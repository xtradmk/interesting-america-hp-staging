export default {
  async fetch(req, env) {
    const url = new URL(req.url);

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
