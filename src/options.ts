import mcData from 'minecraft-data'

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

// Minimum supported version (< will be kicked)
export const MIN_VERSION = '1.16.201'
// Currently supported verson. Note, clients with newer versions can still connect as long as data is in minecraft-data
export const CURRENT_VERSION = '1.21.51'

export const Versions = Object.fromEntries(mcData.versions.bedrock.filter(e => e.releaseType === 'release').map(e => [e.minecraftVersion, e.version]))

// Skip some low priority versions (middle major) on Github Actions to allow faster CI
export const skippedVersionsOnGithubCI = ['1.16.210', '1.17.10', '1.17.30', '1.18.11', '1.19.10', '1.19.20', '1.19.30', '1.19.40', '1.19.50', '1.19.60', '1.19.63', '1.19.70', '1.20.10']
export const testedVersions = process.env.CI ? Object.keys(Versions).filter(v => !skippedVersionsOnGithubCI.includes(v)) : Object.keys(Versions)

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
  protocolVersion: Versions[CURRENT_VERSION],
}

export function validateOptions(options: Options) {
  if (!Versions[options.version]) {
    console.warn('Supported versions', Versions)
    throw Error(`Unsupported version ${options.version}`)
  }

  options.protocolVersion = Versions[options.version]
  // if (options.protocolVersion < MIN_VERSION) {
  //   throw new Error(`Protocol version < ${MIN_VERSION} : ${options.protocolVersion}, too old`)
  // }

}
