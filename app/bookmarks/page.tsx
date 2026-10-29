import { requireChatGPTUser } from '../chatgpt-auth';
import AccountShell from '../../components/account/AccountShell';
import Records from '../../components/account/Records';
export const dynamic='force-dynamic';
export default async function Bookmarks(){await requireChatGPTUser('/bookmarks');return <AccountShell title="نشانک‌های من"><Records kind="bookmark"/></AccountShell>}
