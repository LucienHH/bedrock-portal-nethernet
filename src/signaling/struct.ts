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

  pmsgId: string

  constructor(type: string, connectionId: bigint, data: string, networkId: bigint, pmsgId: string) {
    this.type = type
    this.connectionId = connectionId
    this.data = data
    this.networkId = networkId
    this.pmsgId = pmsgId
  }

  toString() {
    return `${this.type} ${this.connectionId} ${this.data}`
  }

  static fromString(message: string, networkId: bigint, pmsgId: string) {
    const [type, connectionId, ...data] = message.split(' ')

    return new this(type, BigInt(connectionId), data.join(' '), networkId, pmsgId)
  }
}
