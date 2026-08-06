import crypto from 'crypto'
import { decodeProtectedHeader, jwtVerify, JWTPayload } from 'jose'

import { Player } from '../serverPlayer'
import { publicKeysEqual } from '../nethernet/identity'
import { PUBLIC_KEY } from './constants'
import { getAuthorizationVerifier } from './authorizationKeys'

const debug = require('debug')('bedrock-portal-nethernet')

const AUTHORISATION_AUDIENCE = 'api://auth-minecraft-services/multiplayer'
const AUTHORISATION_CLOCK_TOLERANCE_SECONDS = 60

type LoginTokenPayload = JWTPayload & {
  XUID?: string
  cpk?: string
  clientPublicKey?: string
  displayName?: string
  identity?: string
  identityPublicKey?: string
  pfbid?: string
  pfbtid?: string
  playFabId?: string
  playFabTitleId?: string
  PlayFabID?: string
  PlayFabTitleID?: string
  xid?: string
  xname?: string
  xuid?: string
  extraData?: {
    XUID?: string
    [key: string]: unknown
  }
}

function normalizeToken(token: string) {
  return token.replace(/^MCToken\s+/i, '').trim()
}

function getJwtHeader(token: string) {
  return decodeProtectedHeader(normalizeToken(token))
}

function getTokenUserData(decoded: LoginTokenPayload) {
  return {
    extraData: {
      XUID: decoded.xid || decoded.XUID || decoded.xuid || '0',
      displayName: decoded.xname || decoded.displayName || 'Player',
      identity: decoded.identity,
      PlayFabID: decoded.pfbid || decoded.playFabId || decoded.PlayFabID,
      PlayFabTitleID: decoded.pfbtid || decoded.playFabTitleId || decoded.PlayFabTitleID,
    },
  }
}

export default (client: Player) => {
  // Refer to the docs:
  // https://web.archive.org/web/20180917171505if_/https://confluence.yawk.at/display/PEPROTOCOL/Game+Packets#GamePackets-Login

  const getDER = (b64: string) => crypto.createPublicKey({ key: Buffer.from(b64, 'base64'), format: 'der', type: 'spki' })

  async function verifyTokenAuth(token: string) {
    const normalizedToken = normalizeToken(token)
    const { issuer, keys } = await getAuthorizationVerifier(client.options.protocolVersion)
    const { payload: decoded } = await jwtVerify<LoginTokenPayload>(normalizedToken, keys, {
      algorithms: ['RS256'],
      clockTolerance: AUTHORISATION_CLOCK_TOLERANCE_SECONDS,
      issuer,
      audience: AUTHORISATION_AUDIENCE,
    })

    const publicKey = decoded.cpk || decoded.clientPublicKey
    if (!publicKey) {
      throw new Error('Authorization token missing client public key')
    }

    return {
      key: publicKey,
      data: getTokenUserData(decoded),
    }
  }

  async function verifyChainAuth(chain: string[]) {
    let data: LoginTokenPayload = {}

    // There are three JWT tokens sent to us, one signed by the client
    // one signed by Mojang with the Mojang token we have and another one
    // from Xbox with addition user profile data
    // We verify that at least one of the tokens in the chain has been properly
    // signed by Mojang by checking the x509 public key in the JWT headers
    let didVerify = false

    let pubKey: crypto.KeyObject | string = getDER(getX5U(chain[0])) // the first one is client signed, allow it
    let finalKey = ''

    for (const token of chain) {
      const { payload: decoded } = await jwtVerify<LoginTokenPayload>(token, pubKey, { algorithms: ['ES384'] })

      // Check if signed by Mojang key
      const x5u = getX5U(token)
      if (x5u === PUBLIC_KEY && !data.extraData?.XUID) {
        didVerify = true
        debug('Verified client with mojang key', x5u)
      }

      pubKey = getDER(decoded.identityPublicKey || x5u)
      finalKey = decoded.identityPublicKey || finalKey // non pem
      data = { ...data, ...decoded }
    }

    if (!didVerify) {
      client.disconnect('disconnectionScreen.notAuthenticated')
    }

    return { key: finalKey, data }
  }

  async function verifySkin(publicKey: string, token: string) {
    if (getX5U(token) !== publicKey) {
      throw new Error('Invalid JWT signature')
    }

    const pubKey = getDER(publicKey)
    const { payload } = await jwtVerify<Record<string, unknown>>(token, pubKey, { algorithms: ['ES384'] })
    return payload
  }

  client.decodeLoginJWT = async (authTokens: string[], skinTokens: string, authToken = '') => {
    const { key, data } = authToken ? await verifyTokenAuth(authToken) : await verifyChainAuth(authTokens)
    if (!publicKeysEqual(key, client.connection.peerPublicKey)) {
      throw new Error('Login public key does not match WebRTC peer identity')
    }
    const skinData = await verifySkin(key, skinTokens)
    return { key, userData: data, skinData }
  }

  client.encodeLoginJWT = (localChain: string, mojangChain: string[]) => {
    const chains = []
    chains.push(localChain)
    for (const chain of mojangChain) {
      chains.push(chain)
    }
    return chains
  }
}

function getX5U(token: string) {
  const hjson = getJwtHeader(token)
  return typeof hjson.x5u === 'string' ? hjson.x5u : ''
}
