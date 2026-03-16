---
layout: base.njk
title: Contact
description: Start your inquiry with clear event details so we can return fast, practical options.
---

<section class="section subpage-hero">
  <div class="wrap fade in">
    <p class="eyebrow">CONTACT</p>
    <h1 class="h1">Start with one clean brief.</h1>
    <p class="section-lead">This is your funnel entry. The better the input, the faster and sharper our first option set will be.</p>
  </div>
</section>

<section class="section story-section">
  <div class="wrap story-grid fade">
    <div class="story-static">
      <h2 class="h2">What happens next</h2>
      <ul class="clean-list">
        <li>We review feasibility and risk windows</li>
        <li>We return practical options with trade-offs</li>
        <li>We align on scope and move into execution</li>
      </ul>
      <div class="badge-line">
        <span class="badge"><span class="dot"></span> Response Target, within 24h</span>
        <span class="badge"><span class="dot"></span> Priority, complete briefs first</span>
      </div>
    </div>

    <div class="story-dynamic">
      <form class="panel inquiry-form" name="event-inquiry" method="POST" data-netlify="true" netlify-honeypot="company_website">
        <input type="hidden" name="form-name" value="event-inquiry">
        <p class="form-honeypot" aria-hidden="true">
          <label>Do not fill this out: <input name="company_website"></label>
        </p>

        <div class="form-grid">
          <label>
            Full Name *
            <input type="text" name="full_name" required autocomplete="name">
          </label>
          <label>
            Company *
            <input type="text" name="company" required autocomplete="organization">
          </label>
          <label>
            Work Email *
            <input type="email" name="email" required autocomplete="email">
          </label>
          <label>
            Phone / WhatsApp
            <input type="text" name="phone" autocomplete="tel">
          </label>
          <label>
            Event *
            <select name="event" required>
              <option value="" selected disabled>Select event</option>
              <option>FIFA World Cup 2026</option>
              <option>Winter Olympics 2026</option>
              <option>LA Olympics 2028</option>
              <option>Other major event</option>
            </select>
          </label>
          <label>
            Host City / Area *
            <input type="text" name="city_area" required placeholder="e.g. Los Angeles, Downtown / Inglewood">
          </label>
          <label>
            Check-in *
            <input type="date" name="check_in" required>
          </label>
          <label>
            Check-out *
            <input type="date" name="check_out" required>
          </label>
          <label>
            Total Rooms Needed *
            <input type="number" name="rooms_total" required min="1" placeholder="e.g. 85">
          </label>
          <label>
            Budget per Room / Night (USD)
            <input type="text" name="budget" placeholder="e.g. 280-420">
          </label>
          <label>
            Main Guest Mix
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
            Required Services
            <select name="services_scope">
              <option value="" selected disabled>Select scope</option>
              <option>Hotel only</option>
              <option>Hotel + transfers</option>
              <option>Hotel + hospitality access</option>
              <option>Full package (all three)</option>
            </select>
          </label>
          <label class="form-span-2">
            Request Details *
            <textarea name="request_details" required rows="5" placeholder="Room split, star level, stadium proximity, cancellation flexibility, must-haves, known constraints"></textarea>
          </label>
          <label class="form-span-2">
            Decision Deadline
            <input type="text" name="decision_deadline" placeholder="e.g. First option set by Friday 16:00 CET">
          </label>
        </div>

        <div class="form-actions">
          <button class="btn btn-primary" type="submit">Submit Inquiry</button>
          <p class="form-note">Or email directly: <a href="mailto:usa@interesting-america.com">usa@interesting-america.com</a></p>
        </div>
      </form>
    </div>
  </div>
</section>
