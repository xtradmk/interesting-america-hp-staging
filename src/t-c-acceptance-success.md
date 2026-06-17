---
layout: base.njk
title: Confirmation Received
permalink: /t-c-acceptance-success/
metaDescription: Your Terms & Conditions confirmation has been received.
pageClasses: subpage-home page-contact
---

<section class="module module--confirmation-success">
  <div class="container">
    <div class="confirmation-success__card">
      <h1 class="confirmation-success__title">Confirmation received</h1>
      <p class="confirmation-success__text">
        Thank you. Your confirmation has been received. We can now continue with specific hotel introductions and proposal details.
      </p>
      <div class="confirmation-success__details">
        <p><strong>Name:</strong> <span id="success-full-name">—</span></p>
        <p><strong>Email:</strong> <span id="success-email">—</span></p>
        <p><strong>Terms Version:</strong> <span id="success-terms-version">—</span></p>
        <p><strong>Confirmed At:</strong> <span id="success-confirmed-at">—</span></p>
      </div>
      <p class="confirmation-success__cta">
        <a id="terms-document-download" href="#" class="btn btn--primary" data-document-base="{{ integrations.termsDocumentEndpoint }}" target="_blank" rel="noopener">Download confirmation document</a>
      </p>
      <p class="confirmation-success__cta">
        <a href="/" class="btn btn--primary">Back to Home</a>
      </p>
    </div>
  </div>
</section>
