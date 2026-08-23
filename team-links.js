(()=>{
  const STYLE_ID='team-profile-links-style';
  const UNKNOWN='Участник не определен';
  if(!document.getElementById(STYLE_ID)){
    const style=document.createElement('style');style.id=STYLE_ID;style.textContent=`
      .team-profile-link{color:inherit;text-decoration:none;display:inline-flex;align-items:center;gap:inherit;min-width:0;transition:color .16s ease,opacity .16s ease}
      .team-profile-link:hover{color:var(--ice,#7fc6ff)}
      .team-profile-link:focus-visible{outline:2px solid var(--ice,#7fc6ff);outline-offset:3px;border-radius:3px}
      td.team .team-profile-link{display:inline-flex;align-items:center;gap:8px;font-weight:inherit}
      .upcoming-team .team-profile-link,.match-team .team-profile-link{display:flex;align-items:center;gap:8px;font-weight:inherit}
      .match-team.away .team-profile-link{justify-content:flex-end;margin-left:auto}
      .mc-team .team-profile-link{display:grid;justify-items:center;text-align:center;gap:0}
      .mc-period-team .team-profile-link{display:flex;align-items:center;gap:9px}
      .mc-h2h-side .team-profile-link{display:flex;align-items:center;gap:10px}
      .mc-h2h-side.away .team-profile-link{justify-content:flex-end;text-align:right}
      .unknown-team-mark{width:28px;height:28px;border-radius:50%;display:inline-grid;place-items:center;flex:0 0 auto;border:1px solid rgba(127,198,255,.32);background:rgba(127,198,255,.07);color:var(--ice,#7fc6ff);font-size:17px;line-height:1;font-weight:950;box-shadow:inset 0 0 0 1px rgba(255,255,255,.025)}
      .mc-team .unknown-team-mark{width:58px;height:58px;margin:0 auto 12px;font-size:32px}.mc-period-team .unknown-team-mark{width:27px;height:27px;font-size:16px}.mc-h2h-side .unknown-team-mark{width:40px;height:40px;font-size:23px}
      @media(max-width:760px){.mc-h2h-side .team-profile-link{display:grid;justify-items:center;text-align:center;gap:6px}.mc-h2h-side.away .team-profile-link{justify-content:center;text-align:center}.unknown-team-mark{width:24px;height:24px;font-size:15px}.mc-team .unknown-team-mark{width:58px;height:58px}.mc-h2h-side .unknown-team-mark{width:34px;height:34px;font-size:20px}}
    `;document.head.appendChild(style)
  }

  const teamByName=name=>{
    if(typeof D==='undefined'||!Array.isArray(D?.teams))return null;
    const n=String(name||'').replace(/\s+/g,' ').trim().toLowerCase();
    return D.teams.find(t=>String(t.name||'').replace(/\s+/g,' ').trim().toLowerCase()===n)||null;
  };
  const teamById=id=>typeof D!=='undefined'&&Array.isArray(D?.teams)?D.teams.find(t=>Number(t.id)===Number(id)):null;
  const href=id=>`/team.html?team=${encodeURIComponent(id)}`;
  const isUnknown=team=>String(team?.name||'')===UNKNOWN;

  function stopMatchOpen(a){
    if(a.dataset.teamLinkWired==='1')return;
    a.dataset.teamLinkWired='1';
    a.addEventListener('click',e=>e.stopPropagation());
    a.addEventListener('keydown',e=>e.stopPropagation());
  }
  function markUnknown(el){
    if(!el||el.querySelector(':scope > .unknown-team-mark'))return;
    const mark=document.createElement('span');mark.className='unknown-team-mark';mark.textContent='?';mark.setAttribute('aria-hidden','true');
    el.insertBefore(mark,el.firstChild);el.classList.add('logo-ready');
  }
  function wrapContents(el,team){
    if(!el||!team||el.querySelector(':scope > .team-profile-link'))return;
    if(isUnknown(team)){markUnknown(el);return}
    if(el.closest('a'))return;
    const a=document.createElement('a');a.className='team-profile-link';a.href=href(team.id);a.setAttribute('aria-label',`Открыть страницу команды ${team.name}`);
    while(el.firstChild)a.appendChild(el.firstChild);
    el.appendChild(a);stopMatchOpen(a);
  }
  function wrapNameOnly(el,team){
    if(!el||!team||el.closest('a')||el.querySelector(':scope > .team-profile-link'))return;
    if(isUnknown(team)){markUnknown(el);return}
    const a=document.createElement('a');a.className='team-profile-link';a.href=href(team.id);a.setAttribute('aria-label',`Открыть страницу команды ${team.name}`);
    while(el.firstChild)a.appendChild(el.firstChild);
    el.appendChild(a);stopMatchOpen(a);
  }
  function byText(el){return teamByName(el?.dataset?.teamName||el?.textContent||'')}

  function applyTables(){document.querySelectorAll('td.team').forEach(el=>wrapContents(el,byText(el)))}
  function applyUpcoming(){document.querySelectorAll('#upcomingGrid .upcoming-team>span:first-child').forEach(el=>wrapContents(el,byText(el)))}
  function applyMatchRows(){document.querySelectorAll('#matchList .match-team').forEach(el=>wrapContents(el,byText(el)))}
  function applyMatchCenter(){
    if(typeof D==='undefined'||!Array.isArray(D?.teams))return;
    const q=new URL(location.href).searchParams.get('match');
    const m=D.matches?.find(x=>Number(x.id)===Number(q));
    const teams=m?[teamById(m.home_team_id),teamById(m.away_team_id)]:[];
    const mcTeams=[...document.querySelectorAll('#matchCenterOverlay .mc-scoreboard .mc-team')];
    mcTeams.forEach((el,i)=>wrapContents(el,teams[i]||byText(el)));
    document.querySelectorAll('#matchCenterOverlay .mc-period-team').forEach(el=>wrapContents(el,byText(el)));
    document.querySelectorAll('#matchCenterOverlay .mc-h2h-side').forEach(el=>{
      const nameEl=el.querySelector('.mc-h2h-name span');
      const team=byText(nameEl);
      if(team)wrapContents(el,team)
    });
  }
  function applyWinner(){
    const el=document.querySelector('#winnerName');if(!el)return;
    const team=byText(el);if(team)wrapNameOnly(el,team)
  }
  function applyAll(){applyTables();applyUpcoming();applyMatchRows();applyMatchCenter();applyWinner()}

  let queued=false;const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;applyAll()})};
  new MutationObserver(queue).observe(document.body,{childList:true,subtree:true,characterData:true});
  window.addEventListener('popstate',queue);
  document.addEventListener('click',e=>{if(e.target.closest?.('.match-center-clickable,.mc-overlay,.mc-tab'))setTimeout(queue,0)},true);
  setInterval(applyAll,1200);
  applyAll();
})();
