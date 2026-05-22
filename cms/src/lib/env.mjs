import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const cmsRoot = path.resolve(dirname, '../..')
const envPath = path.join(cmsRoot, '.env')

dotenv.config({ path: envPath })

export const CMS_ROOT = cmsRoot
export const PROJECT_ROOT = path.resolve(cmsRoot, '..')
export const FRONTEND_SRC_ROOT = path.join(PROJECT_ROOT, 'src')
export const FRONTEND_IMAGE_ROOT = path.join(FRONTEND_SRC_ROOT, 'images', 'uploads', 'cms')
export const CMS_DATA_ROOT = path.join(CMS_ROOT, 'data')
export const DEFAULT_DATABASE_URL = `file:${path.join(CMS_DATA_ROOT, 'website.sqlite')}`
export const DEFAULT_PAYLOAD_SECRET = 'staging-local-only-change-me'
export const DEFAULT_CMS_PUBLIC_SERVER_URL = 'http://127.0.0.1:3000'
export const DEFAULT_FRONTEND_URL = 'http://127.0.0.1:8080'

export function getEnv(name, fallback) {
  const value = process.env[name]
  return value || fallback
}

export function resolveDatabaseUrl(value = DEFAULT_DATABASE_URL) {
  if (!value.startsWith('file:')) {
    return value
  }

  const filePath = value.slice(5)
  if (!filePath) {
    return DEFAULT_DATABASE_URL
  }

  if (path.isAbsolute(filePath)) {
    return `file:${filePath}`
  }

  return `file:${path.resolve(CMS_ROOT, filePath)}`
}

export function requireEnv(name) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}
