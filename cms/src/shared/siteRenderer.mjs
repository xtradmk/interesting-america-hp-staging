import { lexicalToHTML } from '../lib/richText.mjs'
import { prefixPath } from '../lib/pathPrefix.mjs'

const DEFAULT_CMS_BASE_URL = process.env.CMS_PUBLIC_SERVER_URL || 'http://127.0.0.1:3000'

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function withLineBreaks(value = '') {
  return escapeHtml(value).replace(/\n/g, '<br>')
}

function renderLinkAttrs(link = {}, { prefix = '/', targetMode = 'frontend' } = {}) {
  const href = resolveHref(link.url, { prefix, targetMode })
  const target = link.openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : ''

  return `href="${escapeHtml(href)}"${target}`
}

function resolveHref(url = '/', { prefix = '/', targetMode = 'frontend' } = {}) {
  if (!url) return prefix === '/' ? '/' : prefix
  if (/^(https?:)?\/\//.test(url) || url.startsWith('mailto:') || url.startsWith('tel:')) {
    return url
  }

  if (targetMode === 'cms-preview') {
    return url
  }

  return prefixPath(url, prefix)
}

function mediaUrl(media, { prefix = '/', mode = 'frontend', cmsBaseUrl = DEFAULT_CMS_BASE_URL } = {}) {
  if (!media) return ''
  if (mode === 'cms-preview' && media.url) {
    return media.url.startsWith('http') ? media.url : `${cmsBaseUrl}${media.url}`
  }

  if (media.frontendPath) {
    return prefixPath(media.frontendPath, prefix)
  }

  if (media.filename) {
    return prefixPath(`/images/uploads/cms/${media.filename}`, prefix)
  }

  if (media.url) {
    return media.url.startsWith('http') ? media.url : `${cmsBaseUrl}${media.url}`
  }

  return ''
}

function renderCTA(link, { prefix = '/', targetMode = 'frontend', className = 'hero-link-cta hero-link-cta--static is-visible' } = {}) {
  if (!link?.label || !link?.url) return ''

  return `<a class="${className}" ${renderLinkAttrs(link, { prefix, targetMode })}>
    <span class="hero-link-cta__text">${escapeHtml(link.label)}</span>
    <span class="hero-link-cta__icon" aria-hidden="true">
      <svg viewBox="0 0 19 19" role="presentation" focusable="false">
        <path d="M14.458 10.687 L0 10.688 L0 8.313 L14.458 8.313 L7.808 1.663 L9.5 0 L19 9.5 L9.5 19 L7.808 17.337 Z" fill="currentColor"></path>
      </svg>
    </span>
  </a>`
}

function renderSecondaryLink(link, { prefix = '/', targetMode = 'frontend' } = {}) {
  if (!link?.label || !link?.url) return ''

  return `<a class="hero-home-secondary-link" ${renderLinkAttrs(link, { prefix, targetMode })}>${escapeHtml(link.label)}</a>`
}

function renderBlockWrapper(content, { extraClass = '' } = {}) {
  return `<section class="story-section cms-block ${extraClass}">${content}</section>`
}

function renderProcessIcon(tone = 'blue') {
  if (tone === 'red') {
    return `<svg viewBox="0 0 32 32" role="presentation" focusable="false">
      <rect x="6" y="8" width="8" height="18" fill="none" stroke="currentColor" stroke-width="1.8"/>
      <rect x="14" y="5" width="12" height="21" fill="none" stroke="currentColor" stroke-width="1.8"/>
      <path d="M9.5 12.5H10.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M9.5 17H10.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M18 10.5H22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M18 15H22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M18 19.5H22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <rect x="5.5" y="21.5" width="5" height="5" fill="#FF3B30"/>
    </svg>`
  }

  if (tone === 'dark') {
    return `<svg viewBox="0 0 32 32" role="presentation" focusable="false">
      <rect x="5" y="7" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1.8"/>
      <rect x="21" y="19" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1.8"/>
      <path d="M11 10H17C20.314 10 23 12.686 23 16V19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M18.5 15.5L23 20L27.5 15.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="13.5" y="5.5" width="5" height="5" fill="#0B1020"/>
    </svg>`
  }

  return `<svg viewBox="0 0 32 32" role="presentation" focusable="false">
    <rect x="6" y="5" width="20" height="22" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <rect x="11" y="3" width="10" height="5" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M11 13.5H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M11 18H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <rect x="21.5" y="21.5" width="5" height="5" fill="#0E74C8"/>
  </svg>`
}

function renderHero(block, options) {
  const slides = block.slides || []
  if (!slides.length) return ''

  const heroOpacity = Number(block.dimmingPercent || 100) / 100

  if (block.variant === 'home') {
    const primarySlide = slides[0]
    const secondarySlide = slides[1] || primarySlide
    const slideDataAttrs = slides
      .map((slide, index) => `data-image${index + 1}="${escapeHtml(mediaUrl(slide.image, options))}" data-caption${index + 1}="${escapeHtml(slide.caption || '')}"`)
      .join('\n  ')

    const layeredSlides = slides.slice(0, 8).map((slide, index) => (
      `<div class="hero-bg hero-bg--css hero-bg--${index + 1}" style="background-image:url('${escapeHtml(mediaUrl(slide.image, options))}')"></div>`
    )).join('\n    ')

    const secondaryLinks = [block.secondaryLink].filter(Boolean).map((link) => renderSecondaryLink(link, options)).join('')
    const subcopyItems = (block.subcopyItems || []).map((item) => `<span>${escapeHtml(item.text)}</span>`).join('')

    return `<section class="hero section hero--photo" id="home"
  style="--hero-overlay-opacity: ${heroOpacity}"
  ${slideDataAttrs}>
  <div class="hero-bg-track" aria-hidden="true">
    <div class="hero-bg hero-bg--active" style="background-image:url('${escapeHtml(mediaUrl(primarySlide.image, options))}')"></div>
    <div class="hero-bg hero-bg--next" style="background-image:url('${escapeHtml(mediaUrl(secondarySlide.image, options))}')"></div>
    ${layeredSlides}
    <div class="hero-bg-overlay"></div>
  </div>

  <div class="wrap-wide fade in">
    <div class="hero-copy-block hero-copy-block--home">
      <h1 class="typewriter" data-text="${escapeHtml(block.typewriterText || block.title || '')}">${withLineBreaks(block.title || '')}</h1>
      ${subcopyItems ? `<p class="hero-home-subcopy">${subcopyItems}</p>` : ''}
      ${renderCTA(block.primaryLink, { ...options, className: 'hero-link-cta hero-link-cta--home' })}
      ${secondaryLinks ? `<div class="hero-home-secondary-links">${secondaryLinks}</div>` : ''}
    </div>
  </div>

  <p class="hero-photo-caption" id="hero-photo-caption">${escapeHtml(primarySlide.caption || '')}</p>

  ${slides.length > 1 ? `<div class="hero-slider-ui" aria-label="Header image controls">
    <button class="hero-slider-btn" type="button" data-hero-prev aria-label="Previous image">‹</button>
    <button class="hero-slider-btn" type="button" data-hero-next aria-label="Next image">›</button>
  </div>` : ''}
</section>`
  }

  const dataAttrs = slides.map((slide, index) => {
    const bits = [`data-image${index + 1}="${escapeHtml(mediaUrl(slide.image, options))}"`]
    if (slide.caption) bits.push(`data-caption${index + 1}="${escapeHtml(slide.caption)}"`)
    return bits.join(' ')
  }).join('\n  ')

  const layeredSlides = slides.map((slide, index) => (
    `<div class="hero-bg hero-bg--css hero-bg--${index + 1}" style="background-image:url('${escapeHtml(mediaUrl(slide.image, options))}')"></div>`
  )).join('\n    ')

  return `<section class="hero section hero--photo hero--subpage"
  style="--hero-overlay-opacity: ${heroOpacity}"
  ${dataAttrs}>
  <div class="hero-bg-track" aria-hidden="true">
    <div class="hero-bg hero-bg--active" style="background-image:url('${escapeHtml(mediaUrl(slides[0].image, options))}')"></div>
    <div class="hero-bg hero-bg--next" style="background-image:url('${escapeHtml(mediaUrl((slides[1] || slides[0]).image, options))}')"></div>
    ${layeredSlides}
    <div class="hero-bg-overlay"></div>
  </div>

  <div class="wrap-wide fade in">
    <div class="hero-copy-block hero-copy-block--subpage">
      ${block.kicker ? `<p class="hero-kicker">${escapeHtml(block.kicker)}</p>` : ''}
      <h1 class="hero-page-title">${withLineBreaks(block.title || '')}</h1>
      ${block.copy ? `<p class="hero-page-copy">${escapeHtml(block.copy)}</p>` : ''}
      ${renderCTA(block.primaryLink, options)}
    </div>
  </div>

  ${slides[0]?.caption ? `<p class="hero-photo-caption" id="hero-photo-caption">${escapeHtml(slides[0].caption)}</p>` : ''}

  ${slides.length > 1 ? `<div class="hero-slider-ui" aria-label="Header image controls">
    <button class="hero-slider-btn" type="button" data-hero-prev aria-label="Previous image">‹</button>
    <button class="hero-slider-btn" type="button" data-hero-next aria-label="Next image">›</button>
  </div>` : ''}
</section>`
}

function renderRichTextSection(block) {
  const maxWidthClass = {
    regular: '',
    wide: ' cms-richtext--wide',
    legal: ' cms-richtext--legal',
  }[block.maxWidth || 'regular']
  const alignClass = block.align === 'center' ? ' cms-richtext--center' : ''
  const blockClass = block.maxWidth === 'legal' ? 'legal-text-block fade' : `cms-richtext-block fade${maxWidthClass}${alignClass}`

  return renderBlockWrapper(`<div class="wrap-wide">
    <div class="${blockClass}">
      ${block.eyebrow ? `<p class="eyebrow">${escapeHtml(block.eyebrow)}</p>` : ''}
      ${block.heading ? `<h2 class="cms-richtext-heading">${escapeHtml(block.heading)}</h2>` : ''}
      <div class="cms-richtext-content">${block.contentHtml || ''}</div>
    </div>
  </div>`, {
    extraClass: block.maxWidth === 'legal' ? 'legal-text-section' : 'cms-richtext-section',
  })
}

function renderImage(block, options) {
  const src = mediaUrl(block.image, options)
  if (!src) return ''

  return renderBlockWrapper(`<div class="wrap-wide">
    <figure class="cms-figure cms-figure--${escapeHtml(block.layout || 'contained')}">
      <img src="${escapeHtml(src)}" alt="${escapeHtml(block.image?.alt || '')}" style="object-position:${escapeHtml(block.objectPosition || 'center center')}">
      ${block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : ''}
    </figure>
  </div>`, { extraClass: 'cms-image-section' })
}

function renderGallery(block, options) {
  const items = (block.items || []).map((item, index) => {
    const src = mediaUrl(item.image, options)
    if (!src) return ''

    if (block.style === 'cards') {
      return `<article class="about-page-project-card fade${index === 0 ? ' is-active' : ''}" data-about-project-card tabindex="0">
        <figure class="about-page-project-card__media">
          <img src="${escapeHtml(src)}" alt="${escapeHtml(item.image?.alt || item.title || '')}">
        </figure>
        <div class="about-page-project-card__body">
          <h3 class="about-page-project-card__title">${escapeHtml(item.title || '')}</h3>
          ${item.summary ? `<p class="about-page-project-card__summary">${escapeHtml(item.summary)}</p>` : ''}
          ${item.detail ? `<p class="about-page-project-card__detail">${escapeHtml(item.detail)}</p>` : ''}
          ${item.secondaryDetail ? `<p class="about-page-project-card__detail">${escapeHtml(item.secondaryDetail)}</p>` : ''}
        </div>
      </article>`
    }

    return `<figure class="cms-gallery-card fade">
      <img src="${escapeHtml(src)}" alt="${escapeHtml(item.image?.alt || item.title || '')}">
      <figcaption>
        <strong>${escapeHtml(item.title || '')}</strong>
        ${item.summary ? `<span>${escapeHtml(item.summary)}</span>` : ''}
      </figcaption>
    </figure>`
  }).join('')

  const body = block.style === 'cards'
    ? `<div class="about-page-shell">
        ${block.heading ? `<h2 class="about-page-heading fade" data-letter-reveal>${escapeHtml(block.heading)}</h2>` : ''}
        <div class="about-page-projects">${items}</div>
      </div>`
    : `<div class="cms-gallery-shell">
        ${block.heading ? `<h2 class="cms-gallery-heading">${escapeHtml(block.heading)}</h2>` : ''}
        <div class="cms-gallery-grid">${items}</div>
      </div>`

  return renderBlockWrapper(`<div class="wrap-wide">${body}</div>`, {
    extraClass: block.style === 'cards' ? 'about-page-section about-page-section--projects' : 'cms-gallery-section',
  })
}

function renderCTABlock(block, options) {
  return renderBlockWrapper(`<div class="wrap-wide">
    <div class="cms-cta-band cms-cta-band--${escapeHtml(block.background || 'light')}">
      ${block.heading ? `<h2>${escapeHtml(block.heading)}</h2>` : ''}
      ${block.text ? `<p>${escapeHtml(block.text)}</p>` : ''}
      ${renderCTA(block.primaryLink, options)}
    </div>
  </div>`, { extraClass: 'cms-cta-section' })
}

function renderFAQ(block) {
  const items = (block.items || []).map((item) => `<details class="cms-faq-item">
    <summary>${escapeHtml(item.question || '')}</summary>
    <div class="cms-faq-answer">${item.answerHtml || ''}</div>
  </details>`).join('')

  return renderBlockWrapper(`<div class="wrap-wide">
    <div class="cms-faq-shell">
      ${block.heading ? `<h2 class="cms-faq-heading">${escapeHtml(block.heading)}</h2>` : ''}
      <div class="cms-faq-list">${items}</div>
    </div>
  </div>`, { extraClass: 'cms-faq-section' })
}

function renderLogos(block, options) {
  const items = (block.items || []).map((item) => {
    if (block.displayMode === 'image' && item.logo) {
      const src = mediaUrl(item.logo, options)
      return `<li class="cms-logo-item"><img src="${escapeHtml(src)}" alt="${escapeHtml(item.name || item.logo.alt || '')}"></li>`
    }

    return `<li>${escapeHtml(item.name || '')}</li>`
  }).join('')

  const listClass = block.displayMode === 'image' ? 'cms-logo-grid' : 'about-page-client-grid fade'

  return renderBlockWrapper(`<div class="wrap-wide">
    <div class="about-page-shell">
      ${block.heading ? `<h2 class="about-page-heading fade" data-letter-reveal>${escapeHtml(block.heading)}</h2>` : ''}
      <ul class="${listClass}" aria-label="${escapeHtml(block.heading || 'Logos')}">${items}</ul>
    </div>
  </div>`, {
    extraClass: block.displayMode === 'image' ? 'cms-logos-section' : 'about-page-section about-page-section--clients',
  })
}

function renderStats(block) {
  const items = (block.items || []).map((item) => `<article class="cms-stat-card fade">
    <strong>${escapeHtml(item.value || '')}</strong>
    <span>${escapeHtml(item.label || '')}</span>
    ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ''}
  </article>`).join('')

  return renderBlockWrapper(`<div class="wrap-wide">
    <div class="cms-stats-shell">
      ${block.heading ? `<h2 class="cms-stats-heading">${escapeHtml(block.heading)}</h2>` : ''}
      <div class="cms-stats-grid">${items}</div>
    </div>
  </div>`, { extraClass: 'cms-stats-section' })
}

function renderTestimonials(block) {
  const items = (block.items || []).map((item) => `<figure class="about-page-feedback-card fade">
    <blockquote>${escapeHtml(item.quote || '')}</blockquote>
    <figcaption>
      <span class="about-page-feedback-card__name">${escapeHtml(item.author || '')}</span>
      ${item.role ? `<span class="about-page-feedback-card__type">${escapeHtml(item.role)}</span>` : ''}
    </figcaption>
  </figure>`).join('')

  return renderBlockWrapper(`<div class="wrap-wide">
    <div class="about-page-shell">
      ${block.heading ? `<h2 class="about-page-heading fade" data-letter-reveal>${escapeHtml(block.heading)}</h2>` : ''}
      <div class="about-page-feedback-grid">${items}</div>
    </div>
  </div>`, { extraClass: 'about-page-section about-page-section--feedback' })
}

function renderSplitSection(block, options) {
  const src = mediaUrl(block.image, options)
  if (!src) return ''

  return `<section class="story-section${block.reverse ? ' story-section--reverse' : ''} subpage-home-section cms-split-section">
  <div class="wrap-wide">
    <div class="services-showcase-stack">
      <div class="services-showcase${block.reverse ? ' services-showcase--reverse' : ''}">
        <figure class="services-showcase__media dynamic-media" data-speed="0.18" data-max-offset="39">
          <img src="${escapeHtml(src)}" alt="${escapeHtml(block.image?.alt || block.headline || '')}" style="object-position:${escapeHtml(block.objectPosition || 'center center')};">
        </figure>

        <div class="services-showcase__content">
          <h2 class="services-showcase__headline" data-letter-reveal>${escapeHtml(block.headline || '')}</h2>
          <div class="services-showcase__copy">${block.contentHtml || ''}</div>
          ${renderCTA(block.primaryLink, options)}
        </div>
      </div>
    </div>
  </div>
</section>`
}

function renderSpacer(block) {
  return `<div class="cms-spacer cms-spacer--${escapeHtml(block.size || 'md')}" aria-hidden="true"></div>`
}

function renderProcessSteps(block) {
  const items = (block.items || []).map((item) => `<article class="about-page-process-step fade" data-about-step role="button" tabindex="0" aria-pressed="false">
    <div class="about-page-process-step__top">
      <span class="about-page-process-step__icon about-page-process-step__icon--${escapeHtml(item.tone || 'blue')}" aria-hidden="true">
        ${renderProcessIcon(item.tone)}
      </span>
      <p class="about-page-process-step__index">${escapeHtml(item.index || '')}</p>
    </div>
    <h3>${escapeHtml(item.title || '')}</h3>
    <p>${escapeHtml(item.text || '')}</p>
  </article>`).join('')

  return renderBlockWrapper(`<div class="wrap-wide">
    <div class="about-page-shell">
      <h2 class="about-page-heading fade" data-letter-reveal>${escapeHtml(block.heading || '')}</h2>
      <div class="about-page-process-grid">${items}</div>
    </div>
  </div>`, { extraClass: 'about-page-section about-page-section--panel' })
}

function renderTimeline(block) {
  const items = (block.items || []).map((item, index) => `<article class="about-page-timeline-entry fade${index === 0 ? ' is-active' : ''}" data-about-timeline-entry>
    <h3>${escapeHtml(item.title || '')}</h3>
    <p>${escapeHtml(item.text || '')}</p>
  </article>`).join('')

  return renderBlockWrapper(`<div class="wrap-wide">
    <div class="about-page-shell">
      <h2 class="about-page-heading fade" data-letter-reveal>${escapeHtml(block.heading || '')}</h2>
      <div class="about-page-timeline" data-about-timeline>${items}</div>
    </div>
  </div>`, { extraClass: 'about-page-section about-page-section--timeline' })
}

function renderClientList(block) {
  const items = (block.items || []).map((item) => `<li>${escapeHtml(item.name || '')}</li>`).join('')

  return renderBlockWrapper(`<div class="wrap-wide">
    <div class="about-page-shell">
      <h2 class="about-page-heading fade" data-letter-reveal>${escapeHtml(block.heading || '')}</h2>
      <ul class="about-page-client-grid fade" aria-label="${escapeHtml(block.heading || 'Clients')}">${items}</ul>
    </div>
  </div>`, { extraClass: 'about-page-section about-page-section--clients' })
}

function renderContactForm(block, options) {
  const successPath = prefixPath('/thank-you/', options.prefix)
  const directEmail = options.companyInfo?.email || 'america@interesting.global'
  const introHtml = block.introText
    ? escapeHtml(block.introText)
    : `If email is easier, write to <a href="mailto:${escapeHtml(directEmail)}">${escapeHtml(directEmail)}</a>. Otherwise use the inquiry form below.`
  const noteHtml = block.noteText
    ? escapeHtml(block.noteText)
    : `Direct email also works: <a href="mailto:${escapeHtml(directEmail)}">${escapeHtml(directEmail)}</a>`

  return `<section class="story-section subpage-home-section subpage-home-section--contact-entry" id="contact-form">
  <div class="wrap-wide">
    <div class="contact-funnel fade">
      <p class="contact-funnel__intro">${introHtml}</p>

      <form class="contact-funnel__form" name="event-inquiry" method="POST" action="${escapeHtml(options.integrations.contactFormEndpoint)}">
        <input type="hidden" name="success_path" value="${escapeHtml(successPath)}">
        <p class="form-honeypot" aria-hidden="true"><label>Do not fill this out: <input name="company_website"></label></p>

        <div class="contact-funnel__grid">
          <label><span>Full Name*</span><input type="text" name="full_name" placeholder="Jane Doe" required></label>
          <label><span>Company*</span><input type="text" name="company" placeholder="Agency, federation, brand" required></label>
          <label><span>Work Email*</span><input type="email" name="email" placeholder="name@company.com" required></label>
          <label><span>Phone / WhatsApp</span><input type="text" name="phone" placeholder="+1 310 555 0124"></label>
          <label>
            <span>Event*</span>
            <select name="event" required>
              <option value="" selected disabled>Select event</option>
              <option>World Cup 2026</option>
              <option>Women's World Cup 2027</option>
              <option>Champions League Final 2027</option>
              <option>Summer Olympics 2028</option>
              <option>Winter Olympics 2030</option>
              <option>Other</option>
            </select>
          </label>
          <label><span>Host City / Area*</span><input type="text" name="city_area" placeholder="e.g. Los Angeles" required></label>
          <label><span>Check-in*</span><input type="date" name="check_in" required></label>
          <label><span>Check-out*</span><input type="date" name="check_out" required></label>

          <label class="contact-funnel__field--full contact-funnel__toggle">
            <input type="checkbox" name="varying_dates" data-varying-dates-toggle>
            <span>Check-in and check-out dates are varying across the different rooms</span>
          </label>

          <p class="contact-funnel__hint contact-funnel__field--full" data-varying-dates-note hidden>Please provide the earliest check-in date and the latest check-out date in the form and additional details in the text box below.</p>

          <label><span>Total Rooms*</span><input type="number" name="rooms_total" min="1" placeholder="e.g. 40" required></label>
          <label><span>Budget per Room / Night (USD)</span><input type="text" name="budget" placeholder="e.g. 450"></label>
          <label>
            <span>Main Guest Mix</span>
            <select name="guest_mix">
              <option value="" selected disabled>Select mix</option>
              <option>Sponsor guests + staff</option>
              <option>Media crews + journalists</option>
              <option>Federation + families</option>
              <option>Agency travelers</option>
              <option>Mixed</option>
            </select>
          </label>
          <label>
            <span>Required Services</span>
            <select name="services_scope">
              <option value="" selected disabled>Select scope</option>
              <option>Accommodation only</option>
              <option>Accommodation + transfers</option>
              <option>Accommodation + hospitality access</option>
              <option>Full package</option>
            </select>
          </label>
          <label class="contact-funnel__field--full"><span>Request Details*</span><textarea name="request_details" rows="6" required placeholder="Room split, level, location priorities, constraints, and any varying date details"></textarea></label>
          <label class="contact-funnel__field--full"><span>Decision Deadline</span><input type="text" name="decision_deadline" placeholder="e.g. Friday 16:00 CET"></label>

          <div class="contact-funnel__field--full contact-funnel__toggle contact-funnel__toggle--legal">
            <input id="accept-legal" type="checkbox" name="accept_legal" required>
            <label for="accept-legal">
              <span>I accept the <button type="button" class="contact-funnel__legal-link" data-open-legal="terms">Terms and Conditions</button> and <button type="button" class="contact-funnel__legal-link" data-open-legal="privacy">Privacy Policy</button>.*</span>
            </label>
          </div>
        </div>

        <div class="contact-funnel__actions">
          <button class="contact-funnel__submit" type="submit">
            <span class="hero-link-cta__text">Submit</span>
            <span class="hero-link-cta__icon" aria-hidden="true">
              <svg viewBox="0 0 19 19" role="presentation" focusable="false">
                <path d="M14.458 10.687 L0 10.688 L0 8.313 L14.458 8.313 L7.808 1.663 L9.5 0 L19 9.5 L9.5 19 L7.808 17.337 Z" fill="currentColor"></path>
              </svg>
            </span>
          </button>
          <p class="contact-funnel__note">${noteHtml}</p>
        </div>
      </form>

      ${block.showTrustBadge === false ? '' : `<div class="contact-funnel__trust" aria-label="SSL secured submission">
        <svg viewBox="0 0 24 24" role="presentation" focusable="false" aria-hidden="true">
          <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 0 1 6 0v3H9Zm3 3a2 2 0 0 1 1 3.732V19h-2v-2.268A2 2 0 0 1 12 13Z" fill="currentColor"></path>
        </svg>
        <span>SSL secured submission</span>
      </div>`}
    </div>
  </div>
</section>`
}

const blockRenderers = {
  hero: renderHero,
  richTextSection: renderRichTextSection,
  image: renderImage,
  gallery: renderGallery,
  cta: renderCTABlock,
  faq: renderFAQ,
  logos: renderLogos,
  stats: renderStats,
  testimonial: renderTestimonials,
  splitSection: renderSplitSection,
  spacer: renderSpacer,
  processSteps: renderProcessSteps,
  timeline: renderTimeline,
  clientList: renderClientList,
  contactForm: renderContactForm,
}

export async function enrichBlock(block) {
  const nextBlock = { ...block }

  if (block.blockType === 'richTextSection' && block.content) {
    nextBlock.contentHtml = await lexicalToHTML(block.content)
  }

  if (block.blockType === 'splitSection' && block.content) {
    nextBlock.contentHtml = await lexicalToHTML(block.content)
  }

  if (block.blockType === 'faq' && Array.isArray(block.items)) {
    nextBlock.items = await Promise.all(block.items.map(async (item) => ({
      ...item,
      answerHtml: item.answer ? await lexicalToHTML(item.answer) : '',
    })))
  }

  return nextBlock
}

export async function enrichPage(page) {
  const pageBlocks = await Promise.all((page.pageBlocks || []).map(enrichBlock))
  return {
    ...page,
    pageBlocks,
  }
}

export function renderPageBlocks(page, options = {}) {
  return (page.pageBlocks || []).map((block) => {
    const renderer = blockRenderers[block.blockType]
    return renderer ? renderer(block, options) : ''
  }).join('\n')
}

export async function preparePage(page, options = {}) {
  const enrichedPage = await enrichPage(page)
  const renderedBlocksHtml = renderPageBlocks(enrichedPage, options)

  return {
    ...enrichedPage,
    renderedBlocksHtml,
    renderedHtml: renderedBlocksHtml,
  }
}
