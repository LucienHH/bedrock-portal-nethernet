import { PeerConnection } from 'node-datachannel'

import { Connection } from './connection'
import { verifyIdentity } from './identity'
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

  connections: Map<string, Connection>

  onOpenConnection: (conn: Connection) => void

  onCloseConnection: (conn: Connection, reason: string) => void

  onEncapsulated: (packet: Buffer, conn: Connection) => void

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
    const conn = this.connections.get(this.connectionKey(signal))

    if (conn) {
      try {
        conn.rtcConnection.addRemoteCandidate(signal.data, '0')
      }
      catch (error) {
        debugFn('Rejected invalid remote candidate', signal.connectionId, error)
      }
    }
    else {
      debugFn('Rejected candidate without matching connection', signal)
    }

  }

  async handleOffer(signal: SignalStructure) {

    if (!this.signaling.credentials) {
      throw new Error('No credentials set')
    }

    const peerPublicKey = verifyIdentity(signal.data)
    const rtcConnection = new PeerConnection('pc', { iceServers: this.signaling.credentials })

    const key = this.connectionKey(signal)
    const existing = this.connections.get(key)
    if (existing) {
      this.closeConnection(existing, 'connection replaced by a new offer')
    }

    const connection = new Connection(this, signal.networkId, signal.connectionId, peerPublicKey, rtcConnection)

    this.connections.set(key, connection)

    rtcConnection.onLocalCandidate(candidate => {
      this.signaling.write(
        new SignalStructure(SignalType.CandidateAdd, signal.connectionId, candidate, signal.networkId, signal.pmsgId)
      )
    })

    rtcConnection.onDataChannel(channel => {
      const label = channel.getLabel()
      debugFn('Received data channel', signal.connectionId, label)
      if (channel.getProtocol() !== '') {
        this.closeConnection(connection, `invalid data channel protocol for ${label}`)
      }
      else if (label === 'ReliableDataChannel' && !connection.reliable) {
        connection.setChannels(channel)
      }
      else if (label === 'UnreliableDataChannel' && !connection.unreliable) {
        connection.setChannels(null, channel)
      }
      else {
        this.closeConnection(connection, `invalid or duplicate data channel: ${label}`)
      }
    })

    rtcConnection.onIceStateChange(state => {
      debugFn('ICE state changed', signal.connectionId, state)
      connection.setIceConnected(state === 'connected' || state === 'completed')
      if (state === 'disconnected' || state === 'failed' || state === 'closed') {
        this.closeConnection(connection, `ICE ${state}`)
      }
    })

    rtcConnection.onStateChange(state => {
      debugFn('Peer connection state changed', signal.connectionId, state)
      if (state === 'disconnected' || state === 'failed' || state === 'closed') {
        this.closeConnection(connection, `peer connection ${state}`)
      }
    })

    rtcConnection.setRemoteDescription(signal.data, 'offer')

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
            const connection = this.connections.get(this.connectionKey(signal))
            if (connection) this.closeConnection(connection, 'invalid connection offer')
          })
          break
        case SignalType.ConnectError: {
          const connection = this.connections.get(this.connectionKey(signal))
          if (connection) this.closeConnection(connection, `remote connection error: ${signal.data}`)
          break
        }
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

  closeConnection(connection: Connection, reason: string) {
    const key = this.connectionKey(connection)
    if (this.connections.get(key) !== connection) return

    this.connections.delete(key)
    connection.close()
    this.onCloseConnection(connection, reason)
  }

  close() {
    for (const conn of this.connections.values()) {
      conn.close()
    }
    this.connections.clear()
  }

  private connectionKey(connection: Pick<Connection, 'networkId' | 'connectionId'> | Pick<SignalStructure, 'networkId' | 'connectionId'>) {
    return `${connection.networkId}:${connection.connectionId}`
  }

}
