{{ cmsPage.renderedHtml | safe }}

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
