import { isSameOrigin, validRecord } from './validation';
import { and, desc, eq } from 'drizzle-orm';
import { getUser } from '../../auth';
import { getDb } from '../../../db';
import { records } from '../../../db/schema';
export const dynamic = 'force-dynamic';
const response = (data: unknown, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'private, no-store' } });
export async function GET(request: Request) {
  const user = await getUser();
  if (!user) return response({error:'برای ادامه وارد حساب شوید.'}, 401);
  const kind = new URL(request.url).searchParams.get('kind');
  if (kind !== 'note' && kind !== 'bookmark') return response({error:'نوع مورد نامعتبر است.'}, 400);
  try {
    const items = await getDb().select().from(records).where(and(eq(records.ownerId,user.userId),eq(records.kind,kind))).orderBy(desc(records.updatedAt)).limit(500);
    return response({items});
  } catch { return response({error:'دریافت اطلاعات ممکن نشد. دوباره تلاش کنید.'},503); }
}
export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return response({error:'برای ادامه وارد حساب شوید.'},401);
  if (!isSameOrigin(request)) return response({error:'درخواست نامعتبر است.'},403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return response({error:'قالب درخواست نامعتبر است.'},415);
  let input;
  try { const raw = await request.text(); if(raw.length>16000) return response({error:'یادداشت بیش از حد طولانی است.'},413); input=JSON.parse(raw); } catch { return response({error:'درخواست نامعتبر است.'},400); }
  if (!validRecord(input)) return response({error:'عنوان، تجهیز یا متن معتبر نیست.'},400);
  const values={kind:input.kind as 'note'|'bookmark',title:input.title.trim(),body:input.body,equipmentId:input.equipmentId,componentId:input.componentId||null,updatedAt:Date.now()};
  try {
    const db=getDb();
    if(input.id){const updated=await db.update(records).set(values).where(and(eq(records.id,input.id),eq(records.ownerId,user.userId))).returning({id:records.id}); if(!updated.length)return response({error:'مورد پیدا نشد.'},404); return response({id:input.id});}
    const id=crypto.randomUUID(); await db.insert(records).values({...values,id,ownerId:user.userId}); return response({id},201);
  }catch{return response({error:'ذخیره انجام نشد. دوباره تلاش کنید.'},503);}
}
export async function DELETE(request: Request) {
  const user=await getUser(); if(!user)return response({error:'برای ادامه وارد حساب شوید.'},401);
  if(!isSameOrigin(request))return response({error:'درخواست نامعتبر است.'},403);
  const id=new URL(request.url).searchParams.get('id'); if(!id || !/^[a-f0-9-]{36}$/.test(id))return response({error:'شناسه نامعتبر است.'},400);
  try{const deleted=await getDb().delete(records).where(and(eq(records.id,id),eq(records.ownerId,user.userId))).returning({id:records.id}); return deleted.length?response({ok:true}):response({error:'مورد پیدا نشد.'},404);}catch{return response({error:'حذف انجام نشد.'},503);}
}
