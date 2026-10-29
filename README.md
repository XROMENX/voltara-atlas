# Voltara Atlas

Persian RTL electrical equipment atlas with a preserved Three.js power-transformer viewer, text catalogue, independent email/password accounts, private notes and bookmarks.

Stack: TypeScript, React, Vinext, Cloudflare Workers, D1 and Better Auth. Runtime authentication no longer trusts ChatGPT headers. Email verification and recovery use Resend.

Follow [DEPLOY.md](DEPLOY.md) for exact Cloudflare build, database and secret settings.

The homepage and catalogue are public. The Worker validates a session before serving anything under /transformer/. All assets route through the Worker. The model geometry remains unchanged.

Checks: `pnpm run typecheck`; `node --experimental-strip-types --test tests/*.test.mjs`; `pnpm run build`.

The existing Sites deployment stays on its previously published version until deliberately retired. Existing user data is not automatically migrated.
