import { KeyPairKeyObjectResult } from 'crypto'
import { TypedEmitter } from 'tiny-typed-emitter'

import { Server } from './server'
import LoginVerify from './handshake/loginVerify'
import { Connection } from './nethernet/connection'
import { KeyExchange } from './handshake/keyExchange'
import { serialize, isDebug } from './datatypes/util'
import { MIN_VERSION, Options, Versions } from './options'
import { CompressionAlgorithm, Framer } from './transforms/framer'

const debug = require('debug')('bedrock-portal-nethernet')

export const ClientStatus = {
  Disconnected: 0,
  Connecting: 1,
  Authenticating: 2, // Handshaking
  Initializing: 3, // Authed, need to spawn
  Initialized: 4, // play_status spawn sent by server, client responded with SetPlayerInit packet
}

interface PlayerEvents {
  status: (status: number) => void
  loggingIn: (body: any) => void
  login: (body: any) => void
  'server.client_handshake': (body: any) => void
  join: () => void
  spawn: () => void
  close: () => void
  packet: (packet: any) => void
}

export class Player extends TypedEmitter<PlayerEvents> {

  server: Server

  // defined in KeyExchange
  ecdhKeyPair!: KeyPairKeyObjectResult
  publicKeyDER!: string | Buffer
  privateKeyPEM!: string | Buffer
  clientX509!: string
  sharedSecret!: Buffer
  secretKeyBytes!: Buffer

  // defined in LoginVerify
  decodeLoginJWT!: (authTokens: string[], skinTokens: string) => { key: string, userData: any, skinData: any }
  encodeLoginJWT!: (localChain: string, mojangChain: string[]) => void

  inLog?: (...args: any[]) => void
  outLog?: (...args: any[]) => void

  _sentNetworkSettings: boolean

  serializer: any

  deserializer: any

  features!: {
    compressorInHeader: boolean
  }

  batchHeader: number[]
  disableEncryption: boolean

  compressionAlgorithm!: CompressionAlgorithm
  compressionLevel!: number
  compressionThreshold!: number
  compressionHeader: number

  connection: Connection

  options: Options

  compressionReady: boolean

  userData: any

  skinData: any

  profile?: {
    name: string
    uuid: string
    xuid: string
  }

  version?: number

  #status: number

  constructor(server: Server, connection: Connection) {
    super()
    this.server = server
    this.features = server.features
    this.serializer = server.serializer
    this.deserializer = server.deserializer
    this.connection = connection
    this.options = server.options

    KeyExchange(this)
    LoginVerify(this)

    this.#status = ClientStatus.Authenticating

    if (isDebug) {
      this.inLog = (...args) => debug('C -> S', ...args)
      this.outLog = (...args) => debug('S -> C', ...args)
    }

    this.batchHeader = this.server.batchHeader
    this.disableEncryption = this.server.disableEncryption

    // Compression is server-wide
    this.compressionAlgorithm = this.server.compressionAlgorithm
    this.compressionLevel = this.server.compressionLevel
    this.compressionThreshold = this.server.compressionThreshold
    this.compressionHeader = this.server.compressionHeader

    this._sentNetworkSettings = false // 1.19.30+

    this.compressionReady = false

  }

  getUserData() {
    return this.userData
  }

  get status() {
    return this.#status
  }

  set status(val) {
    debug('* new status', val)
    this.emit('status', val)
    this.#status = val
  }

  versionLessThan(version: string | number) {
    return this.options.protocolVersion < (typeof version === 'string' ? Versions[version] : version)
  }

  versionGreaterThan(version: string | number) {
    return this.options.protocolVersion > (typeof version === 'string' ? Versions[version] : version)
  }

  versionGreaterThanOrEqualTo(version: string | number) {
    return this.options.protocolVersion >= (typeof version === 'string' ? Versions[version] : version)
  }

  versionLessThanOrEqualTo(version: string | number) {
    return this.options.protocolVersion <= (typeof version === 'string' ? Versions[version] : version)
  }

  sendNetworkSettings() {
    this.write('network_settings', {
      compression_threshold: this.server.compressionThreshold,
      compression_algorithm: this.server.compressionAlgorithm,
      client_throttle: false,
      client_throttle_threshold: 0,
      client_throttle_scalar: 0,
    })
    this._sentNetworkSettings = true
    this.compressionReady = true
  }

  handleClientProtocolVersion(clientVersion: number) {
    // if (this.server.options.protocolVersion) {
    //   if (this.server.options.protocolVersion < clientVersion) {
    //     this.sendDisconnectStatus('failed_spawn') // client too new
    //     return false
    //   }
    // }
    if (clientVersion < Number(MIN_VERSION)) {
      this.sendDisconnectStatus('failed_client') // client too old
      return false
    }
    return true
  }

  onLogin(packet: any) {
    const body = packet.data
    this.emit('loggingIn', body)

    const clientVer = body.params.protocol_version
    if (!this.handleClientProtocolVersion(clientVer)) {
      return
    }

    // Parse login data
    const tokens = body.params.tokens
    const authChain = JSON.parse(tokens.identity)
    const skinChain = tokens.client

    try {
      var { key, userData, skinData } = this.decodeLoginJWT(authChain.chain, skinChain) // eslint-disable-line
    }
    catch (e) {
      debug(this.connection.connectionId, e)
      this.disconnect('Server authentication error')
      return
    }

    this.emit('server.client_handshake', { key }) // internal so we start encryption

    this.userData = userData.extraData

    this.skinData = skinData

    this.profile = {
      name: userData.extraData?.displayName,
      uuid: userData.extraData?.identity,
      xuid: userData.extraData?.xuid || userData.extraData?.XUID,
    }
    this.version = clientVer

    this.emit('login', { user: userData.extraData }) // emit events for user
  }

  /**
   * Disconnects a client before it has joined
   * @param {string} playStatus
   */
  sendDisconnectStatus(playStatus: string) {
    if (this.status === ClientStatus.Disconnected) return
    this.write('play_status', { status: playStatus })
    this.close('kick')
  }

  /**
   * Disconnects a client
   */
  disconnect(reason = 'Server closed', hide = false) {
    if (this.status === ClientStatus.Disconnected) return
    this.write('disconnect', {
      hide_disconnect_screen: hide,
      message: reason,
      filtered_message: '',
    })
    this.server.conLog('Kicked ', this.connection.connectionId, reason)
    setTimeout(() => this.close('kick'), 100) // Allow time for message to be recieved.
  }

  // After sending Server to Client Handshake, this handles the client's
  // Client to Server handshake response. This indicates successful encryption
  onHandshake() {
    // https://wiki.vg/Bedrock_Protocol#Play_Status
    this.write('play_status', { status: 'login_success' })
    this.status = ClientStatus.Initializing
    this.emit('join')
  }

  close(reason: string) {
    if (this.status !== ClientStatus.Disconnected) {
      this.emit('close') // Emit close once
      if (!reason) this.inLog?.('Client closed connection', this.connection.connectionId)
    }

    this.connection?.close()
    this.removeAllListeners()
    this.status = ClientStatus.Disconnected
  }

  readPacket(packet: Buffer) {
    try {
      var des = this.server.deserializer.parsePacketBuffer(packet) // eslint-disable-line
    }
    catch (e) {
      this.disconnect('Server error')
      debug('Dropping packet from', this.connection.connectionId, e)
      return
    }

    this.inLog?.(des.data.name, serialize(des.data.params))

    switch (des.data.name) {
      // This is the first packet on 1.19.30 & above
      case 'request_network_settings':
        if (this.handleClientProtocolVersion(des.data.params.client_protocol)) {
          this.sendNetworkSettings()
          this.compressionLevel = this.server.compressionLevel
        }
        return
      // Below 1.19.30, this is the first packet.
      case 'login':
        this.onLogin(des)
        if (!this._sentNetworkSettings) this.sendNetworkSettings()
        return
      case 'client_to_server_handshake':
        // Emit the 'join' event
        this.onHandshake()
        break
      case 'set_local_player_as_initialized':
        this.status = ClientStatus.Initialized
        this.inLog?.('Server client spawned')
        // Emit the 'spawn' event
        this.emit('spawn')
        break
      default:
        if (this.status === ClientStatus.Disconnected || this.status === ClientStatus.Authenticating) {
          this.inLog?.('ignoring', des.data.name)
          return
        }
    }
    this.emit(des.data.name, des.data.params)
    this.emit('packet', des)
  }

  updateItemPalette(palette: any) {
    // In the future, we can send down the whole item palette if we need
    // but since it's only one item, we can just make a single variable.
    let shieldItemID
    for (const state of palette) {
      if (state.name === 'minecraft:shield') {
        shieldItemID = state.runtime_id
        break
      }
    }
    if (shieldItemID) {
      this.serializer.proto.setVariable('ShieldItemID', shieldItemID)
      this.deserializer.proto.setVariable('ShieldItemID', shieldItemID)
    }
  }

  write(name: string, params: any) {
    this.outLog?.(name, params)
    if (name === 'start_game') this.updateItemPalette(params.itemstates)

    const batch = new Framer(this)

    const packet = this.serializer.createPacketBuffer({ name, params })

    batch.addEncodedPacket(packet)

    this.sendPacket(batch.encode())
  }

  sendPacket(buffer: Buffer) {
    if (this.connection.reliable?.readyState !== 'open' || this.status === ClientStatus.Disconnected) return
    try {
      this.connection.write(buffer)
    }
    catch (e) {
      debug('while sending to', this.connection, e)
    }
  }

  onDecryptedPacket = (buffer: Buffer) => {
    const packets = Framer.decode(this, buffer)

    for (const packet of packets) {
      this.readPacket(packet)
    }
  }

}
