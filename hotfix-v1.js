(()=>{
  const style=document.createElement('style');
  style.id='visual-concept-v1-hotfix';
  style.textContent=`
    html td.team.logo-ready{display:table-cell!important;align-items:initial!important;gap:0!important;white-space:nowrap}
    html td.team.logo-ready .team-logo-img{margin-right:8px;vertical-align:middle}
    html .upcoming-team>span:first-child.logo-ready,html .match-team.logo-ready{display:flex!important;align-items:center;gap:9px}
    html .match-team.away.logo-ready{justify-content:flex-end}
    @media(max-width:760px){
      html .table-wrap{overflow-x:auto!important;-webkit-overflow-scrolling:touch;overscroll-behavior-inline:contain}
      html .table-wrap table{min-width:760px!important;width:760px!important;table-layout:auto!important;border-collapse:separate;border-spacing:0}
      html .table-wrap th,html .table-wrap td{padding:9px 7px!important;font-size:10px!important;height:auto!important;min-height:0!important;line-height:1.25!important}
      html .table-wrap th.team,html .table-wrap td.team{min-width:175px!important;width:175px!important}
      html .table-wrap .team-logo-img{width:22px!important;height:22px!important;margin-right:6px!important}
      html .table-wrap th:first-child,html .table-wrap td:first-child{position:sticky;left:0;z-index:4;min-width:40px;width:40px;background:var(--panel)!important}
      html .table-wrap th.team,html .table-wrap td.team{position:sticky;left:40px;z-index:3;background:var(--panel)!important;box-shadow:1px 0 0 var(--line)}
      html .table-wrap thead th:first-child,html .table-wrap thead th.team{z-index:6}
      html #overallTable tbody tr:nth-child(1) .place,html #overallTable tbody tr:nth-child(2) .place,html #overallTable tbody tr:nth-child(3) .place{display:inline-grid!important;min-width:24px!important;width:24px!important;height:24px!important;margin:0!important}
    }
  `;
  document.head.appendChild(style);

  const done=m=>Number.isInteger(m?.home_score)&&Number.isInteger(m?.away_score)&&m.home_score!==m.away_score;
  const renderedSort=(a,b)=>String(a.game_date||'').localeCompare(String(b.game_date||''))||((a.game_no||0)-(b.game_no||0));
  function currentVisibleMatches(){
    if(typeof D==='undefined'||!Array.isArray(D?.matches))return [];
    const gf=document.querySelector('#gf')?.value||'ALL';
    const sf=document.querySelector('#sf')?.value||'ALL';
    const today=new Date().toISOString().slice(0,10);
    return [...D.matches]
      .filter(m=>gf==='ALL'||String(m.group_id)===gf)
      .filter(m=>sf==='ALL'||(sf==='TODAY'?m.game_date===today:sf==='DONE'?done(m):!done(m)))
      .sort(renderedSort);
  }
  function currentUpcoming(){
    if(typeof D==='undefined'||!Array.isArray(D?.matches))return [];
    return [...D.matches].filter(m=>!done(m)).sort(renderedSort).slice(0,4);
  }
  function matchForElement(el){
    if(!el)return null;
    if(el.closest('#upcomingGrid')){
      const cards=[...document.querySelectorAll('#upcomingGrid .upcoming-card')];
      return currentUpcoming()[cards.indexOf(el)]||null;
    }
    if(el.closest('#matchList')){
      const rows=[...document.querySelectorAll('#matchList .match-row')];
      return currentVisibleMatches()[rows.indexOf(el)]||null;
    }
    return null;
  }
  function fixElement(el){
    const m=matchForElement(el);if(!m)return;
    el.dataset.matchId=String(m.id);
    if(typeof D!=='undefined'&&Array.isArray(D?.teams)){
      const tn=id=>D.teams.find(t=>Number(t.id)===Number(id))?.name||'—';
      el.setAttribute('aria-label',`Открыть матч-центр: ${tn(m.home_team_id)} — ${tn(m.away_team_id)}`);
    }
  }
  function fixAll(){
    document.querySelectorAll('#upcomingGrid .upcoming-card,#matchList .match-row').forEach(fixElement);
  }
  document.addEventListener('click',e=>{
    const el=e.target.closest?.('.match-center-clickable');if(el)fixElement(el);
  },true);
  document.addEventListener('keydown',e=>{
    if((e.key==='Enter'||e.key===' ')&&e.target.matches?.('.match-center-clickable'))fixElement(e.target);
  },true);
  let queued=false;const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;fixAll()})};
  new MutationObserver(queue).observe(document.body,{childList:true,subtree:true});
  document.querySelector('#gf')?.addEventListener('change',queue);
  document.querySelector('#sf')?.addEventListener('change',queue);
  setInterval(fixAll,500);
  fixAll();
})();