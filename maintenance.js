(()=>{
  // Tournament is live: keep the compatibility/loaders below, but do not show
  // the old public "technical works" notice anymore.
  document.getElementById('maintenance-notice')?.remove();

  const DJ_NAME='Динамо-Джуниверс';
  const DJ_LOGO='https://drive.google.com/thumbnail?id=1HTqvh6fg5ZzOLFwOtY62zucjnRZyOXmu&sz=w512';
  function addDynamoJuniorsLogos(){
    const selectors='td.team,#upcomingGrid .upcoming-team>span:first-child,#matchList .match-team,#matchCenterOverlay .mc-team,#matchCenterOverlay .mc-period-team,#matchCenterOverlay .mc-h2h-side';
    document.querySelectorAll(selectors).forEach(el=>{
      const text=(el.dataset.teamName||el.textContent||'').replace(/\s+/g,' ').trim();
      if(!text.includes(DJ_NAME))return;
      const target=el.querySelector(':scope > .team-profile-link')||el;
      if(target.querySelector('img[data-dj-logo="1"]')||target.querySelector(`img[src*="1HTqvh6fg5ZzOLFwOtY62zucjnRZyOXmu"]`))return;
      if(target.querySelector('img'))return;
      const img=document.createElement('img');
      img.src=DJ_LOGO;
      img.alt='Логотип '+DJ_NAME;
      img.loading='lazy';
      img.decoding='async';
      img.dataset.djLogo='1';
      if(el.classList.contains('mc-team')){
        target.insertBefore(img,target.firstChild);
      }else{
        img.className=el.classList.contains('mc-event')?'mc-event-logo':'team-logo-img';
        if(el.classList.contains('away')||el.classList.contains('mc-h2h-side')&&el.classList.contains('away'))target.appendChild(img);else target.insertBefore(img,target.firstChild);
        el.classList.add('logo-ready');
      }
    });
  }
  let djQueued=false;
  const djQueue=()=>{if(djQueued)return;djQueued=true;requestAnimationFrame(()=>{djQueued=false;addDynamoJuniorsLogos()})};
  new MutationObserver(djQueue).observe(document.body,{childList:true,subtree:true});
  setInterval(addDynamoJuniorsLogos,1200);
  addDynamoJuniorsLogos();

  const path=location.pathname.replace(/\/+$/,'')||'/';
  if(path==='/'&&!document.querySelector('script[data-standings-help-cleanup]')){
    const help=document.createElement('script');
    help.src='/standings-help-cleanup.js?v=20260908-1';
    help.dataset.standingsHelpCleanup='1';
    document.head.appendChild(help);
  }
  if(path==='/'&&!document.querySelector('script[data-overall-equal-place]')){
    const place=document.createElement('script');
    place.src='/overall-equal-place.js?v=20260908-1';
    place.dataset.overallEqualPlace='1';
    document.head.appendChild(place);
  }
  if(path==='/'&&!document.querySelector('script[data-overall-final-zones]')){
    const zones=document.createElement('script');
    zones.src='/overall-final-zones.js?v=20260908-1';
    zones.dataset.overallFinalZones='1';
    document.head.appendChild(zones);
  }
  if((path==='/'||path==='/team.html'||path==='/team')&&!document.querySelector('script[data-technical-results-ui]')){
    const reg=document.createElement('script');
    reg.src='/technical-results-ui.js?v=20260908-1';
    reg.dataset.technicalResultsUi='1';
    document.head.appendChild(reg);
  }
  if(path==='/'&&!document.querySelector('script[data-mobile-layout-fix]')){
    const m=document.createElement('script');
    m.src='/mobile-layout-fix.js?v=20260906-1';
    m.dataset.mobileLayoutFix='1';
    document.head.appendChild(m);
  }
  if(path==='/'&&!document.querySelector('script[data-home-news]')){
    const s=document.createElement('script');
    s.src='/news.js?v=20260903-1';
    s.dataset.homeNews='1';
    document.head.appendChild(s);
  }
  if((path==='/team.html'||path==='/team')&&!document.querySelector('script[data-team-rosters]')){
    const rosterLabels=document.createElement('style');
    rosterLabels.textContent='.roster-card.g .roster-card-head strong,.roster-card.d .roster-card-head strong,.roster-card.f .roster-card-head strong{font-size:0}.roster-card.g .roster-card-head strong:after{content:"Вратари";font-size:11px}.roster-card.d .roster-card-head strong:after{content:"Защитники";font-size:11px}.roster-card.f .roster-card-head strong:after{content:"Нападающие";font-size:11px}';
    document.head.appendChild(rosterLabels);
    const s=document.createElement('script');
    s.src='/rosters.js?v=20260903-1';
    s.dataset.teamRosters='1';
    s.onload=()=>{
      if(document.querySelector('script[data-akm-roster]'))return;
      const a=document.createElement('script');
      a.src='/rosters-akm.js?v=20260903-1';
      a.dataset.akmRoster='1';
      document.head.appendChild(a);
    };
    document.head.appendChild(s);

    const v=document.createElement('script');
    v.src='/rosters-fhr-view.js?v=20260907-4';
    v.dataset.rosterFhrView='1';
    document.head.appendChild(v);

    const live=document.createElement('script');
    live.src='/rosters-live.js?v=20260907-4';
    live.dataset.rostersLive='1';
    document.head.appendChild(live);

    const manual=document.createElement('script');
    manual.src='/player-photo-overrides.js?v=20260907-3';
    manual.dataset.playerPhotoOverrides='1';
    document.head.appendChild(manual);

    const profiles=document.createElement('script');
    profiles.src='/player-profile-links.js?v=20260907-2';
    profiles.dataset.playerProfileLinks='1';
    document.head.appendChild(profiles);

    const standings=document.createElement('script');
    standings.src='/team-standings-sync.js?v=20260908-3';
    standings.dataset.teamStandingsSync='1';
    document.head.appendChild(standings);

    const calendar=document.createElement('script');
    calendar.src='/team-calendar-export.js?v=20260908-1';
    calendar.dataset.teamCalendarExport='1';
    document.head.appendChild(calendar);

    const cityHero=document.createElement('script');
    cityHero.src='/team-city-hero-fallback.js?v=20260908-1';
    cityHero.dataset.teamCityHeroFallback='1';
    document.head.appendChild(cityHero);
  }
})();
