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
| RESEND_API_KEY | Secret | Your Resend sending API key |
| EMAIL_FROM | Text | Verified sender, e.g. Voltara <accounts@your-domain.example> |

Save/deploy the settings. This repository sets keep_vars=true to preserve dashboard runtime variables on redeployment. Check settings after deployment.

Registration requires email verification. Configure Resend and a verified sender domain before inviting users. Resend's test sender only supports its permitted test recipient; it is not suitable for general registrations. A custom site domain is optional; a verified email sending domain is required for ordinary production email delivery.

Use a Workers plan/CPU budget appropriate for password hashing. Measure sign-up and sign-in in staging: the free CPU allowance may be insufficient for Better Auth's password hashing. Do not weaken password hashing to fit it.

## 4. Verify before announcing

- Homepage and /catalog.html open without login.
- /transformer/ redirects to login; direct /transformer/app.js returns 401 without a session.
- Create an account, follow the email verification link, sign in and open the model.
- Create/edit/delete notes and bookmarks. A second account must not see them.
- Reset the password, confirm old sessions stop working, then sign out.

The build and automated local tests do not verify your live email-provider configuration.

## Existing data and public copies

Old notes/bookmarks live in the previous Sites database, not this new database. Export them before retiring that deployment. Never automatically match an old user to a new user using an unverified email address.

The original transformer site, GitHub Pages and public repository remain independently accessible. This new login gate does not remove earlier public copies. Update the GitHub Pages handoff URL only after the Cloudflare URL is known and verified.

## Local development

`pnpm install --frozen-lockfile`
`pnpm run db:local`
Create ignored `.dev.vars` with the four runtime settings above (use http://localhost:5173 locally).
`pnpm run dev`

For a compiled local Worker use `pnpm run build`, then `pnpm run start`. Apply migrations to the same local persistence directory. Never commit .dev.vars or email credentials.
