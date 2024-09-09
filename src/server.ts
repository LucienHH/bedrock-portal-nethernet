import debugFn from 'debug'
import { EventEmitter } from 'events'
import type { Authflow } from 'prismarine-auth'

import { Player } from './serverPlayer'
import { sleep } from './datatypes/util'
import { Options, defaultOptions, validateOptions, Versions } from './options'
import { createDeserializer, createSerializer } from './transforms/serializer'

import { Signal } from './signaling/Signal'
import { Nethernet } from './nethernet/Nethernet'
import { Connections } from './nethernet/Connection'
import { CompressionAlgorithm } from './transforms/framer'

const debug = debugFn('bedrock-portal-nethernet')

export class Server extends EventEmitter {

  options: Options

  serializer: any

  deserializer: any

  clients: Map<bigint, Player>

  clientCount: number

  conLog: (message: any, ...optionalParams: any[]) => void

  features!: {
    compressorInHeader: boolean
  }

  compressionAlgorithm!: CompressionAlgorithm

  compressionLevel!: number

  compressionThreshold!: number

  signaling?: Signal

  nethernet?: Nethernet

  constructor(options: Options) {
    super()

    this.options = { ...defaultOptions, ...options }
    this.validateOptions()

    this._loadFeatures(this.options.version)

    this.serializer = createSerializer(this.options.version)
    this.deserializer = createDeserializer(this.options.version)

    this.clients = new Map()
    this.clientCount = 0
    this.conLog = debug

    this.setCompressor(this.options.compressionAlgorithm, this.options.compressionLevel, this.options.compressionThreshold)
  }

  _loadFeatures(version: string) {
    try {
      const mcData = require('minecraft-data')('bedrock_' + version)
      this.features = {
        compressorInHeader: mcData.supportFeature('compressorInPacketHeader'),
      }
    }
    catch (e) {
      throw new Error(`Unsupported version: '${version}', no data available`)
    }
  }

  setCompressor(algorithm: CompressionAlgorithm, level = 1, threshold = 256) {
    switch (algorithm) {
      case 'none':
        this.compressionAlgorithm = 'none'
        this.compressionLevel = 0
        break
      case 'deflate':
        this.compressionAlgorithm = 'deflate'
        this.compressionLevel = level
        this.compressionThreshold = threshold
        break
      case 'snappy':
        this.compressionAlgorithm = 'snappy'
        this.compressionLevel = level
        this.compressionThreshold = threshold
        break
      default:
        throw new Error(`Unknown compression algorithm: ${algorithm}`)
    }
  }

  validateOptions() {
    validateOptions(this.options)
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

  onOpenConnection = (conn: Connections) => {
    this.conLog('New connection: ', conn?.id)
    const player = new Player(this, conn)
    this.clients.set(conn.id, player)
    this.clientCount++
    this.emit('connect', player)
  }

  onCloseConnection = (id: bigint, reason: string) => {
    this.conLog('Connection closed:', id, reason)

    const player = this.clients.get(id)

    if (!player) {
      return
    }

    player.close(reason)

    this.clients.delete(id)

    this.clientCount--
  }

  onEncapsulated = (buffer: Buffer, address: bigint) => {
    const client = this.clients.get(address)
    if (!client) {
      // Ignore packets from clients that are not connected.
      debug(`Ignoring packet from unknown inet address: ${address}`)
      return
    }

    process.nextTick(() => client.onDecryptedPacket(buffer))
  }

  async listen(auth: Authflow, networkID: bigint) {

    this.signaling = new Signal(auth, networkID)

    this.nethernet = new Nethernet(this.signaling, networkID)

    await this.nethernet.listen()

    this.conLog('Listening on')

    this.nethernet.onOpenConnection = this.onOpenConnection

    this.nethernet.onCloseConnection = this.onCloseConnection

    this.nethernet.onEncapsulated = this.onEncapsulated

    // this.nethernet.onClose = (reason) => this.close(reason || 'Nethernet closed')

  }

  async close(disconnectReason = 'Server closed') {

    for (const player of this.clients.values()) {
      player.close(disconnectReason)
    }

    this.clients.clear()

    this.clientCount = 0

    // Allow some time for client to get disconnect before closing connection.
    await sleep(60)

    await this.signaling?.destroy(false)
  }
}
