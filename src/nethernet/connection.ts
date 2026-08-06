import { PeerConnection, DataChannel } from 'node-datachannel'

import { Server } from './server'

const debugFn = require('debug')('bedrock-portal-nethernet')

export const maxMessageSize = 10_000
const maxSegments = 256
const connectionReadyTimeout = 15_000

export class Connection {

  nethernet: Server

  connectionId: bigint

  networkId: bigint

  peerPublicKey: Buffer

  rtcConnection: PeerConnection

  reliable: DataChannel | null

  unreliable: DataChannel | null

  promisedSegments: number

  chunks: Buffer[]

  iceConnected: boolean

  opened: boolean

  closed: boolean

  readyTimeout: NodeJS.Timeout

  constructor(nethernet: Server, networkId: bigint, connectionId: bigint, peerPublicKey: Buffer, rtcConnection: PeerConnection) {

    this.nethernet = nethernet

    this.connectionId = connectionId

    this.networkId = networkId

    this.peerPublicKey = peerPublicKey

    this.rtcConnection = rtcConnection

    this.reliable = null

    this.unreliable = null

    this.promisedSegments = 0

    this.chunks = []

    this.iceConnected = false

    this.opened = false

    this.closed = false

    this.readyTimeout = setTimeout(() => {
      debugFn('Connection timed out waiting for reliable data channel', this.connectionId)
      this.nethernet.closeConnection(this, 'reliable data channel timed out')
    }, connectionReadyTimeout)
    this.readyTimeout.unref()

  }

  setChannels(reliable: DataChannel | null, unreliable?: DataChannel) {
    if (reliable) {
      this.reliable = reliable
      this.reliable.onMessage((msg) => {
        try {
          this.handleMessage(msg)
        }
        catch (error) {
          debugFn('Rejected invalid data channel message', this.connectionId, error)
          this.nethernet.closeConnection(this, 'invalid data channel message')
        }
      })
      this.reliable.onOpen(() => {
        debugFn('Reliable data channel opened', this.connectionId)
        this.openIfReady()
      })
      this.reliable.onClosed(() => {
        debugFn('Reliable data channel closed', this.connectionId)
        this.nethernet.closeConnection(this, 'reliable data channel closed')
      })
      this.reliable.onError(error => {
        debugFn('Reliable data channel error', this.connectionId, error)
        this.nethernet.closeConnection(this, `reliable data channel error: ${error}`)
      })
      this.openIfReady()
    }
    if (unreliable) {
      this.unreliable = unreliable
      this.unreliable.onOpen(() => debugFn('Unreliable data channel opened', this.connectionId))
      this.unreliable.onClosed(() => debugFn('Unreliable data channel closed', this.connectionId))
      this.unreliable.onError(error => debugFn('Unreliable data channel error', this.connectionId, error))
    }
  }

  setIceConnected(connected: boolean) {
    this.iceConnected = connected
    this.openIfReady()
  }

  private openIfReady() {
    if (this.opened || this.closed || !this.iceConnected || !this.reliable?.isOpen()) return

    this.opened = true
    clearTimeout(this.readyTimeout)
    this.nethernet.onOpenConnection(this)
  }

  handleMessage(data: string | Buffer | ArrayBuffer) {

    if (typeof data === 'string') {
      data = Buffer.from(data)
    }

    if (data instanceof ArrayBuffer) {
      data = Buffer.from(data)
    }

    if (data.length < 2) {
      throw new Error('Unexpected EOF')
    }

    const segments = data[0]

    debugFn(`handleMessage segments: ${segments}`)

    data = data.subarray(1)

    if (this.promisedSegments > 0 && this.promisedSegments - 1 !== segments) {
      throw new Error(`Invalid promised segments: expected ${this.promisedSegments - 1}, got ${segments}`)
    }

    this.promisedSegments = segments

    this.chunks.push(data)

    if (this.promisedSegments > 0) {
      return
    }

    this.onPacket(Buffer.concat(this.chunks))

    this.chunks = []
  }

  onPacket(packet: Buffer) {
    this.nethernet.onEncapsulated(packet, this)
  }

  write(data: string | Buffer) {
    if (!this.reliable) {
      throw new Error('Reliable data channel is not available')
    }

    let n = 0

    if (typeof data === 'string') {
      data = Buffer.from(data)
    }

    let segments = Math.ceil(data.length / maxMessageSize)

    if (segments > maxSegments) {
      throw new Error(`Data requires ${segments} segments, maximum is ${maxSegments}`)
    }

    for (let i = 0; i < data.length; i += maxMessageSize) {
      segments--

      let end = i + maxMessageSize
      if (end > data.length) end = data.length

      const frag = data.subarray(i, end)
      const message = Buffer.concat([Buffer.from([segments]), frag])

      debugFn('Sending fragment', segments, 'header', message[0])

      if (!this.reliable.sendMessageBinary(message)) {
        this.nethernet.closeConnection(this, 'failed to send reliable data channel message')
        throw new Error(`Failed to send segment ${segments}`)
      }

      n += frag.length
    }

    if (segments !== 0) {
      throw new Error('Segments count did not reach 0 after sending all fragments')
    }

    return n
  }

  close() {
    if (this.closed) return

    this.closed = true
    clearTimeout(this.readyTimeout)
    if (this.reliable) {
      this.reliable.close()
    }
    if (this.unreliable) {
      this.unreliable.close()
    }
    if (this.rtcConnection) {
      this.rtcConnection.close()
    }
  }

}
