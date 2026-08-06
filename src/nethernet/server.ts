import { PeerConnection } from 'node-datachannel'

import { Connection } from './connection'
import { Signal } from '../signaling/signal'
import { SignalStructure, SignalType } from '../signaling/struct'

const debugFn = require('debug')('bedrock-portal-nethernet')

const getRandomUint64 = () => {
  const high = Math.floor(Math.random() * 0xFFFFFFFF)
  const low = Math.floor(Math.random() * 0xFFFFFFFF)

  return (BigInt(high) << 32n) | BigInt(low)
}

export class Server {

  networkId: bigint

  connectionId: bigint

  signaling: Signal

  connections: Map<bigint, Connection>

  pendingCandidates: Map<bigint, SignalStructure[]>

  onOpenConnection: (conn: Connection) => void

  onCloseConnection: (id: bigint, reason: string) => void

  onEncapsulated: (packet: Buffer, id: bigint) => void

  constructor(signaling: Signal, networkId = getRandomUint64(), connectionId = getRandomUint64()) {

    this.signaling = signaling

    this.networkId = networkId

    this.connectionId = connectionId

    this.connections = new Map()

    this.pendingCandidates = new Map()

    this.onOpenConnection = () => { }

    this.onCloseConnection = () => { }

    this.onEncapsulated = () => { }

  }

  async handleCandidate(signal: SignalStructure) {
    const conn = this.connections.get(signal.connectionId)

    if (conn) {
      try {
        conn.rtcConnection.addRemoteCandidate(signal.data, '0')
      }
      catch (error) {
        debugFn('Rejected invalid remote candidate', signal.connectionId, error)
      }
    }
    else {
      const candidates = this.pendingCandidates.get(signal.connectionId) ?? []
      candidates.push(signal)
      this.pendingCandidates.set(signal.connectionId, candidates)
      debugFn('Queued candidate until connection offer arrives', signal)
    }

  }

  async handleOffer(signal: SignalStructure) {

    if (!this.signaling.credentials) {
      throw new Error('No credentials set')
    }

    const rtcConnection = new PeerConnection('pc', { iceServers: this.signaling.credentials })

    const connection = new Connection(this, signal.connectionId, rtcConnection)

    this.connections.set(signal.connectionId, connection)

    rtcConnection.onLocalCandidate(candidate => {
      this.signaling.write(
        new SignalStructure(SignalType.CandidateAdd, signal.connectionId, candidate, signal.networkId, signal.pmsgId)
      )
    })

    rtcConnection.onDataChannel(channel => {
      debugFn('Received data channel', signal.connectionId, channel.getLabel())
      if (channel.getLabel() === 'ReliableDataChannel') connection.setChannels(channel)
      if (channel.getLabel() === 'UnreliableDataChannel') connection.setChannels(null, channel)
    })

    rtcConnection.onIceStateChange(state => {
      debugFn('ICE state changed', signal.connectionId, state)
      connection.setIceConnected(state === 'connected' || state === 'completed')
      if (state === 'disconnected' || state === 'failed' || state === 'closed') {
        this.closeConnection(signal.connectionId, `ICE ${state}`)
      }
    })

    rtcConnection.onStateChange(state => {
      debugFn('Peer connection state changed', signal.connectionId, state)
      if (state === 'disconnected' || state === 'failed' || state === 'closed') {
        this.closeConnection(signal.connectionId, `peer connection ${state}`)
      }
    })

    rtcConnection.setRemoteDescription(signal.data, 'offer')

    const pendingCandidates = this.pendingCandidates.get(signal.connectionId) ?? []
    this.pendingCandidates.delete(signal.connectionId)
    for (const candidate of pendingCandidates) {
      try {
        rtcConnection.addRemoteCandidate(candidate.data, '0')
      }
      catch (error) {
        debugFn('Rejected invalid queued candidate', signal.connectionId, error)
      }
    }

    const answer = rtcConnection.localDescription()

    if (!answer) {
      throw new Error('No answer')
    }

    this.signaling.write(
      new SignalStructure(SignalType.ConnectResponse, signal.connectionId, answer.sdp, signal.networkId, signal.pmsgId)
    )

  }

  async listen() {

    await this.signaling.connect()

    this.signaling.on('signal', (signal) => {

      switch (signal.type) {
        case SignalType.ConnectRequest:
          void this.handleOffer(signal).catch(error => {
            debugFn('Failed to handle connection offer', signal.connectionId, error)
            this.closeConnection(signal.connectionId, 'invalid connection offer')
          })
          break
        case SignalType.CandidateAdd:
          void this.handleCandidate(signal).catch(error => {
            debugFn('Failed to handle remote candidate', signal.connectionId, error)
          })
          break
        default:
          debugFn('Received signal for unknown type', signal)
      }

    })
  }

  closeConnection(id: bigint, reason: string) {
    const connection = this.connections.get(id)
    if (!connection) return

    this.connections.delete(id)
    this.pendingCandidates.delete(id)
    connection.close()
    this.onCloseConnection(id, reason)
  }

  close() {
    for (const conn of this.connections.values()) {
      conn.close()
    }
    this.connections.clear()
    this.pendingCandidates.clear()
  }

}
