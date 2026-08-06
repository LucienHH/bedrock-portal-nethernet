import crypto from 'crypto'
import { CompactSign, decodeJwt, flattenedVerify, SignJWT } from 'jose'

type IdentityData = {
  assertion?: string
  idp?: {
    domain?: string
    protocol?: string
  }
}

type IdentityAssertion = {
  fingerprints?: string
  token?: string
}

type IdentityToken = {
  cpk?: string
  exp?: number
  nbf?: number
}

export type ServerIdentity = {
  privateKey: crypto.KeyObject
  publicKey: string
}

export function createServerIdentity(): ServerIdentity {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', { namedCurve: 'secp384r1' })
  return {
    privateKey,
    publicKey: publicKey.export({ format: 'der', type: 'spki' }).toString('base64'),
  }
}

export async function signServerIdentity(sdp: string, identity: ServerIdentity) {
  const now = Math.floor(Date.now() / 1000)
  const token = await new SignJWT({ cpk: identity.publicKey })
    .setProtectedHeader({ alg: 'ES384', x5u: identity.publicKey })
    .setIssuedAt(now)
    .setExpirationTime(now + 60)
    .sign(identity.privateKey)

  const signedFingerprints = await new CompactSign(fingerprintPayload(sdp))
    .setProtectedHeader({ alg: 'ES384' })
    .sign(identity.privateKey)
  const [protectedHeader, , signature] = signedFingerprints.split('.')
  const fingerprints = `${protectedHeader}..${signature}`
  const value = Buffer.from(JSON.stringify({
    assertion: JSON.stringify({ fingerprints, token }),
    idp: { domain: 'self', protocol: 'default' },
  })).toString('base64')

  return addSessionAttribute(sdp, `a=identity:${value}`)
}

export async function verifyIdentity(sdp: string) {
  const identityValue = getSdpAttribute(sdp, 'identity')
  if (!identityValue) throw new Error('Missing SDP identity assertion')

  const identity = parseJson<IdentityData>(Buffer.from(identityValue, 'base64').toString('utf8'), 'identity assertion')
  if (!identity.assertion || !identity.idp?.domain || identity.idp.protocol !== 'default') {
    throw new Error('Malformed SDP identity assertion')
  }

  const assertion = parseJson<IdentityAssertion>(identity.assertion, 'identity assertion payload')
  if (!assertion.fingerprints || !assertion.token) {
    throw new Error('Incomplete SDP identity assertion')
  }

  const token = decodeJwt<IdentityToken>(assertion.token)
  if (!token.cpk) throw new Error('Identity token missing client public key')

  const now = Date.now() / 1000
  if (token.exp !== undefined && token.exp <= now) throw new Error('Identity token has expired')
  if (token.nbf !== undefined && token.nbf > now) throw new Error('Identity token is not valid yet')

  const publicKey = parsePublicKey(token.cpk)
  await verifyDetachedSignature(assertion.fingerprints, fingerprintPayload(sdp), publicKey)
  return publicKey.export({ format: 'der', type: 'spki' })
}

export function publicKeysEqual(encodedKey: string, expectedKey: Buffer) {
  return parsePublicKey(encodedKey).export({ format: 'der', type: 'spki' }).equals(expectedKey)
}

async function verifyDetachedSignature(compact: string, payload: Buffer, publicKey: crypto.KeyObject) {
  const parts = compact.split('.')
  if (parts.length !== 3 || parts[1] !== '') throw new Error('Malformed detached fingerprint signature')

  await flattenedVerify({
    protected: parts[0],
    payload: payload.toString('base64url'),
    signature: parts[2],
  }, publicKey, { algorithms: ['ES384'] })
}

function fingerprintPayload(sdp: string) {
  const fingerprint = getSdpAttribute(sdp, 'fingerprint')
  if (!fingerprint) throw new Error('Missing SDP fingerprint')

  const separator = fingerprint.indexOf(' ')
  if (separator === -1) throw new Error('Malformed SDP fingerprint')

  return Buffer.from(JSON.stringify({
    fingerprint: [{
      algorithm: fingerprint.slice(0, separator),
      digest: fingerprint.slice(separator + 1),
    }],
  }))
}

function addSessionAttribute(sdp: string, attribute: string) {
  const lineEnding = sdp.includes('\r\n') ? '\r\n' : '\n'
  const lines = sdp.split(lineEnding)
  const mediaIndex = lines.findIndex(line => line.startsWith('m='))
  if (mediaIndex === -1) throw new Error('SDP has no media description')

  lines.splice(mediaIndex, 0, attribute)
  return lines.join(lineEnding)
}

function parsePublicKey(encodedKey: string) {
  const publicKey = crypto.createPublicKey({ key: Buffer.from(encodedKey, 'base64'), format: 'der', type: 'spki' })
  if (publicKey.asymmetricKeyType !== 'ec' || publicKey.asymmetricKeyDetails?.namedCurve !== 'secp384r1') {
    throw new Error('Client public key must use the P-384 curve')
  }
  return publicKey
}

function getSdpAttribute(sdp: string, name: string) {
  const prefix = `a=${name}:`
  const line = sdp.split(/\r?\n/).find(line => line.startsWith(prefix))
  return line?.slice(prefix.length).trim()
}

function parseJson<T>(value: string, name: string) {
  try {
    return JSON.parse(value) as T
  }
  catch {
    throw new Error(`Malformed ${name}`)
  }
}
