const { ProtoDefCompiler, CompiledProtodef } = require('protodef').Compiler
import { FullPacketParser, Serializer } from 'protodef'
import { join } from 'path'
import fs from 'fs'

export class Parser extends FullPacketParser {
  dumpFailedBuffer(packet: Buffer, prefix = '') {
    if (packet.length > 1000) {
      const now = Date.now()
      fs.writeFileSync(now + '_packetReadError.txt', packet.toString('hex'))
      console.log(prefix, `Deserialization failure for packet 0x${packet.slice(0, 1).toString('hex')}. Packet buffer saved in ./${now}_packetReadError.txt as buffer was too large (${packet.length} bytes).`)
    }
    else {
      console.log(prefix, 'Read failure for 0x' + packet.slice(0, 1).toString('hex'), packet.slice(0, 1000))
    }
  }

  verify(deserialized: any, serializer: any) {
    const { name, params } = deserialized.data
    const oldBuffer = deserialized.fullBuffer
    const newBuffer = serializer.createPacketBuffer({ name, params })
    if (!newBuffer.equals(oldBuffer)) {
      const fs = require('fs')
      fs.writeFileSync('new.bin', newBuffer)
      fs.writeFileSync('old.bin', oldBuffer)
      fs.writeFileSync('failed.json', JSON.stringify(params, (k, v) => typeof v === 'bigint' ? v.toString() : v, 2))
      console.warn('Failed to re-encode', name)
    }
  }
}

// Compiles the ProtoDef schema at runtime
export function createProtocol(version: string) {

  try {
    require(`../../data/${version}/size.js`)
    return getProtocol(version)
  }
  // eslint-disable-next-line no-empty
  catch {}

  const protocol = JSON.parse(fs.readFileSync('./protocol.json', 'utf8'))

  const compiler = new ProtoDefCompiler()
  compiler.addTypesToCompile(protocol.types)
  compiler.addTypes(require('../datatypes/compiler-minecraft'))

  const compiledProto = compiler.compileProtoDefSync()
  return compiledProto
}

// Loads already generated read/write/sizeof code
export function getProtocol(version: string) {
  const compiler = new ProtoDefCompiler()
  compiler.addTypes(require(join(__dirname, '../datatypes/compiler-minecraft')))

  global.PartialReadError = require('protodef/src/utils').PartialReadError
  const compile = (compiler: any, file: string) => require(file)(compiler.native)

  return new CompiledProtodef(
    compile(compiler.sizeOfCompiler, join(__dirname, `../../data/${version}/size.js`)),
    compile(compiler.writeCompiler, join(__dirname, `../../data/${version}/write.js`)),
    compile(compiler.readCompiler, join(__dirname, `../../data/${version}/read.js`))
  )
}

export function createSerializer(version: string) {
  const proto = createProtocol(version)
  return new Serializer(proto, 'mcpe_packet')
}

export function createDeserializer(version: string) {
  const proto = createProtocol(version)
  return new Parser(proto, 'mcpe_packet')
}
