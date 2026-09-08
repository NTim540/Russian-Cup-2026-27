const {test}=require('node:test');
const assert=require('node:assert/strict');
const R=require('../standings-rules.js');
const s={win_points:2,ot_loss_points:1,regulation_loss_points:0};
const row=(id,x={})=>({team_id:id,team:String(id),group_id:1,pts:8,gd:0,w:0,rw:0,gf:0,...x});
const match=(h,a,hs,as,x={})=>({home_team_id:h,away_team_id:a,home_score:hs,away_score:as,finish_type:'REG',group_id:1,stage_id:1,...x});
const ids=rows=>rows.map(r=>r.team_id);

test('Article 14: every win is 2, OT/SO loss is 1, regulation loss is 0',()=>{
  const ms=[
    match(1,2,2,1),
    match(1,3,3,2,{finish_type:'OT'}),
    match(1,4,4,3,{finish_type:'SO'}),
    match(5,1,2,1),
    match(6,1,2,1,{finish_type:'OT'}),
    match(7,1,2,1,{finish_type:'SO'})
  ];
  const r=R.stats({id:1,name:'A'},{id:1},ms,s);
  assert.deepEqual([r.pts,r.gp,r.w,r.rw,r.ow,r.rl,r.ol],[8,6,3,1,2,1,2]);
});

test('restart discards parent mini-league after first separation',()=>{
  const ms=[match(1,2,1,0),match(1,3,10,0),match(2,3,1,0),match(3,2,2,0)];
  assert.deepEqual(ids(R.resolve([row(1,{gd:11}),row(2,{gd:-2}),row(3,{gd:-9})],ms,s,'group')),[1,3,2]);
});

test('head to head points precede superior regulation wins and difference',()=>{
  assert.deepEqual(ids(R.resolve([row(1,{gd:-20}),row(2,{gd:30,rw:5})],[match(1,2,1,0)],s,'group')),[1,2]);
});

test('all wins precede regulation wins inside one Tour group',()=>{
  assert.deepEqual(ids(R.resolve([row(1,{w:4,rw:1}),row(2,{w:3,rw:3})],[],s,'group')),[1,2]);
});

test('Article 17 overall table without head-to-head uses RW then GD then GF',()=>{
  assert.deepEqual(ids(R.resolve([row(1,{group_id:1,w:6,rw:1,gd:20}),row(2,{group_id:2,w:3,rw:3,gd:-5})],[],s,'overall')),[2,1]);
});

test('Article 17 overall table with head-to-head uses standard six criteria',()=>{
  assert.deepEqual(ids(R.resolve([row(1,{group_id:1}),row(2,{group_id:2,rw:5})],[match(1,2,1,0,{group_id:null})],s,'overall')),[1,2]);
});

test('complete equality stays unresolved, input order grants no sporting advantage',()=>{
  const out=R.rank([row(2),row(1)],[],s,'group');
  assert.deepEqual(ids(out),[2,1]);assert.ok(out.every(r=>r.unresolved));
});

test('Article 4: crossover match does not affect Tour group standings',()=>{
  const data={settings:s,teams:[{id:1,name:'A'},{id:2,name:'B'}],groups:[{id:10,code:'A'}],memberships:[{team_id:1,group_id:10},{team_id:2,group_id:10}],matches:[
    match(1,2,1,0,{group_id:10}),
    match(2,1,10,0,{group_id:10,is_crossover:true})
  ]};
  const rows=R.groupRows(data,data.groups[0]);
  assert.deepEqual(ids(rows),[1,2]);
  assert.deepEqual([rows[0].pts,rows[1].pts],[2,0]);
});

test('Article 4/17: crossover match counts in accumulated overall table',()=>{
  const data={settings:s,stage:{id:2,sort_order:2},stages:[{id:1,sort_order:1},{id:2,sort_order:2}],teams:[{id:1,name:'A'},{id:2,name:'B'}],groups:[{id:20,code:'B'}],memberships:[{team_id:1,group_id:20},{team_id:2,group_id:20}],matches:[],all_matches:[
    match(1,2,1,0,{stage_id:1,group_id:10}),
    match(2,1,2,0,{stage_id:2,group_id:null,is_crossover:true})
  ]};
  const rows=R.overall(data);
  const a=rows.find(r=>r.team_id===1),b=rows.find(r=>r.team_id===2);
  assert.deepEqual([a.pts,b.pts],[2,2]);
  assert.deepEqual([a.gp,b.gp],[2,2]);
});

test('overall table accumulates previous Tours but excludes future Tours',()=>{
  const data={settings:s,stage:{id:2,sort_order:2},stages:[{id:1,sort_order:1},{id:2,sort_order:2},{id:3,sort_order:3}],teams:[{id:1,name:'A'},{id:2,name:'B'}],groups:[],memberships:[],matches:[],all_matches:[
    match(1,2,1,0,{stage_id:1}),match(1,2,1,0,{stage_id:2}),match(2,1,9,0,{stage_id:3})
  ]};
  const rows=R.overall(data),a=rows.find(r=>r.team_id===1),b=rows.find(r=>r.team_id===2);
  assert.deepEqual([a.gp,a.pts,b.gp,b.pts],[2,4,2,0]);
});

test('Article 18 uses all-match GD before all wins and foreign relegation only at final',()=>{
  const data={settings:s,teams:[{id:1,name:'Foreign'},{id:2,name:'Russian'}],all_matches:[match(1,2,3,0)]};
  assert.deepEqual(ids(R.competition(data)),[1,2]);
  assert.deepEqual(ids(R.competition(data,{final:true,isForeign:t=>t.id===1})),[2,1]);
  assert.throws(()=>R.competition(data,{final:true}),/nationality/);
});
