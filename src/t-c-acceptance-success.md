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
        Thank you. Your confirmation has been received. We will be in touch shortly with our proposal and additional details.
      </p>
      <div class="confirmation-success__details">
        <p><strong>Name:</strong> <span id="success-full-name">—</span></p>
        <p><strong>Email:</strong> <span id="success-email">—</span></p>
        <p><strong>Terms Version:</strong> <span id="success-terms-version">—</span></p>
        <p><strong>Confirmed At:</strong> <span id="success-confirmed-at">—</span></p>
      </div>
      <p class="confirmation-success__cta">
        <a id="terms-document-download" href="#" class="btn btn--primary btn--pill" data-document-base="{{ integrations.termsDocumentEndpoint }}" target="_blank" rel="noopener">Download confirmation document</a>
      </p>
    </div>
  </div>
</section>

<script>
(function() {
  const params = new URLSearchParams(window.location.search);
  const fullName = params.get('full_name');
  const email = params.get('email');
  const termsVersion = params.get('terms_version');
  const confirmedAt = params.get('confirmed_at');
  const confirmationId = params.get('confirmation_id');
  const hash = params.get('hash');

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el && value) el.textContent = value;
  }

  setText('success-full-name', fullName);
  setText('success-email', email);
  setText('success-terms-version', termsVersion);
  setText('success-confirmed-at', confirmedAt);

  const downloadLink = document.getElementById('terms-document-download');
  if (downloadLink && confirmationId && hash) {
    const base = downloadLink.dataset.documentBase || 'https://ia-cms-oauth.interesting-america.workers.dev/terms-confirmation-document';
    const url = new URL(base);
    url.searchParams.set('confirmation_id', confirmationId);
    url.searchParams.set('hash', hash);
    downloadLink.href = url.toString();
  }
})();
</script>
