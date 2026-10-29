import AccountShell from '../../components/account/AccountShell';
import AuthForm from '../../components/account/AuthForm';
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<{returnTo?:string;token?:string;error?:string}>}){const params=await searchParams;return <AccountShell title="گذرواژه جدید"><section className="account-panel"><AuthForm mode="reset" {...params}/></section></AccountShell>;}
