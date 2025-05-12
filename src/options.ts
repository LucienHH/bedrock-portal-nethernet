import { CompressionAlgorithm } from './transforms/framer'

export type Options = {
  version: string
  autoInitPlayer: boolean
  offline: boolean
  connectTimeout: number
  compressionAlgorithm: CompressionAlgorithm
  compressionLevel: number
  compressionThreshold: number
  protocolVersion: number
}

// Currently supported verson. Note, clients with newer versions can still connect as long as data is in minecraft-data
export const CURRENT_VERSION = '1.21.80'

export const defaultOptions = {
  // https://minecraft.wiki/w/Protocol_version#Bedrock_Edition_2
  version: CURRENT_VERSION,
  // client: If we should send SetPlayerInitialized to the server after getting play_status spawn.
  // if this is disabled, no 'spawn' event will be emitted, you should manually set
  // client.status to ClientStatus.Initialized after sending the init packet.
  autoInitPlayer: true,
  // If true, do not authenticate with Xbox Live
  offline: false,
  // Milliseconds to wait before aborting connection attempt
  connectTimeout: 9000,
  // server: What compression algorithm to use by default, either `none`, `deflate` or `snappy`
  compressionAlgorithm: CompressionAlgorithm.Deflate,
  // server and client: On Deflate, what compression level to use, between 1 and 9
  compressionLevel: 7,
  // server: If true, only compress if a payload is larger than compressionThreshold
  compressionThreshold: 512,
  // server and client: The protocol version to use
  protocolVersion: 800,
}
