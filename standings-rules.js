(function(root){
  'use strict';

  const TECH_TYPES=new Set(['INELIGIBLE_PLAYER','NO_SHOW','DISCIPLINARY','OTHER']);
  const same=(a,b)=>String(a)===String(b);
  const hasNumericScore=m=>Number.isInteger(m?.home_score)&&Number.isInteger(m?.away_score)&&m.home_score!==m.away_score;
  const technicalType=m=>TECH_TYPES.has(String(m?.technical_result_type||'').toUpperCase())?String(m.technical_result_type).toUpperCase():'NONE';
  const isTechnical=m=>technicalType(m)!=='NONE'&&m?.technical_winner_team_id!==null&&m?.technical_winner_team_id!==undefined;
  const done=m=>isTechnical(m)||hasNumericScore(m);
  const finish=m=>isTechnical(m)?'REG':(m?.finish_type==='OT'||m?.finish_type==='SO'?m.finish_type:'REG');
  const winnerId=m=>isTechnical(m)?m.technical_winner_team_id:(hasNumericScore(m)?(m.home_score>m.away_score?m.home_team_id:m.away_team_id):null);
  const goalsCount=m=>!isTechnical(m)||Boolean(m?.technical_goals_count);

  function points(m,id,s){
    if(!done(m))return 0;
    const won=same(winnerId(m),id);
    if(won)return Number(s.win_points);
    if(isTechnical(m))return Number(s.regulation_loss_points);
    return finish(m)==='REG'?Number(s.regulation_loss_points):Number(s.ot_loss_points);
  }

  function stats(t,g,matches,s){
    const r={team_id:t.id,team:t.name,group_id:g?.id??null,group_code:g?.code??null,gp:0,w:0,rw:0,ow:0,tw:0,l:0,rl:0,ol:0,tl:0,gf:0,ga:0,gd:0,pts:0,unresolved:false,disqualified:Boolean(t.is_disqualified),disqualification_note:t.disqualification_note||null};
    for(const m of matches||[]){
      if(!done(m)||(!same(m.home_team_id,t.id)&&!same(m.away_team_id,t.id)))continue;
      const won=same(winnerId(m),t.id),type=finish(m),home=same(m.home_team_id,t.id),technical=isTechnical(m);
      r.gp++;r.pts+=points(m,t.id,s);
      if(goalsCount(m)&&hasNumericScore(m)){
        const f=home?m.home_score:m.away_score,a=home?m.away_score:m.home_score;
        r.gf+=f;r.ga+=a;
      }
      if(won){
        r.w++;
        if(technical)r.tw++;
        else if(type==='REG')r.rw++;
        else r.ow++;
      }else{
        r.l++;
        if(technical)r.tl++;
        else if(type==='REG')r.rl++;
        else r.ol++;
      }
    }
    r.gd=r.gf-r.ga;
    return r;
  }

  function split(rows,key){
    const groups=new Map();
    for(const row of rows){const value=Number(key(row));if(!groups.has(value))groups.set(value,[]);groups.get(value).push(row);}
    return [...groups.entries()].sort((a,b)=>b[0]-a[0]).map(x=>x[1]);
  }

  // Articles 17-18: after any criterion separates one or more teams, the
  // remaining tied subgroup is evaluated again from criterion 1.
  function resolve(rows,matches,s,mode='overall'){
    if(rows.length<2)return rows;
    const ids=new Set(rows.map(r=>String(r.team_id)));
    const personal=(matches||[]).filter(m=>done(m)&&ids.has(String(m.home_team_id))&&ids.has(String(m.away_team_id)));
    const mini=new Map(rows.map(r=>[r.team_id,stats({id:r.team_id,name:r.team},null,personal,s)]));

    // Article 17: when tied teams in the general tournament table have not
    // played each other, use RW -> GD -> GF.
    const usePersonal=mode==='group'||mode==='competition'||personal.length>0;
    const keys=usePersonal
      ? [r=>mini.get(r.team_id).pts,r=>mini.get(r.team_id).gd,r=>r.gd,r=>r.w,r=>r.rw,r=>r.gf]
      : [r=>r.rw,r=>r.gd,r=>r.gf];

    for(const key of keys){
      const groups=split(rows,key);
      if(groups.length>1)return groups.flatMap(group=>resolve(group,matches,s,mode));
    }
    return rows.map(r=>({...r,unresolved:true}));
  }

  function rank(rows,matches,s,mode){
    return split(rows.map(r=>({...r,unresolved:false})),r=>r.pts)
      .flatMap(group=>resolve(group,matches,s,mode))
      .map((r,i)=>({...r,place:i+1}));
  }

  function isCrossover(m){
    return m?.is_crossover===true||m?.counts_for_tour===false||String(m?.match_type||'').toUpperCase()==='CROSSOVER';
  }

  function groupRows(data,g,s=data.settings){
    // Article 4: crossover matches in Tours 2-3 do not affect a Tour's places.
    const matches=(data.matches||[]).filter(m=>same(m.group_id,g.id)&&!isCrossover(m));
    const members=(data.memberships||[]).filter(m=>same(m.group_id,g.id)).sort((a,b)=>(a.seed??999)-(b.seed??999));
    const rows=members.map(m=>(data.teams||[]).find(t=>same(t.id,m.team_id))).filter(Boolean).map(t=>stats(t,g,matches,s));
    return rank(rows,matches,s,'group');
  }

  function matchesThroughSelectedTour(data){
    const source=Array.isArray(data.all_matches)?data.all_matches:(data.matches||[]);
    if(!data.stage||!Array.isArray(data.stages)||!data.stages.length)return source;
    const current=Number(data.stage.sort_order);
    if(!Number.isFinite(current))return source;
    const order=new Map(data.stages.map(x=>[String(x.id),Number(x.sort_order)]));
    return source.filter(m=>{
      const value=order.get(String(m.stage_id));
      return !Number.isFinite(value)||value<=current;
    });
  }

  function currentGroup(data,teamId){
    const mem=(data.memberships||[]).find(m=>same(m.team_id,teamId));
    return mem?(data.groups||[]).find(g=>same(g.id,mem.group_id))||null:null;
  }

  function finalStageComplete(data){
    const stages=(data.stages||[]).map(x=>Number(x.sort_order)).filter(Number.isFinite);
    const maxStage=stages.length?Math.max(...stages):0;
    const current=Number(data.stage?.sort_order);
    return current>=5&&current===maxStage&&(data.matches||[]).length>0&&(data.matches||[]).every(done);
  }

  function hasVerifiedCountries(data){
    return (data.teams||[]).length>0&&(data.teams||[]).every(t=>/^[A-Z]{2}$/.test(String(t.country_code||'').toUpperCase()));
  }

  // Article 17 general tournament table: accumulated points from all Tours up
  // to the selected Tour. Crossover matches count here. Once Tour 5 is fully
  // complete, the same surface becomes the Article 18 final classification.
  function overall(data,s=data.settings){
    const matches=matchesThroughSelectedTour(data);
    if(finalStageComplete(data)&&hasVerifiedCountries(data)){
      return competition({...data,all_matches:matches},{final:true,isForeign:t=>String(t.country_code).toUpperCase()!=='RU'});
    }
    const rows=(data.teams||[]).map(t=>stats(t,currentGroup(data,t.id),matches,s));
    return rank(rows,matches,s,'overall');
  }

  // Article 18: the final classification uses all competition matches. Article
  // 38 leaves a disqualified team's previously earned points intact in history,
  // but those points are not used when final places are distributed. Such a
  // team is therefore shown outside the numbered sporting places.
  function competition(data,{final=false,isForeign}={}){
    const matches=Array.isArray(data.all_matches)?data.all_matches:(data.matches||[]);
    const teams=data.teams||[];
    const eligible=final?teams.filter(t=>!t.is_disqualified):teams;
    let rows=rank(eligible.map(t=>stats(t,null,matches,data.settings)),matches,data.settings,'competition');
    if(final){
      if(typeof isForeign!=='function')throw Error('Final classification requires verified nationality');
      const foreign=new Map(eligible.map(t=>[t.id,isForeign(t)]));
      if([...foreign.values()].some(v=>typeof v!=='boolean'))throw Error('Unknown team nationality');
      rows=[...rows.filter(r=>!foreign.get(r.team_id)),...rows.filter(r=>foreign.get(r.team_id))].map((r,i)=>({...r,place:i+1}));
      const dq=teams.filter(t=>t.is_disqualified).map(t=>({...stats(t,null,matches,data.settings),place:null,disqualified:true,unresolved:false}));
      rows.push(...dq);
    }
    return rows;
  }

  function matchScore(m){
    if(isTechnical(m))return same(winnerId(m),m.home_team_id)?'+:–':'–:+';
    return hasNumericScore(m)?`${m.home_score}:${m.away_score}`:'—';
  }
  function technicalReasonLabel(m){
    return ({INELIGIBLE_PLAYER:'тех. результат · ст. 34',NO_SHOW:'тех. результат · неявка',DISCIPLINARY:'тех. результат · матч прекращён',OTHER:'технический результат'})[technicalType(m)]||'';
  }
  function matchFinishLabel(m){
    if(isTechnical(m))return technicalReasonLabel(m);
    return m?.finish_type==='OT'?'ОТ':m?.finish_type==='SO'?'буллиты':'осн. время';
  }

  const api={TECH_TYPES,hasNumericScore,technicalType,isTechnical,done,finish,winnerId,goalsCount,points,stats,resolve,rank,isCrossover,groupRows,matchesThroughSelectedTour,currentGroup,finalStageComplete,hasVerifiedCountries,overall,competition,matchScore,technicalReasonLabel,matchFinishLabel};
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.CupStandings=api;

  function installBrowserDataEnricher(){
    if(typeof window==='undefined'||typeof window.fetch!=='function'||window.__cupStandingsFetchPatched)return;
    const nativeFetch=window.fetch.bind(window);
    const dataEndpoint='/functions/v1/russian-cup/api/data';
    window.__cupStandingsFetchPatched=true;
    window.fetch=async function(input,init){
      const response=await nativeFetch(input,init);
      try{
        const rawUrl=typeof input==='string'?input:input?.url;
        if(!response.ok||!rawUrl||!String(rawUrl).includes(dataEndpoint))return response;
        const data=await response.clone().json();
        if(!data?.stage||!Array.isArray(data?.stages)||!Array.isArray(data?.matches))return response;
        const current=Number(data.stage.sort_order);
        const prior=data.stages.filter(stage=>Number(stage.sort_order)<current);
        const previous=prior.length?await Promise.all(prior.map(async stage=>{
          const u=new URL(rawUrl,window.location.href);
          u.searchParams.set('stage_id',String(stage.id));
          const r=await nativeFetch(u.toString(),init);
          if(!r.ok)return[];
          const d=await r.json();
          return Array.isArray(d?.matches)?d.matches:[];
        })) : [];
        const byId=new Map();
        for(const m of [...previous.flat(),...data.matches])byId.set(String(m.id??`${m.stage_id}:${m.game_no}:${m.home_team_id}:${m.away_team_id}`),m);
        data.all_matches=[...byId.values()];
        const headers=new Headers(response.headers);
        headers.delete('content-length');
        headers.set('content-type','application/json; charset=utf-8');
        return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers});
      }catch(error){
        console.warn('Standings cumulative data:',error);
        return response;
      }
    };
  }

  function applyRegulationHelp(){
    if(typeof document==='undefined')return;
    const overallTip=document.querySelector('#overall .help .tip');
    if(overallTip)overallTip.textContent='Общая турнирная таблица — накопительная: очки выбранного тура суммируются с очками предыдущих туров. Во 2-м и 3-м турах стыковые матчи учитываются в общей таблице, но не влияют на места внутри группы данного тура. При равенстве очков, если между сравниваемыми командами были матчи: очки в личных встречах → разница шайб в личных встречах → общая разница шайб → все победы → победы в основное время → заброшенные шайбы. Если личных встреч не было: победы в основное время → общая разница шайб → заброшенные шайбы. Для оставшейся равной подгруппы критерии применяются заново с первого пункта. Техническое поражение за участие неоформленного или дисквалифицированного хоккеиста не входит в разницу шайб (ст. 34). Техническая победа учитывается как победа, но Регламент отдельно не говорит, что она является «победой в основное время», поэтому без отдельного официального решения она не увеличивает этот показатель. Очки дисквалифицированной за пропуск тура команды сохраняются в истории, но не учитываются при итоговом распределении мест после всех туров (ст. 38). После трёх отборочных туров места 1–8 выходят в «Золотой финал», 9–20 — в «Серебряный финал». В итоговой классификации иностранные команды располагаются после российских; победитель Кубка — победитель пятого тура в группе «Золотого финала». Основание: статьи 4, 17, 18, 34 и 38 Регламента.';
    const groupTip=document.querySelector('#groups .help .tip');
    if(groupTip)groupTip.textContent='Таблица группы показывает результат именно выбранного тура. Во 2-м и 3-м турах стыковые матчи не влияют на итоговые места в группе. При равенстве очков: очки в личных встречах → разница шайб в личных встречах → общая разница шайб → все победы → победы в основное время → заброшенные шайбы. Если одна из трёх и более равных команд отделилась, оставшиеся сравниваются заново с первого критерия. Технический результат учитывается как победа/поражение; при техническом поражении по ст. 34 результат не включается в разницу забитых и пропущенных шайб. Техническая победа без отдельного официального указания не приравнивается к победе в основное время для отдельного критерия. Основание: статьи 4, 17 и 34 Регламента.';
    const points=document.querySelector('#pointsRule');
    if(points&&!points.dataset.regulationNote)points.dataset.regulationNote='article-14';
  }

  installBrowserDataEnricher();
  if(typeof document!=='undefined'){
    applyRegulationHelp();
    document.addEventListener('DOMContentLoaded',applyRegulationHelp,{once:true});
  }
})(typeof window!=='undefined'?window:globalThis);
