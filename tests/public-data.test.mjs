import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const src=await readFile(new URL('../api/public-data.js',import.meta.url),'utf8');
const {default:handler}=await import('data:text/javascript;base64,'+Buffer.from(src).toString('base64'));
const req=(q,opts)=>new Request('https://test.example/api/public-data?'+q,opts);
test('public cache rejects writes and private routes without contacting backend',async()=>{
 const old=global.fetch;global.fetch=()=>{throw Error('Unexpected upstream request')};
 try{assert.equal((await handler(req('resource=russian-cup',{method:'POST'}))).status,405);assert.equal((await handler(req('resource=russian-cup&route=api/admin'))).status,404);assert.equal((await handler(req('resource=russian-cup-stats&stage_id=all&password=x'))).status,400)}finally{global.fetch=old}
});
test('anonymous shared cache strips credentials and distinguishes archived/live TTL',async()=>{
 const old=global.fetch;let status='FINAL';global.fetch=async(url,opts)=>{assert.equal(new URL(url).hostname,'wcucbtdfkghjirpbqzzk.supabase.co');assert.equal(opts.headers.Authorization,undefined);assert.equal(opts.headers.Cookie,undefined);return Response.json({ok:true,live:{status}})};
 try{let r=await handler(req('resource=russian-cup-match-center-v3&match_id=28',{headers:{Authorization:'secret',Cookie:'private'}}));assert.equal(r.headers.get('X-Cup-Cache-TTL'),'3600');status='ACTIVE';r=await handler(req('resource=russian-cup-match-center-v3&match_id=28'));assert.equal(r.headers.get('X-Cup-Cache-TTL'),'30')}finally{global.fetch=old}
});
test('upstream errors are never cached as successful data',async()=>{
 const old=global.fetch;global.fetch=async()=>new Response('unavailable',{status:503});try{const r=await handler(req('resource=russian-cup-stats&stage_id=all'));assert.equal(r.status,502);assert.equal(r.headers.get('Cache-Control'),'no-store')}finally{global.fetch=old}
});
