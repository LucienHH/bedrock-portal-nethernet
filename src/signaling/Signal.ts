import type { Authflow } from 'prismarine-auth'

import debugFn from 'debug'
import { Data, ErrorEvent, WebSocket } from 'ws'
import { SignalStructure } from './struct'
import { once, EventEmitter } from 'events'
import { stringify } from 'json-bigint'

const MessageType = {
  RequestPing: 0,
  Signal: 1,
  Credentials: 2,
}

const debug = debugFn('bedrock-portal-nethernet')

export function getRandomUint64() {
  // Generate two 32-bit random integers
  const high = Math.floor(Math.random() * 0xFFFFFFFF)
  const low = Math.floor(Math.random() * 0xFFFFFFFF)

  // Combine them to create a 64-bit unsigned integer
  const result = (BigInt(high) << 32n) | BigInt(low)
  return result
}

export class Signal extends EventEmitter {

  authflow: Authflow

  ws: WebSocket | null

  authorization: string | null

  pingInterval: NodeJS.Timeout | null

  networkID: bigint

  credentials: any

  constructor(authflow: Authflow, networkID: bigint) {
    super()

    this.authflow = authflow

    this.ws = null

    this.authorization = null

    this.pingInterval = null

    this.networkID = networkID

    this.credentials = null

  }

  async connect() {
    if (this.ws?.readyState === WebSocket.OPEN) throw new Error('Already connected signaling server')
    await this.init()
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

    const xbl = await this.authflow.getMinecraftServicesToken()

    this.authorization = xbl.mcToken

    debug('Fetched XBL Token', xbl)

    const address = `wss://signal.franchise.minecraft-services.net/ws/v1.0/signaling/${this.networkID.toString()}`

    debug('Connecting to Signal', address)

    const ws = new WebSocket(address, {
      headers: { Authorization: this.authorization },
    })

    await once(ws, 'open')

    this.pingInterval = setInterval(() => {
      if (this.ws) {
        this.ws.send(JSON.stringify({ Type: MessageType.RequestPing }))
      }
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
  }

  onError(err: ErrorEvent) {
    debug('Signal Error', err)
  }

  onClose(code: number, reason: string) {
    debug(`Signal Disconnected with code ${code} and reason ${reason}`)

    if (code === 1006) {
      debug('Signal Connection Closed Unexpectedly')

      this.destroy(true)
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

        this.credentials = JSON.parse(message.Message)

        break
      }
      case MessageType.Signal: {
        this.emit('signal', SignalStructure.fromWSMessage(BigInt(message.From), message.Message))
        break
      }
      case MessageType.RequestPing: {
        debug('Signal Pinged')
      }
    }

  }

  // TODO: this
  async getCredentials() {
    if (!this.credentials) {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          if (this.credentials) {
            clearInterval(interval)
            resolve(this.credentials)
          }
        }, 1000)
      })
    }

    return this.credentials
  }

  write(signal: SignalStructure) {
    if (!this.ws) throw new Error('WebSocket not connected')
    const message = { Type: MessageType.Signal, To: signal.networkID, Message: signal.marshalText() }

    debug('Sending Signal', message)

    this.ws.send(stringify(message))
  }

}
