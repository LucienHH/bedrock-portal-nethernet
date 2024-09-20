export const SignalType = {
  ConnectRequest: 'CONNECTREQUEST',
  ConnectResponse: 'CONNECTRESPONSE',
  CandidateAdd: 'CANDIDATEADD',
  ConnectError: 'CONNECTERROR',
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
