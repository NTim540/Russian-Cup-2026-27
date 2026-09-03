(()=>{
  const ID='maintenance-notice',STYLE_ID='maintenance-notice-style';
  if(document.getElementById(ID))return;

  if(!document.getElementById(STYLE_ID)){
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      #${ID}{position:relative;z-index:70;border-bottom:1px solid rgba(127,198,255,.16);background:linear-gradient(90deg,rgba(47,111,237,.13),rgba(10,28,47,.96) 38%,rgba(226,58,71,.07));color:#e8f2fb}
      #${ID} .mn-inner{width:min(1240px,calc(100% - 32px));margin:auto;min-height:54px;display:flex;align-items:center;gap:13px;padding:9px 0}
      #${ID} .mn-icon{width:30px;height:30px;flex:0 0 30px;display:grid;place-items:center;border-radius:9px;border:1px solid rgba(127,198,255,.22);background:rgba(127,198,255,.08);font-size:14px}
      #${ID} .mn-copy{min-width:0;display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;line-height:1.4}
      #${ID} strong{font-size:11px;text-transform:uppercase;letter-spacing:.09em;font-weight:950;color:#cfeaff}
      #${ID} span{font-size:12px;color:#9fb0c4}
      html[data-theme='light'] #${ID}{background:linear-gradient(90deg,rgba(47,111,237,.08),rgba(255,255,255,.96) 42%,rgba(226,58,71,.04));border-bottom-color:rgba(20,45,80,.10);color:#102139}
      html[data-theme='light'] #${ID} .mn-icon{background:rgba(47,111,237,.06);border-color:rgba(47,111,237,.15)}
      html[data-theme='light'] #${ID} strong{color:#245a94}
      html[data-theme='light'] #${ID} span{color:#66788e}
      @media(max-width:680px){#${ID} .mn-inner{width:calc(100% - 20px);align-items:flex-start;padding:10px 0}#${ID} .mn-copy{display:grid;gap:2px}#${ID} span{font-size:11px}}
    `;
    document.head.appendChild(style);
  }

  const notice=document.createElement('div');
  notice.id=ID;
  notice.setAttribute('role','status');
  notice.innerHTML=`<div class="mn-inner"><div class="mn-icon" aria-hidden="true">⚙</div><div class="mn-copy"><strong>Технические работы</strong><span>Ведём работу по оптимизации карточек команд. Отдельные элементы на страницах команд могут временно отображаться нестабильно.</span></div></div>`;

  const header=document.querySelector('.site-header,.header');
  if(header)header.insertAdjacentElement('afterend',notice);else document.body.prepend(notice);

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
  }
})();
