import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import * as orm from 'drizzle-orm';
import * as core from 'drizzle-orm/sqlite-core';
import { drizzle } from 'drizzle-orm/sqlite-proxy';
import { isSameOrigin, validRecord } from '../app/api/records/validation.ts';
function compile(path, imports) {
  const source=ts.transpileModule(readFileSync(new URL(path,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const exports={};
  runInNewContext(source,{exports,require:(name)=>{if(!(name in imports))throw new Error(`Unexpected import ${name}`);return imports[name];},Response,Request,URL,crypto,Date,JSON});
  return exports;
}
test('API enforces user ownership with a real SQLite database',async()=>{
  const sqlite=new DatabaseSync(':memory:');
  sqlite.exec(readFileSync(new URL('../drizzle/0000_last_arachne.sql',import.meta.url),'utf8'));
  const schema=compile('../db/schema.ts',{'drizzle-orm/sqlite-core':core});
  const db=drizzle(async(sql,params,method)=>{
    const statement=sqlite.prepare(sql);statement.setReturnArrays(true);
    if(method==='run'){statement.run(...params);return {rows:[]};}
    const rows=statement.all(...params);return {rows:method==='get'?rows[0]:rows};
  },{schema});
  let user=null;
  const route=compile('../app/api/records/route.ts',{'./validation':{isSameOrigin,validRecord},'drizzle-orm':orm,'../../auth':{getUser:async()=>user},'../../../db':{getDb:()=>db},'../../../db/schema':schema});
  const origin='https://voltara.test';
  const req=(method,payload,id)=>new Request(`${origin}/api/records?kind=note${id?'&id='+id:''}`,{method,headers:{origin,'content-type':'application/json'},...(payload?{body:JSON.stringify(payload)}:{})});
  const payload={kind:'note',title:'Test note',body:'Only owner A',equipmentId:'power-transformer',componentId:'core'};
  assert.equal((await route.GET(req('GET'))).status,401);
  assert.equal((await route.POST(req('POST',payload))).status,401);
  user={userId:'owner-a'};
  const created=await route.POST(req('POST',payload));assert.equal(created.status,201);const {id}=await created.json();
  assert.equal((await (await route.GET(req('GET'))).json()).items.length,1);
  user={userId:'owner-b'};
  assert.equal((await (await route.GET(req('GET'))).json()).items.length,0);
  assert.equal((await route.POST(req('POST',{...payload,id,body:'stolen'}))).status,404);
  assert.equal((await route.DELETE(req('DELETE',null,id))).status,404);
  user={userId:'owner-a'};
  assert.equal((await route.POST(req('POST',{...payload,id,body:'edited'}))).status,200);
  assert.equal((await (await route.GET(req('GET'))).json()).items[0].body,'edited');
  const cross=new Request(`${origin}/api/records`,{method:'POST',headers:{origin:'https://other.test','content-type':'application/json'},body:JSON.stringify(payload)});
  assert.equal((await route.POST(cross)).status,403);
  assert.equal((await route.DELETE(req('DELETE',null,id))).status,200);
  assert.equal((await (await route.GET(req('GET'))).json()).items.length,0);
  sqlite.close();
});
