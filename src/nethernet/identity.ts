import crypto from 'crypto'

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

export function verifyIdentity(sdp: string) {
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

  const tokenParts = assertion.token.split('.')
  if (tokenParts.length !== 3) throw new Error('Malformed identity token')

  const token = parseJson<IdentityToken>(Buffer.from(tokenParts[1], 'base64url').toString('utf8'), 'identity token')
  if (!token.cpk) throw new Error('Identity token missing client public key')

  const now = Date.now() / 1000
  if (token.exp !== undefined && token.exp <= now) throw new Error('Identity token has expired')
  if (token.nbf !== undefined && token.nbf > now) throw new Error('Identity token is not valid yet')

  const publicKey = parsePublicKey(token.cpk)
  const fingerprint = getSdpAttribute(sdp, 'fingerprint')
  if (!fingerprint) throw new Error('Missing SDP fingerprint')

  const separator = fingerprint.indexOf(' ')
  if (separator === -1) throw new Error('Malformed SDP fingerprint')

  const signedPayload = Buffer.from(JSON.stringify({
    fingerprint: [{
      algorithm: fingerprint.slice(0, separator),
      digest: fingerprint.slice(separator + 1),
    }],
  }))

  verifyDetachedSignature(assertion.fingerprints, signedPayload, publicKey)
  return publicKey.export({ format: 'der', type: 'spki' })
}

export function publicKeysEqual(encodedKey: string, expectedKey: Buffer) {
  return parsePublicKey(encodedKey).export({ format: 'der', type: 'spki' }).equals(expectedKey)
}

function verifyDetachedSignature(compact: string, payload: Buffer, publicKey: crypto.KeyObject) {
  const parts = compact.split('.')
  if (parts.length !== 3 || parts[1] !== '') throw new Error('Malformed detached fingerprint signature')

  const header = parseJson<{ alg?: string }>(Buffer.from(parts[0], 'base64url').toString('utf8'), 'fingerprint signature header')
  if (header.alg !== 'ES384') throw new Error(`Unexpected fingerprint signature algorithm: ${header.alg}`)

  const signingInput = Buffer.from(`${parts[0]}.${payload.toString('base64url')}`)
  const signature = Buffer.from(parts[2], 'base64url')
  if (!crypto.verify('sha384', signingInput, { key: publicKey, dsaEncoding: 'ieee-p1363' }, signature)) {
    throw new Error('Invalid SDP fingerprint signature')
  }
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
