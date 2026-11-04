(function hybridPreview(){
  const LOGOS={"Динамо Москва":"https://drive.google.com/thumbnail?id=1I3KuJZEajmksDKtoBsdj4h_75fU0e_KY&sz=w512","МАХ":"https://drive.google.com/thumbnail?id=1Veii4NYgKc06nRtxKmCRQv1YCE164YZP&sz=w512","Торпедо":"https://drive.google.com/thumbnail?id=17NYLCFaSrX6q4g0T7jhBnmidrI1JzKl9&sz=w512","Локомотив":"https://drive.google.com/thumbnail?id=1D6wJnaawN4kMt-1ZWTSvf-trYkslzyKi&sz=w512","Авангард":"https://drive.google.com/thumbnail?id=1y6CZfZSXYDVqCAjOvv6xB_7Fwu1AQwvn&sz=w512","Локомотив 2004":"https://drive.google.com/thumbnail?id=1sq7UHtBq_xiexekxmzWawF3yVTaEl-J-&sz=w512","Крылья Советов":"https://drive.google.com/thumbnail?id=1n6ViHZhkRvq_R_Ul1PEHnFnX7HVNk6-p&sz=w512","Сибирь":"https://drive.google.com/thumbnail?id=1Xul8VXC7juk2NHQfb28Cl9Jt_Kj0Obw-&sz=w512","Лада":"https://drive.google.com/thumbnail?id=15mcwMoXT7OaH46jj8w90PCeTtJY54UAF&sz=w512","Трактор":"https://drive.google.com/thumbnail?id=1qWTRWy-p36RDSMlAy4AqA60PrrUTaczd&sz=w512","Ак Барс":"https://drive.google.com/thumbnail?id=1I09r6XwD-9L4r5ojPGKCHsJ5WGUyOFy1&sz=w512","Спартак":"https://drive.google.com/thumbnail?id=19kJ3uz-yyb1Z2y8qvRbFwuw_2kjUUD2f&sz=w512","Динамо СПБ":"https://drive.google.com/thumbnail?id=1x4KaAFMJ_qfmi26oVjnsc-huKpWtqBbh&sz=w512","СКА-Стрельна":"https://drive.google.com/thumbnail?id=1DH_sKpyVZsh6vnt8Q1_ovBpDuVkPHrNh&sz=w512","АКМ":"https://drive.google.com/thumbnail?id=1NmPj1OwI3C1yuNmgt2XX57HbEiiDauB7&sz=w512","ЦСКА":"https://drive.google.com/thumbnail?id=1bT6o4afTqonyA05keLbe_nfQ78sAmNda&sz=w512","Армия СКА":"https://drive.google.com/thumbnail?id=14XZX2FRyR5x_aVkU2SMLhW-Emk0RUkTo&sz=w512","Нефтехимик":"https://drive.google.com/thumbnail?id=1csEdtjesEvgAFSsfnfhmWUnUE23Tnqeg&sz=w512","Северсталь":"https://drive.google.com/thumbnail?id=10xBTOFy_ps1G3LNaHV3WpbQkuZ74pjRn&sz=w512","Красная Машина Юниор":"https://drive.google.com/thumbnail?id=1qATM0WxWDCgYfemDQvhdy30Ub0sWSWWV&sz=w512"};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl=v=>/^https:\/\//.test(String(v||''))?String(v):'';
  const done=m=>Number.isInteger(m?.home_score)&&Number.isInteger(m?.away_score)&&m.home_score!==m.away_score;
  const sort=(a,b)=>String(a.game_date).localeCompare(String(b.game_date))||Number(a.game_no||0)-Number(b.game_no||0);
  const dateLabel=x=>{try{return new Date(x+'T12:00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'short'})}catch{return x}};
  const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Moscow',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const team=id=>D.teams.find(t=>Number(t.id)===Number(id))?.name||'Команда уточняется';
  const group=id=>D.groups.find(g=>Number(g.id)===Number(id))?.code||'';
  const logo=name=>safeUrl(LOGOS[name]||'');
  const teamImg=(name,cls='')=>logo(name)?`<img class="${cls}" src="${esc(logo(name))}" alt="${esc(name)}" loading="lazy" onerror="this.style.visibility='hidden'">`:`<span class="pv-logo-placeholder">🏒</span>`;
  const stream=m=>safeUrl(m.stream_url);
  let groupIndex=0,statsFetchedAt=0,statsBusy=false,leaderData=null;
  const root=document.createElement('section');root.className='pv-dashboard wrap';root.id='pvDashboard';
  root.innerHTML=`
    <div class="pv-stats" id="pvStats"></div>
    <div class="pv-grid">
      <article class="pv-panel">
        <div class="pv-panel-head"><h2>Последний результат</h2><a href="#matches">Все матчи ›</a></div>
        <div id="pvFeatured"></div>
      </article>
      <article class="pv-panel">
        <div class="pv-panel-head"><h2>Ближайшие матчи</h2><a href="#matches">Календарь ›</a></div>
        <div id="pvSchedule" class="pv-schedule-list"></div>
      </article>
      <article class="pv-panel">
        <div class="pv-panel-head"><h2>Таблица группы</h2><a href="#groups">Все группы ›</a></div>
        <div id="pvGroups"></div><div id="pvGroupTable"></div>
        <div class="pv-panel-bottom"><a href="#overall">Общая таблица турнира ›</a></div>
      </article>
    </div>
    <div class="pv-lower">
      <article class="pv-panel">
        <div class="pv-panel-head"><h2>Лидеры турнира</h2><a href="/stats">Полная статистика ›</a></div>
        <div id="pvLeaders" class="pv-leaders"><div style="padding:20px;color:#8fa8c5">Загружаем статистику игроков…</div></div>
      </article>
      <article class="pv-panel">
        <div class="pv-panel-head"><h2>Информация о турнире</h2><a href="/news.html">Новости ›</a></div>
        <div class="pv-links">
          <a class="pv-link" href="/tour-path.html"><strong>Путь в третий тур</strong><span>Система отбора ↗</span></a>
          <a class="pv-link" href="/stats"><strong>Статистика игроков</strong><span>Бомбардиры и вратари ↗</span></a>
          <a class="pv-link" href="/teams.html"><strong>Участники турнира</strong><span>Все команды ↗</span></a>
          <a class="pv-link" href="/news.html"><strong>Новости Кубка</strong><span>Материалы и события ↗</span></a>
        </div>
      </article>
    </div>`;
  document.querySelector('#upcoming')?.before(root);
  const bar=document.createElement('div');bar.className='pv-preview-bar';
  bar.innerHTML='<div class="wrap"><strong>✦ ТЕСТОВЫЙ ДИЗАЙН · ГИБРИД KHL / FLASHSCORE</strong><a href="https://tournamentu16.ru/" target="_blank" rel="noopener noreferrer">Открыть действующий сайт ↗</a></div>';
  document.querySelector('.site-header')?.after(bar);
  document.querySelector('.nav a[href="#upcoming"]')?.setAttribute('href','#pvDashboard');
  function statCard(symbol,num,label){return `<div class="pv-stat"><span class="pv-stat-icon">${symbol}</span><div><strong>${num}</strong><span>${label}</span></div></div>`}
  function featured(m){
    if(!m)return '<div class="pv-feature" style="justify-content:center;color:#a6bdd9">Матчи пока не добавлены.</div>';
    const home=team(m.home_team_id),away=team(m.away_team_id),isDone=done(m);
    const status=isDone?'<span class="pv-pill">✓ Завершён</span>':'<span class="pv-pill future">◉ Предстоит</span>';
    const p=(a,b)=>Number.isInteger(a)&&Number.isInteger(b)?`<span>${a}:${b}</span>`:'';
    const periods=isDone?[p(m.p1_home,m.p1_away),p(m.p2_home,m.p2_away),p(m.p3_home,m.p3_away)].join(''):'';
    return `<div class="pv-feature">
      <div class="pv-feature-meta"><span>${esc(group(m.group_id))} · ${esc(dateLabel(m.game_date))} · Матч №${esc(m.game_no)}</span>${status}</div>
      <div class="pv-scoreboard match-center-clickable" data-match-id="${Number(m.id)}" tabindex="0" role="button" aria-label="Открыть матч-центр: ${esc(home)} — ${esc(away)}" style="cursor:pointer">
        <div class="pv-team">${teamImg(home)}<strong>${esc(home)}</strong></div>
        <div class="pv-score"><strong>${isDone?`${m.home_score} : ${m.away_score}`:'— : —'}</strong><small>${isDone?(m.finish_type==='OT'?'Овертайм':m.finish_type==='SO'?'Буллиты':'Основное время'):(esc(m.start_time||'Время уточняется'))}</small><div class="pv-periods">${periods}</div></div>
        <div class="pv-team">${teamImg(away)}<strong>${esc(away)}</strong></div>
      </div>
      <div class="pv-feature-actions">
        <button class="pv-action match-center-clickable" data-match-id="${Number(m.id)}" type="button">▤ Протокол матча</button>
        ${stream(m)?`<a class="pv-action blue" href="${esc(stream(m))}" target="_blank" rel="noopener noreferrer">▶ ${isDone?'Смотреть запись':'Трансляция'}</a>`:`<a class="pv-action blue" href="https://vkvideo.ru/playlist/-133823152_14" target="_blank" rel="noopener noreferrer">▶ Эфиры тура</a>`}
      </div></div>`;
  }
  function gameRow(m){
    const h=team(m.home_team_id),a=team(m.away_team_id),f=done(m);
    return `<div class="pv-game match-center-clickable" data-match-id="${Number(m.id)}" tabindex="0" role="button" aria-label="Открыть матч ${esc(h)} — ${esc(a)}">
      <div class="pv-game-time">${esc(dateLabel(m.game_date))}<span>${esc(m.start_time||'—')}</span></div>
      <div class="pv-game-names"><div class="pv-game-team">${teamImg(h)}<span>${esc(h)}</span></div><div class="pv-game-team">${teamImg(a)}<span>${esc(a)}</span></div></div>
      <div class="pv-game-score">${f?`${m.home_score}<br>${m.away_score}`:'—<br>—'}<span>${esc(group(m.group_id))}</span></div>
    </div>`;
  }
  function drawGroup(){
    if(!D?.groups?.length)return;
    const groups=[...D.groups].sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
    groupIndex=Math.min(groupIndex,groups.length-1);
    const selected=groups[groupIndex];
    document.querySelector('#pvGroups').innerHTML='<div class="pv-groups">'+groups.map((g,i)=>`<button type="button" class="pv-group-btn ${i===groupIndex?'active':''}" data-pv-group="${i}">${esc(g.code||g.name)}</button>`).join('')+'</div>';
    let rows=[];
    try{rows=groupRows(selected,D.settings)}catch(e){console.warn('Preview group table',e)}
    document.querySelector('#pvGroupTable').innerHTML=`<table class="pv-table"><thead><tr><th>№</th><th>Команда</th><th>И</th><th>О</th></tr></thead><tbody>${rows.map((r,i)=>`<tr><td>${i+1}</td><td>${teamImg(r.team)}<span class="pv-team-name">${esc(r.team)}</span></td><td>${Number(r.gp||0)}</td><td>${Number(r.pts||0)}</td></tr>`).join('')}</tbody></table>`;
  }
  function drawLeaders(){
    const el=document.querySelector('#pvLeaders');if(!el)return;
    if(!leaderData){el.innerHTML='<div style="padding:18px;color:#9cb4d2">Статистика игроков загружается…</div>';return}
    const rows=leaderData.slice(0,3);
    el.innerHTML=rows.length?rows.map((p,i)=>`<div class="pv-leader">
      <span class="pv-leader-rank">${i+1}</span>${safeUrl(p.team_logo)?`<img class="pv-leader-logo" src="${esc(safeUrl(p.team_logo))}" alt="">`:teamImg(p.team,'pv-leader-logo')}
      <div><div class="pv-leader-name">${esc(p.name)}</div><span class="pv-leader-team">${esc(p.team)} · ${Number(p.goals||0)}+${Number(p.assists||0)}</span></div>
      <div class="pv-leader-pts">${Number(p.points||0)}<small>очков</small></div></div>`).join(''):'<div style="padding:18px;color:#9cb4d2">Пока нет статистики игроков.</div>';
  }
  async function fetchLeaders(){
    if(statsBusy||Date.now()-statsFetchedAt<90000)return;
    statsBusy=true;statsFetchedAt=Date.now();
    try{
      const r=await fetch('https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-stats?stage_id=all',{cache:'no-store'});
      if(!r.ok)throw Error('stats '+r.status);
      const json=await r.json();if(!json.ok||!Array.isArray(json.players))throw Error('stats unavailable');
      leaderData=json.players;drawLeaders();
    }catch(e){console.warn('Hybrid preview leaders',e);document.querySelector('#pvLeaders').innerHTML='<div style="padding:18px;color:#9cb4d2">Статистика временно недоступна. <a href="/stats">Открыть раздел ↗</a></div>'}
    finally{statsBusy=false}
  }
  function draw(){
    if(typeof D==='undefined'||!D?.matches||!D?.teams)return;
    document.querySelector('#heroTitle').textContent=D.tournament.name;
    const ms=[...D.matches].sort(sort),finished=ms.filter(done),future=ms.filter(m=>!done(m));
    const scored=finished.reduce((s,m)=>s+Number(m.home_score||0)+Number(m.away_score||0),0);
    document.querySelector('#pvStats').innerHTML=[
      statCard('▦',finished.length,'матчей сыграно · этот тур'),
      statCard('◉',scored,'заброшено шайб · этот тур'),
      statCard('♧',D.teams.length,'команд в текущем туре'),
      statCard('▤',D.groups.length,'группы турнира')
    ].join('');
    document.querySelector('#pvFeatured').innerHTML=featured(finished.length?finished[finished.length-1]:ms[0]);
    const near=future.length?future.slice(0,4):finished.slice(-4).reverse();
    document.querySelector('#pvSchedule').innerHTML=near.length?near.map(gameRow).join(''):'<div style="padding:20px;color:#a4b8d2">Матчей нет.</div>';
    const title=document.querySelector('.pv-grid>.pv-panel:nth-child(2) h2');if(title)title.textContent=future.length?'Ближайшие матчи':'Последние матчи';
    drawGroup();drawLeaders();fetchLeaders();
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('[data-pv-group]');if(!b)return;
    groupIndex=Number(b.dataset.pvGroup);drawGroup();
  });
  document.addEventListener('keydown',e=>{
    if((e.key==='Enter'||e.key===' ')&&e.target.matches?.('.pv-game,.pv-scoreboard')){e.preventDefault();e.target.click()}
  });

  // Match cards: three rounded, horizontal cards per row instead of a full-width match list.
  function renderHybridMatches(){
    if(typeof D==='undefined'||!D?.matches)return;
    const gf=document.querySelector('#gf')?.value||'ALL';
    const sf=document.querySelector('#sf')?.value||'ALL';
    const currentDay=new Date().toISOString().slice(0,10);
    const visible=[...D.matches]
      .filter(m=>gf==='ALL'||String(m.group_id)===gf)
      .filter(m=>sf==='ALL'||(sf==='TODAY'?m.game_date===currentDay:sf==='DONE'?done(m):!done(m)))
      .sort(sort);
    const list=document.querySelector('#matchList');
    if(!list)return;
    if(!visible.length){
      list.innerHTML='<div class="card empty">Матчей по выбранному фильтру нет.</div>';
      return;
    }
    const byDate=new Map();
    for(const m of visible){
      if(!byDate.has(m.game_date))byDate.set(m.game_date,[]);
      byDate.get(m.game_date).push(m);
    }
    const card=m=>{
      const home=team(m.home_team_id),away=team(m.away_team_id);
      const finished=done(m);
      const time=typeof matchTime==='function'?matchTime(m):m.start_time||'';
      const venue=typeof matchPlace==='function'?matchPlace(m):'';
      const result=finished?m.home_score+' : '+m.away_score:'— : —';
      const resultType=finished?(typeof finishLabel==='function'?finishLabel(m.finish_type):'Завершён'):'Матч предстоит';
      return `<article class="match-row pv-match-card match-center-clickable" data-match-id="${Number(m.id)}" tabindex="0" role="button" aria-label="Открыть матч-центр: ${esc(home)} — ${esc(away)}">
        <div class="pv-match-top">
          <span class="pv-match-group">${esc(group(m.group_id))}</span>
          <span class="pv-match-number">МАТЧ №${esc(m.game_no??'—')}</span>
          <span class="pv-match-time">${esc(time||'Время уточняется')}</span>
        </div>
        <div class="pv-match-center">
          <div class="pv-match-side">${teamImg(home,'pv-match-logo')}<strong>${esc(home)}</strong></div>
          <div class="pv-match-score"><strong>${result}</strong><span>${finished?'ИТОГ':'СКОРО'}</span></div>
          <div class="pv-match-side">${teamImg(away,'pv-match-logo')}<strong>${esc(away)}</strong></div>
        </div>
        <div class="pv-match-bottom">
          <span class="pv-match-result ${finished?'is-finished':''}"><i></i>${esc(resultType)}</span>
          <span class="pv-match-open">Матч-центр <b>↗</b></span>
        </div>
        ${venue?`<div class="pv-match-venue" title="${esc(venue)}">${esc(venue)}</div>`:''}
      </article>`;
    };
    list.innerHTML=[...byDate.entries()].map(([date,games])=>`<section class="pv-match-date-group">
      <h3 class="date-heading">${esc(typeof fmtLong==='function'?fmtLong(date):date)} <span class="pv-match-count">${games.length} ${games.length===1?'матч':'матчей'}</span></h3>
      <div class="match-list">${games.map(card).join('')}</div>
    </section>`).join('');
  }
  renderMatches=renderHybridMatches;
  document.querySelector('#gf').onchange=renderHybridMatches;
  document.querySelector('#sf').onchange=renderHybridMatches;
  const previousRender=render;
  render=function(...args){const result=previousRender.apply(this,args);draw();return result};
  if(typeof D!=='undefined'&&D?.matches)draw();
})();