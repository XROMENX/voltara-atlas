"use client";
import { useState, type FormEvent } from 'react';
import { safeReturnTo } from '../../lib/return-to';

type Mode = 'login' | 'register' | 'forgot' | 'reset';

export default function AuthForm({
  mode, returnTo, token, error: initialError,
}: { mode: Mode; returnTo?: string; token?: string; error?: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(initialError ? 'پیوند معتبر نیست یا منقضی شده است. دوباره درخواست بدهید.' : '');
  const [done, setDone] = useState(false);
  const target = safeReturnTo(returnTo);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    const data = new FormData(e.currentTarget);
    const email = String(data.get('email') || '').trim();
    const password = String(data.get('password') || '');
    let endpoint = '';
    let body: Record<string, unknown> = {};

    if (mode === 'login') {
      endpoint = 'sign-in/email';
      body = { email, password, callbackURL: target };
    } else if (mode === 'register') {
      endpoint = 'sign-up/email';
      body = { email, password, name: String(data.get('name') || '').trim() };
    } else if (mode === 'forgot') {
      endpoint = 'request-password-reset';
      body = { email, redirectTo: '/reset-password' };
    } else {
      endpoint = 'reset-password';
      body = { token, newPassword: password };
    }

    try {
      const response = await fetch('/api/auth/' + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        setMessage('درخواست انجام نشد. اطلاعات را بررسی کنید و دوباره تلاش کنید.');
        return;
      }

      // Better Auth creates a session on sign-up when email verification is not required.
      // Navigate to the originally requested protected page in both cases.
      if (mode === 'login' || mode === 'register') {
        window.location.assign(target);
        return;
      }

      setDone(true);
      setMessage(mode === 'forgot'
        ? 'اگر حسابی با این ایمیل وجود داشته باشد و ارسال ایمیل فعال باشد، پیوند بازیابی ارسال می‌شود.'
        : 'گذرواژه تغییر کرد. اکنون وارد شوید.');
    } catch {
      setMessage('ارتباط برقرار نشد. دوباره تلاش کنید.');
    } finally {
      setBusy(false);
    }
  }

  return <>
    <p>{mode === 'login'
      ? 'برای مشاهده مدل سه‌بعدی و استفاده از یادداشت‌ها وارد شوید.'
      : mode === 'register'
        ? 'حساب شخصی ولتارا بسازید و بدون تأیید ایمیل وارد شوید.'
        : mode === 'forgot'
          ? 'ایمیل حساب را وارد کنید. بازیابی گذرواژه به سرویس ایمیل فعال نیاز دارد.'
          : 'گذرواژه جدید را وارد کنید.'}</p>
    {!done && <form onSubmit={submit}>
      {mode === 'register' && <label>نام<input name="name" required maxLength={100} autoComplete="name" /></label>}
      {mode !== 'reset' && <label>ایمیل<input name="email" type="email" dir="ltr" required autoComplete="email" maxLength={254} /></label>}
      {mode !== 'forgot' && <label>گذرواژه<input name="password" type="password" dir="ltr" required minLength={mode === 'login' ? 1 : 12} maxLength={128} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />{mode !== 'login' && <small>حداقل ۱۲ نویسه</small>}</label>}
      <button disabled={busy || (mode === 'reset' && !token)}>{busy ? 'در حال انجام…' : ({ login: 'ورود', register: 'ساخت حساب', forgot: 'ارسال پیوند بازیابی', reset: 'ذخیره گذرواژه' })[mode]}</button>
    </form>}
    <p role="status" aria-live="polite">{message}</p>
    <nav>
      <a href={'/login?returnTo=' + encodeURIComponent(target)}>ورود</a>
      <a href={'/register?returnTo=' + encodeURIComponent(target)}>ساخت حساب</a>
      <a href="/forgot-password">فراموشی گذرواژه</a>
    </nav>
  </>;
}
