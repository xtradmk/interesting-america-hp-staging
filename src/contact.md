---
layout: base.njk
title: Contact
description: Contact INTERESTING AMERICA
pageClasses: subpage-editorial page-contact
templateEngineOverride: njk
---

<section class="editorial-hero">
  <div class="editorial-shell fade in">
    <div class="editorial-hero__grid">
      <div>
        <p class="editorial-kicker">Contact</p>
        <h1 class="editorial-title">Send one sharp brief. We will return with workable options, not noise.</h1>
      </div>

      <div class="editorial-hero__side">
        <p class="editorial-intro">The more precise the starting brief, the faster we can qualify feasibility and shape a credible first round. If transport or hospitality are part of scope, include them from the beginning.</p>

        <div class="editorial-meta">
          <div class="editorial-meta__item">
            <span>Direct Email</span>
            <strong><a class="editorial-inline-link" href="mailto:usa@interesting-america.com">usa@interesting-america.com</a></strong>
          </div>
          <div class="editorial-meta__item">
            <span>Bases</span>
            <strong>Berlin &amp; Los Angeles</strong>
          </div>
          <div class="editorial-meta__item">
            <span>Best For</span>
            <strong>Hotel, transfer, and hospitality briefs</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section contact-brief">
  <div class="editorial-shell contact-brief__grid fade">
    <p class="editorial-label">Best Starting Point</p>

    <div class="editorial-copy">
      <p>Tell us the event, city, dates, approximate room volume, guest mix, and the speed of the decision. If location priorities or budget bands already exist, include those too.</p>
    </div>
  </div>
</section>

<section class="section contact-sheet-section">
  <div class="editorial-shell contact-sheet fade">
    <aside class="contact-card">
      <p class="contact-card__eyebrow">Project Intake</p>
      <h2 class="contact-card__title">The cleaner the brief, the better the first move.</h2>

      <ul class="contact-card__list">
        <li>
          <span>Include</span>
          <strong>Event, city, dates, room volume, guest mix, and your decision deadline.</strong>
        </li>
        <li>
          <span>Helpful Context</span>
          <strong>Budget band, preferred hotel level, walkability or transfer expectations, and any non-negotiables.</strong>
        </li>
        <li>
          <span>Direct Channel</span>
          <strong><a class="editorial-inline-link" href="mailto:usa@interesting-america.com">usa@interesting-america.com</a></strong>
        </li>
      </ul>

      <p class="contact-card__subtle">If email is easier than forms, that is perfectly fine. A concise written brief still works well.</p>
    </aside>

    <div class="editorial-form-wrap">
      <h2 class="editorial-form-heading">Project inquiry</h2>
      <p class="editorial-form-note">Fields marked with * give us enough structure to qualify the request properly without a second round of basic questions.</p>

      <form class="editorial-form" name="event-inquiry" method="POST" data-netlify="true" netlify-honeypot="company_website">
        <input type="hidden" name="form-name" value="event-inquiry">
        <p class="form-honeypot" aria-hidden="true"><label>Do not fill this out: <input name="company_website"></label></p>

        <div class="editorial-form-grid">
          <label>Full Name*
            <input type="text" name="full_name" required placeholder="Your name">
          </label>

          <label>Company*
            <input type="text" name="company" required placeholder="Company or organization">
          </label>

          <label>Work Email*
            <input type="email" name="email" required placeholder="name@company.com">
          </label>

          <label>Phone / WhatsApp
            <input type="text" name="phone" placeholder="+49 / +1 / WhatsApp">
          </label>

          <label>Event*
            <select name="event" required>
              <option value="" selected disabled>Select event</option>
              <option>FIFA World Cup 2026</option>
              <option>Winter Olympics 2026</option>
              <option>LA Olympics 2028</option>
              <option>Other major event</option>
            </select>
          </label>

          <label>Host City / Area*
            <input type="text" name="city_area" required placeholder="City, district, or venue area">
          </label>

          <label>Check-in*
            <input type="date" name="check_in" required>
          </label>

          <label>Check-out*
            <input type="date" name="check_out" required>
          </label>

          <label>Total Rooms*
            <input type="number" name="rooms_total" min="1" required placeholder="0">
          </label>

          <label>Budget per Room / Night (USD)
            <input type="text" name="budget" placeholder="Target band or ceiling">
          </label>

          <label>Main Guest Mix
            <select name="guest_mix">
              <option value="" selected disabled>Select mix</option>
              <option>Sponsor guests + staff</option>
              <option>Media crews + journalists</option>
              <option>Federation + families</option>
              <option>Agency travelers</option>
              <option>Mixed</option>
            </select>
          </label>

          <label>Required Services
            <select name="services_scope">
              <option value="" selected disabled>Select scope</option>
              <option>Hotel only</option>
              <option>Hotel + transfers</option>
              <option>Hotel + hospitality access</option>
              <option>Full package</option>
            </select>
          </label>

          <label class="span-2">Request Details*
            <textarea name="request_details" rows="6" required placeholder="Room split, target level, location priorities, constraints, hosting requirements"></textarea>
          </label>

          <label class="span-2">Decision Deadline
            <input type="text" name="decision_deadline" placeholder="For example: Friday, 16:00 CET">
          </label>
        </div>

        <div class="editorial-form-actions">
          <button class="editorial-submit" type="submit">
            <span>Send inquiry</span>
            <span class="editorial-submit__icon" aria-hidden="true">
              <svg viewBox="0 0 19 19" role="presentation" focusable="false">
                <path d="M14.458 10.687 L0 10.688 L0 8.313 L14.458 8.313 L7.808 1.663 L9.5 0 L19 9.5 L9.5 19 L7.808 17.337 Z" fill="currentColor"></path>
              </svg>
            </span>
          </button>

          <p class="editorial-contact-line">Direct email also works: <a class="editorial-inline-link" href="mailto:usa@interesting-america.com">usa@interesting-america.com</a></p>
        </div>
      </form>
    </div>
  </div>
</section>

<section class="section editorial-lines">
  <div class="editorial-shell fade">
    <article>
      <span class="editorial-index">01</span>
      <h2>Share the real timing.</h2>
      <p>If the decision window is already tight, say that early. Speed changes the shape of the search.</p>
    </article>

    <article>
      <span class="editorial-index">02</span>
      <h2>Tell us what cannot move.</h2>
      <p>Venue proximity, guest level, minimum hotel category, or specific arrival patterns are all useful anchors.</p>
    </article>

    <article>
      <span class="editorial-index">03</span>
      <h2>Bring adjacent scope in from the start.</h2>
      <p>If transfers or hospitality may become part of the assignment, it is better to design for that early than retrofit later.</p>
    </article>
  </div>
</section>

<section class="section editorial-gallery editorial-gallery--contact">
  <div class="editorial-shell editorial-gallery__grid fade">
    <figure class="editorial-frame editorial-frame--wide dynamic-media" data-speed="0.18" data-max-offset="44">
      <img src="{{ '/images/uploads/hero-dallas-tx.jpg' | url }}" alt="Dallas skyline at dusk" style="object-position:center 50%;">
      <figcaption>American host-city context</figcaption>
    </figure>

    <figure class="editorial-frame editorial-frame--portrait dynamic-media editorial-frame--lower" data-speed="0.24" data-max-offset="60">
      <img src="{{ '/images/uploads/hero-atl-marriott-marquis.jpg' | url }}" alt="Interior of the Marriott Marquis in Atlanta" style="object-position:center 40%;">
      <figcaption>Hotel sourcing with delivery in mind</figcaption>
    </figure>
  </div>
</section>

<section class="section editorial-cta">
  <div class="editorial-shell editorial-cta__grid fade">
    <div>
      <p class="editorial-label">Direct Contact</p>
      <h2 class="editorial-display editorial-display--medium">If the assignment is already active, send the brief and we will get oriented quickly.</h2>
    </div>

    <a class="editorial-cta__link" href="mailto:usa@interesting-america.com">
      <span>Email us directly</span>
      <span class="editorial-cta__icon" aria-hidden="true">
        <svg viewBox="0 0 19 19" role="presentation" focusable="false">
          <path d="M14.458 10.687 L0 10.688 L0 8.313 L14.458 8.313 L7.808 1.663 L9.5 0 L19 9.5 L9.5 19 L7.808 17.337 Z" fill="currentColor"></path>
        </svg>
      </span>
    </a>
  </div>
</section>
