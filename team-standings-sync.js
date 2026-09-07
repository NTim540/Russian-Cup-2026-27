(()=>{
  const API='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup';
  const teamId=Number(new URL(location.href).searchParams.get('team'));
  if(!Number.isInteger(teamId)||teamId<1)return;

  const done=m=>Number.isInteger(m?.home_score)&&Number.isInteger(m?.away_score)&&m.home_score!==m.away_score;
  async function get(path){const r=await fetch(API+path,{cache:'no-store'});if(!r.ok)throw Error(await r.text());return r.json()}
  function pts(m,id,s){if(!done(m))return 0;const w=(m.home_score>m.away_score?m.home_team_id:m.away_team_id)===id;return w?s.win_points:(m.finish_type==='REG'?s.regulation_loss_points:s.ot_loss_points)}
  function raw(t,g,ms,s){let o={team_id:t.id,team:t.name,group_id:g.id,group_code:g.code,gp:0,w:0,rw:0,ow:0,l:0,rl:0,ol:0,gf:0,ga:0,gd:0,pts:0,unresolved:false};for(const m of ms){if(!done(m)||![m.home_team_id,m.away_team_id].includes(t.id))continue;o.gp++;const h=m.home_team_id===t.id,f=h?m.home_score:m.away_score,a=h?m.away_score:m.home_score;o.gf+=f;o.ga+=a;o.pts+=pts(m,t.id,s);if(f>a){o.w++;if(m.finish_type==='REG')o.rw++;else o.ow++}else{o.l++;if(m.finish_type==='REG')o.rl++;else o.ol++}}o.gd=o.gf-o.ga;return o}
  function split(a,getter){const m=new Map;for(const x of a){const k=getter(x);if(!m.has(k))m.set(k,[]);m.get(k).push(x)}return[...m.entries()].sort((a,b)=>Number(b[0])-Number(a[0])).map(x=>x[1])}
  function head(rows,ms,s){const ids=new Set(rows.map(x=>x.team_id)),o=new Map(rows.map(x=>[x.team_id,{p:0,d:0}]));for(const m of ms){if(!done(m)||!ids.has(m.home_team_id)||!ids.has(m.away_team_id))continue;for(const id of [m.home_team_id,m.away_team_id]){const h=m.home_team_id===id,f=h?m.home_score:m.away_score,a=h?m.away_score:m.home_score,x=o.get(id);x.p+=pts(m,id,s);x.d+=f-a}}return o}
  function inside(rows,ms,s){if(rows.length<2)return rows;const h=head(rows,ms,s),gets=[r=>h.get(r.team_id).p,r=>h.get(r.team_id).d,r=>r.gd,r=>r.w,r=>r.rw,r=>r.gf];let groups=[rows];for(const getter of gets){const next=[];for(const g of groups){if(g.length<2){next.push(g);continue}const p=split(g,getter);if(p.length>1)for(const q of p)next.push(q.length>1?inside(q,ms,s):q);else next.push(g)}groups=next;if(groups.every(g=>g.length===1))break}return groups.flat()}
  function groupRows(group,data,s){const ms=data.matches.filter(m=>m.group_id===group.id),mem=data.memberships.filter(x=>x.group_id===group.id).sort((a,b)=>(a.seed||999)-(b.seed||999)),rows=mem.map(x=>data.teams.find(t=>t.id===x.team_id)).filter(Boolean).map(t=>raw(t,group,ms,s)),by=new Map;for(const r of rows){if(!by.has(r.pts))by.set(r.pts,[]);by.get(r.pts).push(r)}let out=[];for(const p of [...by.keys()].sort((a,b)=>b-a)){const tied=by.get(p);out.push(...(tied.length>1?inside(tied,ms,s):tied))}out.forEach((r,i)=>r.place=i+1);return out}
  function cross(rows,data,s){if(rows.length<2)return rows;if(rows.every(r=>r.group_id===rows[0].group_id))return inside(rows,data.matches.filter(m=>m.group_id===rows[0].group_id),s);let groups=[rows];const gets=[r=>r.rw,r=>r.gd,r=>r.gf];for(const getter of gets){const next=[];for(const g of groups){if(g.length<2){next.push(g);continue}const p=split(g,getter);if(p.length>1)for(const q of p)next.push(q.length>1?cross(q,data,s):q);else next.push(g)}groups=next;if(groups.every(g=>g.length===1))break}return groups.flat()}
  function overall(data,s){const rows=data.groups.flatMap(g=>groupRows(g,data,s)),by=new Map;for(const r of rows){if(!by.has(r.pts))by.set(r.pts,[]);by.get(r.pts).push(r)}let out=[];for(const p of [...by.keys()].sort((a,b)=>b-a)){const tied=by.get(p);out.push(...(tied.length>1?cross(tied,data,s):tied))}out.forEach((r,i)=>r.place=i+1);return out}

  function paint(groupPlace,overallPlace){
    const gp=document.querySelector('#groupPlace');if(gp)gp.textContent=groupPlace||'—';
    const first=document.querySelector('#statsGrid .stat-card:first-child strong');if(first)first.textContent=overallPlace||'—';
  }

  async function sync(){
    try{
      const catalog=await get('/api/catalog'),tournament=catalog.tournaments?.[0];if(!tournament)return;
      const stages=(catalog.stages||[]).filter(s=>Number(s.tournament_id)===Number(tournament.id)).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0)),stage=stages[0];if(!stage)return;
      const data=await get('/api/data?tournament_slug='+encodeURIComponent(tournament.slug)+'&stage_id='+stage.id),membership=data.memberships.find(x=>Number(x.team_id)===teamId),group=data.groups.find(g=>Number(g.id)===Number(membership?.group_id));
      if(!group)return;
      const gr=groupRows(group,data,data.settings),groupPlace=gr.find(r=>Number(r.team_id)===teamId)?.place||'—';
      const or=overall(data,data.settings),overallPlace=or.find(r=>Number(r.team_id)===teamId)?.place||'—';
      paint(groupPlace,overallPlace);
    }catch(e){console.warn('Standings sync:',e)}
  }

  let tries=0;const timer=setInterval(()=>{tries++;sync();if(tries>=4)clearInterval(timer)},800);
  sync();
})();
