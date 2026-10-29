# Deploy Voltara to your own Cloudflare account

## 1. Create the database

Cloudflare dashboard → Storage & databases → D1 → Create database.
Name: `voltara-production`. Copy its Database ID (UUID).

## 2. Connect the GitHub repository to Workers Builds

Use XROMENX/voltara-atlas, branch main, project name voltara-atlas.

| Setting | Value |
|---|---|
| Root directory | / |
| Build command | pnpm run build |
| Deploy command | pnpm run deploy |
| Preview deploy command | leave blank / disable previews initially |
| Build variable D1_DATABASE_ID | UUID from step 1 |
| Build variable NODE_VERSION | 22 |

The deploy script applies D1 migrations and deploys the compiled Worker. The build's Cloudflare API token needs Workers Scripts:Edit and D1:Edit for this account. If migration fails with a permission error, edit the build API token permissions; do not remove the migration step.

The all-zero database ID in wrangler.jsonc is for local development only. The deploy script requires and injects your real ID into the compiled configuration.

## 3. Configure the deployed Worker's runtime variables and secrets

Workers & Pages → voltara-atlas → Settings → Variables and Secrets.
These are runtime settings, separate from the build variable above.

| Name | Type | Value |
|---|---|---|
| BETTER_AUTH_URL | Text | Exact HTTPS Worker URL, e.g. https://voltara-atlas.YOUR-SUBDOMAIN.workers.dev |
| BETTER_AUTH_SECRET | Secret | Generate locally with `openssl rand -base64 32`; keep private |
| RESEND_API_KEY | Secret | Optional for signup/login; required for password-reset email |
| EMAIL_FROM | Text | Optional for signup/login; required for password-reset email (verified sender) |

Save/deploy the settings. This repository sets keep_vars=true to preserve dashboard runtime variables on redeployment. Check settings after deployment.

Registration and login do not require email verification or a sending domain. Newly registered users receive an authenticated session immediately. Resend remains wired for optional password-reset emails, but password recovery for general users will not work until RESEND_API_KEY and EMAIL_FROM are configured with a verified sender domain. Resend's test sender supports only its permitted test recipient. A custom site domain is optional; a verified sending domain is required for ordinary production emails. Never use an unverified email address to assign privileged roles or to recover a user's account.

Use a Workers plan/CPU budget appropriate for password hashing. Measure sign-up and sign-in in staging: the free CPU allowance may be insufficient for Better Auth's password hashing. Do not weaken password hashing to fit it.

## 4. Verify before announcing

- Homepage and /catalog.html open without login.
- /transformer/ redirects to login; direct /transformer/app.js returns 401 without a session.
- Create an account without an email message, confirm the session opens the model, sign out and confirm a direct model URL is denied. Confirm a subsequent sign-in works.
- Create/edit/delete notes and bookmarks. A second account must not see them.
- When a verified email sender is available, reset the password and confirm old sessions stop working; until then, warn users that self-service password recovery is unavailable.

The build and automated local tests do not verify your live email-provider configuration.

## Existing data and public copies

Old notes/bookmarks live in the previous Sites database, not this new database. Export them before retiring that deployment. Never automatically match an old user to a new user using an unverified email address.

The original transformer site, GitHub Pages and public repository remain independently accessible. This login gate protects this Cloudflare deployment, not public copies of the source. Its transformer service worker deliberately does not cache model assets offline so every request passes through the Worker authentication check. Update the GitHub Pages handoff URL only after the Cloudflare URL is known and verified.

## Local development

`pnpm install --frozen-lockfile`
`pnpm run db:local`
Create ignored `.dev.vars` with BETTER_AUTH_URL and BETTER_AUTH_SECRET (use http://localhost:5173 locally); add RESEND_API_KEY and EMAIL_FROM to test password recovery.
`pnpm run dev`

For a compiled local Worker use `pnpm run build`, then `pnpm run start`. Apply migrations to the same local persistence directory. Never commit .dev.vars or email credentials.
