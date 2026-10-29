import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';
test('the Worker gates direct and encoded model asset URLs before accessing storage',async()=>{
 const exports={};let session=null,reads=0;
 const imports={'vinext/server/fetch-handler':{default:{fetch:async()=>new Response('public app')}},'../lib/auth':{getAuth:()=>({api:{getSession:async()=>session}})}};
 const code=ts.transpileModule(readFileSync(new URL('../worker/independent.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 runInNewContext(code,{exports,require:name=>imports[name],Request,Response,URL,decodeURIComponent});
 const env={ASSETS:{fetch:async()=>{reads++;return new Response('model');}}};
 for(const path of ['/transformer/app.js','/transformer/','/%74ransformer/app.js','/transformer%2Fapp.js']){
 const response=await exports.default.fetch(new Request('https://voltara.test'+path),env,{});assert.equal(response.status,401);assert.equal(reads,0);
 }
 const navigation=await exports.default.fetch(new Request('https://voltara.test/transformer/',{headers:{Accept:'text/html'}}),env,{});assert.equal(navigation.status,303);assert.match(navigation.headers.get('location'),/^\/login\?returnTo=/);
 session={user:{id:'valid-user'}};
 const allowed=await exports.default.fetch(new Request('https://voltara.test/transformer/app.js'),env,{});assert.equal(allowed.status,200);assert.equal(reads,1);assert.equal(allowed.headers.get('cache-control'),'private, no-store');
});

test('offline service worker cannot bypass model authentication using old cache entries',()=>{
 const sw=readFileSync(new URL('../public/transformer/sw.js',import.meta.url),'utf8');
 assert.match(sw,/caches\.delete/);
 assert.doesNotMatch(sw,/caches\.open/);
 assert.doesNotMatch(sw,/caches\.match/);
 assert.match(sw,/event\.respondWith\(fetch\(event\.request\)\)/);
});
