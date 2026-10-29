# Voltara architecture

React/TypeScript pages and APIs run in a Cloudflare Worker using Vinext. The standalone build uses the Cloudflare Vite plugin and no Sites runtime plugin.

Better Auth handles email/password accounts, verification, recovery and cookie sessions. Database-backed rate limiting uses Cloudflare's trusted cf-connecting-ip header. Secrets belong in Worker settings. Resend delivers verification and reset links. Users must verify their email before signing in.

D1 stores authentication tables and user_records. Each notes/bookmarks query scopes ownership by the validated session user ID. Forged oai-authenticated-user-* headers grant no access. Deleting personal records preserves the independent login account.

All asset requests run through worker/independent.ts. The /transformer/ prefix requires a session, including model JavaScript, vendor assets and HTML. Responses from that prefix are private/no-store. Only font and reference manual aliases are public; /catalog.html is a static text alternative. No viewer service worker is registered. The original externally hosted/public copies remain outside this access boundary.

Deployment applies checked-in migrations before publishing. D1_DATABASE_ID is supplied by the owner's build configuration; auth and mail credentials are runtime secrets. See DEPLOY.md for setup and live acceptance checks.

Technical content and model geometry remain educational, not manufacturer certification. Electrical review, real-device WebGL performance testing, live mail acceptance, monitoring and database restore drills remain operational follow-up work.
