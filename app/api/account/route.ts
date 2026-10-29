import { eq } from 'drizzle-orm';
import { getUser } from '../../auth';
import { getDb } from '../../../db';
import { records } from '../../../db/schema';
export const dynamic='force-dynamic';
export async function DELETE(request: Request){
 const user=await getUser(); if(!user)return Response.json({error:'ورود لازم است.'},{status:401});
 if(request.headers.get('origin')!==new URL(request.url).origin || request.headers.get('x-confirm-delete')!=='delete-my-voltara-data')return Response.json({error:'درخواست نامعتبر است.'},{status:403});
 try{await getDb().delete(records).where(eq(records.ownerId,user.userId));return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'حذف انجام نشد. دوباره تلاش کنید.'},{status:503});}
}
