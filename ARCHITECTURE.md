# Voltara architecture

Canonical application: https://voltara-atlas.romie-m.chatgpt.site
GitHub Pages serves a forwarding page only. GitHub contains the application source; Sites builds the Worker deployment.

## Boundaries
- TypeScript/React application: catalogue, accounts, personal records.
- Preserved Three.js transformer module: public/transformer; original geometry and referenced technical content retained.
- Managed identity: trusted Sites ingress headers; never deploy this authentication adapter behind an untrusted proxy that accepts client-supplied identity headers.
- D1: user-owned records. Each query/mutation must scope by authenticated identity. No passwords in application storage.
- No model assets or credentials stored in private notes cache; viewer service worker disabled in this distribution.

## Release and verification
Run TypeScript checks, account authorization tests, model syntax checks and production build before publication. Check live catalogue, component navigation and sign-in flow. Migrations are append-only after application. Restore code by redeploying a known source revision; database restore is separate and must be rehearsed before wider launch.

## Content governance
The transformer remains an illustrative educational model, not a manufacturer-certified digital twin. Preserve source references and attribution. A qualified electrical reviewer must approve technical changes; software tests cannot certify electrical accuracy. Add a second equipment module only once it has stable component IDs, bilingual names, reference provenance, a text alternative and module-specific asset loading.

## Remaining operational work
Real device performance/accessibility audits, external-user identity acceptance tests, backup restore drill, independent technical review and alerting policy require explicit verification before broad production use. No claim of certification or exhaustive audit is made.
