const [readVarInt, writeVarInt, sizeOfVarInt] = require('protodef').types.varint
import zlib from 'zlib'

import { Player } from '../serverPlayer'

export enum CompressionAlgorithm {
  None = 'none',
  Deflate = 'deflate',
  Snappy = 'snappy'
}

// Concatenates packets into one batch packet, and adds length prefixs.
export class Framer {

  packets: Buffer[]

  batchHeader: number[]

  compressor: CompressionAlgorithm

  compressionLevel: number

  compressionThreshold: number

  compressionHeader: number

  writeCompressor: boolean

  constructor(client: Player) {
    this.packets = []

    this.batchHeader = client.batchHeader

    this.compressor = client.compressionAlgorithm || 'none'

    this.compressionLevel = client.compressionLevel

    this.compressionThreshold = client.compressionThreshold

    this.compressionHeader = client.compressionHeader || 0

    this.writeCompressor = client.compressionReady
  }

  // No compression in base class
  compress(buffer: Buffer) {
    switch (this.compressor) {
      case CompressionAlgorithm.Deflate: return zlib.deflateRawSync(buffer, { level: this.compressionLevel })
      case CompressionAlgorithm.Snappy: throw Error('Snappy compression not implemented')
      case CompressionAlgorithm.None: return buffer
    }
  }

  static decompress(algorithm: number | string, buffer: Buffer) {
    switch (algorithm) {
      case 0:
      case 'deflate':
        return zlib.inflateRawSync(buffer, { chunkSize: 512000 })
      case 1:
      case 'snappy':
        throw Error('Snappy compression not implemented')
      case 'none':
      case 255:
        return buffer
      default: throw Error('Unknown compression type ' + algorithm)
    }
  }

  static decode(client: Player, buf: Buffer) {

    const headerLength = client.batchHeader.length

    if (buf.length < headerLength) {
      throw new Error('Unexpected EOF')
    }

    const buffer = buf.slice(headerLength)

    let decompressed
    if (client.compressionReady) {
      decompressed = this.decompress(buffer[0], buffer.slice(1))
    }
    else {
      // On old versions, compressor is session-wide ; failing to decompress
      // a packet will assume it's not compressed
      try {
        decompressed = this.decompress(client.compressionAlgorithm, buffer)
      }
      catch (e) {
        decompressed = buffer
      }
    }
    return Framer.getPackets(decompressed)
  }

  encode() {
    const buf = Buffer.concat(this.packets)
    const shouldCompress = (buf.length > this.compressionThreshold)
    const compressed = shouldCompress ? this.compress(buf) : buf
    const header = this.writeCompressor ? [...this.batchHeader, shouldCompress ? this.compressionHeader : 255] : this.batchHeader
    return Buffer.concat([Buffer.from(header), compressed])
  }

  addEncodedPacket(chunk: Buffer) {
    const varIntSize = sizeOfVarInt(chunk.byteLength)
    const buffer = Buffer.allocUnsafe(varIntSize + chunk.byteLength)
    writeVarInt(chunk.length, buffer, 0)
    chunk.copy(buffer, varIntSize)
    this.packets.push(buffer)
  }

  addEncodedPackets(packets: Buffer[]) {
    let allocSize = 0
    for (const packet of packets) {
      allocSize += sizeOfVarInt(packet.byteLength)
      allocSize += packet.byteLength
    }
    const buffer = Buffer.allocUnsafe(allocSize)
    let offset = 0
    for (const chunk of packets) {
      offset = writeVarInt(chunk.length, buffer, offset)
      offset += chunk.copy(buffer, offset, 0)
    }

    this.packets.push(buffer)
  }

  getBuffer() {
    return Buffer.concat(this.packets)
  }

  static getPackets(buffer: Buffer) {
    const packets = []
    let offset = 0
    while (offset < buffer.byteLength) {
      const { value, size } = readVarInt(buffer, offset)
      const dec = Buffer.allocUnsafe(value)
      offset += size
      offset += buffer.copy(dec, 0, offset, offset + value)
      packets.push(dec)
    }
    return packets
  }
}
