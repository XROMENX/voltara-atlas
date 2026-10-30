import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {stripTypeScriptTypes} from 'node:module';
test('the Worker gates direct and encoded model asset URLs before accessing storage',async()=>{
 const exports={};let session=null,reads=0;
 const imports={'vinext/server/fetch-handler':{default:{fetch:async()=>new Response('public app')}},'../lib/auth':{getAuth:()=>({api:{getSession:async()=>session}})}};
 const code=stripTypeScriptTypes(readFileSync(new URL('../worker/independent.ts',import.meta.url),'utf8'))
   .replace("import handler from 'vinext/server/fetch-handler';", "const handler=require('vinext/server/fetch-handler').default;")
   .replace("import { getAuth } from '../lib/auth';", "const {getAuth}=require('../lib/auth');")
   .replace('export default', 'exports.default =');
 runInNewContext(code,{exports,require:name=>imports[name],Request,Response,URL,decodeURIComponent});
 const env={ASSETS:{fetch:async()=>{reads++;return new Response('model');}}};
 for(const path of ['/transformer/app.js','/transformer/','/%74ransformer/app.js','/transformer%2Fapp.js']){
 const response=await exports.default.fetch(new Request('https://voltara.test'+path),env,{});assert.equal(response.status,401);assert.equal(reads,0);
 }
 const navigation=await exports.default.fetch(new Request('https://voltara.test/transformer/',{headers:{Accept:'text/html'}}),env,{});assert.equal(navigation.status,303);assert.match(navigation.headers.get('location'),/^\/login\?returnTo=/);
 session={user:{id:'valid-user'}};
 const allowed=await exports.default.fetch(new Request('https://voltara.test/transformer/app.js'),env,{});assert.equal(allowed.status,200);assert.equal(reads,1);assert.equal(allowed.headers.get('cache-control'),'private, no-cache, must-revalidate');
 const html=await exports.default.fetch(new Request('https://voltara.test/transformer/index.html'),env,{});assert.equal(html.headers.get('cache-control'),'private, no-store');
 env.ASSETS.fetch=async()=>{reads++;return new Response(null,{status:304,headers:{ETag:'"model-v1"'}});};
 const conditional=new Request('https://voltara.test/transformer/app.js',{headers:{'If-None-Match':'"model-v1"'}});
 const unchanged=await exports.default.fetch(conditional,env,{});assert.equal(unchanged.status,304);assert.equal(unchanged.headers.get('cache-control'),'private, no-cache, must-revalidate');
 session=null;const before=reads;
 const loggedOut=await exports.default.fetch(conditional,env,{});assert.equal(loggedOut.status,401);assert.equal(reads,before);assert.equal(loggedOut.headers.get('cache-control'),'private, no-store');
});

test('only generic third-party libraries bypass the Worker; model requests still authenticate',()=>{
 const config=JSON.parse(readFileSync(new URL('../wrangler.jsonc',import.meta.url),'utf8'));
 assert.deepEqual(config.assets.run_worker_first,['/*','!/_next/static/*','!/vendor/three-r170.module.js','!/vendor/OrbitControls-r170.js']);
});

test('offline service worker cannot bypass model authentication using old cache entries',()=>{
 const sw=readFileSync(new URL('../public/transformer/sw.js',import.meta.url),'utf8');
 assert.match(sw,/caches\.delete/);
 assert.doesNotMatch(sw,/caches\.open/);
 assert.doesNotMatch(sw,/caches\.match/);
 assert.match(sw,/event\.respondWith\(fetch\(event\.request\)\)/);
});

