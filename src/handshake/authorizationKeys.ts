import crypto from 'crypto'

const debug = require('debug')('bedrock-portal-nethernet')

const AUTHORISATION_KEY_REFRESH_INTERVAL_MS = 30 * 60 * 1000
const AUTHORISATION_FETCH_TIMEOUT_MS = 10_000
const AUTHORISATION_SERVICE_URI_FALLBACK = 'https://authorization.franchise.minecraft-services.net'
const AUTHORISATION_SERVICE_OPENID_CONFIGURATION_PATH = '/.well-known/openid-configuration'
const AUTHORISATION_SERVICE_KEYS_PATH = '/.well-known/keys'
const MINECRAFT_SERVICES_DISCOVERY_URL = 'https://client.discovery.minecraft-services.net/api/v1.0/discovery/MinecraftPE/builds/'

type OpenIdConfiguration = {
  issuer?: string
  jwks_uri?: string
}

type DiscoveryResponse = {
  result?: {
    serviceEnvironments?: {
      auth?: {
        prod?: {
          issuer?: string
          serviceUri?: string
        }
      }
    }
  }
}

type AuthorizationJwk = crypto.JsonWebKey & {
  kid?: string
}

type AuthorizationJwkSet = {
  keys?: AuthorizationJwk[]
}

type AuthorizationKeyring = {
  fetchedAt: number
  issuer: string
  keys: Map<string, crypto.KeyObject>
  protocolVersion: number
}

let cachedAuthorizationKeyring: AuthorizationKeyring | null = null
let inflightAuthorizationKeyring: Promise<AuthorizationKeyring> | null = null

async function fetchJson<T>(url: URL): Promise<T> {
  let response: Response

  try {
    response = await fetch(url, { signal: AbortSignal.timeout(AUTHORISATION_FETCH_TIMEOUT_MS) })
  }
  catch (error) {
    throw new Error(`Failed accessing ${url}: ${error instanceof Error ? error.message : String(error)}`)
  }

  if (!response.ok) {
    throw new Error(`Unexpected HTTP response code accessing ${url}: ${response.status}`)
  }

  return response.json() as Promise<T>
}

async function resolveAuthorizationUrls(protocolVersion: number) {
  let authServiceUrl = new URL(AUTHORISATION_SERVICE_URI_FALLBACK)
  let issuer = authServiceUrl.toString()

  try {
    const discovery = await fetchJson<DiscoveryResponse>(new URL(String(protocolVersion), MINECRAFT_SERVICES_DISCOVERY_URL))
    const authService = discovery.result?.serviceEnvironments?.auth?.prod

    if (!authService?.serviceUri) {
      throw new Error('Discovery response missing auth service URI')
    }

    authServiceUrl = new URL(authService.serviceUri)
    issuer = authService.issuer ? new URL(authService.issuer).toString() : authServiceUrl.toString()
  }
  catch (error) {
    debug('Failed to resolve auth service info, using fallback', error)
  }

  let jwksUrl = new URL(AUTHORISATION_SERVICE_KEYS_PATH, authServiceUrl)

  try {
    const openIdConfiguration = await fetchJson<OpenIdConfiguration>(new URL(AUTHORISATION_SERVICE_OPENID_CONFIGURATION_PATH, authServiceUrl))
    issuer = openIdConfiguration.issuer ? new URL(openIdConfiguration.issuer).toString() : issuer
    jwksUrl = openIdConfiguration.jwks_uri ? new URL(openIdConfiguration.jwks_uri) : jwksUrl
  }
  catch (error) {
    debug('Failed to resolve OpenID configuration, using default JWKS endpoint', error)
  }

  return { issuer, jwksUrl }
}

async function fetchAuthorizationKeyring(protocolVersion: number): Promise<AuthorizationKeyring> {
  const { issuer, jwksUrl } = await resolveAuthorizationUrls(protocolVersion)
  const payload = await fetchJson<AuthorizationJwkSet>(jwksUrl)
  const keys = new Map<string, crypto.KeyObject>()

  for (const jwk of payload.keys || []) {
    if (!jwk.kid) continue
    keys.set(jwk.kid, crypto.createPublicKey({ key: jwk, format: 'jwk' }))
  }

  if (keys.size === 0) {
    throw new Error('No valid authentication keys returned by Microsoft')
  }

  return {
    fetchedAt: Date.now(),
    issuer,
    keys,
    protocolVersion,
  }
}

function isAuthorizationKeyringFresh(protocolVersion: number) {
  return cachedAuthorizationKeyring !== null &&
    cachedAuthorizationKeyring.protocolVersion === protocolVersion &&
    Date.now() - cachedAuthorizationKeyring.fetchedAt < AUTHORISATION_KEY_REFRESH_INTERVAL_MS
}

async function refreshAuthorizationKeyring(protocolVersion: number) {
  inflightAuthorizationKeyring ??= fetchAuthorizationKeyring(protocolVersion)

  try {
    const keyring = await inflightAuthorizationKeyring
    cachedAuthorizationKeyring = keyring
    return keyring
  }
  finally {
    inflightAuthorizationKeyring = null
  }
}

export async function getAuthorizationKey(protocolVersion: number, keyId: string) {
  let keyring = isAuthorizationKeyringFresh(protocolVersion)
    ? cachedAuthorizationKeyring
    : await refreshAuthorizationKeyring(protocolVersion)

  if (!keyring || !keyring.keys.has(keyId)) {
    keyring = await refreshAuthorizationKeyring(protocolVersion)
  }

  const key = keyring.keys.get(keyId)
  if (!key) {
    throw new Error(`Unrecognized authentication key ID: ${keyId}`)
  }

  return {
    issuer: keyring.issuer,
    key,
  }
}