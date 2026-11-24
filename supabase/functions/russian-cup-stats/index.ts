import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const cors={
  "Access-Control-Allow-Origin":"*",
  "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":"GET, OPTIONS",
  "Content-Type":"application/json; charset=utf-8",
  "Cache-Control":"public, max-age=300, s-maxage=300"
};

const norm=(v:string|null|undefined)=>String(v||"").trim().toLowerCase().replace(/ё/g,"е").replace(/\s+/g," ");
const splitAssists=(v:string|null|undefined)=>String(v||"").split(/[,;]+/).map(x=>x.trim()).filter(Boolean);
const n=(v:any)=>Number.isFinite(Number(v))?Number(v):0;
const isTeamPenaltyName=(v:string|null|undefined)=>/^(командн(?:ый|ого)\s+штраф|team\s+penalty)$/i.test(norm(v));

const responseCache = new Map<number, {expires:number; body:string}>();
Deno.serve(async(req:Request)=>{
  if(req.method==="OPTIONS") return new Response("ok",{headers:cors});
  try{
    const url=new URL(req.url);
    const requestedStage=url.searchParams.get("stage_id")||"all";
    const stageId=requestedStage==="all"?0:Number(requestedStage);
    const cached=responseCache.get(stageId);
    if(req.method==="GET" && cached && cached.expires>Date.now()) return new Response(cached.body,{headers:cors});
    if(![0,1,2].includes(stageId))return new Response(JSON.stringify({ok:false,error:"invalid_stage"}),{status:400,headers:cors});
    const sb=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,{auth:{persistSession:false}});

    const [{data:stage,error:stageErr},{data:matches,error:matchErr},{data:groups,error:groupErr}]=await Promise.all([
      sb.from("cup_stages").select("id,tournament_id,name,start_date,end_date,sort_order").eq("id",stageId||2).maybeSingle(),
      sb.from("cup_matches").select("id,group_id,game_no,game_date,home_team_id,away_team_id,home_score,away_score,finish_type,p1_home,p1_away,p2_home,p2_away,p3_home,p3_away,ot_home,ot_away,so_home,so_away,fhr_live_state,protocol_health,technical_result_type,technical_goals_count").in("stage_id",stageId?[stageId]:[1,2]),
      sb.from("cup_groups").select("id,code,name,sort_order").in("stage_id",stageId?[stageId]:[1,2])
    ]);
    if(stageErr) throw stageErr;
    if(matchErr) throw matchErr;
    if(groupErr) throw groupErr;
    if(!stage) return new Response(JSON.stringify({ok:false,error:"stage_not_found"}),{status:404,headers:cors});

    const stageView=stageId===0?{...stage,id:0,name:"Все туры · 1-й и 2-й",start_date:"2026-09-09",end_date:"2026-11-15"}:stage;
    const tournamentId=stage.tournament_id;
    const {data:teams,error:teamErr}=await sb.from("cup_teams").select("id,name,city,logo_url").eq("tournament_id",tournamentId);
    if(teamErr) throw teamErr;

    const played=(matches||[]).filter((m:any)=>Number.isInteger(m.home_score)&&Number.isInteger(m.away_score)&&String(m.fhr_live_state||"").toUpperCase()==="FINAL" && String(m.technical_result_type||"NONE")==="NONE");
    const matchIds=played.map((m:any)=>m.id);
    let events:any[]=[];
    if(matchIds.length){
      const {data,error}=await sb.from("cup_match_events")
        .select("id,match_id,period,clock,event_type,team_id,player,assistants,penalty_minutes,description,source_number:source_payload->number,source_photo:source_payload->player_photo,source_pp:source_payload->power_play,source_en:source_payload->empty_net")
        .in("match_id",matchIds)
        .in("event_type",["GOAL","PENALTY"])
        .order("match_id",{ascending:true}).order("sort_order",{ascending:true});
      if(error) throw error;
      events=(data||[]).map((e:any)=>({...e,source_payload:{number:e.source_number,player_photo:e.source_photo,power_play:e.source_pp,empty_net:e.source_en}}));
    }

    const teamById=new Map((teams||[]).map((t:any)=>[Number(t.id),t]));
    const meta=new Map<string,any>();
    const playerKey=(teamId:number,name:string)=>`${teamId}:${norm(name)}`;

    for(const e of events){
      if(!e.team_id||!e.player||isTeamPenaltyName(e.player)) continue;
      const k=playerKey(Number(e.team_id),e.player);
      const p=e.source_payload||{};
      const old=meta.get(k)||{};
      meta.set(k,{name:e.player||old.name,number:p.number??old.number??null,photo:p.player_photo||old.photo||null});
    }

    const stats=new Map<string,any>();
    const getPlayer=(teamId:number,name:string)=>{
      if(!name||isTeamPenaltyName(name)) return null;
      const k=playerKey(teamId,name);
      if(!stats.has(k)){
        const m=meta.get(k)||{};
        const team=teamById.get(teamId)||{};
        stats.set(k,{key:k,name:m.name||name,team_id:teamId,team:team.name||"—",team_logo:team.logo_url||null,number:m.number??null,photo:m.photo||null,goals:0,assists:0,points:0,pim:0,pp_goals:0,en_goals:0,ot_goals:0});
      }
      const s=stats.get(k);
      const m=meta.get(k)||{};
      if(!s.photo&&m.photo)s.photo=m.photo;
      if(s.number==null&&m.number!=null)s.number=m.number;
      return s;
    };

    for(const e of events){
      const teamId=Number(e.team_id||0);
      if(!teamId) continue;
      if(e.event_type==="GOAL"){
        if(String(e.period||"").toUpperCase()==="SO") continue;
        if(e.player){
          const s=getPlayer(teamId,e.player);
          if(s){
            s.goals++;
            if(e.source_payload?.power_play)s.pp_goals++;
            if(e.source_payload?.empty_net)s.en_goals++;
            if(String(e.period||"").toUpperCase()==="OT")s.ot_goals++;
          }
        }
        for(const a of splitAssists(e.assistants)){
          const s=getPlayer(teamId,a);
          if(s)s.assists++;
        }
      }else if(e.event_type==="PENALTY"&&e.player&&!isTeamPenaltyName(e.player)){
        const s=getPlayer(teamId,e.player);
        if(s)s.pim+=n(e.penalty_minutes);
      }
    }
    const players=[...stats.values()].map((s:any)=>({...s,points:s.goals+s.assists}));
    const tie=(a:any,b:any)=>b.points-a.points||b.goals-a.goals||a.pim-b.pim||a.name.localeCompare(b.name,"ru");
    players.sort(tie);

    const teamStats=new Map<number,any>();
    for(const t of teams||[]) teamStats.set(Number(t.id),{team_id:Number(t.id),team:t.name,city:t.city||null,logo:t.logo_url||null,gp:0,w:0,l:0,otw:0,otl:0,gf:0,ga:0,pim:0,pp_goals:0,periods:[0,0,0,0],form:[]});
    const playedSorted=[...played].sort((a:any,b:any)=>String(a.game_date).localeCompare(String(b.game_date))||a.game_no-b.game_no);
    for(const m of playedSorted){
      const h=teamStats.get(Number(m.home_team_id)),a=teamStats.get(Number(m.away_team_id));
      if(!h||!a) continue;
      h.gp++;a.gp++;h.gf+=n(m.home_score);h.ga+=n(m.away_score);a.gf+=n(m.away_score);a.ga+=n(m.home_score);
      const finish=String(m.finish_type||"REG").toUpperCase();
      const hw=n(m.home_score)>n(m.away_score);
      if(finish==="REG") { if(hw){h.w++;a.l++;h.form.push("W");a.form.push("L")}else{a.w++;h.l++;a.form.push("W");h.form.push("L")} }
      else { if(hw){h.otw++;a.otl++;h.form.push("W");a.form.push("OTL")}else{a.otw++;h.otl++;a.form.push("W");h.form.push("OTL")} }
      h.periods[0]+=n(m.p1_home);h.periods[1]+=n(m.p2_home);h.periods[2]+=n(m.p3_home);h.periods[3]+=n(m.ot_home)+n(m.so_home);
      a.periods[0]+=n(m.p1_away);a.periods[1]+=n(m.p2_away);a.periods[2]+=n(m.p3_away);a.periods[3]+=n(m.ot_away)+n(m.so_away);
    }
    for(const e of events){
      const t=teamStats.get(Number(e.team_id||0)); if(!t)continue;
      // Team penalties stay in team PIM even though they are not individual player statistics.
      if(e.event_type==="PENALTY")t.pim+=n(e.penalty_minutes);
      if(e.event_type==="GOAL"&&String(e.period||"").toUpperCase()!=="SO"&&e.source_payload?.power_play)t.pp_goals++;
    }
    const teamsOut=[...teamStats.values()].filter((t:any)=>t.gp>0).map((t:any)=>({...t,gd:t.gf-t.ga,gf_per_game:t.gp?Number((t.gf/t.gp).toFixed(2)):0,ga_per_game:t.gp?Number((t.ga/t.gp).toFixed(2)):0,form:t.form.slice(-5)})).sort((a:any,b:any)=>b.gf-a.gf||b.gd-a.gd||a.team.localeCompare(b.team,"ru"));

    const summary={
      played_matches:played.length,
      goals:played.reduce((total:number,m:any)=>total+n(m.home_score)+n(m.away_score),0),
      penalties:events.filter((e:any)=>e.event_type==="PENALTY").length,
      penalty_minutes:events.filter((e:any)=>e.event_type==="PENALTY").reduce((s:number,e:any)=>s+n(e.penalty_minutes),0),
      players:players.length,
      teams:teamsOut.length
    };

    const body=JSON.stringify({ok:true,stage:stageView,groups:groups||[],summary,players,teams:teamsOut,updated_at:new Date().toISOString()});
    responseCache.set(stageId,{expires:Date.now()+300000,body});
    return new Response(body,{headers:cors});
  }catch(e){
    console.error(e);
    return new Response(JSON.stringify({ok:false,error:String(e?.message||e)}),{status:500,headers:cors});
  }
});

