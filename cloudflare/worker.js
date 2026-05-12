const CONTACT_FIELDS = [
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

  if (String(formData.get("company_website") || "").trim()) {
    return Response.redirect(buildRedirectUrl(requestOrigin, successPath), 303);
  }

  const payload = {};
  for (const [name] of CONTACT_FIELDS) {
    payload[name] = String(formData.get(name) || "").trim();
  }

  const missingRequired = [...REQUIRED_CONTACT_FIELDS].filter((field) => !payload[field]);
  if (missingRequired.length) {
    return renderErrorPage(
      "Please complete the required fields",
      "Some required information is missing. Please go back and try again.",
      returnUrl,
      400,
    );
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_FROM_EMAIL) {
    return renderErrorPage(
      "Contact form is not configured yet",
      "The inquiry backend is missing its email configuration. Please use the direct email address for now.",
      returnUrl,
      500,
    );
  }

  const subjectContext = [payload.event, payload.company].filter(Boolean).join(" / ");
  const subject = subjectContext ? `Website inquiry: ${subjectContext}` : "Website inquiry";

  const textLines = [
    "New website inquiry",
    "",
    ...CONTACT_FIELDS.map(([name, label]) => `${label}: ${payload[name] || "-"}`),
  ];

  const htmlRows = CONTACT_FIELDS.map(([name, label]) => `
    <tr>
      <td style="padding:10px 14px;border:1px solid #d8dee8;font-weight:600;background:#f8fafc;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:10px 14px;border:1px solid #d8dee8;vertical-align:top;">${escapeHtml(payload[name] || "-").replace(/\n/g, "<br>")}</td>
    </tr>
  `).join("");

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL,
      to: [env.CONTACT_TO_EMAIL || "america@interesting.global"],
      reply_to: payload.email,
      subject,
      text: textLines.join("\n"),
      html: `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:32px;background:#f4f7fb;font-family:Inter,Arial,sans-serif;color:#0f172a;">
    <table role="presentation" style="width:100%;max-width:760px;margin:0 auto;border-collapse:collapse;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 18px 44px rgba(15,23,42,.08);">
      <tr>
        <td style="padding:28px 32px 12px;">
          <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#64748b;">Interesting America</p>
          <h1 style="margin:0;font-size:30px;line-height:1.05;font-weight:600;letter-spacing:-.04em;">New website inquiry</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 32px 32px;">
          <table role="presentation" style="width:100%;border-collapse:collapse;">
            ${htmlRows}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
    }),
  });

  if (!resendResponse.ok) {
    const resendError = await resendResponse.text();
    return renderErrorPage(
      "We could not send your inquiry",
      `The email provider returned an error: ${resendError.slice(0, 180)}`,
      returnUrl,
      502,
    );
  }

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
