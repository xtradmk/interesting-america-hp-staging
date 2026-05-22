import fs from 'fs/promises'
import path from 'path'

import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'

import config from '../payload.config.mjs'
import { CMS_DATA_ROOT, FRONTEND_SRC_ROOT } from './env.mjs'
import { getPayloadClient } from './payloadClient.mjs'
import { getSeedBlueprint, materializeSeedContent } from './seedContent.mjs'

function createPayloadMediaResolver(mediaDocsByKey) {
  return Object.fromEntries(
    Object.entries(mediaDocsByKey).map(([key, mediaDoc]) => [key, mediaDoc.id]),
  )
}

async function ensureMediaDoc(payload, media) {
  const sourcePath = path.join(FRONTEND_SRC_ROOT, media.sourceRelativePath)
  const existing = await payload.find({
    collection: 'media',
    limit: 1,
    overrideAccess: true,
    where: {
      seedKey: {
        equals: media.seedKey,
      },
    },
  })

  const data = {
    alt: media.alt,
    seedKey: media.seedKey,
  }

  if (existing.docs[0]) {
    return payload.update({
      collection: 'media',
      id: existing.docs[0].id,
      data,
      filePath: sourcePath,
      overrideAccess: true,
    })
  }

  return payload.create({
    collection: 'media',
    data,
    filePath: sourcePath,
    overrideAccess: true,
  })
}

async function createMediaMap(payload, blueprint) {
  const mediaDocsByKey = {}

  for (const media of Object.values(blueprint.mediaLibrary)) {
    mediaDocsByKey[media.seedKey] = await ensureMediaDoc(payload, media)
  }

  return mediaDocsByKey
}

async function convertHTMLValueToLexical(html, editorConfig) {
  return convertHTMLToLexical({
    editorConfig,
    html,
    JSDOM,
  })
}

async function transformPageBlocksForPayload(pageBlocks, editorConfig) {
  const output = []

  for (const block of pageBlocks || []) {
    const nextBlock = { ...block }

    if (block.blockType === 'richTextSection' && block.contentHtml) {
      nextBlock.content = await convertHTMLValueToLexical(block.contentHtml, editorConfig)
      delete nextBlock.contentHtml
    }

    if (block.blockType === 'splitSection' && block.contentHtml) {
      nextBlock.content = await convertHTMLValueToLexical(block.contentHtml, editorConfig)
      delete nextBlock.contentHtml
    }

    if (block.blockType === 'faq' && Array.isArray(block.items)) {
      nextBlock.items = await Promise.all(
        block.items.map(async (item) => {
          const nextItem = { ...item }
          if (item.answerHtml) {
            nextItem.answer = await convertHTMLValueToLexical(item.answerHtml, editorConfig)
            delete nextItem.answerHtml
          }
          return nextItem
        }),
      )
    }

    output.push(nextBlock)
  }

  return output
}

async function upsertPage(payload, page, editorConfig) {
  const existing = await payload.find({
    collection: 'pages',
    limit: 1,
    overrideAccess: true,
    where: {
      slug: {
        equals: page.slug,
      },
    },
  })

  const data = {
    title: page.title,
    slug: page.slug,
    pageClasses: page.pageClasses,
    hideFooter: Boolean(page.hideFooter),
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    ogImage: page.ogImage || null,
    pageBlocks: await transformPageBlocksForPayload(page.pageBlocks, editorConfig),
    _status: 'published',
  }

  if (existing.docs[0]) {
    return payload.update({
      collection: 'pages',
      id: existing.docs[0].id,
      data,
      draft: false,
      overrideAccess: true,
    })
  }

  return payload.create({
    collection: 'pages',
    data,
    draft: false,
    overrideAccess: true,
  })
}

async function upsertGlobal(payload, slug, data) {
  return payload.updateGlobal({
    slug,
    data: {
      ...data,
      _status: 'published',
    },
    draft: false,
    overrideAccess: true,
  })
}

export async function upsertAdminUser(payload) {
  const email = process.env.PAYLOAD_ADMIN_EMAIL
  const password = process.env.PAYLOAD_ADMIN_PASSWORD

  if (!email || !password) {
    return null
  }

  const name = process.env.PAYLOAD_ADMIN_NAME || 'Interesting America Admin'
  const existing = await payload.find({
    collection: 'users',
    limit: 1,
    overrideAccess: true,
    where: {
      email: {
        equals: email,
      },
    },
  })

  const data = {
    email,
    password,
    name,
    role: 'admin',
  }

  if (existing.docs[0]) {
    return payload.update({
      collection: 'users',
      id: existing.docs[0].id,
      data,
      overrideAccess: true,
    })
  }

  return payload.create({
    collection: 'users',
    data,
    overrideAccess: true,
  })
}

export async function seedPayloadContent() {
  await fs.mkdir(CMS_DATA_ROOT, { recursive: true })

  const payload = await getPayloadClient()
  const blueprint = await getSeedBlueprint()
  const mediaDocsByKey = await createMediaMap(payload, blueprint)
  const payloadSeed = materializeSeedContent(blueprint, createPayloadMediaResolver(mediaDocsByKey))
  const editorConfig = await editorConfigFactory.default({ config })

  await upsertGlobal(payload, 'header', payloadSeed.globals.header)
  await upsertGlobal(payload, 'footer', payloadSeed.globals.footer)
  await upsertGlobal(payload, 'seo-settings', payloadSeed.globals.seoSettings)
  await upsertGlobal(payload, 'company-info', payloadSeed.globals.companyInfo)
  await upsertGlobal(payload, 'social-links', payloadSeed.globals.socialLinks)

  for (const page of payloadSeed.pages) {
    await upsertPage(payload, page, editorConfig)
  }

  const adminUser = await upsertAdminUser(payload)

  return {
    pageCount: payloadSeed.pages.length,
    mediaCount: Object.keys(mediaDocsByKey).length,
    adminEmail: adminUser?.email || null,
  }
}
