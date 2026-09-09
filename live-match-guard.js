(()=>{
  const R=window.CupStandings;
  if(!R||R.__liveGuardInstalled)return;
  R.__liveGuardInstalled=true;

  const original={
    done:R.done,
    stats:R.stats,
    resolve:R.resolve,
    rank:R.rank,
    groupRows:R.groupRows,
    overall:R.overall,
    competition:R.competition,
    finalStageComplete:R.finalStageComplete
  };

  const state=m=>String(m?.fhr_live_state||'').toUpperCase();
  const isLive=m=>{
    if(R.isTechnical(m))return false;
    if(m?.fhr_live_final_at||state(m)==='FINAL')return false;
    return m?.fhr_live_auto===true&&['WATCHING','ERROR'].includes(state(m));
  };
  const scrubMatch=m=>isLive(m)?{...m,home_score:null,away_score:null}:m;
  const scrubMatches=matches=>(matches||[]).map(scrubMatch);
  const scrubData=data=>({...data,matches:scrubMatches(data?.matches),all_matches:Array.isArray(data?.all_matches)?scrubMatches(data.all_matches):data?.all_matches});

  R.isLive=isLive;
  R.done=m=>isLive(m)?false:original.done(m);
  R.stats=(t,g,matches,s)=>original.stats(t,g,scrubMatches(matches),s);
  R.resolve=(rows,matches,s,mode)=>original.resolve(rows,scrubMatches(matches),s,mode);
  R.rank=(rows,matches,s,mode)=>original.rank(rows,scrubMatches(matches),s,mode);
  R.groupRows=(data,g,s=data?.settings)=>original.groupRows(scrubData(data),g,s);
  R.overall=(data,s=data?.settings)=>original.overall(scrubData(data),s);
  R.competition=(data,opt={})=>original.competition(scrubData(data),opt);
  R.finalStageComplete=data=>original.finalStageComplete(scrubData(data));
})();
