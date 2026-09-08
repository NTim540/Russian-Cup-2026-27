import {test} from 'node:test';
import assert from 'node:assert/strict';
import {uploadTeamHero,MAX_IMAGE_BYTES} from '../supabase/team-hero-upload.mjs';

const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64');
const json=(data,status=200)=>Response.json(data,{status});
function request(body=png,type='image/png',id='7',extra={}){
  return new Request('https://example.test/?action=upload_team_hero&id='+id,{method:'POST',headers:{'Content-Type':type,...extra},body});
}
function context(overrides={}){
  return {json,supa:async()=>[{id:7}],baseUrl:'https://project.test',serviceKey:'test-only',fetchImpl:async()=>Response.json({}),...overrides};
}
test('uploads to unique path and leaves team profile unchanged',async()=>{
  const paths=[];
  const ctx=context({supa:async path=>{assert.equal(path,'cup_teams?id=eq.7&select=id');return [{id:7}];},fetchImpl:async(url,opt)=>{
    paths.push(url);assert.equal(opt.method,'POST');assert.equal(opt.headers['x-upsert'],'false');assert.equal(opt.headers['Content-Type'],'image/png');assert.deepEqual(Buffer.from(opt.body),png);return Response.json({});
  }});
  const a=await uploadTeamHero(request(),ctx),b=await uploadTeamHero(request(),ctx);
  assert.equal(a.status,200);assert.equal(b.status,200);assert.notEqual(paths[0],paths[1]);
  assert.match((await a.json()).url,/\/object\/public\/team-city-images\/teams\/7\/[\w-]+\.png$/);
});
for(const [label,req,status] of [
  ['invalid id',()=>request(png,'image/png','../other'),400],
  ['SVG',()=>request('<svg/>','image/svg+xml'),415],
  ['forged image type',()=>request('<html>not an image</html>'),415],
  ['empty image',()=>request(''),415],
  ['wrong MIME',()=>request(png,'image/jpeg'),415],
  ['oversize declared',()=>request(png,'image/png','7',{'Content-Length':String(MAX_IMAGE_BYTES+1)}),413],
  ['oversize streamed',()=>request(new Uint8Array(MAX_IMAGE_BYTES+1)),413]
])test(label,async()=>{
  let uploads=0;
  const r=await uploadTeamHero(req(),context({fetchImpl:async()=>{uploads++;return Response.json({});}}));
  assert.equal(r.status,status);assert.equal(uploads,0);
});
test('unknown team',async()=>assert.equal((await uploadTeamHero(request(),context({supa:async()=>[]}))).status,404));
test('storage failure is not reported as success or leaked',async()=>{
  const r=await uploadTeamHero(request(),context({fetchImpl:async()=>new Response('private internal detail',{status:403})}));
  assert.equal(r.status,502);assert.doesNotMatch(await r.text(),/private internal/);
});
