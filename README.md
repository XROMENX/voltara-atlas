# Voltara Atlas | ولتارا

Persian electrical equipment atlas with a server-rendered catalogue, integrated Three.js transformer, managed sign-in, and private database-backed notes/bookmarks.

Canonical full application: https://voltara-atlas.romie-m.chatgpt.site

## Stack
TypeScript, React, Vinext (Next.js-compatible routing), Cloudflare Workers and D1. Sites supplies trusted identity; deploy behind its authenticated ingress. Do not expose this Worker directly while trusting arbitrary identity headers.

## Development
`npm run dev` starts local development. `npm run build` builds the application. `node --experimental-strip-types --test tests/account-validation.test.mjs` checks input and origin rules. `npx tsc --noEmit` checks types. `node public/transformer/tests/explosion.mjs` checks geometry.

Set the hosting manifest D1 binding to `DB`. SQL migrations in `drizzle/` are applied by Sites during publication. Local development requires applying migrations with Wrangler; see ARCHITECTURE.md for release and review boundaries.

## Adding equipment
Add metadata to `lib/equipment.ts`; add the module's assets, component IDs, references and text alternative. Catalogue rendering is server-side. Heavy transformer code loads only on its module page.

## Identity
Visitors use ChatGPT sign-in. Notes/bookmarks APIs require identity and scope all records by the authenticated owner. Writes also validate origin and input. Account deletion removes Voltara records, not the external ChatGPT account. Passwords are never collected by this application.

## Transformer provenance
Preserved source: https://github.com/XROMENX/power-transformer-altlas at 6ce5a08eec00170ecc7b60b4ae03bf3d9159b063. Geometry, technical reference and creator attribution retained. Educational model; not manufacturer-certified. Service-worker registration is disabled in this integrated version to avoid caching account data. Text catalogue works without WebGL.

## Hosting
GitHub Pages cannot execute the account backend. Its publication directory is `pages-redirect/`, containing a link to the full application. The source repository includes the full backend and frontend; Sites owns production builds and migrations.
