import { RTCIceCandidate, RTCPeerConnection } from 'werift'

import { Connection } from './connection'
import { getRandomUint64, Signal } from '../signaling/signal'
import { SignalStructure, SignalType } from '../signaling/struct'

const debugFn = require('debug')('bedrock-portal-nethernet')

export class Server {

  networkId: bigint

  connectionId: bigint

  signaling: Signal

  connections: Map<bigint, Connection>

  onOpenConnection: (conn: Connection) => void

  onCloseConnection: (id: bigint, reason: string) => void

  onEncapsulated: (packet: Buffer, id: bigint) => void

  constructor(signaling: Signal, networkId = getRandomUint64(), connectionId = getRandomUint64()) {

    this.signaling = signaling

    this.networkId = networkId

    this.connectionId = connectionId

    this.connections = new Map()

    this.onOpenConnection = () => { }

    this.onCloseConnection = () => { }

    this.onEncapsulated = () => { }

  }

  async handleCandidate(signal: SignalStructure) {
    const conn = this.connections.get(signal.connectionId)

    if (conn) {
      await conn.rtcConnection.addIceCandidate(new RTCIceCandidate({ candidate: signal.data }))
    }
    else {
      debugFn('Received candidate for unknown connection', signal)
    }

  }

  async handleOffer(signal: SignalStructure) {

    const rtcConnection = new RTCPeerConnection({
      iceServers: this.signaling.credentials,
    })

    const connection = new Connection(this, signal.connectionId, rtcConnection)

    this.connections.set(signal.connectionId, connection)

    rtcConnection.onicecandidate = (e) => {
      if (e.candidate) {
        this.signaling.write(
          new SignalStructure(SignalType.CandidateAdd, signal.connectionId, e.candidate.candidate, signal.networkId)
        )
      }
    }

    rtcConnection.ondatachannel = ({ channel }) => {
      if (channel.label === 'ReliableDataChannel') connection.setChannels(channel)
      if (channel.label === 'UnreliableDataChannel') connection.setChannels(null, channel)
    }

    rtcConnection.onconnectionstatechange = () => {
      const state = rtcConnection.connectionState
      if (state === 'connected') this.onOpenConnection(connection)
      if (state === 'disconnected') this.onCloseConnection(signal.connectionId, 'disconnected')
    }

    await rtcConnection.setRemoteDescription({ type: 'offer', sdp: signal.data })

    const answer = await rtcConnection.createAnswer()

    await rtcConnection.setLocalDescription(answer)

    this.signaling.write(
      new SignalStructure(SignalType.ConnectResponse, signal.connectionId, answer.sdp, signal.networkId)
    )

  }

  async listen() {

    await this.signaling.connect()

    this.signaling.on('signal', (signal) => {

      switch (signal.type) {
        case SignalType.ConnectRequest:
          this.handleOffer(signal)
          break
        case SignalType.CandidateAdd:
          this.handleCandidate(signal)
          break
        default:
          debugFn('Received signal for unknown type', signal)
      }

    })
  }

  close() {
    for (const conn of this.connections.values()) {
      conn.close()
    }
  }

}
