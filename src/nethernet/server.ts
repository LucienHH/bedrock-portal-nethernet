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
  pendingCandidates: Map<bigint, string[]>
  onOpenConnection: (conn: Connection) => void
  onCloseConnection: (id: bigint, reason: string) => void
  onEncapsulated: (packet: Buffer, id: bigint) => void

  constructor(signaling: Signal, networkId = getRandomUint64(), connectionId = getRandomUint64()) {
    this.signaling = signaling
    this.networkId = networkId
    this.connectionId = connectionId
    this.connections = new Map()
    this.pendingCandidates = new Map()
    this.onOpenConnection = () => {}
    this.onCloseConnection = () => {}
    this.onEncapsulated = () => {}
  }

  async handleCandidate(signal: SignalStructure) {
    const pending = this.pendingCandidates.get(signal.connectionId)
    if (pending !== undefined) {
      pending.push(signal.data)
      return
    }

    const conn = this.connections.get(signal.connectionId)
    if (conn) {
      try {
        conn.rtcConnection.addRemoteCandidate(signal.data, '0')
      } catch (e) {
        debugFn('Failed to add remote candidate (likely closed)', (e as Error).message)
      }
    } else {
      debugFn('Received candidate for unknown connection', signal)
    }
  }

  async handleOffer(signal: SignalStructure) {
    if (!this.signaling.credentials) {
      throw new Error('No credentials set')
    }

    const rtcConnection = new PeerConnection('pc', { iceServers: this.signaling.credentials })
    const connection = new Connection(this, signal.connectionId, rtcConnection)

    this.connections.set(signal.connectionId, connection)
    this.pendingCandidates.set(signal.connectionId, [])

    rtcConnection.onLocalCandidate(candidate => {
      this.signaling.write(
        new SignalStructure(SignalType.CandidateAdd, signal.connectionId, candidate, signal.networkId)
      )
    })

    rtcConnection.onDataChannel(channel => {
      if (channel.getLabel() === 'ReliableDataChannel') connection.setChannels(channel)
      if (channel.getLabel() === 'UnreliableDataChannel') connection.setChannels(null, channel)
    })

    rtcConnection.onIceStateChange(state => {
      if (state === 'connected') {
        this.onOpenConnection(connection)
      }
      if (['disconnected', 'failed', 'closed'].includes(state)) {
        this.onCloseConnection(signal.connectionId, state)
        connection.close()
        this.connections.delete(signal.connectionId)
        this.pendingCandidates.delete(signal.connectionId)
      }
    })

    rtcConnection.setRemoteDescription(signal.data, 'offer')

    const desc = rtcConnection.localDescription()
    if (!desc || desc.type !== 'answer' || !desc.sdp) {
      throw new Error('Failed to generate answer')
    }

    this.signaling.write(
      new SignalStructure(SignalType.ConnectResponse, signal.connectionId, desc.sdp, signal.networkId)
    )

    const pending = this.pendingCandidates.get(signal.connectionId) ?? []
    pending.forEach(cand => {
      try {
        rtcConnection.addRemoteCandidate(cand, '0')
      } catch (e) {
        debugFn('Failed to add queued candidate', (e as Error).message)
      }
    })
    this.pendingCandidates.delete(signal.connectionId)
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
    this.connections.clear()
    this.pendingCandidates.clear()
  }
}
