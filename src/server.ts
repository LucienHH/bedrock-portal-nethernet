import debugFn from 'debug'
import { TypedEmitter } from 'tiny-typed-emitter'
import type { Authflow } from 'prismarine-auth'

import { Player } from './serverPlayer'
import { sleep } from './datatypes/util'
import { Options, defaultOptions } from './options'
import { createDeserializer, createSerializer } from './transforms/serializer'

import { Signal } from './signaling/signal'

import { Server as NethernetServer } from './nethernet/server'
import { Connection } from './nethernet/connection'
import { CompressionAlgorithm } from './transforms/framer'

const debug = debugFn('bedrock-portal-nethernet')

interface ServerEvents {
  connect: (player: Player) => void
}

export class Server extends TypedEmitter<ServerEvents> {

  options: Options

  serializer: any

  deserializer: any

  clients: Map<bigint, Player>

  clientCount: number

  conLog: (message: any, ...optionalParams: any[]) => void

  batchHeader: number[]
  disableEncryption: boolean

  compressionAlgorithm!: CompressionAlgorithm

  compressionLevel!: number

  compressionThreshold!: number

  compressionHeader!: number

  signaling?: Signal

  nethernet?: NethernetServer

  constructor(options: Partial<Options> = {}) {
    super()

    this.options = { ...defaultOptions, ...options }

    this.serializer = createSerializer(this.options.version)
    this.deserializer = createDeserializer(this.options.version)

    this.clients = new Map()
    this.clientCount = 0
    this.conLog = debug

    this.batchHeader = []
    this.disableEncryption = true

    this.setCompressor(this.options.compressionAlgorithm, this.options.compressionLevel, this.options.compressionThreshold)
  }

  setCompressor(algorithm: CompressionAlgorithm, level = 1, threshold = 256) {
    switch (algorithm) {
      case CompressionAlgorithm.None:
        this.compressionAlgorithm = CompressionAlgorithm.None
        this.compressionLevel = 0
        this.compressionHeader = 255
        break
      case CompressionAlgorithm.Deflate:
        this.compressionAlgorithm = CompressionAlgorithm.Deflate
        this.compressionLevel = level
        this.compressionThreshold = threshold
        this.compressionHeader = 0
        break
      case CompressionAlgorithm.Snappy:
        this.compressionAlgorithm = CompressionAlgorithm.Snappy
        this.compressionLevel = level
        this.compressionThreshold = threshold
        this.compressionHeader = 1
        break
      default:
        throw new Error(`Unknown compression algorithm: ${algorithm}`)
    }
  }

  onOpenConnection = (conn: Connection) => {
    this.conLog('New connection: ', conn?.connectionId)
    const player = new Player(this, conn)
    this.clients.set(conn.connectionId, player)
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

  async listen(auth: Authflow, networkId: bigint) {

    this.signaling = new Signal(auth, networkId, this.options.version)

    this.nethernet = new NethernetServer(this.signaling, networkId)

    await this.nethernet.listen()

    this.nethernet.onOpenConnection = this.onOpenConnection

    this.nethernet.onCloseConnection = this.onCloseConnection

    this.nethernet.onEncapsulated = this.onEncapsulated

  }

  async close(disconnectReason = 'Server closed') {

    for (const player of this.clients.values()) {
      player.disconnect(disconnectReason)
    }

    this.clients.clear()
    this.clientCount = 0

    await sleep(60)
    this.nethernet?.close()

    if (this.signaling) {
      await this.signaling.destroy()
    }

  }
}
