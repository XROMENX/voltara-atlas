import {readFile,writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
const id=process.env.D1_DATABASE_ID;
if(!id||! /^[0-9a-f-]{36}$/i.test(id)){throw new Error('Create D1 voltara-production, then set D1_DATABASE_ID in Workers Builds variables to its database UUID.');}
const file='dist/server/wrangler.json';
const config=JSON.parse(await readFile(file,'utf8'));
config.d1_databases=[{binding:'DB',database_name:'voltara-production',database_id:id,migrations_dir:'../../drizzle'}];
await writeFile(file,JSON.stringify(config,null,2));
for(const args of [['d1','migrations','apply','DB','--remote','--config',file],['deploy','--config',file]]){
 const result=spawnSync('pnpm',['exec','wrangler',...args],{stdio:'inherit',env:process.env});if(result.status!==0)process.exit(result.status||1);
}
