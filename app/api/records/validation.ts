import {componentCatalogue} from '../../../components/account/component-catalogue.ts';
export function isSameOrigin(request: Request): boolean {
  return request.headers.get('origin') === new URL(request.url).origin && request.headers.get('sec-fetch-site') !== 'cross-site';
}
export function validRecord(input: unknown): input is {id?:string;kind:'note'|'bookmark';title:string;body:string;equipmentId:'power-transformer';componentId?:string|null} {
  if (!input || typeof input !== 'object') return false;
  const value=input as Record<string, unknown>;
  return ['note','bookmark'].includes(String(value.kind)) && typeof value.title==='string' && Boolean(value.title.trim()) && value.title.length<=160 && typeof value.body==='string' && value.body.length<=10000 && value.equipmentId==='power-transformer' && (value.componentId==null || (typeof value.componentId==='string' && componentCatalogue.some(part=>part.id===value.componentId))) && (value.id==null || (typeof value.id==='string' && /^[a-f0-9-]{36}$/.test(value.id)));
}
