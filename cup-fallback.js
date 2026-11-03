(()=>{
'use strict';
let snapshotPromise=null,eventsPromise=null,newsPromise=null;
const clone=x=>JSON.parse(JSON.stringify(x));
async function jsonFile(path){
  const r=await fetch(path,{cache:'no-store'});
  if(!r.ok)throw Error('Fallback HTTP '+r.status);
  return r.json();
}
function snapshot(){return snapshotPromise||(snapshotPromise=jsonFile('/fallback/cup-snapshot.json'))}
function eventData(){return eventsPromise||(eventsPromise=jsonFile('/fallback/match-events.json'))}
function newsData(){return newsPromise||(newsPromise=jsonFile('/fallback/news.json'))}
function dataForStage(s,id){
  const d=s.stages_data?.[String(id)];
  if(!d)throw Error('Резервные данные тура не найдены');
  return clone(d);
}
async function request(path){
  const s=await snapshot(),u=new URL(path,location.origin);
  if(u.pathname.endsWith('/api/catalog'))return clone(s.catalog);
  if(u.pathname.endsWith('/api/data')){
    let id=Number(u.searchParams.get('stage_id'));
    if(!Number.isInteger(id)){
      const slug=u.searchParams.get('tournament_slug');
      const t=s.catalog.tournaments.find(x=>!slug||x.slug===slug)||s.catalog.tournaments[0];
      id=s.catalog.stages.filter(x=>Number(x.tournament_id)===Number(t?.id)).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0))[0]?.id;
    }
    const d=dataForStage(s,id),order=Number(d.stage?.sort_order)||0;d.all_matches=Object.values(s.stages_data||{}).filter(x=>(Number(x.stage?.sort_order)||0)<=order).flatMap(x=>clone(x.matches||[]));return d;
  }
  throw Error('Резервный API не поддерживает этот запрос');
}
function team(stage,id){return stage.teams.find(x=>Number(x.id)===Number(id))||{id,name:'—'}}
function periodScores(m,started){
  if(!started)return[];
  const xs=[[m.p1_home,m.p1_away],[m.p2_home,m.p2_away],[m.p3_home,m.p3_away],[m.ot_home,m.ot_away],[m.so_home,m.so_away]];
  return xs.map(x=>x.every(Number.isInteger)?x:null);
}
async function match(id){
  const [s,e]=await Promise.all([snapshot(),eventData()]);
  let d=null,m=null;
  for(const x of Object.values(s.stages_data||{})){const hit=x.matches?.find(y=>Number(y.id)===Number(id));if(hit){d=x;m=hit;break}}
  if(!d||!m)throw Error('Матч не найден в резервной копии');
  const home=team(d,m.home_team_id),away=team(d,m.away_team_id),events=clone(e.matches?.[String(id)]||[]);
  const final=Boolean(m.protocol_archived_at)||String(m.fhr_live_state||'').toUpperCase()==='FINAL'||Boolean(m.fhr_live_final_at);
  const start=Date.parse(String(m.game_date||'')+'T'+String(m.start_time||'00:00')+':00+03:00');
  const scheduled=Number.isFinite(start)&&Date.now()<start&&!final;
  const started=!scheduled&&(final||events.length>0||Number.isInteger(m.home_score));
  const status=final?'FINAL':scheduled?'SCHEDULED':'ACTIVE';
  const ft=String(m.finish_type||'REG').toUpperCase();
  const schedule=(d.matches||[]).map(g=>({...clone(g),home_team:{id:g.home_team_id,name:team(d,g.home_team_id).name},away_team:{id:g.away_team_id,name:team(d,g.away_team_id).name}}));
  const current=final?(ft==='SO'?'SO':ft==='OT'?'OT':'3'):'1';
  return {ok:true,tournament:clone(d.tournament),stage:clone(d.stage),group:clone(d.groups.find(g=>Number(g.id)===Number(m.group_id))||{}),match:clone(m),home_team:clone(home),away_team:clone(away),schedule,stored_events:events,lineups:{home:[],away:[]},fhr_error:null,refreshed_at:s.generated_at||new Date().toISOString(),archive_fast:final,protocol_health:'OK',fallback:true,live:{status,status_text:status==='FINAL'?'Матч завершён':status==='SCHEDULED'?'Не начался':'Идёт',headline_score:started?[Number(m.home_score)||0,Number(m.away_score)||0]:null,period_scores:periodScores(m,started),current_period:current,events,orientation:'direct',extra_periods:{ot:ft==='OT'||ft==='SO',so:ft==='SO'},parser:'static-fallback-v1'}};
}
function splitAssistants(v){return String(v||'').split(/[,;\/]+/).map(x=>x.trim()).filter(Boolean)}
async function stats(stageId='all'){
  const [snapshotData,eventsData]=await Promise.all([snapshot(),eventData()]);
  const all=String(stageId)==='all'||Number(stageId)===0;
  const d=dataForStage(snapshotData,all?2:Number(stageId));
  const matches=all?[...(snapshotData.stages_data?.['1']?.matches||[]),...(snapshotData.stages_data?.['2']?.matches||[])]:d.matches||[];
  const played=matches.filter(m=>Number.isInteger(m.home_score)&&Number.isInteger(m.away_score)&&m.home_score!==m.away_score&&String(m.technical_result_type||'NONE')==='NONE');
  const pmap=new Map(),tmap=new Map(),meta=new Map();
  const norm=x=>String(x||'').trim().toLowerCase().replace(/ё/g,'е').replace(/\\s+/g,' ');
  const isTeamPenalty=x=>/^(командн(?:ый|ого)\\s+штраф|team\\s+penalty)$/i.test(norm(x));
  for(const t of d.teams||[])tmap.set(Number(t.id),{team_id:Number(t.id),team:t.name,gp:0,gf:0,ga:0,gd:0,gf_per_game:0,pim:0,form:[]});
  for(const m of played)for(const ev of eventsData.matches?.[String(m.id)]||[]){
    const tid=Number(ev.side==='away'?m.away_team_id:m.home_team_id),name=ev.player;
    if(name&&!isTeamPenalty(name)){const key=tid+'|'+norm(name),old=meta.get(key)||{};meta.set(key,{name,number:ev.number??old.number??null,photo:ev.player_photo||old.photo||''})}
  }
  const ensurePlayer=(name,tid)=>{
    if(!name||isTeamPenalty(name))return null;
    const key=tid+'|'+norm(name),m=meta.get(key)||{};
    if(!pmap.has(key))pmap.set(key,{name:m.name||name,number:m.number??null,team_id:tid,team:team(d,tid).name,photo:m.photo||'',goals:0,assists:0,points:0,pim:0});
    return pmap.get(key);
  };
  let goals=0,pims=0,penalties=0;
  for(const m of played){
    const ht=tmap.get(Number(m.home_team_id)),at=tmap.get(Number(m.away_team_id));
    if(ht&&at){ht.gp++;at.gp++;ht.gf+=m.home_score;ht.ga+=m.away_score;at.gf+=m.away_score;at.ga+=m.home_score;const hw=m.home_score>m.away_score,ot=['OT','SO'].includes(String(m.finish_type||''));ht.form.push(hw?'W':ot?'OTL':'L');at.form.push(!hw?'W':ot?'OTL':'L')}
    for(const ev of eventsData.matches?.[String(m.id)]||[]){
      const tid=Number(ev.side==='away'?m.away_team_id:m.home_team_id),type=String(ev.event_type||'').toUpperCase();
      if(type==='GOAL'&&String(ev.period||'').toUpperCase()!=='SO'){
        goals++;const scorer=ensurePlayer(ev.player,tid);if(scorer)scorer.goals++;
        for(const a of splitAssistants(ev.assistants)){const assistant=ensurePlayer(a,tid);if(assistant)assistant.assists++}
      }else if(type==='PENALTY'){
        const pm=Number(ev.penalty_minutes)||0;pims+=pm;penalties++;
        const player=ensurePlayer(ev.player,tid);if(player)player.pim+=pm;
        const t=tmap.get(tid);if(t)t.pim+=pm;
      }
    }
  }
  const players=[...pmap.values()].map(p=>({...p,points:p.goals+p.assists})).sort((a,b)=>b.points-a.points||b.goals-a.goals||a.pim-b.pim||a.name.localeCompare(b.name,'ru'));
  const teams=[...tmap.values()].filter(t=>t.gp>0).map(t=>({...t,gd:t.gf-t.ga,gf_per_game:t.gp?Number((t.gf/t.gp).toFixed(2)):0,form:t.form.slice(-5)}));
  return {ok:true,stage:all?{...d.stage,id:0,name:'Все туры · 1-й и 2-й'}:clone(d.stage),updated_at:snapshotData.generated_at||new Date().toISOString(),summary:{played_matches:played.length,goals,penalties,penalty_minutes:pims,players:players.length,teams:teams.length},players,teams,fallback:true};
}
async function news(tournamentId,limit=20){
  const n=await newsData();let items=(n.items||[]).filter(x=>!tournamentId||Number(x.tournament_id)===Number(tournamentId));items=items.slice(0,limit);return {ok:true,items:clone(items),fallback:true};
}
window.CupFallback={request,match,stats,news,snapshot};
})();