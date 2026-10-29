import './account.css';

type AccountShellProps = {
  title: string;
  children: React.ReactNode;
  auth?: boolean;
};

export default function AccountShell({ title, children, auth = false }: AccountShellProps) {
  return (
    <div className={'account-shell' + (auth ? ' account-shell--auth' : '')} dir="rtl">
      <header className="account-topbar">
        <a className="account-brand" href="/" aria-label="ولتارا، صفحه اصلی">
          <span className="account-brand-icon" aria-hidden="true">ϟ</span>
          <span>ولتارا <small dir="ltr">VOLTARA ATLAS</small></span>
        </a>
        <nav aria-label="ناوبری حساب">
          {!auth && <><a href="/notes">یادداشت‌ها</a><a href="/bookmarks">نشانک‌ها</a><a href="/account">حساب من</a></>}
          <a className="account-home-link" href="/">بازگشت به اطلس <span aria-hidden="true">←</span></a>
        </nav>
      </header>

      {auth ? (
        <main id="main" className="account-auth-layout">
          <aside className="account-auth-feature" aria-label="درباره ولتارا">
            <div className="auth-feature-orbit auth-feature-orbit--one" aria-hidden="true" />
            <div className="auth-feature-orbit auth-feature-orbit--two" aria-hidden="true" />
            <div className="auth-feature-inner">
              <span className="auth-feature-kicker"><span className="auth-feature-dot" /> اطلس تعاملی تجهیزات برق</span>
              <div className="auth-feature-visual" aria-hidden="true">
                <span className="auth-visual-ring auth-visual-ring--one" />
                <span className="auth-visual-ring auth-visual-ring--two" />
                <span className="auth-visual-core">ϟ</span>
                <span className="auth-visual-node auth-visual-node--one" />
                <span className="auth-visual-node auth-visual-node--two" />
                <span className="auth-visual-node auth-visual-node--three" />
              </div>
              <p className="auth-feature-eyebrow" dir="ltr">EXPLORE · LEARN · MASTER</p>
              <h2>دنیای تجهیزات برق،<br /><span>از زاویه‌ای تازه.</span></h2>
              <p className="auth-feature-description">مدل‌های سه‌بعدی را کاوش کنید، جزئیات فنی را بشناسید و یادداشت‌های خود را در یک فضای شخصی نگه دارید.</p>
              <div className="auth-feature-tags"><span>مدل سه‌بعدی</span><span>منابع فنی</span><span>یادگیری تعاملی</span></div>
            </div>
          </aside>
          <div className="account-auth-content">
            <div className="account-auth-content-inner">
              <a className="auth-back-link" href="/">← بازگشت به صفحه اصلی</a>
              <div className="auth-page-heading">
                <p className="auth-page-kicker">به ولتارا خوش آمدید</p>
                <h1>{title}</h1>
              </div>
              {children}
              <p className="auth-footnote">VOLTARA ATLAS <span aria-hidden="true">·</span> اطلس تخصصی تجهیزات برق</p>
            </div>
          </div>
        </main>
      ) : (
        <main id="main" className="account-dashboard-main">
          <div className="account-page-heading">
            <a className="auth-back-link" href="/">← کتابخانه تجهیزات</a>
            <h1>{title}</h1>
          </div>
          {children}
        </main>
      )}
    </div>
  );
}
