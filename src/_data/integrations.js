const workerBaseUrl = (process.env.CLOUDFLARE_WORKER_BASE_URL || "https://ia-cms-oauth.davidmauricekoelle.workers.dev").replace(/\/$/, "");

module.exports = {
  contactFormEndpoint: `${workerBaseUrl}/contact-submit`,
  newsletterFormEndpoint: `${workerBaseUrl}/newsletter-subscribe`,
  termsConfirmEndpoint: `${workerBaseUrl}/terms-confirm`,
  termsDocumentEndpoint: `${workerBaseUrl}/terms-confirmation-document`,
};
