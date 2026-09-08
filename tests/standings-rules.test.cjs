const {test}=require('node:test');
const assert=require('node:assert/strict');
const R=require('../standings-rules.js');
const s={win_points:2,ot_loss_points:1,regulation_loss_points:0};
const row=(id,x={})=>({team_id:id,team:String(id),group_id:1,pts:8,gd:0,w:0,rw:0,gf:0,...x});
const match=(h,a,hs,as)=>({home_team_id:h,away_team_id:a,home_score:hs,away_score:as,finish_type:'REG',group_id:1});
const ids=rows=>rows.map(r=>r.team_id);
test('restart discards parent mini-league after first separation',()=>{
  const ms=[match(1,2,1,0),match(1,3,10,0),match(2,3,1,0),match(3,2,2,0)];
  assert.deepEqual(ids(R.resolve([row(1,{gd:11}),row(2,{gd:-2}),row(3,{gd:-9})],ms,s,'group')),[1,3,2]);
});
test('head to head points precede superior regulation wins and difference',()=>{
  assert.deepEqual(ids(R.resolve([row(1,{gd:-20}),row(2,{gd:30,rw:5})],[match(1,2,1,0)],s,'group')),[1,2]);
});
test('all wins precede regulation wins inside group',()=>{
  assert.deepEqual(ids(R.resolve([row(1,{w:4,rw:1}),row(2,{w:3,rw:3})],[],s,'group')),[1,2]);
});
test('different groups without matches use regulation wins first',()=>{
  assert.deepEqual(ids(R.resolve([row(1,{group_id:1,w:6,rw:1,gd:20}),row(2,{group_id:2,w:3,rw:3,gd:-5})],[],s)),[2,1]);
});
test('different current groups with personal matches use those results',()=>{
  assert.deepEqual(ids(R.resolve([row(1,{group_id:1}),row(2,{group_id:2,rw:5})],[match(1,2,1,0)],s)),[1,2]);
});
test('remaining subgroup re-evaluates applicability of personal criteria',()=>{
  assert.deepEqual(ids(R.resolve([row(1,{group_id:1,rw:5}),row(2,{group_id:2,w:3,rw:2}),row(3,{group_id:2,w:4,rw:2})],[],s)),[1,3,2]);
});
test('complete equality stays unresolved, input order grants no advantage',()=>{
  const out=R.rank([row(2),row(1)],[],s,'group');
  assert.deepEqual(ids(out),[2,1]);assert.ok(out.every(r=>r.unresolved));
});
test('scoring handles regulation, overtime loss and unplayed matches',()=>{
  const ms=[match(1,2,2,1),{...match(1,3,1,2),finish_type:'OT'},{...match(1,4,null,null)}];
  const r=R.stats({id:1,name:'A'},{id:1},ms,s);
  assert.deepEqual([r.pts,r.gp,r.w,r.rw,r.ol,r.gf,r.ga],[3,2,1,1,1,3,3]);
});
test('group and overall reset unresolved flag before another comparison',()=>{
  const data={settings:s,teams:[{id:1,name:'A'},{id:2,name:'B'}],groups:[{id:1},{id:2}],memberships:[{team_id:1,group_id:1},{team_id:2,group_id:2}],matches:[]};
  assert.ok(R.overall(data).every(r=>r.unresolved));
});
test('article 18 applies all-match difference before wins and foreign relegation only at final',()=>{
  const data={settings:s,teams:[{id:1,name:'Foreign'},{id:2,name:'Russian'}],matches:[match(1,2,3,0)]};
  assert.deepEqual(ids(R.competition(data)),[1,2]);
  assert.deepEqual(ids(R.competition(data,{final:true,isForeign:t=>t.id===1})),[2,1]);
  assert.throws(()=>R.competition(data,{final:true}),/nationality/);
});
