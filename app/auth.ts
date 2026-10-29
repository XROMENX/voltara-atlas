import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAuth } from '../lib/auth';
import { safeReturnTo } from '../lib/return-to';
export async function getUser() {
 const session = await getAuth().api.getSession({headers: await headers()});
 return session ? {userId: session.user.id, email: session.user.email, displayName: session.user.name} : null;
}
export async function requireUser(returnTo: string) {
 const user = await getUser();
 if (!user) redirect('/login?returnTo='+encodeURIComponent(safeReturnTo(returnTo)));
 return user;
}
