import { Nethernet } from './Nethernet'
import { SessionDescription } from 'sdp-transform'
import { RTCDataChannel, RTCPeerConnection } from 'werift'

const debugFn = require('debug')('bedrock-portal-nethernet')

export const maxMessageSize = 10_000

export class Connections {

  nethernet: Nethernet

  id: bigint

  networkId: bigint

  webrtc: RTCPeerConnection

  description: SessionDescription

  reliable: RTCDataChannel | null

  unreliable: RTCDataChannel | null

  promisedSegments: number

  buf: Buffer | null

  constructor(nethernet: Nethernet, id: bigint, networkId:bigint, webrtc: RTCPeerConnection, description: SessionDescription) {

    this.nethernet = nethernet

    this.id = id

    this.networkId = networkId

    this.webrtc = webrtc

    this.description = description

    this.reliable = null

    this.unreliable = null

    this.promisedSegments = 0

    this.buf = Buffer.alloc(0)

    this.webrtc.onDataChannel.subscribe(channel => {

      console.log('onDataChannel', channel.label)

      if(channel.label === 'ReliableDataChannel') {
        this.reliable = channel

        channel.onmessage = (msg) => this.handleMessage(msg.data)

        // channel.onclose = () => console.log('ReliableDataChannel closed')

      }
      if(channel.label === 'UnreliableDataChannel') {
        this.unreliable = channel

        // channel.onclose = () => console.log('UnreliableDataChannel closed')
      }
    })

    this.webrtc.connectionStateChange.subscribe((state) => {
      if (state === 'connected') {
        this.nethernet.onOpenConnection(this)
      }
      if (state === 'disconnected') {
        this.nethernet.onCloseConnection(this.id, 'disconnected')
      }
    })

  }

  handleMessage(data: string | Buffer) {

    if (typeof data === 'string') {
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
    this.nethernet.onEncapsulated(packet, this.id)
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

      this.reliable.send(message)

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
  }

}
