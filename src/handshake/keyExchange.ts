import { sign } from 'jsonwebtoken'
import { KeyExportOptions, generateKeyPairSync } from 'crypto'
import { Player } from '../serverPlayer'

const debug = require('debug')('bedrock-portal-nethernet')

const SALT = '🧂'

const curve = 'secp384r1'
const pem: KeyExportOptions<'pem'> = { format: 'pem', type: 'sec1' }
const der: KeyExportOptions<'der'> = { format: 'der', type: 'spki' }

export function KeyExchange(client: Player) {
  // Generate a key pair at program start up
  client.ecdhKeyPair = generateKeyPairSync('ec', { namedCurve: curve })
  client.publicKeyDER = client.ecdhKeyPair.publicKey.export(der)
  client.privateKeyPEM = client.ecdhKeyPair.privateKey.export(pem)
  client.clientX509 = client.publicKeyDER.toString('base64')

  function startClientboundEncryption(publicKey: { key: string }) {
    debug('[encrypt] Client pub key base64: ', publicKey)

    // const pubKeyDer = crypto.createPublicKey({ key: Buffer.from(publicKey.key, 'base64'), ...der })
    // Shared secret from the client's public key + our private key
    // client.sharedSecret = crypto.diffieHellman({ privateKey: client.ecdhKeyPair.privateKey, publicKey: pubKeyDer })

    // Secret hash we use for packet encryption:
    // From the public key of the remote and the private key
    // of the local, a shared secret is generated using ECDH.
    // The secret key bytes are then computed as
    // sha256(server_token + shared_secret). These secret key
    //  bytes are 32 bytes long.
    // const secretHash = crypto.createHash('sha256')
    // secretHash.update(SALT)
    // secretHash.update(client.sharedSecret)

    const token = sign({
      salt: toBase64(SALT),
      signedToken: client.clientX509,
    }, client.ecdhKeyPair.privateKey, { algorithm: 'ES384', header: { x5u: client.clientX509, alg: 'ES384' } })

    client.write('server_to_client_handshake', { token })
    // client.secretKeyBytes = secretHash.digest()

    // // The encryption scheme is AES/CFB8/NoPadding with the
    // // secret key being the result of the sha256 above and
    // // the IV being the first 16 bytes of this secret key.
    // const initial = client.secretKeyBytes.slice(0, 16)
    // client.startEncryption(initial)
  }

  client.on('server.client_handshake', startClientboundEncryption)
}

function toBase64(string: string) {
  return Buffer.from(string).toString('base64')
}
