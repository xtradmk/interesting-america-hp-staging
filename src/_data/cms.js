const path = require('path')
const { pathToFileURL } = require('url')

function cmsModuleUrl(relativePath) {
  return pathToFileURL(path.join(__dirname, '..', '..', 'cms', relativePath)).href
}

async function importCmsModule(relativePath) {
  return import(cmsModuleUrl(relativePath))
}

function resolveMediaPath(media) {
  if (!media) return ''
  if (media.frontendPath) return media.frontendPath
  if (media.url) return media.url
  if (media.filename) return `/images/uploads/cms/${media.filename}`
  return ''
}

async function loadFromLocalPayload(options) {
  const [{ getPayloadClient }, { preparePage }] = await Promise.all([
    importCmsModule('src/lib/payloadClient.mjs'),
    importCmsModule('src/shared/siteRenderer.mjs'),
  ])

  const payload = await getPayloadClient()
  const [pagesResult, header, footer, seoSettings, companyInfo, socialLinks] = await Promise.all([
    payload.find({
      collection: 'pages',
      depth: 2,
      limit: 100,
      overrideAccess: false,
      pagination: false,
      sort: 'title',
    }),
    payload.findGlobal({ slug: 'header', depth: 2, overrideAccess: false }),
    payload.findGlobal({ slug: 'footer', depth: 2, overrideAccess: false }),
    payload.findGlobal({ slug: 'seo-settings', depth: 2, overrideAccess: false }),
    payload.findGlobal({ slug: 'company-info', depth: 2, overrideAccess: false }),
    payload.findGlobal({ slug: 'social-links', depth: 2, overrideAccess: false }),
  ])

  if (!pagesResult?.docs?.length) {
    throw new Error('No published CMS pages found in local Payload storage.')
  }

  const pages = await Promise.all(
    pagesResult.docs.map((page) => preparePage(page, { ...options, companyInfo })),
  )

  return {
    source: 'payload-local',
    globals: { header, footer, seoSettings, companyInfo, socialLinks },
    pages,
  }
}

async function loadFromSeed(options) {
  const [{ getSeedBlueprint, materializeSeedContent, createFrontendMediaResolver }, { preparePage }] = await Promise.all([
    importCmsModule('src/lib/seedContent.mjs'),
    importCmsModule('src/shared/siteRenderer.mjs'),
  ])

  const blueprint = await getSeedBlueprint()
  const seedContent = materializeSeedContent(blueprint, createFrontendMediaResolver(blueprint.mediaLibrary))
  const pages = await Promise.all(
    seedContent.pages.map((page) => preparePage(page, { ...options, companyInfo: seedContent.globals.companyInfo })),
  )

  return {
    source: 'seed-fallback',
    globals: seedContent.globals,
    pages,
  }
}

module.exports = async function() {
  const [{ resolvePathPrefix }, { integrations }, { CORE_PAGE_SLUGS }] = await Promise.all([
    importCmsModule('src/lib/pathPrefix.mjs'),
    importCmsModule('src/lib/integrations.mjs'),
    importCmsModule('src/lib/seedContent.mjs'),
  ])

  const prefix = resolvePathPrefix()
  const options = {
    prefix,
    mode: 'frontend',
    integrations,
  }

  let data

  // CI builds do not have a writable local Payload SQLite database.
  if (process.env.CI === 'true') {
    data = await loadFromSeed(options)
  } else {
    try {
      data = await loadFromLocalPayload(options)
    } catch (error) {
      data = await loadFromSeed(options)
    }
  }

  const companyInfo = data.globals.companyInfo || {}
  const preparedPages = await Promise.all(
    data.pages.map(async (page) => ({
      ...page,
      ogImagePath: resolveMediaPath(page.ogImage),
      permalinkPath: page.slug === 'home' ? '/' : `/${page.slug}/`,
    })),
  )

  const pagesBySlug = Object.fromEntries(preparedPages.map((page) => [page.slug, page]))
  const generatedPages = preparedPages.filter((page) => !CORE_PAGE_SLUGS.has(page.slug))

  return {
    source: data.source,
    prefix,
    header: {
      ...data.globals.header,
      logoPath: resolveMediaPath(data.globals.header?.logo),
    },
    footer: {
      ...data.globals.footer,
      logoPath: resolveMediaPath(data.globals.header?.logo),
      copyrightLineRendered: String(data.globals.footer?.copyrightLine || '').replace('{year}', String(new Date().getFullYear())),
    },
    seoSettings: {
      ...data.globals.seoSettings,
      defaultOgImagePath: resolveMediaPath(data.globals.seoSettings?.defaultOgImage),
    },
    companyInfo,
    socialLinks: data.globals.socialLinks || { items: [] },
    integrations,
    pages: preparedPages,
    pagesBySlug,
    generatedPages,
  }
}
