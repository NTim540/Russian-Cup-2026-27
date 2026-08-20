(()=>{
  const TEAM_LOGOS={
    'Динамо Москва':'https://drive.google.com/thumbnail?id=1I3KuJZEajmksDKtoBsdj4h_75fU0e_KY&sz=w512',
    'МАХ':'https://drive.google.com/thumbnail?id=1Veii4NYgKc06nRtxKmCRQv1YCE164YZP&sz=w512',
    'Торпедо':'https://drive.google.com/thumbnail?id=17NYLCFaSrX6q4g0T7jhBnmidrI1JzKl9&sz=w512',
    'Локомотив':'https://drive.google.com/thumbnail?id=1D6wJnaawN4kMt-1ZWTSvf-trYkslzyKi&sz=w512',
    'Авангард':'https://drive.google.com/thumbnail?id=1y6CZfZSXYDVqCAjOvv6xB_7Fwu1AQwvn&sz=w512',
    'Локомотив 2004':'https://drive.google.com/thumbnail?id=1sq7UHtBq_xiexekxmzWawF3yVTaEl-J-&sz=w512',
    'Крылья Советов':'https://drive.google.com/thumbnail?id=1n6ViHZhkRvq_R_Ul1PEHnFnX7HVNk6-p&sz=w512',
    'Сибирь':'https://drive.google.com/thumbnail?id=1Xul8VXC7juk2NHQfb28Cl9Jt_Kj0Obw-&sz=w512',
    'Лада':'https://drive.google.com/thumbnail?id=15mcwMoXT7OaH46jj8w90PCeTtJY54UAF&sz=w512',
    'Трактор':'https://drive.google.com/thumbnail?id=1qWTRWy-p36RDSMlAy4AqA60PrrUTaczd&sz=w512',
    'Ак Барс':'https://drive.google.com/thumbnail?id=1I09r6XwD-9L4r5ojPGKCHsJ5WGUyOFy1&sz=w512',
    'Спартак':'https://drive.google.com/thumbnail?id=19kJ3uz-yyb1Z2y8qvRbFwuw_2kjUUD2f&sz=w512',
    'Динамо СПБ':'https://drive.google.com/thumbnail?id=1x4KaAFMJ_qfmi26oVjnsc-huKpWtqBbh&sz=w512',
    'СКА-Стрельна':'https://drive.google.com/thumbnail?id=1DH_sKpyVZsh6vnt8Q1_ovBpDuVkPHrNh&sz=w512',
    'АКМ':'https://drive.google.com/thumbnail?id=1NmPj1OwI3C1yuNmgt2XX57HbEiiDauB7&sz=w512',
    'ЦСКА':'https://drive.google.com/thumbnail?id=1bT6o4afTqonyA05keLbe_nfQ78sAmNda&sz=w512',
    'Армия СКА':'https://drive.google.com/thumbnail?id=14XZX2FRyR5x_aVkU2SMLhW-Emk0RUkTo&sz=w512',
    'Нефтехимик':'https://drive.google.com/thumbnail?id=1csEdtjesEvgAFSsfnfhmWUnUE23Tnqeg&sz=w512',
    'Северсталь':'https://drive.google.com/thumbnail?id=10xBTOFy_ps1G3LNaHV3WpbQkuZ74pjRn&sz=w512',
    'Красная Машина Юниор':'https://drive.google.com/thumbnail?id=1qATM0WxWDCgYfemDQvhdy30Ub0sWSWWV&sz=w512'
  };
  const CUP_LOGO='https://drive.google.com/thumbnail?id=1hwFp1ukBAQ_Qd-nI5okdiejSRlUrfLeB&sz=w512';
  const FHR_LOGO='https://drive.google.com/thumbnail?id=1nFMK_7IvAoiHPbC7z9k_eLlwsrw3Bcmx&sz=w512';

  const style=document.createElement('style');
  style.textContent=`
    .site-logo-img{width:30px;height:30px;object-fit:contain;display:block}
    .brand-mark{overflow:hidden}
    .team-logo-img{width:28px;height:28px;object-fit:contain;display:inline-block;vertical-align:middle;flex:0 0 auto;filter:drop-shadow(0 3px 7px rgba(0,0,0,.22))}
    td.team.logo-ready,.upcoming-team>span:first-child.logo-ready,.match-team.logo-ready{display:flex;align-items:center;gap:9px}
    .match-team.away.logo-ready{justify-content:flex-end}
    .organizer-logo-img{width:56px;height:56px;object-fit:contain;display:block}
    .winner-logo-img{width:84px;height:84px;object-fit:contain;display:block}
    .match-center-clickable{cursor:pointer;position:relative}
    .match-center-clickable:focus-visible{outline:2px solid #7fc6ff;outline-offset:3px}
    .match-center-clickable:hover{border-color:rgba(127,198,255,.42)!important}
    .mc-overlay{position:fixed;inset:0;z-index:999;background:rgba(2,8,16,.82);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:18px;opacity:0;visibility:hidden;transition:.18s ease}
    .mc-overlay.open{opacity:1;visibility:visible}
    .mc-dialog{width:min(900px,100%);max-height:92vh;overflow:auto;border:1px solid rgba(127,198,255,.18);border-radius:24px;background:linear-gradient(180deg,#10223a,#081523 88%);box-shadow:0 30px 100px rgba(0,0,0,.62);transform:translateY(12px) scale(.985);transition:.18s ease}
    .mc-overlay.open .mc-dialog{transform:none}
    .mc-head{position:sticky;top:0;z-index:3;display:flex;justify-content:space-between;align-items:center;gap:14px;padding:15px 18px;border-bottom:1px solid rgba(255,255,255,.08);background:rgba(8,21,35,.88);backdrop-filter:blur(16px)}
    .mc-kicker{font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:#7fc6ff;font-weight:900}.mc-title{font-size:16px;font-weight:900;margin-top:3px}.mc-close{width:38px;height:38px;border-radius:12px;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.05);color:#fff;font-size:22px;cursor:pointer}
    .mc-body{padding:22px}.mc-scoreboard{display:grid;grid-template-columns:1fr 150px 1fr;align-items:center;gap:18px;padding:22px;border:1px solid rgba(255,255,255,.08);border-radius:20px;background:linear-gradient(145deg,rgba(47,111,237,.09),rgba(255,255,255,.025))}
    .mc-team{text-align:center;font-weight:900;font-size:18px;min-width:0}.mc-team img{width:78px;height:78px;object-fit:contain;display:block;margin:0 auto 12px;filter:drop-shadow(0 8px 18px rgba(0,0,0,.28))}.mc-team span{display:block}.mc-score{text-align:center}.mc-score strong{display:block;font-size:52px;line-height:.95;letter-spacing:-.045em}.mc-score small{display:block;color:#91a0b4;margin-top:8px;font-size:10px;text-transform:uppercase;letter-spacing:.1em}
    .mc-meta{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:13px}.mc-chip{padding:7px 10px;border:1px solid rgba(255,255,255,.09);border-radius:999px;background:rgba(255,255,255,.035);color:#aebccc;font-size:11px}
    .mc-section{margin-top:22px}.mc-section h3{margin:0 0 11px;font-size:18px}.mc-periods{overflow:auto;border:1px solid rgba(255,255,255,.08);border-radius:16px}.mc-periods table{min-width:560px}.mc-periods th,.mc-periods td{padding:12px 11px}.mc-periods td:first-child,.mc-periods th:first-child{text-align:left;min-width:180px}.mc-period-team{display:flex;align-items:center;gap:9px;font-weight:800}.mc-period-team img{width:27px;height:27px;object-fit:contain}.mc-final{font-weight:950;color:#fff}
    .mc-protocol{display:grid;gap:14px}.mc-period-block{border:1px solid rgba(255,255,255,.08);border-radius:16px;overflow:hidden}.mc-period-title{padding:10px 13px;background:rgba(255,255,255,.035);color:#b8c7d9;font-size:11px;text-transform:uppercase;letter-spacing:.11em;font-weight:900}.mc-event{display:grid;grid-template-columns:62px 34px minmax(0,1fr) auto;align-items:center;gap:10px;padding:12px 13px;border-top:1px solid rgba(255,255,255,.06)}.mc-event:first-of-type{border-top:0}.mc-event-time{font-weight:900;color:#dbe8f7}.mc-event-logo{width:30px;height:30px;object-fit:contain}.mc-event-main strong{display:block;font-size:13px}.mc-event-main span{display:block;color:#8fa0b5;font-size:11px;line-height:1.45;margin-top:2px}.mc-event-score{font-weight:950;font-size:14px}.mc-event-type{display:inline-block;margin-right:6px;color:#7fc6ff}.mc-event.penalty .mc-event-type{color:#ff9ca4}.mc-empty{padding:22px;border:1px dashed rgba(255,255,255,.11);border-radius:16px;color:#8fa0b5;text-align:center;font-size:12px;line-height:1.55}
    @media(max-width:760px){.team-logo-img{width:24px;height:24px}td.team.logo-ready,.upcoming-team>span:first-child.logo-ready,.match-team.logo-ready{gap:7px}.site-logo-img{width:26px;height:26px}.mc-overlay{padding:0;align-items:flex-end}.mc-dialog{width:100%;max-height:94vh;border-radius:22px 22px 0 0}.mc-body{padding:14px}.mc-scoreboard{grid-template-columns:1fr 100px 1fr;gap:9px;padding:16px 10px}.mc-team{font-size:13px}.mc-team img{width:58px;height:58px;margin-bottom:8px}.mc-score strong{font-size:36px}.mc-event{grid-template-columns:48px 28px minmax(0,1fr) auto;padding:11px 10px;gap:8px}.mc-event-logo{width:25px;height:25px}.mc-meta{justify-content:flex-start}}
  `;
  document.head.appendChild(style);

  function img(src,cls,alt){const i=document.createElement('img');i.src=src;i.className=cls;i.alt=alt;i.loading='lazy';i.decoding='async';return i}
  function escHtml(x){return String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function cleanName(el){return (el.dataset.teamName||el.textContent||'').trim()}
  function decorate(el,away=false){
    if(!el||el.dataset.logoApplied==='1')return;
    const name=cleanName(el),src=TEAM_LOGOS[name];
    if(!src)return;
    el.dataset.teamName=name;
    const logo=img(src,'team-logo-img','Логотип '+name);
    if(away)el.appendChild(logo);else el.insertBefore(logo,el.firstChild);
    el.classList.add('logo-ready');el.dataset.logoApplied='1';
  }
  function isDone(m){return Number.isInteger(m?.home_score)&&Number.isInteger(m?.away_score)&&m.home_score!==m.away_score}
  function getTeam(id){return typeof D!=='undefined'&&D?.teams?D.teams.find(t=>Number(t.id)===Number(id)):null}
  function teamNameById(id){return getTeam(id)?.name||'—'}
  function teamLogoHtml(id,cls=''){const name=teamNameById(id),src=TEAM_LOGOS[name];return src?`<img class="${cls}" src="${src}" alt="Логотип ${escHtml(name)}">`:''}
  function groupName(id){const g=typeof D!=='undefined'&&D?.groups?D.groups.find(x=>Number(x.id)===Number(id)):null;return g?.name||g?.code||''}
  function finishText(ft){return ft==='OT'?'Овертайм':ft==='SO'?'Буллиты':'Основное время'}
  function prettyDate(x){try{return new Date(x+'T12:00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'})}catch{return x||''}}

  const overlay=document.createElement('div');
  overlay.className='mc-overlay';
  overlay.id='matchCenterOverlay';
  overlay.innerHTML='<div class="mc-dialog" role="dialog" aria-modal="true" aria-labelledby="mcTitle"><div class="mc-head"><div><div class="mc-kicker">Матч-центр</div><div class="mc-title" id="mcTitle">Матч</div></div><button class="mc-close" type="button" aria-label="Закрыть">×</button></div><div class="mc-body" id="mcBody"></div></div>';
  document.body.appendChild(overlay);

  function periodCols(m){
    const cols=[{key:'p1',label:'1 период'},{key:'p2',label:'2 период'},{key:'p3',label:'3 период'}];
    if(m.ot_home!=null||m.ot_away!=null||m.finish_type==='OT'||m.finish_type==='SO')cols.push({key:'ot',label:'ОТ'});
    if(m.so_home!=null||m.so_away!=null||m.finish_type==='SO')cols.push({key:'so',label:'Б'});
    return cols;
  }
  function protocolEvents(matchId){return (typeof D!=='undefined'&&Array.isArray(D?.match_events)?D.match_events:[]).filter(e=>Number(e.match_id)===Number(matchId)).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0)||(a.id-b.id))}
  function renderProtocol(m){
    const events=protocolEvents(m.id);
    if(!events.length)return '<div class="mc-empty">События матча ещё не добавлены. После заполнения протокола здесь появятся голы, удаления и ключевые эпизоды.</div>';
    const order=['1','2','3','OT','SO'];
    const labels={'1':'1 период','2':'2 период','3':'3 период','OT':'Овертайм','SO':'Буллиты'};
    let hs=0,as=0;
    const rows=events.map(e=>{if(e.event_type==='GOAL'){if(Number(e.team_id)===Number(m.home_team_id))hs++;if(Number(e.team_id)===Number(m.away_team_id))as++}return {...e,_score:e.event_type==='GOAL'?`${hs}:${as}`:''}});
    return order.map(period=>{
      const list=rows.filter(e=>String(e.period)===period);if(!list.length)return '';
      return `<div class="mc-period-block"><div class="mc-period-title">${labels[period]}</div>${list.map(e=>{
        const name=teamNameById(e.team_id),src=TEAM_LOGOS[name],type=e.event_type==='GOAL'?'ГОЛ':e.event_type==='PENALTY'?'ШТРАФ':'СОБЫТИЕ';
        let detail='';
        if(e.event_type==='GOAL')detail=[e.assistants?`Передачи: ${escHtml(e.assistants)}`:'',e.description?escHtml(e.description):''].filter(Boolean).join(' · ');
        else if(e.event_type==='PENALTY')detail=[e.penalty_minutes!=null?`${e.penalty_minutes} мин.`:'',e.description?escHtml(e.description):''].filter(Boolean).join(' · ');
        else detail=escHtml(e.description||'');
        return `<div class="mc-event ${e.event_type==='PENALTY'?'penalty':''}"><div class="mc-event-time">${escHtml(e.clock||'—')}</div>${src?`<img class="mc-event-logo" src="${src}" alt="${escHtml(name)}">`:'<span></span>'}<div class="mc-event-main"><strong><span class="mc-event-type">${type}</span>${escHtml(e.player||name||'')}</strong>${detail?`<span>${detail}</span>`:''}</div><div class="mc-event-score">${e._score}</div></div>`;
      }).join('')}</div>`;
    }).join('');
  }
  function openMatch(id,pushUrl=true){
    if(typeof D==='undefined'||!D?.matches)return;
    const m=D.matches.find(x=>Number(x.id)===Number(id));if(!m)return;
    const home=teamNameById(m.home_team_id),away=teamNameById(m.away_team_id),finished=isDone(m),cols=periodCols(m);
    const meta=[prettyDate(m.game_date),m.start_time||'',groupName(m.group_id),m.game_no?`Матч №${m.game_no}`:'',[m.city,m.arena].filter(Boolean).join(' · ')].filter(Boolean);
    const periodTable=cols.some(c=>m[c.key+'_home']!=null||m[c.key+'_away']!=null)||finished?`<div class="mc-periods"><table><thead><tr><th>Команда</th>${cols.map(c=>`<th>${c.label}</th>`).join('')}<th>Итог</th></tr></thead><tbody><tr><td><span class="mc-period-team">${teamLogoHtml(m.home_team_id)}${escHtml(home)}</span></td>${cols.map(c=>`<td>${m[c.key+'_home']??'—'}</td>`).join('')}<td class="mc-final">${m.home_score??'—'}</td></tr><tr><td><span class="mc-period-team">${teamLogoHtml(m.away_team_id)}${escHtml(away)}</span></td>${cols.map(c=>`<td>${m[c.key+'_away']??'—'}</td>`).join('')}<td class="mc-final">${m.away_score??'—'}</td></tr></tbody></table></div>`:'<div class="mc-empty">Счёт по периодам появится после заполнения протокола матча.</div>';
    overlay.querySelector('#mcTitle').textContent=`${home} — ${away}`;
    overlay.querySelector('#mcBody').innerHTML=`
      <div class="mc-scoreboard">
        <div class="mc-team">${teamLogoHtml(m.home_team_id)}<span>${escHtml(home)}</span></div>
        <div class="mc-score"><strong>${finished?`${m.home_score}:${m.away_score}`:'—'}</strong><small>${finished?finishText(m.finish_type):'Матч предстоит'}</small></div>
        <div class="mc-team">${teamLogoHtml(m.away_team_id)}<span>${escHtml(away)}</span></div>
      </div>
      <div class="mc-meta">${meta.map(x=>`<span class="mc-chip">${escHtml(x)}</span>`).join('')}</div>
      <section class="mc-section"><h3>Счёт по периодам</h3>${periodTable}</section>
      <section class="mc-section"><h3>Протокол матча</h3><div class="mc-protocol">${renderProtocol(m)}</div></section>`;
    overlay.classList.add('open');document.body.style.overflow='hidden';
    if(pushUrl){const u=new URL(location.href);u.searchParams.set('match',String(m.id));history.pushState({matchCenter:true},'',u)}
  }
  function closeMatch(fromPop=false){
    if(!overlay.classList.contains('open'))return;
    overlay.classList.remove('open');document.body.style.overflow='';
    if(!fromPop){const u=new URL(location.href);u.searchParams.delete('match');history.pushState({},'',u)}
  }
  overlay.querySelector('.mc-close').onclick=()=>closeMatch();
  overlay.addEventListener('click',e=>{if(e.target===overlay)closeMatch()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMatch()});
  window.addEventListener('popstate',()=>{const id=new URL(location.href).searchParams.get('match');if(id)openMatch(Number(id),false);else closeMatch(true)});

  function wireMatches(){
    if(typeof D==='undefined'||!D?.matches)return;
    const sort=(a,b)=>String(a.game_date).localeCompare(String(b.game_date))||String(a.start_time||'99:99').localeCompare(String(b.start_time||'99:99'))||((a.game_no||0)-(b.game_no||0));
    const upcoming=[...D.matches].filter(m=>!isDone(m)).sort(sort).slice(0,4);
    document.querySelectorAll('#upcomingGrid .upcoming-card').forEach((el,i)=>{const m=upcoming[i];if(!m)return;el.dataset.matchId=m.id;el.classList.add('match-center-clickable');el.tabIndex=0;el.setAttribute('role','button');el.setAttribute('aria-label',`Открыть матч-центр: ${teamNameById(m.home_team_id)} — ${teamNameById(m.away_team_id)}`)});
    const gf=document.querySelector('#gf')?.value||'ALL',sf=document.querySelector('#sf')?.value||'ALL',today=new Date().toISOString().slice(0,10);
    const visible=[...D.matches].filter(m=>gf==='ALL'||String(m.group_id)===gf).filter(m=>sf==='ALL'||(sf==='TODAY'?m.game_date===today:sf==='DONE'?isDone(m):!isDone(m))).sort(sort);
    document.querySelectorAll('#matchList .match-row').forEach((el,i)=>{const m=visible[i];if(!m)return;el.dataset.matchId=m.id;el.classList.add('match-center-clickable');el.tabIndex=0;el.setAttribute('role','button');el.setAttribute('aria-label',`Открыть матч-центр: ${teamNameById(m.home_team_id)} — ${teamNameById(m.away_team_id)}`)});
  }
  document.addEventListener('click',e=>{const el=e.target.closest?.('.match-center-clickable[data-match-id]');if(el)openMatch(Number(el.dataset.matchId))});
  document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches?.('.match-center-clickable[data-match-id]')){e.preventDefault();openMatch(Number(e.target.dataset.matchId))}});

  let deepLinked=false;
  function maybeOpenFromUrl(){if(deepLinked||typeof D==='undefined'||!D?.matches?.length)return;const id=Number(new URL(location.href).searchParams.get('match'));if(id&&D.matches.some(m=>Number(m.id)===id)){deepLinked=true;openMatch(id,false)}}
  function apply(){
    const mark=document.querySelector('.brand-mark');
    if(mark&&!mark.dataset.logoApplied){mark.textContent='';mark.appendChild(img(CUP_LOGO,'site-logo-img','Кубок России U16'));mark.dataset.logoApplied='1'}
    const org=document.querySelector('.organizer-mark');
    if(org&&!org.dataset.logoApplied){org.textContent='';org.appendChild(img(FHR_LOGO,'organizer-logo-img','Федерация хоккея России'));org.dataset.logoApplied='1'}
    document.querySelectorAll('td.team').forEach(el=>decorate(el,false));
    document.querySelectorAll('.upcoming-team>span:first-child').forEach(el=>decorate(el,false));
    document.querySelectorAll('.match-team').forEach(el=>decorate(el,el.classList.contains('away')));
    const winner=document.querySelector('#winnerName'),wm=document.querySelector('.winner-mark');
    if(winner&&wm){const name=(winner.textContent||'').trim(),src=TEAM_LOGOS[name];if(src&&wm.dataset.teamName!==name){wm.textContent='';wm.appendChild(img(src,'winner-logo-img','Логотип '+name));wm.dataset.teamName=name}}
    wireMatches();maybeOpenFromUrl();
  }
  let queued=false;
  const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})};
  new MutationObserver(queue).observe(document.body,{childList:true,subtree:true,characterData:true});
  setInterval(queue,1200);
  apply();
})();
