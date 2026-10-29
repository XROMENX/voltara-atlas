import {requireChatGPTUser,chatGPTSignOutPath} from '../chatgpt-auth';
import AccountShell from '../../components/account/AccountShell';
import DeleteData from '../../components/account/DeleteData';
export const dynamic='force-dynamic';
export default async function Account(){const user=await requireChatGPTUser('/account');return <AccountShell title="حساب من"><section className="account-panel"><h2>{user.displayName}</h2><p dir="ltr">{user.email}</p><p>یادداشت‌ها و نشانک‌های شما به همین حساب متصل‌اند. برای تغییر اطلاعات ورود یا بازیابی حساب، تنظیمات ChatGPT را استفاده کنید.</p><div className="account-actions"><a href="/notes">یادداشت‌های من</a><a href="/bookmarks">نشانک‌های من</a><a href={chatGPTSignOutPath('/login')} target="_top">خروج از حساب</a></div></section><DeleteData/></AccountShell>}
