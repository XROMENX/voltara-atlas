import handler from 'vinext/server/fetch-handler';
import { getAuth } from '../lib/auth';
export default {
  async fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    let path: string;
    try { path = decodeURIComponent(url.pathname); } catch { return new Response('Invalid path', {status:400}); }
    // Generated CSS and JavaScript are public build assets, not application routes.
    // run_worker_first also sends these requests here, so serve them explicitly.
    if (path.startsWith('/_next/static/')) return env.ASSETS.fetch(request);
    const publicAssets: Record<string,string> = {'/fonts/vazir.woff2':'/transformer/vendor/vazir.woff2','/reference-manual.pdf':'/transformer/reference-manual.pdf'};
    if (publicAssets[path]) return env.ASSETS.fetch(new Request(new URL(publicAssets[path],url),request));
    if (path === '/transformer' || path.startsWith('/transformer/')) {
      const session = await getAuth().api.getSession({headers: request.headers});
      if (!session) {
        if (request.headers.get('Sec-Fetch-Dest') === 'document' || request.headers.get('Accept')?.includes('text/html')) {
          return new Response(null, {status: 303, headers: {Location: `/login?returnTo=${encodeURIComponent(url.pathname + url.search)}`, 'Cache-Control': 'private, no-store'}});
        }
        return new Response('Authentication required', {status: 401, headers: {'Cache-Control': 'private, no-store'}});
      }
      const asset = await env.ASSETS.fetch(request);
      const response = new Response(asset.body, asset);
      response.headers.set('Cache-Control', 'private, no-store');
      return response;
    }
    return handler.fetch(request, env, ctx);
  }
};
