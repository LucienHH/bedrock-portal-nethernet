import { parse } from 'sdp-transform'
import { Connections } from './Connection'
import { getRandomUint64, Signal } from '../signaling/Signal'
import { SignalStructure, SignalType } from '../signaling/struct'
import { RTCIceCandidate, RTCPeerConnection } from 'werift'

const debugFn = require('debug')('bedrock-portal-nethernet')

export class Nethernet {

  networkId: bigint

  connectionId: bigint

  signaling: Signal

  connections: Map<bigint, Connections>

  onOpenConnection: (conn: Connections) => void

  onCloseConnection: (id: bigint, reason: string) => void

  onEncapsulated: (packet: Buffer, id: bigint) => void

  constructor(signaling: Signal, networkId = getRandomUint64(), connectionId = getRandomUint64()) {

    this.networkId = networkId

    this.connectionId = connectionId

    this.signaling = signaling

    this.connections = new Map()

    this.onOpenConnection = () => { }

    this.onCloseConnection = () => { }

    this.onEncapsulated = () => { }

  }

  async handleCandidate(signal: SignalStructure) {
    const conn = this.connections.get(signal.connectionID)

    if (conn) {
      await conn.webrtc.addIceCandidate(new RTCIceCandidate({ candidate: signal.data }))
    }
    else {
      debugFn('Received candidate for unknown connection', signal)
    }

  }

  async handleOffer(signal: SignalStructure) {

    const creds = await this.signaling.getCredentials()

    const conn = new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:relay.communication.microsoft.com:3478',
          credential: creds.TurnAuthServers[0].Password,
          username: creds.TurnAuthServers[0].Username,
        },
        {
          urls: 'turn:relay.communication.microsoft.com:3478',
          credential: creds.TurnAuthServers[0].Password,
          username: creds.TurnAuthServers[0].Username,
        },
      ],
    })

    conn.onicecandidate = (e) => {
      if (e.candidate) {
        this.signaling.write(
          new SignalStructure(SignalType.CandidateAdd, signal.connectionID, e.candidate.candidate, signal.networkID)
        )
      }
    }

    await conn.setRemoteDescription({ type: 'offer', sdp: signal.data })

    const c = new Connections(this, signal.connectionID, signal.networkID, conn, parse(signal.data))

    this.connections.set(signal.connectionID, c)

    const answer = await conn.createAnswer()

    await conn.setLocalDescription(answer)

    this.signaling.write(
      new SignalStructure(SignalType.ConnectResponse, signal.connectionID, answer.sdp, signal.networkID)
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
}
