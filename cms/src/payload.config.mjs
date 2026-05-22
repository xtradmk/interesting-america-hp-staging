import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'

import { Media } from './collections/Media.mjs'
import { Pages } from './collections/Pages.mjs'
import { Users } from './collections/Users.mjs'
import { CompanyInfo } from './globals/CompanyInfo.mjs'
import { Footer } from './globals/Footer.mjs'
import { Header } from './globals/Header.mjs'
import { SEOSettings } from './globals/SEOSettings.mjs'
import { SocialLinks } from './globals/SocialLinks.mjs'
import {
  DEFAULT_CMS_PUBLIC_SERVER_URL,
  DEFAULT_DATABASE_URL,
  DEFAULT_FRONTEND_URL,
  DEFAULT_PAYLOAD_SECRET,
  getEnv,
  resolveDatabaseUrl,
} from './lib/env.mjs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = getEnv('CMS_PUBLIC_SERVER_URL', DEFAULT_CMS_PUBLIC_SERVER_URL)
const frontendURL = getEnv('NEXT_PUBLIC_FRONTEND_URL', DEFAULT_FRONTEND_URL)

export default buildConfig({
  serverURL,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, 'app', '(payload)'),
      importMapFile: path.resolve(dirname, 'app', '(payload)', 'admin', 'importMap.js'),
    },
    meta: {
      titleSuffix: ' | IA CMS',
    },
  },
  collections: [Users, Media, Pages],
  globals: [Header, Footer, SEOSettings, CompanyInfo, SocialLinks],
  editor: lexicalEditor(),
  secret: getEnv('PAYLOAD_SECRET', DEFAULT_PAYLOAD_SECRET),
  db: sqliteAdapter({
    client: {
      url: resolveDatabaseUrl(getEnv('DATABASE_URL', DEFAULT_DATABASE_URL)),
    },
  }),
  sharp,
  cors: [serverURL, frontendURL],
  csrf: [serverURL, frontendURL],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
