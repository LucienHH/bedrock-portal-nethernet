import fs from 'fs'
import UUID from 'uuid-1345'

export function getFiles(dir: string) {
  let results: string[] = []
  const list = fs.readdirSync(dir)
  list.forEach((file) => {
    file = dir + '/' + file
    const stat = fs.statSync(file)
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file))
    }
    else {
      results.push(file)
    }
  })
  return results
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function waitFor(cb: (resolve: (value?: any) => void, reject: (reason?: any) => void) => void, withTimeout: number, onTimeout: () => Promise<void>) {
  let t
  const ret = await Promise.race([
    new Promise((resolve, reject) => cb(resolve, reject)),
    new Promise(resolve => { t = setTimeout(() => resolve('timeout'), withTimeout) }),
  ])
  clearTimeout(t)
  if (ret === 'timeout') await onTimeout()
  return ret
}

export function serialize(obj = {}, fmt?: string | number) {
  return JSON.stringify(obj, (k, v) => typeof v === 'bigint' ? v.toString() : v, fmt)
}

export function uuidFrom(string: string) {
  return UUID.v3({ namespace: '6ba7b811-9dad-11d1-80b4-00c04fd430c8', name: string })
}

export function nextUUID() {
  return uuidFrom(Date.now().toString())
}

export const isDebug = process.env.DEBUG?.includes('bedrock-portal')
