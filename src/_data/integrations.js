const workerBaseUrl = (process.env.CLOUDFLARE_WORKER_BASE_URL || "https://ia-cms-oauth.interesting-america.workers.dev").replace(/\/$/, "");
const contactWorkerBaseUrl = (process.env.CLOUDFLARE_CONTACT_WORKER_BASE_URL || workerBaseUrl).replace(/\/$/, "");

module.exports = {
  contactFormEndpoint: `${contactWorkerBaseUrl}/contact-submit`,
  contactUpdateEndpoint: `${contactWorkerBaseUrl}/contact-update`,
  newsletterFormEndpoint: `${workerBaseUrl}/newsletter-subscribe`,
  termsConfirmEndpoint: `${workerBaseUrl}/terms-confirm`,
  termsDocumentEndpoint: `${workerBaseUrl}/terms-confirmation-document`,
};
