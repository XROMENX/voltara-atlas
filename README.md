# Voltara Atlas | ولتارا

A modular, Persian-first electrical equipment atlas. The initial Power Transformer module opens the existing, independently maintained atlas at https://xromenx.github.io/power-transformer-altlas/.

## Source

Based on the visual language and module concept of https://github.com/XROMENX/power-transformer-altlas (reviewed v14). The existing application's code and assets are not duplicated. The hub uses a new schematic illustration and retains the dark sage visual palette, Persian RTL layout, and technical editorial style.

## Structure

- `dist/index.html`: homepage and featured transformer module
- `dist/style.css`: responsive styling
- `dist/modules.js`: module registry
- `dist/app.js`: registry rendering
- `dist/icon.svg`: brand mark

No dependencies or build step. Serve `dist` using any static server. For example: `python3 -m http.server 8080 --directory dist`.

## Adding a module

Add an object to `dist/modules.js` with a unique `id`, Persian `title`, `english` label, and `symbol`. Set `status: 'planned'` until its site is ready. To activate it, set `status: 'available'` and supply its `url`. Active modules render as links automatically; planned modules remain non-interactive. The active module count updates automatically. The Power Transformer remains the featured module; its URL is sourced from the registry.

Switchgear, electric machines, and protection/control are illustrative future topics, not implemented tools or commitments.

## GitHub Pages

A workflow is included to publish `dist` when pushed to `main`. In repository Settings → Pages, choose GitHub Actions as the source. The hub links to the original transformer site in the same tab; browser Back returns to the hub. No iframe or cross-origin dependency is required.

## Brand

Voltara Atlas / ولتارا. Working brand name; no trademark or domain availability claim is made.
