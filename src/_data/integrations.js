const workerBaseUrl = (process.env.CLOUDFLARE_WORKER_BASE_URL || "https://ia-cms-oauth.davidmauricekoelle.workers.dev").replace(/\/$/, "");

module.exports = {
  contactFormEndpoint: `${workerBaseUrl}/contact-submit`,
  newsletterFormEndpoint: `${workerBaseUrl}/newsletter-subscribe`,
  // Terms confirmation endpoint for the Hotel Introduction Confirmation page.
  // See cloudflare/worker.js for the matching server-side handler.
  termsConfirmationEndpoint: `${workerBaseUrl}/terms-confirmation`,
};
