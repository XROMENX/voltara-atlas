import { requireUser } from '../auth';
import AccountShell from '../../components/account/AccountShell';
import Records from '../../components/account/Records';
export const dynamic='force-dynamic';
export default async function Notes(){await requireUser('/notes');return <AccountShell title="یادداشت‌های من"><Records kind="note"/></AccountShell>}
