const workerBaseUrl = (process.env.CLOUDFLARE_WORKER_BASE_URL || 'https://ia-cms-oauth.davidmauricekoelle.workers.dev').replace(/\/$/, '')

export const integrations = {
  contactFormEndpoint: `${workerBaseUrl}/contact-submit`,
  newsletterFormEndpoint: `${workerBaseUrl}/newsletter-subscribe`,
}
