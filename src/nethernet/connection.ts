import { PeerConnection, DataChannel } from 'node-datachannel'

import { Server } from './server'

const debugFn = require('debug')('bedrock-portal-nethernet')

export const maxMessageSize = 10_000

export class Connection {

  nethernet: Server

  connectionId: bigint

  rtcConnection: PeerConnection

  reliable: DataChannel | null

  unreliable: DataChannel | null

  promisedSegments: number

  buf: Buffer | null

  constructor(nethernet: Server, connectionId: bigint, rtcConnection: PeerConnection) {

    this.nethernet = nethernet

    this.connectionId = connectionId

    this.rtcConnection = rtcConnection

    this.reliable = null

    this.unreliable = null

    this.promisedSegments = 0

    this.buf = Buffer.alloc(0)

  }

  setChannels(reliable: DataChannel | null, unreliable?: DataChannel) {
    if (reliable) {
      this.reliable = reliable
      this.reliable.onMessage((msg) => this.handleMessage(msg))
    }
    if (unreliable) {
      this.unreliable = unreliable
    }
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

    this.buf = this.buf ? Buffer.concat([this.buf, data]) : data

    if (this.promisedSegments > 0) {
      return
    }

    this.onPacket(this.buf)

    this.buf = null
  }

  onPacket(packet: Buffer) {
    this.nethernet.onEncapsulated(packet, this.connectionId)
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

    for (let i = 0; i < data.length; i += maxMessageSize) {
      segments--

      let end = i + maxMessageSize
      if (end > data.length) end = data.length

      const frag = data.subarray(i, end)
      const message = Buffer.concat([Buffer.from([segments]), frag])

      debugFn('Sending fragment', segments, 'header', message[0])

      this.reliable.sendMessageBinary(message)

      n += frag.length
    }

    if (segments !== 0) {
      throw new Error('Segments count did not reach 0 after sending all fragments')
    }

    return n
  }

  close() {
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
