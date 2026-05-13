import type { Authflow } from 'prismarine-auth'
import type { IceServer } from 'node-datachannel'

import debugFn from 'debug'
import { JSONRPCClient, JSONRPCServer, JSONRPCServerAndClient, TypedJSONRPCClient, TypedJSONRPCServer, TypedJSONRPCServerAndClient } from 'json-rpc-2.0'
import { stringify } from 'json-bigint'
import { randomUUID } from 'crypto'
import { EventEmitter, once } from 'events'
import { Data, ErrorEvent, WebSocket } from 'ws'

import { SignalStructure } from './struct'

const TURN_AUTH_METHOD = 'Signaling_TurnAuth_v1_0'
const RECEIVE_MESSAGE_METHOD = 'Signaling_ReceiveMessage_v1_0'
const DELIVERY_NOTIFICATION_METHOD = 'Signaling_DeliveryNotification_V1_0'
const PING_METHOD = 'System_Ping_v1_0'
const PONG_METHOD = 'System_Pong_v1_0'
const SEND_CLIENT_MESSAGE_METHOD = 'Signaling_SendClientMessage_v1_0'
const WEB_RTC_METHOD = 'Signaling_WebRtc_v1_0'
const CONNECT_ERROR_EVENT = 'connectError'

type JsonRpcSignalPayload = {
  jsonrpc: string,
  method: string
  params: {
    netherNetId: string
    message: string

  }
}

type TurnAuthResponse = {
  TurnAuthServers?: Array<{
    Urls: string[]
    Username: string
    Password: string
  }>
}

const debug = debugFn('bedrock-portal-nethernet')

type Methods = {
  [TURN_AUTH_METHOD]: () => Promise<TurnAuthResponse>
  [RECEIVE_MESSAGE_METHOD]: (params: { From: string, Message: string, Id: string }[]) => void
  [DELIVERY_NOTIFICATION_METHOD]: () => void
  [PING_METHOD]: () => void
  [PONG_METHOD]: () => void
  [SEND_CLIENT_MESSAGE_METHOD]: (params: { toPlayerId: string, messageId: string, message: string }) => void
  [WEB_RTC_METHOD]: (params: { netherNetId: string, message: string }) => void
}

export class Signal extends EventEmitter {

  public ws: WebSocket | null

  public networkId: bigint

  public pmsgId: string | null

  public credentials: IceServer[] | null

  private authflow: Authflow

  private version: string

  private pingInterval: NodeJS.Timeout | null

  private retryCount: number

  private rpc: TypedJSONRPCServerAndClient<Methods, Methods>

  constructor(authflow: Authflow, networkId: bigint, version: string) {
    super()

    this.authflow = authflow

    this.networkId = networkId

    this.pmsgId = null

    this.version = version

    this.ws = null

    this.credentials = null

    this.pingInterval = null

    this.retryCount = 0

    const server: TypedJSONRPCServer<Methods> = new JSONRPCServer({
      errorListener: (message, payload) => {
        debug('JSON-RPC server error', message, payload)
      },
    })

    server.addMethod(RECEIVE_MESSAGE_METHOD, (params) => {
      const items = Array.isArray(params) ? params : [params]

      for (const item of items) {

        const parsed = JSON.parse(item.Message) as JsonRpcSignalPayload

        if (parsed.method !== WEB_RTC_METHOD) {
          continue
        }

        const signal = SignalStructure.fromString(parsed.params.message, BigInt(parsed.params.netherNetId), item.From)

        if (!signal) {
          debug('Failed to parse signal message', item.Message)
          continue
        }

        if (signal) {
          this.emit('signal', signal)
        }
      }

      return
    })

    server.addMethod(PING_METHOD, () => { })
    server.addMethod(PONG_METHOD, () => { })
    server.addMethod(DELIVERY_NOTIFICATION_METHOD, () => { })

    const client: TypedJSONRPCClient<Methods> = new JSONRPCClient(async (payload) => {
      if (this.ws?.readyState !== WebSocket.OPEN) {
        throw new Error('WebSocket not connected')
      }

      this.ws.send(stringify(payload))
    }, () => randomUUID())

    this.rpc = new JSONRPCServerAndClient(server, client, {
      errorListener: (message, payload) => {
        debug('JSON-RPC transport error', message, payload)
      },
    })

  }

  async connect() {
    if (this.ws?.readyState === WebSocket.OPEN) throw new Error('Already connected signaling server')
    await this.init()

    await once(this, 'credentials')
  }

  async destroy(resume = false) {

    debug('Disconnecting from Signal')

    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }

    this.rpc.rejectAllPendingRequests('Signal connection destroyed')

    if (this.ws) {

      this.ws.onmessage = null
      this.ws.onclose = null

      const shouldClose = this.ws.readyState === WebSocket.OPEN

      if (shouldClose) {

        let outerResolve: (() => void) | null = null

        const promise = new Promise<void>((resolve) => {
          outerResolve = resolve
        })

        this.ws.onclose = () => {
          outerResolve?.()
        }

        this.ws.close(1000, 'Normal Closure')

        await promise

      }

      this.ws.onerror = null

      this.ws = null
    }

    if (resume) {
      return this.init()
    }


  }

  async init() {

    const xbl = await this.authflow.getMinecraftBedrockServicesToken({ version: this.version })

    this.pmsgId = parseTokenPmsgId(xbl.mcToken)

    debug('Fetched XBL Token', xbl)

    const address = 'wss://signal.franchise.minecraft-services.net/ws/v1.0/messaging/connect'

    debug('Connecting to Signal', address)

    const ws = new WebSocket(address, {
      headers: {
        'Authorization': xbl.mcToken,
        'session-id': randomUUID(),
        'request-id': randomUUID(),
      },
    })

    ws.onopen = () => {
      this.onOpen()
    }

    ws.onclose = (event) => {
      this.onClose(event.code, event.reason)
    }

    ws.onerror = (event) => {
      this.onError(event)
    }

    ws.onmessage = (event) => {
      this.onMessage(event.data)
    }

    this.ws = ws
  }

  onOpen() {
    debug('Signal Connected to Signal')

    this.rpc.timeout(15000).request(TURN_AUTH_METHOD, {}, undefined)
      .then(res => {
        this.credentials = parseTurnServers(res)

        this.emit('credentials', this.credentials)
      })


    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        void Promise.resolve(this.rpc.timeout(15000).request(PING_METHOD, [], undefined)).catch((err: unknown) => {
          debug('Signal ping failed', err)
        })
      }
    }, 5000)
  }

  onError(err: ErrorEvent) {
    debug('Signal Error', err)
  }

  onClose(code: number, reason: string) {
    debug(`Signal Disconnected with code ${code} and reason ${reason}`)

    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }

    if (code === 1006) {
      debug('Signal Connection Closed Unexpectedly')

      if (this.retryCount < 5) {
        this.retryCount++
        void this.destroy(true).catch((err) => {
          debug('Signal reconnect failed', err)
          this.emitConnectError(err)
        })
      }
      else {
        void this.destroy().catch((err) => {
          debug('Signal destroy failed', err)
        })
        this.emitConnectError(new Error('Signal Connection Closed Unexpectedly'))
      }

      return
    }

    if (!this.credentials && code !== 1000) {
      this.emitConnectError(new Error(`Signal connection closed before credentials with code ${code} and reason ${reason}`))
    }
  }

  onMessage(res: Data) {

    if (typeof res !== 'string') return debug('Received non-string message', res)

    let message: unknown

    try {
      message = JSON.parse(res)
    }
    catch (err) {
      return debug('Received invalid JSON-RPC message', err)
    }

    debug('Received message', message)

    void this.rpc.receiveAndSend(message, undefined, undefined).catch((err) => {
      debug('Failed to handle JSON-RPC message', err)
    })

  }

  write(signal: SignalStructure) {
    if (this.ws?.readyState !== WebSocket.OPEN) throw new Error('WebSocket not connected')

    const innerMessage = JSON.stringify({
      jsonrpc: '2.0',
      method: WEB_RTC_METHOD,
      params: {
        netherNetId: this.networkId.toString(),
        message: signal.toString(),
      },
    })

    const params = {
      toPlayerId: signal.pmsgId,
      messageId: randomUUID(),
      message: innerMessage,
    }

    debug('Sending Signal', params)

    void Promise.resolve(this.rpc.timeout(15000).request(SEND_CLIENT_MESSAGE_METHOD, params, undefined)).catch((err: unknown) => {
      debug('Failed to send signal', err)
    })
  }

  private emitConnectError(err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err))

    this.emit(CONNECT_ERROR_EVENT, error)

    if (this.listenerCount('error') > 0) {
      this.emit('error', error)
    }

    return error
  }

}

function parseTurnServers(data: TurnAuthResponse) {
  const servers: { hostname: string, port: number, username: string, password: string }[] = []

  if (!data.TurnAuthServers) return servers

  for (const server of data.TurnAuthServers) {
    if (!server.Urls) continue

    for (const url of server.Urls) {
      const match = url.match(/(stun|turn):([^:]+):(\d+)/)
      if (match) {
        servers.push({
          hostname: match[2],
          port: parseInt(match[3], 10),
          username: server.Username,
          password: server.Password,
        })
      }
    }
  }

  return servers
}

function parseTokenPmsgId(token: string) {
  const jwt = token.split(' ')[1]

  if (!jwt) {
    return null
  }

  const [, payload] = jwt.split('.')

  if (!payload) {
    return null
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { pmid?: unknown }

    return typeof parsed.pmid === 'string' ? parsed.pmid : null
  }
  catch {
    return null
  }
}