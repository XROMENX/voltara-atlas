'use client';

import { useState, type FormEvent } from 'react';
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { safeReturnTo } from '../../lib/return-to';

type Mode = 'login' | 'register' | 'forgot' | 'reset';
type Notice = { kind: 'error' | 'success'; text: string } | null;

const labels: Record<Mode, string> = {
  login: 'ورود به حساب',
  register: 'ساخت حساب کاربری',
  forgot: 'ارسال لینک بازیابی',
  reset: 'ثبت گذرواژه جدید',
};

export default function AuthForm({
  mode, returnTo, token, error: initialError,
}: { mode: Mode; returnTo?: string; token?: string; error?: string }) {
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState<Notice>(initialError
    ? { kind: 'error', text: 'این لینک معتبر نیست یا اعتبار آن به پایان رسیده است. لطفاً دوباره درخواست دهید.' }
    : null);
  const [done, setDone] = useState(false);
  const target = safeReturnTo(returnTo);
  const loginUrl = '/login?returnTo=' + encodeURIComponent(target);
  const registerUrl = '/register?returnTo=' + encodeURIComponent(target);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setNotice(null);

    const data = new FormData(e.currentTarget);
    const email = String(data.get('email') || '').trim();
    const password = String(data.get('password') || '');
    let endpoint: string;
    let body: Record<string, unknown>;

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
        const text = response.status === 429
          ? 'تعداد درخواست‌ها زیاد بوده است. لطفاً کمی بعد دوباره تلاش کنید.'
          : mode === 'login'
            ? 'ایمیل یا گذرواژه درست نیست. دوباره تلاش کنید.'
            : mode === 'register'
              ? 'ساخت حساب انجام نشد. اطلاعات را بررسی کنید یا با ایمیل دیگری تلاش کنید.'
              : mode === 'forgot'
                ? 'ارسال لینک بازیابی انجام نشد. لطفاً دوباره تلاش کنید.'
                : 'تغییر گذرواژه انجام نشد. لینک بازیابی را بررسی کنید.';
        setNotice({ kind: 'error', text });
        return;
      }

      if (mode === 'login' || mode === 'register') {
        window.location.assign(target);
        return;
      }

      setDone(true);
      setNotice({
        kind: 'success',
        text: mode === 'forgot'
          ? 'اگر حسابی با این ایمیل وجود داشته باشد، لینک بازیابی برای آن ارسال می‌شود.'
          : 'گذرواژه شما تغییر کرد. اکنون می‌توانید وارد حساب شوید.',
      });
    } catch {
      setNotice({ kind: 'error', text: 'ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی و دوباره تلاش کنید.' });
    } finally {
      setBusy(false);
    }
  }

  const intro = {
    login: 'برای دسترسی به مدل‌های سه‌بعدی، یادداشت‌ها و نشان‌شده‌های شخصی خود وارد شوید.',
    register: 'به ولتارا بپیوندید و مسیر یادگیری و یادداشت‌های فنی خود را یک‌جا نگه دارید.',
    forgot: 'ایمیل حساب خود را وارد کنید تا لینک بازیابی گذرواژه برای شما ارسال شود.',
    reset: 'یک گذرواژه جدید و امن برای حساب خود انتخاب کنید.',
  }[mode];

  return (
    <>
      <p className="auth-intro-text">{intro}</p>

      {(mode === 'login' || mode === 'register') && (
        <nav className="auth-switch" aria-label="انتخاب نوع دسترسی">
          <a href={loginUrl} aria-current={mode === 'login' ? 'page' : undefined}>ورود</a>
          <a href={registerUrl} aria-current={mode === 'register' ? 'page' : undefined}>ثبت‌نام</a>
        </nav>
      )}

      {!done && (
        <form className="account-auth-form" onSubmit={submit}>
          {mode === 'register' && (
            <div className="auth-field">
              <label className="auth-field-label" htmlFor="auth-name">نام و نام خانوادگی</label>
              <span className="auth-input-wrap">
                <UserRound className="auth-input-icon" size={18} aria-hidden="true" />
                <input className="auth-input auth-input--rtl" id="auth-name" name="name" type="text"
                  autoComplete="name" placeholder="نام شما" required maxLength={100} />
              </span>
            </div>
          )}

          {mode !== 'reset' && (
            <div className="auth-field">
              <label className="auth-field-label" htmlFor="auth-email">ایمیل</label>
              <span className="auth-input-wrap">
                <Mail className="auth-input-icon" size={18} aria-hidden="true" />
                <input className="auth-input" id="auth-email" name="email" type="email"
                  inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false}
                  placeholder="name@example.com" required maxLength={254} />
              </span>
            </div>
          )}

          {mode !== 'forgot' && (
            <div className="auth-field">
              <label className="auth-field-label" htmlFor="auth-password">{mode === 'reset' ? 'گذرواژه جدید' : 'گذرواژه'}</label>
              <span className="auth-input-wrap">
                <LockKeyhole className="auth-input-icon" size={18} aria-hidden="true" />
                <input className="auth-input auth-input--password" id="auth-password" name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  placeholder={mode === 'login' ? 'گذرواژه خود را وارد کنید' : 'حداقل ۱۲ نویسه'}
                  required minLength={mode === 'login' ? 1 : 12} maxLength={128} />
                <button className="auth-password-toggle" type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'پنهان کردن گذرواژه' : 'نمایش گذرواژه'}
                  aria-pressed={showPassword}>
                  {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
              </span>
              {mode !== 'login' && <span className="auth-hint">برای امنیت حساب، گذرواژه باید حداقل ۱۲ نویسه داشته باشد.</span>}
            </div>
          )}

          {mode === 'login' && (
            <div className="auth-form-support">
              <a className="auth-inline-link" href="/forgot-password">گذرواژه را فراموش کرده‌اید؟</a>
            </div>
          )}

          <button className="auth-submit" type="submit" disabled={busy || (mode === 'reset' && !token)}>
            {busy ? 'در حال پردازش…' : labels[mode]}
            {!busy && <ArrowLeft size={17} aria-hidden="true" />}
          </button>
        </form>
      )}

      {notice && (
        <p className={'auth-feedback auth-feedback--' + notice.kind}
          role={notice.kind === 'error' ? 'alert' : 'status'} aria-live="polite">
          {notice.text}
        </p>
      )}

      {mode === 'reset' && !token && !done && (
        <p className="auth-feedback auth-feedback--error" role="alert">
          لینک بازیابی موجود نیست. لطفاً از صفحه فراموشی گذرواژه یک لینک جدید دریافت کنید.
        </p>
      )}

      <div className="auth-panel-footer">
        {mode === 'login' ? <>هنوز حساب ندارید؟ <a href={registerUrl}>ثبت‌نام کنید</a></>
          : mode === 'register' ? <>قبلاً ثبت‌نام کرده‌اید؟ <a href={loginUrl}>وارد شوید</a></>
            : <>بازگشت به <a href={loginUrl}>صفحه ورود</a></>}
      </div>
    </>
  );
}
