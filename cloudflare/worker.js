const CURRENT_TERMS_VERSION = "2026-06-16";
const TERMS_CHECKBOX_TEXT = "I have reviewed and accept the Interesting America Terms & Conditions, including the Hotel Introduction Terms.";

const KNOWN_TERMS_CONFIRMATION_FIELDS = [
  ["full_name", "Full Name"],
  ["email", "Email"],
  ["company", "Company"],
  ["inquiry_reference", "Inquiry Reference"],
];
const TERMS_CONFIRMATION_FIELD_LABELS = new Map(KNOWN_TERMS_CONFIRMATION_FIELDS);
const REQUIRED_TERMS_CONFIRMATION_FIELDS = new Set(["full_name", "email"]);

const KNOWN_CONTACT_FIELDS = [
  ["full_name", "Full Name"],
  ["company", "Company"],
  ["email", "Work Email"],
  ["phone", "Phone / WhatsApp"],
  ["event", "Event"],
  ["city_area", "Host City / Area"],
  ["check_in", "Check-in"],
  ["check_out", "Check-out"],
  ["rooms_total", "Total Rooms"],
  ["budget", "Budget per Room / Night (USD)"],
  ["guest_mix", "Main Guest Mix"],
  ["services_scope", "Required Services"],
  ["request_details", "Request Details"],
  ["decision_deadline", "Decision Deadline"],
  ["accept_legal", "Accepted Terms and Privacy"],
];
const KNOWN_NEWSLETTER_FIELDS = [
  ["email", "Email Address"],
];

const CONTACT_FIELD_LABELS = new Map(KNOWN_CONTACT_FIELDS);
const NEWSLETTER_FIELD_LABELS = new Map(KNOWN_NEWSLETTER_FIELDS);
const REQUIRED_CONTACT_FIELDS = new Set([
  "full_name",
  "company",
  "email",
  "event",
  "city_area",
  "check_in",
  "check_out",
  "rooms_total",
  "request_details",
  "accept_legal",
]);
const REQUIRED_NEWSLETTER_FIELDS = new Set([
  "email",
]);
const RESERVED_FORM_FIELDS = new Set(["success_path", "company_website"]);
const MAX_FORM_FIELDS = 50;
const MAX_FIELD_NAME_LENGTH = 80;
const MAX_FIELD_VALUE_LENGTH = 1200;
const TELEGRAM_TEXT_LIMIT = 4000;
const DISCORD_FIELD_VALUE_LIMIT = 1024;
const DISCORD_FIELD_NAME_LIMIT = 256;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const recentSubmissionAttempts = new Map();

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

function htmlResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}

function logEvent(level, event, payload = {}) {
  const message = JSON.stringify({
    event,
    timestamp: new Date().toISOString(),
    ...payload,
  });

  if (level === "error") {
    console.error(message);
    return;
  }

  console.log(message);
}

function getAllowedOrigins(env) {
  return [env.ALLOWED_ORIGIN, env.ADDITIONAL_ALLOWED_ORIGINS || ""]
    .join(",")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function getRequestOrigin(req) {
  const origin = req.headers.get("Origin");
  if (origin) return origin;

  const referer = req.headers.get("Referer");
  if (!referer) return "";

  try {
    return new URL(referer).origin;
  } catch {
    return "";
  }
}

function getSafeReturnUrl(req, origin, fallbackPath = "/") {
  const referer = req.headers.get("Referer");
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      if (refererUrl.origin === origin) return refererUrl.toString();
    } catch {
      // Ignore malformed referer values and fall back below.
    }
  }

  return new URL(fallbackPath, origin).toString();
}

function buildRedirectUrl(origin, path) {
  const safePath = String(path || "/").startsWith("/") ? String(path || "/") : "/";
  return new URL(safePath, origin).toString();
}

function getClientIp(req) {
  const forwarded = req.headers.get("CF-Connecting-IP") || req.headers.get("X-Forwarded-For") || "";
  return forwarded.split(",")[0]?.trim() || "unknown";
}

function sanitizeText(value, { singleLine = false, maxLength = MAX_FIELD_VALUE_LENGTH } = {}) {
  let sanitized = String(value || "")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();

  if (singleLine) {
    sanitized = sanitized.replace(/\s+/g, " ");
  }

  if (sanitized.length > maxLength) {
    sanitized = `${sanitized.slice(0, Math.max(0, maxLength - 1))}...`;
  }

  return sanitized;
}

function sanitizeFieldName(rawName) {
  return sanitizeText(rawName, {
    singleLine: true,
    maxLength: MAX_FIELD_NAME_LENGTH,
  });
}

function humanizeFieldName(name, fieldLabels = new Map()) {
  return fieldLabels.get(name)
    || name
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
}

function compactValue(value) {
  return sanitizeText(value, {
    singleLine: true,
    maxLength: MAX_FIELD_VALUE_LENGTH,
  }) || "-";
}

function clampText(value, maxLength) {
  return value.length > maxLength
    ? `${value.slice(0, Math.max(0, maxLength - 1))}...`
    : value;
}

function consumeRateLimit(clientIp) {
  if (!clientIp || clientIp === "unknown") {
    return { allowed: true };
  }

  const now = Date.now();
  for (const [ip, timestamps] of recentSubmissionAttempts.entries()) {
    const freshTimestamps = timestamps.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
    if (freshTimestamps.length === 0) {
      recentSubmissionAttempts.delete(ip);
    } else {
      recentSubmissionAttempts.set(ip, freshTimestamps);
    }
  }

  const attempts = recentSubmissionAttempts.get(clientIp) || [];
  if (attempts.length >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((RATE_LIMIT_WINDOW_MS - (now - attempts[0])) / 1000),
    };
  }

  attempts.push(now);
  recentSubmissionAttempts.set(clientIp, attempts);

  return { allowed: true };
}

function renderErrorPage(title, message, returnUrl, status = 500, returnLabel = "Back to the previous page") {
  return htmlResponse(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <style>
      body{margin:0;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#f4f7fb;color:#0f172a}
      main{max-width:680px;margin:0 auto;padding:64px 24px}
      .panel{padding:32px;border-radius:24px;background:#fff;box-shadow:0 24px 54px rgba(15,23,42,.08)}
      h1{margin:0 0 12px;font-size:clamp(32px,6vw,52px);line-height:.98;font-weight:500;letter-spacing:-.04em}
      p{margin:0 0 18px;font-size:18px;line-height:1.6;color:#475569}
      a{color:#0f172a}
    </style>
  </head>
  <body>
    <main>
      <div class="panel">
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(message)}</p>
        <p><a href="${escapeHtml(returnUrl)}">${escapeHtml(returnLabel)}</a></p>
      </div>
    </main>
  </body>
</html>`, status);
}

function collectFormFields(formData, fieldLabels = new Map()) {
  const fieldsByName = new Map();

  for (const [rawName, rawValue] of formData.entries()) {
    const name = sanitizeFieldName(rawName);
    if (!name || RESERVED_FORM_FIELDS.has(name)) {
      continue;
    }

    if (rawValue instanceof File) {
      continue;
    }

    const value = sanitizeText(rawValue);
    const existingField = fieldsByName.get(name);
    if (existingField) {
      const combinedValue = [existingField.value, value].filter(Boolean).join(", ");
      existingField.value = clampText(combinedValue, MAX_FIELD_VALUE_LENGTH);
      continue;
    }

    if (fieldsByName.size >= MAX_FORM_FIELDS) {
      break;
    }

    fieldsByName.set(name, {
      name,
      label: humanizeFieldName(name, fieldLabels),
      value,
    });
  }

  return [...fieldsByName.values()];
}

function fieldsToPayload(fields) {
  return Object.fromEntries(fields.map((field) => [field.name, field.value]));
}

function validateContactSubmission(payload) {
  if (!payload.accept_legal) {
    return {
      valid: false,
      message: "Please accept the Terms and Conditions and Privacy Policy before submitting.",
      status: 400,
    };
  }

  const missingFields = [...REQUIRED_CONTACT_FIELDS].filter((field) => !payload[field]);
  if (missingFields.length) {
    return {
      valid: false,
      message: "Some required information is missing. Please go back and try again.",
      status: 400,
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email || "")) {
    return {
      valid: false,
      message: "Please provide a valid email address.",
      status: 400,
    };
  }

  if (!/^\d+$/.test(payload.rooms_total || "") || Number(payload.rooms_total) < 1) {
    return {
      valid: false,
      message: "Please provide a valid room quantity.",
      status: 400,
    };
  }

  return { valid: true };
}

function validateNewsletterSubmission(payload) {
  const missingFields = [...REQUIRED_NEWSLETTER_FIELDS].filter((field) => !payload[field]);
  if (missingFields.length) {
    return {
      valid: false,
      message: "Please provide your email address.",
      status: 400,
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email || "")) {
    return {
      valid: false,
      message: "Please provide a valid email address.",
      status: 400,
    };
  }

  return { valid: true };
}

function validateTermsConfirmation(payload) {
  const missingFields = [...REQUIRED_TERMS_CONFIRMATION_FIELDS].filter((field) => !payload[field]);
  if (missingFields.length) {
    return {
      valid: false,
      message: "Please enter your full name and email address.",
      status: 400,
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email || "")) {
    return {
      valid: false,
      message: "Please enter a valid email address.",
      status: 400,
    };
  }

  if (!payload.accept_terms) {
    return {
      valid: false,
      message: "Please confirm the Terms and Conditions before continuing.",
      status: 400,
    };
  }

  return { valid: true };
}

const CONTACT_FORM_CONFIG = {
  eventPrefix: "contact_submission",
  source: "Website Contact Form",
  notificationTitle: "New Website Form Submission",
  fieldLabels: CONTACT_FIELD_LABELS,
  fallbackReturnPath: "/contact/",
  returnLabel: "Back to the inquiry form",
  validationTitle: "Please complete the required fields",
  configErrorTitle: "Contact notifications are not configured yet",
  configErrorMessage: "The notification backend is missing required configuration. Please try again later.",
  deliveryFailureTitle: "We could not deliver your submission",
  validate: validateContactSubmission,
};

const NEWSLETTER_FORM_CONFIG = {
  eventPrefix: "newsletter_submission",
  source: "Website Footer Newsletter Signup",
  notificationTitle: "New Website Newsletter Signup",
  fieldLabels: NEWSLETTER_FIELD_LABELS,
  fallbackReturnPath: "/",
  returnLabel: "Back to the previous page",
  validationTitle: "Please check the email field",
  configErrorTitle: "Newsletter notifications are not configured yet",
  configErrorMessage: "The notification backend is missing required configuration. Please try again later.",
  deliveryFailureTitle: "We could not deliver your signup",
  validate: validateNewsletterSubmission,
};

const TERMS_CONFIRMATION_CONFIG = {
  eventPrefix: "terms_confirmation",
  source: "Hotel Introduction Terms Confirmation",
  notificationTitle: "New Terms Confirmation",
  fieldLabels: TERMS_CONFIRMATION_FIELD_LABELS,
  fallbackReturnPath: "/hotel-introductions/confirmation/",
  returnLabel: "Back to the confirmation form",
  validationTitle: "Please complete the confirmation",
  configErrorTitle: "Terms confirmation storage is not configured yet",
  configErrorMessage: "The confirmation backend is missing required configuration. Please try again later.",
  deliveryFailureTitle: "We could not record your confirmation",
  validate: validateTermsConfirmation,
  requiresKv: true,
};

function buildSubmissionRecord(req, fields, formConfig) {
  const referer = sanitizeText(req.headers.get("Referer"), {
    singleLine: true,
    maxLength: 500,
  });

  const record = {
    id: crypto.randomUUID(),
    eventPrefix: formConfig.eventPrefix,
    source: formConfig.source,
    notificationTitle: formConfig.notificationTitle,
    submittedAt: new Date().toISOString(),
    pageUrl: referer || "",
    clientIp: getClientIp(req),
    userAgent: sanitizeText(req.headers.get("User-Agent"), { singleLine: true, maxLength: 500 }),
    fields,
    notificationFields: fields.filter((field) => field.value),
    payload: fieldsToPayload(fields),
  };

  if (formConfig.eventPrefix === "terms_confirmation") {
    record.termsVersion = CURRENT_TERMS_VERSION;
    record.checkboxText = TERMS_CHECKBOX_TEXT;
  }

  return record;
}

async function storeTermsConfirmation(env, submission) {
  const kv = env.TERMS_CONFIRMATIONS_KV;
  if (!kv) {
    throw new Error("TERMS_CONFIRMATIONS_KV binding is not configured");
  }

  const key = `terms_confirmation:${submission.id}`;
  const value = JSON.stringify({
    id: submission.id,
    full_name: submission.payload.full_name || "",
    email: submission.payload.email || "",
    company: submission.payload.company || "",
    inquiry_reference: submission.payload.inquiry_reference || "",
    terms_version: submission.termsVersion,
    checkbox_text: submission.checkboxText,
    confirmed_at: submission.submittedAt,
    ip_address: submission.clientIp,
    user_agent: submission.userAgent,
    page_url: submission.pageUrl,
  });

  await kv.put(key, value, { expirationTtl: 60 * 60 * 24 * 365 }); // 1 year
  return { key };
}

function buildNotificationLines(submission) {
  const headerLines = [
    submission.notificationTitle,
    `Source: ${submission.source}`,
    `Submission ID: ${submission.id}`,
    `Submitted: ${submission.submittedAt}`,
    `Page: ${submission.pageUrl || "-"}`,
  ];

  const fieldLines = submission.notificationFields.map(
    (field) => `${field.label}: ${compactValue(field.value)}`
  );

  return [
    ...headerLines,
    "",
    ...(fieldLines.length ? fieldLines : ["No fields submitted."]),
  ];
}

function buildTelegramMessage(submission) {
  return clampText(buildNotificationLines(submission).join("\n"), TELEGRAM_TEXT_LIMIT);
}

function buildDiscordPayload(submission) {
  const description = [
    `Source: ${submission.source}`,
    `Submission ID: ${submission.id}`,
    `Submitted: ${submission.submittedAt}`,
    `Page: ${submission.pageUrl || "-"}`,
  ].join("\n");

  const fields = submission.notificationFields.slice(0, 25).map((field) => ({
    name: clampText(field.label, DISCORD_FIELD_NAME_LIMIT),
    value: clampText(compactValue(field.value), DISCORD_FIELD_VALUE_LIMIT),
    inline: false,
  }));

  return {
    allowed_mentions: { parse: [] },
    content: submission.notificationTitle,
    embeds: [
      {
        title: submission.notificationTitle,
        description,
        color: 2248278,
        timestamp: submission.submittedAt,
        footer: {
          text: `Submission ID: ${submission.id}`,
        },
        fields,
      },
    ],
  };
}

async function sendTelegramNotification(env, submission) {
  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHAT_ID,
      text: buildTelegramMessage(submission),
      disable_web_page_preview: true,
    }),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.ok) {
    const errorMessage = result?.description || `Telegram returned ${response.status}`;
    throw new Error(errorMessage);
  }

  return {
    messageId: result.result?.message_id,
  };
}

async function sendDiscordNotification(env, submission) {
  const response = await fetch(`https://discord.com/api/v10/channels/${env.DISCORD_CHANNEL_ID}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
    },
    body: JSON.stringify(buildDiscordPayload(submission)),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    const errorText = result?.message || `Discord returned ${response.status}`;
    throw new Error(String(errorText).slice(0, 200));
  }

  return {
    messageId: result?.id,
    status: response.status,
  };
}

function getNotificationChannels(env) {
  const channels = [];
  const missing = [];

  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    channels.push({ name: "telegram", send: sendTelegramNotification });
  } else if (env.TELEGRAM_BOT_TOKEN || env.TELEGRAM_CHAT_ID) {
    missing.push({
      channel: "telegram",
      missingConfig: [
        !env.TELEGRAM_BOT_TOKEN ? "TELEGRAM_BOT_TOKEN" : null,
        !env.TELEGRAM_CHAT_ID ? "TELEGRAM_CHAT_ID" : null,
      ].filter(Boolean),
    });
  } else {
    missing.push({
      channel: "telegram",
      missingConfig: ["TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID"],
    });
  }

  if (env.DISCORD_BOT_TOKEN && env.DISCORD_CHANNEL_ID) {
    channels.push({ name: "discord", send: sendDiscordNotification });
  } else if (env.DISCORD_BOT_TOKEN || env.DISCORD_CHANNEL_ID) {
    missing.push({
      channel: "discord",
      missingConfig: [
        !env.DISCORD_BOT_TOKEN ? "DISCORD_BOT_TOKEN" : null,
        !env.DISCORD_CHANNEL_ID ? "DISCORD_CHANNEL_ID" : null,
      ].filter(Boolean),
    });
  } else {
    missing.push({
      channel: "discord",
      missingConfig: ["DISCORD_BOT_TOKEN", "DISCORD_CHANNEL_ID"],
    });
  }

  return { channels, missing };
}

async function dispatchNotifications(channels, env, submission) {
  const results = await Promise.allSettled(channels.map(async (channel) => {
    const result = await channel.send(env, submission);
    logEvent("info", `${submission.eventPrefix}_notification_succeeded`, {
      submissionId: submission.id,
      channel: channel.name,
      result,
    });
    return result;
  }));

  const failures = results.flatMap((result, index) => {
    if (result.status === "fulfilled") {
      return [];
    }

    const failure = {
      channel: channels[index].name,
      message: result.reason instanceof Error ? result.reason.message : "Unknown notification failure.",
    };

    logEvent("error", `${submission.eventPrefix}_notification_failed`, {
      submissionId: submission.id,
      channel: failure.channel,
      message: failure.message,
    });

    return [failure];
  });

  const succeededChannels = results.flatMap((result, index) => (
    result.status === "fulfilled" ? [channels[index].name] : []
  ));

  if (!succeededChannels.length) {
    throw new Error(`Notification delivery failed for: ${failures.map((failure) => failure.channel).join(", ")}`);
  }

  return {
    succeededChannels,
    failures,
  };
}

async function handleFormSubmission(req, env, formConfig) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: {
        Allow: "POST",
      },
    });
  }

  const requestOrigin = getRequestOrigin(req);
  const allowedOrigins = getAllowedOrigins(env);
  if (!requestOrigin || !allowedOrigins.includes(requestOrigin)) {
    return new Response("Origin not allowed", { status: 403 });
  }

  const formData = await req.formData();
  const successPath = String(formData.get("success_path") || "/thank-you/");
  const returnUrl = getSafeReturnUrl(req, requestOrigin, formConfig.fallbackReturnPath);
  const clientIp = getClientIp(req);

  if (String(formData.get("company_website") || "").trim()) {
    logEvent("info", `${formConfig.eventPrefix}_honeypot_blocked`, {
      clientIp,
    });
    return Response.redirect(buildRedirectUrl(requestOrigin, successPath), 303);
  }

  const rateLimit = consumeRateLimit(clientIp);
  if (!rateLimit.allowed) {
    logEvent("error", `${formConfig.eventPrefix}_rate_limited`, {
      clientIp,
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    });
    return renderErrorPage(
      "Too many submissions",
      "Please wait a few minutes before trying again.",
      returnUrl,
      429,
      formConfig.returnLabel,
    );
  }

  const fields = collectFormFields(formData, formConfig.fieldLabels);
  const submission = buildSubmissionRecord(req, fields, formConfig);
  logEvent("info", `${submission.eventPrefix}_received`, {
    submissionId: submission.id,
    source: submission.source,
    pageUrl: submission.pageUrl,
    clientIp: submission.clientIp,
    fieldCount: submission.fields.length,
  });

  const validation = formConfig.validate(submission.payload);
  if (!validation.valid) {
    logEvent("error", `${submission.eventPrefix}_validation_failed`, {
      submissionId: submission.id,
      clientIp: submission.clientIp,
      message: validation.message,
    });
    return renderErrorPage(
      formConfig.validationTitle,
      validation.message,
      returnUrl,
      validation.status,
      formConfig.returnLabel,
    );
  }

  const notificationConfig = getNotificationChannels(env);
  for (const incompleteChannel of notificationConfig.missing) {
    logEvent("error", `${submission.eventPrefix}_config_missing`, {
      submissionId: submission.id,
      channel: incompleteChannel.channel,
      missingConfig: incompleteChannel.missingConfig,
    });
  }

  if (!notificationConfig.channels.length) {
    return renderErrorPage(
      formConfig.configErrorTitle,
      formConfig.configErrorMessage,
      returnUrl,
      500,
      formConfig.returnLabel,
    );
  }

  try {
    const notificationResult = await dispatchNotifications(notificationConfig.channels, env, submission);
    if (notificationResult.failures.length) {
      logEvent("error", `${submission.eventPrefix}_partial_delivery`, {
        submissionId: submission.id,
        succeededChannels: notificationResult.succeededChannels,
        failedChannels: notificationResult.failures.map((failure) => failure.channel),
      });
    }

    if (formConfig.eventPrefix === "terms_confirmation") {
      await storeTermsConfirmation(env, submission);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown notification error.";
    logEvent("error", `${submission.eventPrefix}_delivery_failed`, {
      submissionId: submission.id,
      clientIp: submission.clientIp,
      message,
    });
    return renderErrorPage(
      formConfig.deliveryFailureTitle,
      `The notification pipeline returned an error: ${message}`,
      returnUrl,
      502,
      formConfig.returnLabel,
    );
  }

  logEvent("info", `${submission.eventPrefix}_completed`, {
    submissionId: submission.id,
    clientIp: submission.clientIp,
  });

  let finalSuccessPath = successPath;
  if (formConfig.eventPrefix === "terms_confirmation") {
    const params = new URLSearchParams();
    params.set("full_name", submission.payload.full_name || "");
    params.set("email", submission.payload.email || "");
    params.set("terms_version", submission.termsVersion || "");
    params.set("confirmed_at", submission.submittedAt || "");
    finalSuccessPath = `${successPath}?${params.toString()}`;
  }

  return Response.redirect(buildRedirectUrl(requestOrigin, finalSuccessPath), 303);
}

async function handleTermsConfirm(req, env) {
  return handleFormSubmission(req, env, TERMS_CONFIRMATION_CONFIG);
}

async function handleContactSubmit(req, env) {
  return handleFormSubmission(req, env, CONTACT_FORM_CONFIG);
}

async function handleNewsletterSubmit(req, env) {
  return handleFormSubmission(req, env, NEWSLETTER_FORM_CONFIG);
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    if (url.pathname === "/contact-submit") {
      return handleContactSubmit(req, env);
    }

    if (url.pathname === "/newsletter-subscribe") {
      return handleNewsletterSubmit(req, env);
    }

    if (url.pathname === "/terms-confirm") {
      return handleTermsConfirm(req, env);
    }

    if (url.pathname === "/auth") {
      const originParam = url.searchParams.get("origin") || env.ALLOWED_ORIGIN;
      const normalizedOrigin = new URL(originParam).origin;
      if (normalizedOrigin !== env.ALLOWED_ORIGIN) {
        return new Response("Origin not allowed", { status: 403 });
      }

      const nonce = crypto.randomUUID();
      const state = `${nonce}|${encodeURIComponent(normalizedOrigin)}`;
      const redirect = new URL("https://github.com/login/oauth/authorize");
      redirect.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
      redirect.searchParams.set("redirect_uri", `${url.origin}/callback`);
      redirect.searchParams.set("scope", "repo");
      redirect.searchParams.set("state", state);
      return Response.redirect(redirect.toString(), 302);
    }

    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      const rawState = url.searchParams.get("state") || "";
      const parts = rawState.split("|");
      const origin = parts[1] ? decodeURIComponent(parts[1]) : "";

      if (!code || !origin || origin !== env.ALLOWED_ORIGIN) {
        return new Response("Invalid OAuth callback", { status: 400 });
      }

      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      const tokenJson = await tokenRes.json();
      if (!tokenJson.access_token) {
        return new Response(`OAuth token error: ${JSON.stringify(tokenJson)}`, { status: 400 });
      }

      const html = `<!doctype html><html><body><script>
        (function() {
          const authData = { token: "${tokenJson.access_token}", provider: "github" };
          (window.opener || window.parent).postMessage(
            "authorization:github:success:" + JSON.stringify(authData),
            "${origin}"
          );
          window.close();
        })();
      </script>Login complete.</body></html>`;

      return new Response(html, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};
