import fs from 'fs/promises'
import path from 'path'

import { notFound } from 'next/navigation'

import { DEFAULT_CMS_PUBLIC_SERVER_URL, DEFAULT_PAYLOAD_SECRET, PROJECT_ROOT } from '../../../lib/env.mjs'
import { integrations } from '../../../lib/integrations.mjs'
import { getPayloadClient } from '../../../lib/payloadClient.mjs'
import { preparePage } from '../../../shared/siteRenderer.mjs'

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function resolveMediaUrl(media, cmsBaseUrl) {
  if (!media) return ''
  if (media.url) {
    return media.url.startsWith('http') ? media.url : `${cmsBaseUrl}${media.url}`
  }
  if (media.frontendPath) return media.frontendPath
  return ''
}

function renderPreviewHeader(header, cmsBaseUrl) {
  const navItems = (header?.navItems || []).map((item) => (
    `<li class="nav-item"><a href="${escapeHtml(item.url || '#')}" class="nav-link">${escapeHtml(item.label || '')}</a></li>`
  )).join('')
  const logoUrl = resolveMediaUrl(header?.logo, cmsBaseUrl)

  return `<header class="site-header">
    <div class="container">
      <a href="/" class="logo" aria-label="${escapeHtml(header?.brandAriaLabel || 'Back to Home')}">
        ${logoUrl ? `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(header?.brandName || 'Interesting America')}" class="logo__img">` : escapeHtml(header?.brandName || 'INTERESTING AMERICA')}
      </a>
      <nav class="site-nav" aria-label="Main navigation">
        <ul class="nav-list nav-island">${navItems}</ul>
      </nav>
    </div>
  </header>`
}

function renderPreviewFooter(header, footer, cmsBaseUrl) {
  const logoUrl = resolveMediaUrl(header?.logo, cmsBaseUrl)
  const navItems = (footer?.navItems || []).map((item) => (
    `<li><a href="${escapeHtml(item.url || '#')}">${escapeHtml(item.label || '')}</a></li>`
  )).join('')
  const copyrightLine = String(footer?.copyrightLine || '').replace('{year}', String(new Date().getFullYear()))

  return `<footer class="site-footer">
    <div class="container footer-shell">
      <div class="footer-content">
        <div class="footer-signup-row">
          <p class="footer-copy">${escapeHtml(footer?.newsletterPrompt || '')}</p>
          <form class="footer-newsletter" method="POST" action="${escapeHtml(integrations.newsletterFormEndpoint)}" aria-label="Newsletter subscription form">
            <input type="hidden" name="success_path" value="/thank-you/">
            <p class="form-honeypot" aria-hidden="true"><label>Do not fill this out: <input name="company_website"></label></p>
            <label class="footer-newsletter__field" for="preview-newsletter-email">
              <span class="sr-only">Email address</span>
              <input id="preview-newsletter-email" type="email" name="email" autocomplete="email" placeholder="${escapeHtml(footer?.newsletterPlaceholder || 'Email address')}" required>
            </label>
            <button class="footer-newsletter__button" type="submit">${escapeHtml(footer?.newsletterButtonLabel || 'Subscribe')}</button>
          </form>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-bottom__main">
          <div class="footer-brand">
            ${logoUrl ? `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(header?.brandName || 'Interesting America')}" class="footer-logo__img">` : ''}
          </div>
          <nav class="footer-nav" aria-label="Footer navigation">
            <ul>${navItems}</ul>
          </nav>
        </div>
        <div class="footer-legal"><p>${escapeHtml(copyrightLine)}</p></div>
      </div>
    </div>
  </footer>`
}

async function loadPreviewPage(slug) {
  const payload = await getPayloadClient()
  const pageResult = await payload.find({
    collection: 'pages',
    limit: 1,
    depth: 2,
    draft: true,
    overrideAccess: true,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return pageResult.docs[0] || null
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const page = await loadPreviewPage(resolvedParams.slug)

  if (!page) {
    return {
      title: 'Draft Preview',
    }
  }

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || 'Draft preview',
  }
}

export default async function PreviewPage({ params, searchParams }) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const expectedSecret = process.env.PAYLOAD_PREVIEW_SECRET || process.env.PAYLOAD_SECRET || DEFAULT_PAYLOAD_SECRET
  if (resolvedSearchParams?.secret !== expectedSecret) {
    notFound()
  }

  const payload = await getPayloadClient()
  const page = await loadPreviewPage(resolvedParams.slug)
  if (!page) {
    notFound()
  }

  const [header, footer, seoSettings, companyInfo] = await Promise.all([
    payload.findGlobal({ slug: 'header', depth: 2, draft: true, overrideAccess: true }),
    payload.findGlobal({ slug: 'footer', depth: 2, draft: true, overrideAccess: true }),
    payload.findGlobal({ slug: 'seo-settings', depth: 2, draft: true, overrideAccess: true }),
    payload.findGlobal({ slug: 'company-info', depth: 2, draft: true, overrideAccess: true }),
  ])

  const preparedPage = await preparePage(page, {
    prefix: '/',
    mode: 'cms-preview',
    cmsBaseUrl: process.env.CMS_PUBLIC_SERVER_URL || DEFAULT_CMS_PUBLIC_SERVER_URL,
    integrations,
    companyInfo,
  })

  const [frontendCss, frontendJs] = await Promise.all([
    fs.readFile(path.join(PROJECT_ROOT, 'src', 'css', 'main.css'), 'utf8'),
    fs.readFile(path.join(PROJECT_ROOT, 'src', 'js', 'main.js'), 'utf8'),
  ])

  let contactLegalOverlays = ''
  if (page.slug === 'contact') {
    const [termsHtml, privacyHtml] = await Promise.all([
      fs.readFile(path.join(PROJECT_ROOT, 'src', '_includes', 'modules', 'legal-terms-flow.njk'), 'utf8'),
      fs.readFile(path.join(PROJECT_ROOT, 'src', '_includes', 'modules', 'legal-privacy-flow.njk'), 'utf8'),
    ])

    contactLegalOverlays = `<div class="legal-overlay" data-legal-overlay="terms" hidden>
      <div class="legal-overlay__backdrop" data-close-legal></div>
      <div class="legal-overlay__dialog" role="dialog" aria-modal="true" aria-labelledby="preview-legal-overlay-title-terms">
        <div class="legal-overlay__header">
          <h2 id="preview-legal-overlay-title-terms">Terms &amp; Conditions</h2>
          <button type="button" class="legal-overlay__close" data-close-legal aria-label="Close Terms and Conditions overlay">Close</button>
        </div>
        <div class="legal-overlay__body">${termsHtml}</div>
      </div>
    </div>
    <div class="legal-overlay" data-legal-overlay="privacy" hidden>
      <div class="legal-overlay__backdrop" data-close-legal></div>
      <div class="legal-overlay__dialog" role="dialog" aria-modal="true" aria-labelledby="preview-legal-overlay-title-privacy">
        <div class="legal-overlay__header">
          <h2 id="preview-legal-overlay-title-privacy">Privacy Policy</h2>
          <button type="button" class="legal-overlay__close" data-close-legal aria-label="Close Privacy Policy overlay">Close</button>
        </div>
        <div class="legal-overlay__body">${privacyHtml}</div>
      </div>
    </div>`
  }

  const bodyClassName = preparedPage.pageClasses || ''
  const cmsBaseUrl = process.env.CMS_PUBLIC_SERVER_URL || DEFAULT_CMS_PUBLIC_SERVER_URL

  return (
    <div className={bodyClassName}>
      <style dangerouslySetInnerHTML={{ __html: frontendCss }} />
      <div className="cms-preview-banner">
        <div className="cms-preview-banner__inner">
          <strong>Draft Preview</strong>
          <span>{preparedPage.title}</span>
        </div>
      </div>
      <div dangerouslySetInnerHTML={{ __html: renderPreviewHeader(header, cmsBaseUrl) }} />
      <main id="main" dangerouslySetInnerHTML={{ __html: `${preparedPage.renderedHtml}${contactLegalOverlays}` }} />
      {!preparedPage.hideFooter && <div dangerouslySetInnerHTML={{ __html: renderPreviewFooter(header, footer, cmsBaseUrl) }} />}
      <script dangerouslySetInnerHTML={{ __html: frontendJs }} />
    </div>
  )
}
