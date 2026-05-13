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
];

const CONTACT_FIELD_LABELS = new Map(KNOWN_CONTACT_FIELDS);
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
]);
const RESERVED_FORM_FIELDS = new Set(["success_path", "company_website"]);
const MAX_FORM_FIELDS = 50;
const MAX_FIELD_NAME_LENGTH = 80;
const MAX_FIELD_VALUE_LENGTH = 1200;
const TELEGRAM_TEXT_LIMIT = 4000;
const DISCORD_FIELD_VALUE_LIMIT = 1024;
const DISCORD_FIELD_NAME_LIMIT = 256;
const NOTIFICATION_SOURCE = "Website Contact Form";
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

function humanizeFieldName(name) {
  return CONTACT_FIELD_LABELS.get(name)
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

function renderErrorPage(title, message, returnUrl, status = 500) {
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
        <p><a href="${escapeHtml(returnUrl)}">Back to the inquiry form</a></p>
      </div>
    </main>
  </body>
</html>`, status);
}

function collectFormFields(formData) {
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
      label: humanizeFieldName(name),
      value,
    });
  }

  return [...fieldsByName.values()];
}

function fieldsToPayload(fields) {
  return Object.fromEntries(fields.map((field) => [field.name, field.value]));
}

function validateSubmission(payload) {
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

function buildSubmissionRecord(req, fields) {
  const referer = sanitizeText(req.headers.get("Referer"), {
    singleLine: true,
    maxLength: 500,
  });

  return {
    id: crypto.randomUUID(),
    source: NOTIFICATION_SOURCE,
    submittedAt: new Date().toISOString(),
    pageUrl: referer || "",
    clientIp: getClientIp(req),
    fields,
    notificationFields: fields.filter((field) => field.value),
    payload: fieldsToPayload(fields),
  };
}

function buildNotificationLines(submission) {
  const headerLines = [
    "New Website Form Submission",
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
    content: "New Website Form Submission",
    embeds: [
      {
        title: "New Website Form Submission",
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
  const webhookUrl = new URL(env.DISCORD_WEBHOOK_URL);
  webhookUrl.searchParams.set("wait", "true");

  const response = await fetch(webhookUrl.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildDiscordPayload(submission)),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText.slice(0, 200) || `Discord returned ${response.status}`);
  }

  return {
    status: response.status,
  };
}

function getMissingNotificationConfig(env) {
  return [
    "TELEGRAM_BOT_TOKEN",
    "TELEGRAM_CHAT_ID",
    "DISCORD_WEBHOOK_URL",
  ].filter((key) => !env[key]);
}

async function dispatchNotifications(env, submission) {
  const channels = [
    { name: "telegram", send: sendTelegramNotification },
    { name: "discord", send: sendDiscordNotification },
  ];

  const results = await Promise.allSettled(channels.map(async (channel) => {
    const result = await channel.send(env, submission);
    logEvent("info", "contact_submission_notification_succeeded", {
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

    logEvent("error", "contact_submission_notification_failed", {
      submissionId: submission.id,
      channel: failure.channel,
      message: failure.message,
    });

    return [failure];
  });

  if (failures.length) {
    throw new Error(`Notification delivery failed for: ${failures.map((failure) => failure.channel).join(", ")}`);
  }
}

async function handleContactSubmit(req, env) {
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
  const returnUrl = getSafeReturnUrl(req, requestOrigin, "/contact/");
  const clientIp = getClientIp(req);

  if (String(formData.get("company_website") || "").trim()) {
    logEvent("info", "contact_submission_honeypot_blocked", {
      clientIp,
    });
    return Response.redirect(buildRedirectUrl(requestOrigin, successPath), 303);
  }

  const rateLimit = consumeRateLimit(clientIp);
  if (!rateLimit.allowed) {
    logEvent("error", "contact_submission_rate_limited", {
      clientIp,
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    });
    return renderErrorPage(
      "Too many submissions",
      "Please wait a few minutes before trying again.",
      returnUrl,
      429,
    );
  }

  const fields = collectFormFields(formData);
  const submission = buildSubmissionRecord(req, fields);
  logEvent("info", "contact_submission_received", {
    submissionId: submission.id,
    source: submission.source,
    pageUrl: submission.pageUrl,
    clientIp: submission.clientIp,
    fieldCount: submission.fields.length,
  });

  const validation = validateSubmission(submission.payload);
  if (!validation.valid) {
    logEvent("error", "contact_submission_validation_failed", {
      submissionId: submission.id,
      clientIp: submission.clientIp,
      message: validation.message,
    });
    return renderErrorPage(
      "Please complete the required fields",
      validation.message,
      returnUrl,
      validation.status,
    );
  }

  const missingNotificationConfig = getMissingNotificationConfig(env);
  if (missingNotificationConfig.length) {
    logEvent("error", "contact_submission_config_missing", {
      submissionId: submission.id,
      missingConfig: missingNotificationConfig,
    });
    return renderErrorPage(
      "Contact notifications are not configured yet",
      "The notification backend is missing required configuration. Please try again later.",
      returnUrl,
      500,
    );
  }

  try {
    await dispatchNotifications(env, submission);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown notification error.";
    logEvent("error", "contact_submission_delivery_failed", {
      submissionId: submission.id,
      clientIp: submission.clientIp,
      message,
    });
    return renderErrorPage(
      "We could not deliver your submission",
      `The notification pipeline returned an error: ${message}`,
      returnUrl,
      502,
    );
  }

  logEvent("info", "contact_submission_completed", {
    submissionId: submission.id,
    clientIp: submission.clientIp,
  });
  return Response.redirect(buildRedirectUrl(requestOrigin, successPath), 303);
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    if (url.pathname === "/contact-submit") {
      return handleContactSubmit(req, env);
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
