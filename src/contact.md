---
layout: base.njk
title: Contact
description: Contact INTERESTING AMERICA
pageClasses: subpage-home page-contact
templateEngineOverride: njk
---

<section class="story-section subpage-home-section subpage-home-section--contact-entry" id="contact-form">
  <div class="wrap-wide">
    <div class="contact-funnel fade">
      <p class="contact-funnel__intro">If email is easier, write to <a href="mailto:america@interesting.global">america@interesting.global</a>. Otherwise use the inquiry form below.</p>

      <form class="contact-funnel__form" name="event-inquiry" method="POST" action="{{ integrations.contactFormEndpoint }}">
        <input type="hidden" name="success_path" value="{{ '/thank-you/' | url }}">
        <p class="form-honeypot" aria-hidden="true"><label>Do not fill this out: <input name="company_website"></label></p>

        <div class="contact-funnel__grid">
          <label>
            <span>Full Name*</span>
            <input type="text" name="full_name" placeholder="Jane Doe" required>
          </label>
          <label>
            <span>Company*</span>
            <input type="text" name="company" placeholder="Agency, federation, brand" required>
          </label>
          <label>
            <span>Work Email*</span>
            <input type="email" name="email" placeholder="name@company.com" required>
          </label>
          <label>
            <span>Phone / WhatsApp</span>
            <input type="text" name="phone" placeholder="+1 310 555 0124">
          </label>
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
          <label>
            <span>Host City / Area*</span>
            <input type="text" name="city_area" placeholder="e.g. Los Angeles" required>
          </label>
          <label>
            <span>Check-in*</span>
            <input type="date" name="check_in" required>
          </label>
          <label>
            <span>Check-out*</span>
            <input type="date" name="check_out" required>
          </label>

          <label class="contact-funnel__field--full contact-funnel__toggle">
            <input type="checkbox" name="varying_dates" data-varying-dates-toggle>
            <span>Check-in and check-out dates are varying across the different rooms</span>
          </label>

          <p class="contact-funnel__hint contact-funnel__field--full" data-varying-dates-note hidden>Please provide the earliest check-in date and the latest check-out date in the form and additional details in the text box below.</p>

          <label>
            <span>Total Rooms*</span>
            <input type="number" name="rooms_total" min="1" placeholder="e.g. 40" required>
          </label>
          <label>
            <span>Budget per Room / Night (USD)</span>
            <input type="text" name="budget" placeholder="e.g. 450">
          </label>
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
          <label class="contact-funnel__field--full">
            <span>Request Details*</span>
            <textarea name="request_details" rows="6" required placeholder="Room split, level, location priorities, constraints, and any varying date details"></textarea>
          </label>
          <label class="contact-funnel__field--full">
            <span>Decision Deadline</span>
            <input type="text" name="decision_deadline" placeholder="e.g. Friday 16:00 CET">
          </label>

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
          <p class="contact-funnel__note">Direct email also works: <a href="mailto:america@interesting.global">america@interesting.global</a></p>
        </div>
      </form>

      <div class="contact-funnel__trust" aria-label="SSL secured submission">
        <svg viewBox="0 0 24 24" role="presentation" focusable="false" aria-hidden="true">
          <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 0 1 6 0v3H9Zm3 3a2 2 0 0 1 1 3.732V19h-2v-2.268A2 2 0 0 1 12 13Z" fill="currentColor"></path>
        </svg>
        <span>SSL secured submission</span>
      </div>
    </div>
  </div>
</section>

<div class="legal-overlay" data-legal-overlay="terms" hidden>
  <div class="legal-overlay__backdrop" data-close-legal></div>
  <div class="legal-overlay__dialog" role="dialog" aria-modal="true" aria-labelledby="legal-overlay-title-terms">
    <div class="legal-overlay__header">
      <h2 id="legal-overlay-title-terms">Terms &amp; Conditions</h2>
      <button type="button" class="legal-overlay__close" data-close-legal aria-label="Close Terms and Conditions overlay">Close</button>
    </div>
    <div class="legal-overlay__body">
      {% include "modules/legal-terms-flow.njk" %}
    </div>
  </div>
</div>

<div class="legal-overlay" data-legal-overlay="privacy" hidden>
  <div class="legal-overlay__backdrop" data-close-legal></div>
  <div class="legal-overlay__dialog" role="dialog" aria-modal="true" aria-labelledby="legal-overlay-title-privacy">
    <div class="legal-overlay__header">
      <h2 id="legal-overlay-title-privacy">Privacy Policy</h2>
      <button type="button" class="legal-overlay__close" data-close-legal aria-label="Close Privacy Policy overlay">Close</button>
    </div>
    <div class="legal-overlay__body">
      {% include "modules/legal-privacy-flow.njk" %}
    </div>
  </div>
</div>
