import type { Authflow } from 'prismarine-auth'

import debugFn from 'debug'
import { stringify } from 'json-bigint'
import { once, EventEmitter } from 'events'
import { Data, ErrorEvent, WebSocket } from 'ws'

import { SignalStructure } from './struct'

const MessageType = {
  RequestPing: 0,
  Signal: 1,
  Credentials: 2,
}

const debug = debugFn('bedrock-portal-nethernet')

export class Signal extends EventEmitter {

  public ws: WebSocket | null

  public networkId: bigint

  public credentials: { hostname: string, port: number, username: string, password: string }[] | null

  private authflow: Authflow

  private version: string

  private pingInterval: NodeJS.Timeout | null

  private retryCount: number

  constructor(authflow: Authflow, networkId: bigint, version: string) {
    super()

    this.authflow = authflow

    this.networkId = networkId

    this.version = version

    this.ws = null

    this.credentials = null

    this.pingInterval = null

    this.retryCount = 0

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

    if (this.ws) {

      this.ws.onmessage = null
      this.ws.onclose = null

      const shouldClose = this.ws.readyState === WebSocket.OPEN

      if (shouldClose) {

        let outerResolve: any

        const promise = new Promise((resolve) => {
          outerResolve = resolve
        })

        this.ws.onclose = outerResolve

        this.ws.close(1000, 'Normal Closure')

        await promise

      }

      this.ws.onerror = null
    }

    if (resume) {
      return this.init()
    }


  }

  async init() {

    const xbl = await this.authflow.getMinecraftBedrockServicesToken({ version: this.version })

    debug('Fetched XBL Token', xbl)

    const address = `wss://signal.franchise.minecraft-services.net/ws/v1.0/signaling/${this.networkId}`

    debug('Connecting to Signal', address)

    const ws = new WebSocket(address, {
      headers: { Authorization: xbl.mcToken },
    })

    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ Type: MessageType.RequestPing }))
      }
    }, 5000)

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
  }

  onError(err: ErrorEvent) {
    debug('Signal Error', err)
  }

  onClose(code: number, reason: string) {
    debug(`Signal Disconnected with code ${code} and reason ${reason}`)

    if (code === 1006) {
      debug('Signal Connection Closed Unexpectedly')

      if (this.retryCount < 5) {
        this.retryCount++
        this.destroy(true)
      }
      else {
        this.destroy()
        throw new Error('Signal Connection Closed Unexpectedly')
      }

    }
  }

  onMessage(res: Data) {

    if (!(typeof res === 'string')) return debug('Recieved non-string message', res)

    const message = JSON.parse(res)

    debug('Recieved message', message)

    switch (message.Type) {
      case MessageType.Credentials: {

        if (message.From != 'Server') {
          debug('received credentials from non-Server', 'message', message)
          return
        }

        this.credentials = parseTurnServers(message.Message)

        this.emit('credentials', this.credentials)

        break
      }
      case MessageType.Signal: {
        const signal = SignalStructure.fromString(message.Message, BigInt(message.From))

        this.emit('signal', signal)
        break
      }
      case MessageType.RequestPing: {
        debug('Signal Pinged')
      }
    }

  }

  write(signal: SignalStructure) {
    if (!this.ws) throw new Error('WebSocket not connected')
    const message = stringify({ Type: MessageType.Signal, To: signal.networkId, Message: signal.toString() })

    debug('Sending Signal', message)

    this.ws.send(message)
  }

}

function parseTurnServers(dataString: string) {
  const servers: { hostname: string, port: number, username: string, password: string }[] = []

  const data = JSON.parse(dataString)

  if (!data.TurnAuthServers) return servers

  for (const server of data.TurnAuthServers) {
    if (!server.Urls) continue

    for (const url of server.Urls) {
      const match = url.match(/(stun|turn):([^:]+):(\d+)/)
      if (match) {
        servers.push({
          hostname: match[2],
          port: parseInt(match[3], 10),
          username: server.Username || undefined,
          password: server.Password || undefined,
        })
      }
    }
  }

  return servers
}