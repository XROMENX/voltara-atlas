# Migration status

Independent login, registration, verification, reset, logout, private records and protected model routes are implemented. Standalone Cloudflare build and D1 migrations are included. See DEPLOY.md for owner account setup.

The GitHub source and the currently published Sites instance are separate. Publishing source to GitHub does not migrate old database records or replace the existing Sites deployment. Keep it available until any needed records are exported and transferred with verified ownership.
