export const SignalType = {
  ConnectRequest: 'CONNECTREQUEST',
  ConnectResponse: 'CONNECTRESPONSE',
  CandidateAdd: 'CANDIDATEADD',
  ConnectError: 'CONNECTERROR',
}

export const ICECandidateType = {
  Relay: 'relay',
  Srflx: 'srflx',
  Host: 'host',
  Prflx: 'prflx',
}

export class SignalStructure {

  type: string

  connectionID: bigint

  data: string

  networkID: bigint

  constructor(type: string, connectionID: bigint, data: string, networkID: bigint) {
    this.type = type
    this.connectionID = connectionID
    this.data = data
    this.networkID = networkID
  }

  marshalText() {
    return this.toString()
  }

  unmarshalText(input: string) {
    const segments = input.split(' ', 3)
    if (segments.length !== 3) {
      throw new Error(`unexpected segmentations: ${segments.length}`)
    }

    this.type = segments[0]
    this.connectionID = BigInt(segments[1])
    this.data = segments[2]
  }

  toString() {
    return `${this.type} ${this.connectionID.toString()} ${this.data}`
  }

  static fromWSMessage(networkID: bigint, message: string) {
    const segments = message.split(' ', 3)
    if (segments.length !== 3) {
      throw new Error(`unexpected segmentations: ${segments.length}`)
    }

    const [type, connectionId, ...data] = message.split(' ')


    return new SignalStructure(type, BigInt(connectionId), data.join(' '), networkID)
  }
}
