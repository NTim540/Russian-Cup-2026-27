(function(root){
  'use strict';
  const done=m=>Number.isInteger(m.home_score)&&Number.isInteger(m.away_score)&&m.home_score!==m.away_score;
  const same=(a,b)=>String(a)===String(b);
  function points(m,id,s){
    const won=same(m.home_score>m.away_score?m.home_team_id:m.away_team_id,id);
    return Number(won?s.win_points:m.finish_type==='REG'?s.regulation_loss_points:s.ot_loss_points);
  }
  function stats(t,g,matches,s){
    const r={team_id:t.id,team:t.name,group_id:g?.id,group_code:g?.code,gp:0,w:0,rw:0,ow:0,l:0,rl:0,ol:0,gf:0,ga:0,gd:0,pts:0,unresolved:false};
    for(const m of matches){
      if(!done(m)||(!same(m.home_team_id,t.id)&&!same(m.away_team_id,t.id)))continue;
      const home=same(m.home_team_id,t.id),f=home?m.home_score:m.away_score,a=home?m.away_score:m.home_score;
      r.gp++;r.gf+=f;r.ga+=a;r.pts+=points(m,t.id,s);
      if(f>a){r.w++;if(m.finish_type==='REG')r.rw++;else r.ow++;}
      else{r.l++;if(m.finish_type==='REG')r.rl++;else r.ol++;}
    }
    r.gd=r.gf-r.ga;return r;
  }
  function split(rows,key){
    const groups=new Map();
    for(const row of rows){const value=key(row);if(!groups.has(value))groups.set(value,[]);groups.get(value).push(row);}
    return [...groups.entries()].sort((a,b)=>b[0]-a[0]).map(x=>x[1]);
  }
  // Restart immediately after any separation. Never resume the parent mini-league.
  function resolve(rows,matches,s,mode='tour'){
    if(rows.length<2)return rows;
    const ids=new Set(rows.map(r=>String(r.team_id)));
    const personal=matches.filter(m=>done(m)&&ids.has(String(m.home_team_id))&&ids.has(String(m.away_team_id)));
    const oneGroup=rows[0].group_id!=null&&rows.every(r=>same(r.group_id,rows[0].group_id));
    const usePersonal=mode==='competition'||mode==='group'||oneGroup||personal.length>0;
    const mini=new Map(rows.map(r=>[r.team_id,stats({id:r.team_id,name:r.team},null,personal,s)]));
    const keys=usePersonal?[r=>mini.get(r.team_id).pts,r=>mini.get(r.team_id).gd,r=>r.gd,r=>r.w,r=>r.rw,r=>r.gf]:[r=>r.rw,r=>r.gd,r=>r.gf];
    for(const key of keys){
      const groups=split(rows,key);
      if(groups.length>1)return groups.flatMap(group=>resolve(group,matches,s,mode));
    }
    // Stable input order is for display only, never a sporting tie-breaker.
    return rows.map(r=>({...r,unresolved:true}));
  }
  function rank(rows,matches,s,mode){
    return split(rows.map(r=>({...r,unresolved:false})),r=>r.pts).flatMap(group=>resolve(group,matches,s,mode)).map((r,i)=>({...r,place:i+1}));
  }
  function groupRows(data,g,s=data.settings){
    const matches=data.matches.filter(m=>same(m.group_id,g.id));
    const members=data.memberships.filter(m=>same(m.group_id,g.id)).sort((a,b)=>(a.seed??999)-(b.seed??999));
    const rows=members.map(m=>data.teams.find(t=>same(t.id,m.team_id))).filter(Boolean).map(t=>stats(t,g,matches,s));
    return rank(rows,matches,s,'group');
  }
  function overall(data,s=data.settings){
    return rank(data.groups.flatMap(g=>groupRows(data,g,s)),data.matches,s,'tour');
  }
  // Article 18 needs the complete competition match list, not one selected tour.
  // Nationality must be supplied explicitly from verified tournament entries.
  function competition(data,{final=false,isForeign}={}){
    let rows=rank(data.teams.map(t=>stats(t,null,data.matches,data.settings)),data.matches,data.settings,'competition');
    if(final){
      if(typeof isForeign!=='function')throw Error('Final classification requires verified nationality');
      const foreign=new Map(data.teams.map(t=>[t.id,isForeign(t)]));
      if([...foreign.values()].some(v=>typeof v!=='boolean'))throw Error('Unknown team nationality');
      rows=[...rows.filter(r=>!foreign.get(r.team_id)),...rows.filter(r=>foreign.get(r.team_id))];
    }
    return rows.map((r,i)=>({...r,place:i+1}));
  }
  const api={done,stats,resolve,rank,groupRows,overall,competition};
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.CupStandings=api;
})(typeof window!=='undefined'?window:globalThis);
