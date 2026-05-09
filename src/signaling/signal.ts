import { randomUUID } from 'crypto'
import type { Authflow } from 'prismarine-auth'

import debugFn from 'debug'
import { stringify } from 'json-bigint'
import { once, EventEmitter } from 'events'
import { Data, ErrorEvent, WebSocket } from 'ws'

import { NetworkId, SignalStructure } from './struct'

type TurnServer = { hostname: string, port: number, username?: string, password?: string }
type JsonObject = Record<string, unknown>

type PendingRequest = {
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
  timer: NodeJS.Timeout
}

const MessageType = {
  RequestPing: 0,
  Signal: 1,
  Credentials: 2,
}

const Rpc = {
  TurnAuth: 'Signaling_TurnAuth_v1_0',
  SendMessage: 'Signaling_SendClientMessage_v1_0',
  ReceiveMessage: 'Signaling_ReceiveMessage_v1_0',
  Ping: 'System_Ping_v1_0',
  Pong: 'System_Pong_v1_0',
  WebRtc: 'Signaling_WebRtc_v1_0',
  Delivery: 'Signaling_DeliveryNotification_V1_0',
}

const RPC_SIGNAL_URL = 'wss://signal.franchise.minecraft-services.net/ws/v1.0/messaging/connect'
const LEGACY_SIGNAL_URL = 'wss://signal.franchise.minecraft-services.net/ws/v1.0/signaling'
const SIGNALING_USER_AGENT = 'libHttpClient/1.0.0.0'

const debug = debugFn('bedrock-portal-nethernet')

export class Signal extends EventEmitter {

  public ws: WebSocket | null

  public networkId: NetworkId

  public credentials: TurnServer[] | null

  private authflow: Authflow

  private version: string

  private pingInterval: NodeJS.Timeout | null

  private retryCount: number

  private pendingRequests: Map<string, PendingRequest>

  private mode: 'rpc' | 'legacy'

  constructor(authflow: Authflow, networkId: NetworkId, version: string, signalingMode: 'rpc' | 'legacy' = 'rpc') {
    super()

    this.authflow = authflow

    this.networkId = networkId

    this.version = version

    this.ws = null

    this.credentials = null

    this.pingInterval = null

    this.retryCount = 0

    this.pendingRequests = new Map()

    this.mode = signalingMode

  }

  async connect() {
    if (this.ws?.readyState === WebSocket.OPEN) throw new Error('Already connected signaling server')
    await this.init()

    await once(this, 'credentials')
  }

  async destroy(resume = false) {

    debug('Disconnecting from Signal')

    this.clearPing()
    this.rejectPending(new Error('Signal disconnected'))

    if (this.ws) {

      this.ws.onmessage = null
      this.ws.onclose = null

      const shouldClose = this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING

      if (shouldClose) {

        await new Promise((resolve) => {
          this.ws!.onclose = resolve
          this.ws!.close(1000, 'Normal Closure')
        })

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

    this.mode = this.mode === 'legacy' ? 'legacy' : 'rpc'
    const address = this.mode === 'legacy' ? `${LEGACY_SIGNAL_URL}/${this.networkId}` : RPC_SIGNAL_URL

    debug('Connecting to Signal', address)

    const headers = this.mode === 'legacy'
      ? { Authorization: xbl.mcToken }
      : {
        'Authorization': xbl.mcToken,
        'User-Agent': SIGNALING_USER_AGENT,
        'session-id': randomUUID(),
        'request-id': randomUUID(),
      }

    const ws = new WebSocket(address, { headers })

    ws.onopen = () => {
      this.onOpen()
      if (this.mode === 'legacy') this.startLegacyPing()
      else this.onRpcOpen()
    }

    ws.onclose = (event) => {
      this.handleCloseCleanup(event.code, event.reason)
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

  handleCloseCleanup(code: number, reason: string) {
    this.clearPing()
    this.rejectPending(new Error(`Signal closed with code ${code}: ${reason || 'none'}`))
  }

  clearPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }
  }

  rejectPending(error: Error) {
    for (const pending of this.pendingRequests.values()) {
      clearTimeout(pending.timer)
      pending.reject(error)
    }
    this.pendingRequests.clear()
  }

  startLegacyPing() {
    this.clearPing()
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ Type: MessageType.RequestPing }))
      }
    }, 5000)
    this.pingInterval.unref?.()
  }

  onRpcOpen() {
    this.clearPing()
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.sendJsonRpcRequest(Rpc.Ping, {}).catch(error => {
          debug('RPC ping failed', error)
        })
      }
    }, 50000)
    this.pingInterval.unref?.()

    this.sendJsonRpcRequest(Rpc.TurnAuth, {})
      .then((response) => {
        this.credentials = parseTurnServers(response)
        this.emit('credentials', this.credentials)
      })
      .catch((error) => {
        debug('Failed to fetch JSON-RPC TURN credentials', error)
        if (this.listenerCount('error') > 0) this.emit('error', error)
      })
  }

  onMessage(res: Data) {

    if (Buffer.isBuffer(res)) res = res.toString('utf8')
    if (!(typeof res === 'string')) return debug('Recieved non-string message', res)

    let message: unknown
    try {
      message = JSON.parse(res)
    }
    catch (error) {
      debug('Failed to parse signaling message', res, error)
      return
    }

    debug('Recieved message', message)

    if (isRecord(message) && 'Type' in message) {
      return this.onLegacyMessage(message)
    }

    if (isRecord(message)) {
      return this.onRpcMessage(message)
    }
  }

  onLegacyMessage(message: JsonObject) {
    switch (message.Type) {
      case MessageType.Credentials: {

        const from = getFirstString(message, ['From'])
        if (from != 'Server') {
          debug('received credentials from non-Server', 'message', message)
          return
        }

        this.credentials = parseTurnServers(message.Message)

        this.emit('credentials', this.credentials)

        break
      }
      case MessageType.Signal: {
        const from = getFirstString(message, ['From'])
        const payload = getFirstString(message, ['Message'])
        if (!from || !payload) return

        const signal = SignalStructure.fromString(payload, parseNetworkId(from))

        this.emit('signal', signal)
        break
      }
      case MessageType.RequestPing: {
        debug('Signal Pinged')
      }
    }
  }

  onRpcMessage(message: JsonObject) {
    if (Object.prototype.hasOwnProperty.call(message, 'result') || (message.error && Object.prototype.hasOwnProperty.call(message, 'id'))) {
      this.handleRpcResponse(message)
    }
    else if (message.method) {
      this.handleRpcRequest(message)
    }
  }

  handleRpcResponse(message: JsonObject) {
    if (message.id === undefined || message.id === null) return

    const id = String(message.id)
    const pending = this.pendingRequests.get(id)
    if (!pending) return

    clearTimeout(pending.timer)
    this.pendingRequests.delete(id)

    if (message.error) {
      const rpcError = isRecord(message.error) ? message.error : null
      const errorMessage = typeof rpcError?.message === 'string' ? rpcError.message : JSON.stringify(message.error)
      pending.reject(new Error(errorMessage))
      return
    }

    pending.resolve(message.result || {})
  }

  handleRpcRequest(message: JsonObject) {
    const id = message.id
    const hasResponseId = typeof id === 'string' || typeof id === 'number'

    switch (typeof message.method === 'string' ? message.method : undefined) {
      case Rpc.ReceiveMessage: {
        if (hasResponseId) this.sendJsonRpcResult(id, null)

        const params = Array.isArray(message.params) ? message.params : []
        for (const item of params) {
          this.processIncomingRpcMessage(item)
        }
        break
      }
      case Rpc.Ping:
      case Rpc.Pong: {
        if (hasResponseId) this.sendJsonRpcResult(id, null)
        break
      }
      default:
        debug('Unhandled RPC signaling method', message.method, message)
    }
  }

  processIncomingRpcMessage(message: JsonObject) {
    const from = getFirstString(message, ['From', 'from'])
    const rawInner = getFirstString(message, ['Message', 'message'])
    const messageId = getFirstString(message, ['Id', 'id']) || randomUUID()

    if (!from || !rawInner) {
      debug('Ignoring malformed RPC signal message', message)
      return
    }

    this.sendRpcDeliveryAck(from, messageId).catch(error => {
      debug('Failed to send RPC delivery acknowledgement', error)
    })

    let inner: unknown
    try {
      inner = JSON.parse(rawInner)
    }
    catch (error) {
      debug('Failed to parse inner RPC signaling message', rawInner, error)
      return
    }

    if (!isRecord(inner) || inner.method !== Rpc.WebRtc) {
      debug('Ignoring non-WebRTC RPC inner message', isRecord(inner) ? inner.method : undefined)
      return
    }

    const params = isRecord(inner.params) ? inner.params : null
    const payload = params?.message
    if (typeof payload !== 'string') {
      debug('Ignoring RPC WebRTC message without string payload', inner)
      return
    }

    const signal = SignalStructure.fromString(payload, parseNetworkId(from))
    signal.rpcFrom = from
    this.emit('signal', signal)
  }

  sendRpcDeliveryAck(target: string, messageId: string) {
    const innerMessage = {
      params: { messageId },
      jsonrpc: '2.0',
      method: Rpc.Delivery,
    }

    return this.sendJsonRpcRequest(Rpc.SendMessage, {
      toPlayerId: String(target),
      messageId: randomUUID(),
      message: JSON.stringify(innerMessage),
    })
  }

  sendJsonRpcRequest(method: string, params: unknown) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return Promise.reject(new Error('WebSocket not connected'))
    }

    const id = randomUUID()
    const request = {
      params,
      jsonrpc: '2.0',
      method,
      id,
    }

    const promise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingRequests.delete(id)
        reject(new Error(`Timed out waiting for RPC response to ${method}`))
      }, 30000)
      timer.unref?.()

      this.pendingRequests.set(id, { resolve, reject, timer })
    })

    this.ws.send(JSON.stringify(request))

    return promise
  }

  sendJsonRpcResult(id: string | number, result: unknown) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return

    this.ws.send(JSON.stringify({
      id,
      result,
      jsonrpc: '2.0',
    }))
  }

  write(signal: SignalStructure) {
    if (!this.ws) throw new Error('WebSocket not connected')

    if (this.mode === 'rpc') {
      const target = signal.rpcFrom || stringifyNetworkId(signal.networkId)
      const innerMessage = {
        params: {
          netherNetId: stringifyNetworkId(this.networkId),
          message: signal.toString(),
        },
        jsonrpc: '2.0',
        method: Rpc.WebRtc,
      }

      this.sendJsonRpcRequest(Rpc.SendMessage, {
        toPlayerId: String(target),
        messageId: randomUUID(),
        message: JSON.stringify(innerMessage),
      }).catch(error => {
        debug('Failed to send JSON-RPC signal', target, error)
      })
      return
    }

    const message = stringify({ Type: MessageType.Signal, To: signal.networkId, Message: signal.toString() })

    debug('Sending Signal', message)

    this.ws.send(message)
  }

}

function parseNetworkId(value: unknown): NetworkId {
  if (typeof value === 'bigint') return value

  const stringValue = String(value)
  if (/^[0-9]+$/.test(stringValue)) {
    try {
      return BigInt(stringValue)
    }
    catch (_error) {
      return stringValue
    }
  }

  return stringValue
}

function stringifyNetworkId(value: NetworkId) {
  return typeof value === 'bigint' ? value.toString() : String(value)
}

function isRecord(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === 'object'
}

function getFirstString(source: unknown, keys: string[]) {
  if (!isRecord(source)) return undefined

  for (const key of keys) {
    const value = source[key]
    if (value !== undefined && value !== null) return String(value)
  }

  return undefined
}

function parseTurnServers(dataString: string | unknown) {
  const servers: TurnServer[] = []

  const data = typeof dataString === 'string' ? JSON.parse(dataString) : dataString

  if (!isRecord(data)) return servers

  const turnServers = data.TurnAuthServers || data.turnAuthServers
  if (!Array.isArray(turnServers)) return servers

  for (const server of turnServers) {
    if (!isRecord(server)) continue

    const urls = server.Urls || server.urls
    if (!Array.isArray(urls)) continue

    for (const url of urls) {
      const match = String(url).match(/^(stun|turn):(?:\[([^\]]+)\]|([^:/?]+)):(\d+)/)
      if (match) {
        servers.push({
          hostname: match[2] || match[3],
          port: parseInt(match[4], 10),
          username: getFirstString(server, ['Username', 'username']),
          password: getFirstString(server, ['Password', 'password', 'Credential', 'credential']),
        })
      }
    }
  }

  return servers
}
