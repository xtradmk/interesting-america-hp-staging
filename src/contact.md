---
layout: base.njk
title: Contact
description: Contact INTERESTING AMERICA
pageClasses: subpage-studio page-contact
templateEngineOverride: njk
---

<section class="studio-hero">
  <div class="studio-shell fade in">
    <p class="studio-kicker">Contact</p>

    <div class="studio-hero__grid">
      <h1 class="studio-title">Share the brief clearly. We respond with options that can actually be acted on.</h1>

      <div class="studio-hero__aside">
        <p class="studio-intro">A concise first message is enough to start: event, city, dates, room volume, guest mix, decision timeline, and any non-negotiables. If transfers or hospitality may matter, include that now.</p>
        <a class="studio-link" href="mailto:usa@interesting-america.com">usa@interesting-america.com</a>
      </div>
    </div>
  </div>
</section>

<section class="studio-band studio-band--white">
  <div class="studio-shell fade">
    <div class="studio-statement">
      <p class="studio-label">Best Starting Point</p>
      <p class="studio-statement__lead">The cleaner the brief, the stronger the first move. Good input saves time on both sides.</p>
    </div>
  </div>
</section>

<section class="studio-band">
  <div class="studio-shell studio-contact-layout fade">
    <aside class="studio-contact-panel">
      <p class="studio-label">Direct Contact</p>
      <h2 class="studio-heading">A concise brief is enough to get us oriented.</h2>

      <div class="studio-contact-list">
        <div>
          <span>Email</span>
          <strong><a class="studio-link" href="mailto:usa@interesting-america.com">usa@interesting-america.com</a></strong>
        </div>
        <div>
          <span>Bases</span>
          <strong>Berlin &amp; Los Angeles</strong>
        </div>
        <div>
          <span>Best For</span>
          <strong>Hotel, transfer, and hospitality briefs</strong>
        </div>
      </div>

      <p class="studio-body">If email is easier than a form, that is completely fine. A clear written brief still works well.</p>
    </aside>

    <div class="studio-form-panel">
      <h2 class="studio-form-title">Project inquiry</h2>
      <p class="studio-form-intro">Fields marked with * help us answer quickly without a second round of basic questions.</p>

      <form class="studio-form" name="event-inquiry" method="POST" data-netlify="true" netlify-honeypot="company_website">
        <input type="hidden" name="form-name" value="event-inquiry">
        <p class="form-honeypot" aria-hidden="true"><label>Do not fill this out: <input name="company_website"></label></p>

        <div class="studio-form-grid">
          <label><span>Full Name*</span><input type="text" name="full_name" required placeholder="Your name"></label>
          <label><span>Company*</span><input type="text" name="company" required placeholder="Company or organization"></label>
          <label><span>Work Email*</span><input type="email" name="email" required placeholder="name@company.com"></label>
          <label><span>Phone / WhatsApp</span><input type="text" name="phone" placeholder="+49 / +1 / WhatsApp"></label>
          <label><span>Event*</span>
            <select name="event" required>
              <option value="" selected disabled>Select event</option>
              <option>FIFA World Cup 2026</option>
              <option>Winter Olympics 2026</option>
              <option>LA Olympics 2028</option>
              <option>Other major event</option>
            </select>
          </label>
          <label><span>Host City / Area*</span><input type="text" name="city_area" required placeholder="City, district, or venue area"></label>
          <label><span>Check-in*</span><input type="date" name="check_in" required></label>
          <label><span>Check-out*</span><input type="date" name="check_out" required></label>
          <label><span>Total Rooms*</span><input type="number" name="rooms_total" min="1" required placeholder="0"></label>
          <label><span>Budget per Room / Night (USD)</span><input type="text" name="budget" placeholder="Target band or ceiling"></label>
          <label><span>Main Guest Mix</span>
            <select name="guest_mix">
              <option value="" selected disabled>Select mix</option>
              <option>Sponsor guests + staff</option>
              <option>Media crews + journalists</option>
              <option>Federation + families</option>
              <option>Agency travelers</option>
              <option>Mixed</option>
            </select>
          </label>
          <label><span>Required Services</span>
            <select name="services_scope">
              <option value="" selected disabled>Select scope</option>
              <option>Hotel only</option>
              <option>Hotel + transfers</option>
              <option>Hotel + hospitality access</option>
              <option>Full package</option>
            </select>
          </label>
          <label class="studio-form-grid__full"><span>Request Details*</span><textarea name="request_details" rows="6" required placeholder="Room split, target level, location priorities, constraints, hosting requirements"></textarea></label>
          <label class="studio-form-grid__full"><span>Decision Deadline</span><input type="text" name="decision_deadline" placeholder="For example: Friday, 16:00 CET"></label>
        </div>

        <div class="studio-form-actions">
          <button class="studio-button" type="submit">Send inquiry</button>
          <p class="studio-note">Direct email also works: <a class="studio-link" href="mailto:usa@interesting-america.com">usa@interesting-america.com</a></p>
        </div>
      </form>
    </div>
  </div>
</section>

<section class="studio-band studio-band--white">
  <div class="studio-shell fade">
    <div class="studio-list">
      <article class="studio-list__item">
        <span class="studio-count">01</span>
        <div>
          <h3>Share the real timing.</h3>
          <p>If the decision window is already tight, say that early. Speed changes the search strategy.</p>
        </div>
      </article>

      <article class="studio-list__item">
        <span class="studio-count">02</span>
        <div>
          <h3>Tell us what cannot move.</h3>
          <p>Venue proximity, guest level, minimum hotel category, or specific arrival patterns are all useful anchors.</p>
        </div>
      </article>

      <article class="studio-list__item">
        <span class="studio-count">03</span>
        <div>
          <h3>Bring adjacent scope in early.</h3>
          <p>If transfers or hospitality may become part of the assignment, it is better to design for that at the beginning.</p>
        </div>
      </article>
    </div>
  </div>
</section>
