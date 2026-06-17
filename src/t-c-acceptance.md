---
layout: base.njk
title: Terms & Conditions Acceptance
description: Confirm the Interesting America Terms & Conditions before we share specific hotel options, contacts, rates, or availability.
pageClasses: subpage-home page-contact
templateEngineOverride: njk
---

<section class="story-section subpage-home-section subpage-home-section--contact-entry" id="t-c-acceptance">
  <div class="wrap-wide">
    <div class="contact-funnel fade">
      <p class="contact-funnel__intro contact-funnel__intro--full">Thank you for thinking of Interesting Sports. We’re excited to help and look forward to learning more about your needs.<br><br>

To move forward with your customized proposal, please confirm our Terms &amp; Conditions and Privacy Policy below.</p>

      <form class="contact-funnel__form" name="terms-acceptance" method="POST" action="{{ integrations.termsConfirmEndpoint }}" data-prefill-from-url>
        <input type="hidden" name="success_path" value="{{ '/t-c-acceptance-success/' | url }}">
        <p class="form-honeypot" aria-hidden="true"><label>Do not fill this out: <input name="company_website"></label></p>

        <div class="contact-funnel__grid">
          <label>
            <span>Full Name*</span>
            <input type="text" name="full_name" placeholder="Jane Doe" required>
          </label>
          <label>
            <span>Email*</span>
            <input type="email" name="email" placeholder="name@company.com" required>
          </label>
          <label>
            <span>Company</span>
            <input type="text" name="company" placeholder="Agency, federation, brand">
          </label>
          <label>
            <span>Inquiry Reference</span>
            <input type="text" name="inquiry_reference" placeholder="e.g. proposal or request number">
          </label>

          <div class="contact-funnel__field--full contact-funnel__toggle contact-funnel__toggle--legal">
            <input id="accept-terms" type="checkbox" name="accept_terms" required>
            <label for="accept-terms">
              <span>I have reviewed and accept the <button type="button" class="contact-funnel__legal-link" data-open-legal="terms">Terms and Conditions</button> and <button type="button" class="contact-funnel__legal-link" data-open-legal="privacy">Privacy Policy</button>.*</span>
            </label>
          </div>
        </div>

        <div class="contact-funnel__actions">
          <button class="contact-funnel__submit" type="submit">
            <span class="hero-link-cta__text">Confirm and Continue</span>
            <span class="hero-link-cta__icon" aria-hidden="true">
              <svg viewBox="0 0 19 19" role="presentation" focusable="false">
                <path d="M14.458 10.687 L0 10.688 L0 8.313 L14.458 8.313 L7.808 1.663 L9.5 0 L19 9.5 L9.5 19 L7.808 17.337 Z" fill="currentColor"></path>
              </svg>
            </span>
          </button>
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
