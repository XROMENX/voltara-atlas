import AccountShell from '../../components/account/AccountShell';
import AuthForm from '../../components/account/AuthForm';
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<{returnTo?:string;token?:string;error?:string}>}){const params=await searchParams;return <AccountShell auth title="ساخت حساب"><section className="account-panel"><AuthForm mode="register" {...params}/></section></AccountShell>;}
