export const SignalType = {
  ConnectRequest: 'CONNECTREQUEST',
  ConnectResponse: 'CONNECTRESPONSE',
  CandidateAdd: 'CANDIDATEADD',
  ConnectError: 'CONNECTERROR',
}

export class SignalStructure {

  type: string

  connectionId: bigint

  data: string

  networkId: bigint

  constructor(type: string, connectionId: bigint, data: string, networkId: bigint) {
    this.type = type
    this.connectionId = connectionId
    this.data = data
    this.networkId = networkId
  }

  toString() {
    return `${this.type} ${this.connectionId} ${this.data}`
  }

  static fromString(message: string, networkId: bigint) {
    const [type, connectionId, ...data] = message.split(' ')

    return new this(type, BigInt(connectionId), data.join(' '), networkId)
  }
}
