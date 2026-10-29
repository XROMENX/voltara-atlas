import {requireUser} from '../auth';
import AccountShell from '../../components/account/AccountShell';
import DeleteData from '../../components/account/DeleteData';
import SignOut from '../../components/account/SignOut';
export const dynamic='force-dynamic';
export default async function Account(){const user=await requireUser('/account');return <AccountShell title="حساب من"><section className="account-panel"><h2>{user.displayName}</h2><p dir="ltr">{user.email}</p><div className="account-actions"><a href="/notes">یادداشت‌های من</a><a href="/bookmarks">نشانک‌های من</a><a href="/forgot-password">تغییر گذرواژه</a><SignOut/></div></section><DeleteData/></AccountShell>;}
