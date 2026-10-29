export function safeReturnTo(value: string | null | undefined): string {
 if (!value || !value.startsWith('/') || value.startsWith('//')) return '/account';
 try { const url = new URL(value, 'https://voltara.invalid');
 if (url.origin !== 'https://voltara.invalid' || /^\/(login|register|reset-password|forgot-password|api\/auth)(\/|$)/.test(url.pathname)) return '/account';
 return url.pathname + url.search + url.hash;
 } catch { return '/account'; }
}
