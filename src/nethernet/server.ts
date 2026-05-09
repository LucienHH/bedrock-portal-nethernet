import { PeerConnection } from 'node-datachannel'

import { Connection } from './connection'
import { Signal } from '../signaling/signal'
import { SignalStructure, SignalType } from '../signaling/struct'

const debugFn = require('debug')('bedrock-portal-nethernet')

type PendingCandidate = {
  signal: SignalStructure
  attempts: number
}

const MAX_PENDING_CANDIDATE_ATTEMPTS = 50
const PENDING_CANDIDATE_RETRY_MS = 100

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

  pendingCandidates: Map<bigint, PendingCandidate[]>

  remoteDescriptionReady: Set<bigint>

  pendingCandidateTimers: Map<bigint, NodeJS.Timeout>

  onOpenConnection: (conn: Connection) => void

  onCloseConnection: (id: bigint, reason: string) => void

  onEncapsulated: (packet: Buffer, id: bigint) => void

  constructor(signaling: Signal, networkId = getRandomUint64(), connectionId = getRandomUint64()) {

    this.signaling = signaling

    this.networkId = networkId

    this.connectionId = connectionId

    this.connections = new Map()

    this.pendingCandidates = new Map()

    this.remoteDescriptionReady = new Set()

    this.pendingCandidateTimers = new Map()

    this.onOpenConnection = () => { }

    this.onCloseConnection = () => { }

    this.onEncapsulated = () => { }

  }

  async handleCandidate(signal: SignalStructure) {
    const conn = this.connections.get(signal.connectionId)

    if (!conn || !this.remoteDescriptionReady.has(signal.connectionId)) {
      this.queueCandidate(signal)
      return
    }

    try {
      conn.rtcConnection.addRemoteCandidate(signal.data, '0')
    }
    catch (error) {
      this.queueCandidate(signal, formatCandidateError(error))
    }
  }

  queueCandidate(signal: SignalStructure, reason = 'connection is not ready') {
    const candidates = this.pendingCandidates.get(signal.connectionId) || []
    candidates.push({ signal, attempts: 0 })
    this.pendingCandidates.set(signal.connectionId, candidates)

    debugFn('Queued ICE candidate', signal.connectionId, reason)
    this.schedulePendingCandidateFlush(signal.connectionId)
  }

  schedulePendingCandidateFlush(connectionId: bigint) {
    if (this.pendingCandidateTimers.has(connectionId)) return

    const timer = setTimeout(() => {
      this.pendingCandidateTimers.delete(connectionId)
      this.flushPendingCandidates(connectionId)
    }, PENDING_CANDIDATE_RETRY_MS)
    timer.unref?.()

    this.pendingCandidateTimers.set(connectionId, timer)
  }

  flushPendingCandidates(connectionId: bigint) {
    const candidates = this.pendingCandidates.get(connectionId)
    if (!candidates?.length) return

    const conn = this.connections.get(connectionId)
    const remaining: PendingCandidate[] = []

    for (const candidate of candidates) {
      if (!conn || !this.remoteDescriptionReady.has(connectionId)) {
        this.requeueCandidate(candidate, remaining, 'connection is not ready')
        continue
      }

      try {
        conn.rtcConnection.addRemoteCandidate(candidate.signal.data, '0')
      }
      catch (error) {
        this.requeueCandidate(candidate, remaining, formatCandidateError(error))
      }
    }

    if (remaining.length) {
      this.pendingCandidates.set(connectionId, remaining)
      this.schedulePendingCandidateFlush(connectionId)
    }
    else {
      this.pendingCandidates.delete(connectionId)
    }
  }

  requeueCandidate(candidate: PendingCandidate, remaining: PendingCandidate[], reason: string) {
    if (candidate.attempts >= MAX_PENDING_CANDIDATE_ATTEMPTS) {
      debugFn('Dropping ICE candidate after retries', candidate.signal.connectionId, reason)
      return
    }

    remaining.push({
      signal: candidate.signal,
      attempts: candidate.attempts + 1,
    })
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
        new SignalStructure(SignalType.CandidateAdd, signal.connectionId, candidate, signal.networkId)
      )
    })

    rtcConnection.onDataChannel(channel => {
      if (channel.getLabel() === 'ReliableDataChannel') connection.setChannels(channel)
      if (channel.getLabel() === 'UnreliableDataChannel') connection.setChannels(null, channel)
    })

    rtcConnection.onIceStateChange(state => {
      if (state === 'connected') this.onOpenConnection(connection)
      if (state === 'disconnected') {
        this.remoteDescriptionReady.delete(signal.connectionId)
        this.pendingCandidates.delete(signal.connectionId)
        this.onCloseConnection(signal.connectionId, 'disconnected')
      }
    })

    rtcConnection.setRemoteDescription(signal.data, 'offer')
    this.remoteDescriptionReady.add(signal.connectionId)
    this.flushPendingCandidates(signal.connectionId)

    const answer = rtcConnection.localDescription()

    if(!answer) {
      throw new Error('No answer')
    }

    this.signaling.write(
      new SignalStructure(SignalType.ConnectResponse, signal.connectionId, answer.sdp, signal.networkId)
    )

  }

  async listen() {

    await this.signaling.connect()

    this.signaling.on('signal', (signal) => {

      switch (signal.type) {
        case SignalType.ConnectRequest:
          this.handleOffer(signal).catch(error => {
            debugFn('Failed to handle connect offer', signal, error)
          })
          break
        case SignalType.CandidateAdd:
          this.handleCandidate(signal).catch(error => {
            debugFn('Failed to handle ICE candidate', signal, error)
          })
          break
        default:
          debugFn('Received signal for unknown type', signal)
      }

    })
  }

  close() {
    for (const timer of this.pendingCandidateTimers.values()) {
      clearTimeout(timer)
    }
    this.pendingCandidateTimers.clear()
    this.pendingCandidates.clear()
    this.remoteDescriptionReady.clear()

    for (const conn of this.connections.values()) {
      conn.close()
    }
  }

}

function formatCandidateError(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}
