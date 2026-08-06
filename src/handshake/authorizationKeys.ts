import { createRemoteJWKSet } from 'jose'

const debug = require('debug')('bedrock-portal-nethernet')

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

type AuthorizationVerifier = {
  issuer: string
  keys: ReturnType<typeof createRemoteJWKSet>
}

const authorizationVerifiers = new Map<number, Promise<AuthorizationVerifier>>()

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

async function createAuthorizationVerifier(protocolVersion: number): Promise<AuthorizationVerifier> {
  const { issuer, jwksUrl } = await resolveAuthorizationUrls(protocolVersion)

  return {
    issuer,
    keys: createRemoteJWKSet(jwksUrl, {
      cacheMaxAge: 30 * 60 * 1000,
      timeoutDuration: AUTHORISATION_FETCH_TIMEOUT_MS,
    }),
  }
}

export function getAuthorizationVerifier(protocolVersion: number) {
  let verifier = authorizationVerifiers.get(protocolVersion)
  if (!verifier) {
    verifier = createAuthorizationVerifier(protocolVersion)
    authorizationVerifiers.set(protocolVersion, verifier)
    void verifier.catch(() => authorizationVerifiers.delete(protocolVersion))
  }
  return verifier
}
