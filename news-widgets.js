(()=>{
  const CORE='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup';
  const STYLE='news-live-widgets-style';
  const TEAM_LOGOS={
    'Динамо Москва':'https://drive.google.com/thumbnail?id=1I3KuJZEajmksDKtoBsdj4h_75fU0e_KY&sz=w512',
    'МАХ':'https://drive.google.com/thumbnail?id=1Veii4NYgKc06nRtxKmCRQv1YCE164YZP&sz=w512',
    'Московская академия хоккея':'https://drive.google.com/thumbnail?id=1Veii4NYgKc06nRtxKmCRQv1YCE164YZP&sz=w512',
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
    'Динамо-Джуниверс':'https://drive.google.com/thumbnail?id=1HTqvh6fg5ZzOLFwOtY62zucjnRZyOXmu&sz=w512',
    'СКА-Стрельна':'https://drive.google.com/thumbnail?id=1DH_sKpyVZsh6vnt8Q1_ovBpDuVkPHrNh&sz=w512',
    'АКМ':'https://drive.google.com/thumbnail?id=1NmPj1OwI3C1yuNmgt2XX57HbEiiDauB7&sz=w512',
    'Академия Михайлова':'https://drive.google.com/thumbnail?id=1NmPj1OwI3C1yuNmgt2XX57HbEiiDauB7&sz=w512',
    'ЦСКА':'https://drive.google.com/thumbnail?id=1bT6o4afTqonyA05keLbe_nfQ78sAmNda&sz=w512',
    'Армия СКА':'https://drive.google.com/thumbnail?id=14XZX2FRyR5x_aVkU2SMLhW-Emk0RUkTo&sz=w512',
    'Нефтехимик':'https://drive.google.com/thumbnail?id=1csEdtjesEvgAFSsfnfhmWUnUE23Tnqeg&sz=w512',
    'Северсталь':'https://drive.google.com/thumbnail?id=10xBTOFy_ps1G3LNaHV3WpbQkuZ74pjRn&sz=w512',
    'Красная Машина Юниор':'https://drive.google.com/thumbnail?id=1qATM0WxWDCgYfemDQvhdy30Ub0sWSWWV&sz=w512'
  };
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const done=m=>Number.isInteger(m?.home_score)&&Number.isInteger(m?.away_score)&&m.home_score!==m.away_score;
  const dateObj=x=>new Date(x+'T12:00:00');
  const fmtDate=x=>x?dateObj(x).toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'}):'';
  const fmtTime=m=>String(m.start_time||m.game_time||m.time||'—').slice(0,5);
  const finish=m=>m.finish_type==='OT'?'ОТ':m.finish_type==='SO'?'Б':'осн.';
  const initials=name=>String(name||'?').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,2).toUpperCase()||'?';

  if(!document.getElementById(STYLE)){
    const s=document.createElement('style');s.id=STYLE;s.textContent=`
      .news-widgets{display:grid;gap:24px;margin-top:34px}
      .nw{position:relative;border:1px solid rgba(127,198,255,.16);border-radius:24px;overflow:hidden;background:linear-gradient(145deg,rgba(15,35,58,.96),rgba(8,23,40,.985) 48%,rgba(8,20,35,.99));box-shadow:0 20px 55px rgba(0,0,0,.20)}
      .nw:before{content:"";position:absolute;left:0;top:0;bottom:0;width:2px;background:linear-gradient(180deg,#55b8ff 0 28%,rgba(47,111,237,.35) 55%,rgba(226,58,71,.75) 100%);pointer-events:none}
      .nw-head{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;padding:21px 22px 19px;border-bottom:1px solid rgba(127,198,255,.13);background:linear-gradient(100deg,rgba(47,111,237,.13),rgba(127,198,255,.035) 47%,rgba(226,58,71,.035))}
      .nw-kicker{display:flex;align-items:center;gap:7px;color:#82c9ff;font-size:9px;text-transform:uppercase;letter-spacing:.16em;font-weight:950;margin-bottom:6px}.nw-kicker:before{content:"//";color:#e23a47;letter-spacing:-.12em}
      .nw-head h3{font-size:24px;line-height:1.02;margin:0;letter-spacing:-.035em;text-transform:uppercase}.nw-sub{flex:0 0 auto;padding:7px 10px;border:1px solid rgba(127,198,255,.12);border-radius:999px;background:rgba(127,198,255,.035);color:#8ca9c2;font-size:9px;text-align:right;white-space:nowrap}
      .nw-matches{display:grid}.nw-match{display:grid;grid-template-columns:92px minmax(190px,1fr) 104px minmax(190px,1fr) 172px;gap:15px;align-items:center;min-height:91px;padding:16px 21px;border-top:1px solid rgba(255,255,255,.065);transition:background .16s ease,border-color .16s ease}.nw-match:first-child{border-top:0}.nw-match:hover{background:linear-gradient(90deg,rgba(47,111,237,.045),rgba(255,255,255,.018),rgba(226,58,71,.025));border-color:rgba(127,198,255,.12)}
      .nw-meta{color:#7590aa;font-size:9px;line-height:1.5;text-transform:none}.nw-meta strong{display:inline-block;margin-bottom:2px;color:#a9cae5;font-size:10px;font-weight:900}.nw-meta br+*{color:#7590aa}
      .nw-team{display:flex;align-items:center;gap:11px;min-width:0;font-size:14px;font-weight:900;line-height:1.2}.nw-team.home{justify-content:flex-end;text-align:right}.nw-team.away{justify-content:flex-start;text-align:left}.nw-team-name{min-width:0;overflow-wrap:anywhere}.nw-team-logo{width:46px;height:46px;flex:0 0 46px;display:grid;place-items:center;border:1px solid rgba(127,198,255,.12);border-radius:12px;background:radial-gradient(circle at 45% 35%,rgba(127,198,255,.11),rgba(255,255,255,.025));box-shadow:inset 0 0 18px rgba(127,198,255,.025)}.nw-team-logo img{display:block;max-width:38px;max-height:38px;width:auto;height:auto;object-fit:contain;filter:drop-shadow(0 4px 8px rgba(0,0,0,.22))}.nw-team-logo-fallback{font-size:10px;color:#9ebbd3;font-weight:950;letter-spacing:.04em}
      .nw-score{text-align:center;align-self:center}.nw-score strong{display:block;font-size:27px;line-height:.95;letter-spacing:-.04em;color:#fff;font-weight:950}.nw-score span{display:block;margin-top:6px;color:#7294b2;font-size:8px;text-transform:uppercase;letter-spacing:.12em;font-weight:850}
      .nw-venue{padding-left:14px;border-left:1px solid rgba(127,198,255,.09);text-align:right;color:#7895af;font-size:9px;line-height:1.45}.nw-venue:before{content:"МЕСТО";display:block;margin-bottom:3px;color:#56748f;font-size:7px;letter-spacing:.12em;font-weight:900}
      .nw-table-wrap{overflow:auto}.nw table{width:100%;min-width:760px;border-collapse:collapse}.nw th,.nw td{padding:11px 9px;border-bottom:1px solid rgba(255,255,255,.065);text-align:center;font-size:11px}.nw th{color:#8090a4;font-size:9px;text-transform:uppercase;letter-spacing:.06em;background:rgba(255,255,255,.018)}.nw th.team,.nw td.team{text-align:left;min-width:170px}.nw tbody tr:last-child td{border-bottom:0}.nw .pts{font-weight:950;color:#fff}.nw .pos{font-weight:950}.nw .gdplus{color:#72d7a6}.nw .gdminus{color:#ff8f98}
      .nw-group-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:13px}.nw-group-card{border:1px solid rgba(255,255,255,.075);border-radius:14px;overflow:hidden;background:rgba(255,255,255,.018)}.nw-group-name{padding:11px 12px;border-bottom:1px solid rgba(255,255,255,.065);font-size:12px;font-weight:900}.nw-member{display:flex;justify-content:space-between;gap:10px;padding:9px 12px;border-top:1px solid rgba(255,255,255,.05);font-size:11px}.nw-member:first-of-type{border-top:0}.nw-member span:last-child{color:var(--muted);font-size:9px}
      .nw-empty{padding:24px;text-align:center;color:var(--muted);font-size:12px}
      @media(max-width:980px){.nw-match{grid-template-columns:78px minmax(145px,1fr) 82px minmax(145px,1fr) 130px;gap:9px;padding:14px}.nw-team{font-size:12px}.nw-team-logo{width:40px;height:40px;flex-basis:40px}.nw-team-logo img{max-width:33px;max-height:33px}.nw-score strong{font-size:23px}.nw-venue{font-size:8px}}
      @media(max-width:760px){.nw{border-radius:18px}.nw-head{align-items:flex-start;flex-direction:column;padding:17px 15px 15px;gap:10px}.nw-head h3{font-size:20px}.nw-sub{padding:5px 8px;text-align:left}.nw-match{grid-template-columns:minmax(0,1fr) 70px minmax(0,1fr);gap:9px;min-height:0;padding:13px 12px 12px}.nw-meta{grid-column:1/-1;display:flex;align-items:center;gap:6px;font-size:8px;padding-bottom:2px}.nw-meta strong{margin:0}.nw-meta br{display:none}.nw-team{font-size:11px;gap:7px}.nw-team.home{grid-column:1}.nw-score{grid-column:2}.nw-team.away{grid-column:3}.nw-team-logo{width:36px;height:36px;flex-basis:36px;border-radius:10px}.nw-team-logo img{max-width:29px;max-height:29px}.nw-score strong{font-size:20px}.nw-score span{font-size:7px;margin-top:4px}.nw-venue{grid-column:1/-1;padding:8px 0 0;border-left:0;border-top:1px solid rgba(127,198,255,.07);text-align:center;font-size:8px}.nw-venue:before{display:inline;margin:0 6px 0 0}.nw-group-grid{grid-template-columns:1fr}}
      @media(max-width:430px){.nw-team.home{flex-direction:column-reverse;text-align:center;justify-content:flex-start}.nw-team.away{flex-direction:column;text-align:center;justify-content:flex-start}.nw-team{align-self:start}.nw-team-logo{width:40px;height:40px;flex-basis:40px}.nw-team-name{font-size:10px}.nw-score{align-self:start;padding-top:9px}}
    `;document.head.appendChild(s);
  }

  async function j(url){const r=await fetch(url,{cache:'no-store'}),b=await r.json().catch(()=>({}));if(!r.ok)throw Error(b.error||'Ошибка загрузки');return b}





function groupRows(D,g,s){return CupStandings.groupRows(D,g,s)}

function overall(D,s){return CupStandings.overall(D,s)}
  function table(rows){return`<div class="nw-table-wrap"><table><thead><tr><th>№</th><th class="team">Команда</th><th>И</th><th>В</th><th>В ОТ/Б</th><th>П</th><th>П ОТ/Б</th><th>Шайбы</th><th>+/-</th><th>О</th></tr></thead><tbody>${rows.map(r=>`<tr><td class="pos">${r.place}</td><td class="team">${esc(r.team)}</td><td>${r.gp}</td><td>${r.rw}</td><td>${r.ow}</td><td>${r.rl}</td><td>${r.ol}</td><td>${r.gf}:${r.ga}</td><td class="${r.gd>0?'gdplus':r.gd<0?'gdminus':''}">${r.gd>0?'+':''}${r.gd}</td><td class="pts">${r.pts}</td></tr>`).join('')}</tbody></table></div>`}
  function teamObj(D,id){return D.teams.find(t=>Number(t.id)===Number(id))||null}
  function teamName(D,id){return teamObj(D,id)?.name||'—'}
  function teamLogo(D,id,name){const t=teamObj(D,id);return t?.logo_url||TEAM_LOGOS[name||t?.name]||''}
  function groupName(D,id){const g=D.groups.find(g=>Number(g.id)===Number(id));return g?.name||g?.code||''}
  function headHtml(title,sub){return`<div class="nw-head"><div><div class="nw-kicker">Данные турнира</div><h3>${esc(title)}</h3></div>${sub?`<div class="nw-sub">${esc(sub)}</div>`:''}</div>`}
  function logoHtml(src,name){return`<span class="nw-team-logo">${src?`<img src="${esc(src)}" alt="Логотип ${esc(name)}" loading="lazy" decoding="async" onerror="this.remove();this.parentElement.innerHTML='<span class=&quot;nw-team-logo-fallback&quot;>${esc(initials(name))}</span>'">`:`<span class="nw-team-logo-fallback">${esc(initials(name))}</span>`}</span>`}
  function teamHtml(D,id,side){const name=teamName(D,id),src=teamLogo(D,id,name),logo=logoHtml(src,name),label=`<span class="nw-team-name">${esc(name)}</span>`;return`<div class="nw-team ${side}">${side==='home'?label+logo:logo+label}</div>`}
  function matchList(D,ms,results){if(!ms.length)return'<div class="nw-empty">Матчей на эту дату нет.</div>';return`<div class="nw-matches">${ms.map(m=>{const score=results?(done(m)?`${m.home_score}:${m.away_score}`:'—'):fmtTime(m),label=results?(done(m)?finish(m):'не сыгран'):'начало',place=[m.city,m.arena].filter(Boolean).join(' · ');return`<div class="nw-match nw-match--rich"><div class="nw-meta"><strong>${esc(groupName(D,m.group_id))}</strong><br>Матч №${m.game_no??'—'}</div>${teamHtml(D,m.home_team_id,'home')}<div class="nw-score"><strong>${esc(score)}</strong><span>${esc(label)}</span></div>${teamHtml(D,m.away_team_id,'away')}<div class="nw-venue">${esc(place||'Место уточняется')}</div></div>`}).join('')}</div>`}
  function groupsHtml(D){const gs=[...D.groups].sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));return`<div class="nw-group-grid">${gs.map(g=>{const mem=D.memberships.filter(m=>Number(m.group_id)===Number(g.id)).sort((a,b)=>(a.seed||999)-(b.seed||999));return`<div class="nw-group-card"><div class="nw-group-name">${esc(g.name||('Группа '+g.code))}</div>${mem.map(m=>{const t=D.teams.find(t=>Number(t.id)===Number(m.team_id));return`<div class="nw-member"><span>${esc(t?.name||'—')}</span><span>${esc(t?.city||'')}</span></div>`}).join('')}</div>`}).join('')}</div>`}

  function upgradeFrozenMatches(root=document){
    root.querySelectorAll?.('.news-widgets .nw-match:not(.nw-match--rich)').forEach(row=>{
      const teams=[...row.querySelectorAll('.nw-team')];if(teams.length<2)return;
      teams.forEach((el,i)=>{
        const name=(el.textContent||'').replace(/\s+/g,' ').trim();if(!name)return;
        const side=i===0?'home':'away',src=TEAM_LOGOS[name]||'';
        el.classList.remove('away','home');el.classList.add(side);
        const label=`<span class="nw-team-name">${esc(name)}</span>`,logo=logoHtml(src,name);
        el.innerHTML=side==='home'?label+logo:logo+label;
      });
      row.classList.add('nw-match--rich');
    });
  }
  let upgradeQueued=false;
  function queueUpgrade(){if(upgradeQueued)return;upgradeQueued=true;requestAnimationFrame(()=>{upgradeQueued=false;upgradeFrozenMatches(document)})}
  new MutationObserver(queueUpgrade).observe(document.documentElement,{childList:true,subtree:true});

  window.renderNewsWidgets=async function(news,container){
    if(!container)return;
    const widgets=Array.isArray(news?.widgets)?news.widgets:[];
    if(!widgets.length){container.innerHTML='';return}
    container.innerHTML='<div class="nw-empty">Загружаем данные турнира…</div>';
    try{
      if(!window.CupStandings)await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='/standings-rules.js?v=20260908-1';script.onload=resolve;script.onerror=()=>reject(Error('Не удалось загрузить правила таблиц'));document.head.appendChild(script)});
      const cat=await j(CORE+'/api/catalog'),t=cat.tournaments.find(x=>Number(x.id)===Number(news.tournament_id));if(!t)throw Error('Турнир для виджетов не найден');
      const cache=new Map();
      async function data(stageId){const sid=Number(stageId)||cat.stages.find(s=>Number(s.tournament_id)===Number(t.id))?.id;if(!sid)throw Error('Этап не найден');if(!cache.has(sid))cache.set(sid,j(CORE+'/api/data?tournament_slug='+encodeURIComponent(t.slug)+'&stage_id='+sid));return cache.get(sid)}
      const chunks=[];
      for(const w of widgets){const D=await data(w.stage_id),title=w.title||({schedule:'Расписание игр',results:'Результаты дня',overall_table:'Общая таблица',group_table:'Таблица группы',all_group_tables:'Таблицы групп',groups:'Состав групп'}[w.type]||'Данные турнира');
        if(w.type==='schedule'||w.type==='results'){const ms=[...D.matches].filter(m=>m.game_date===w.date).sort((a,b)=>(a.start_time||'').localeCompare(b.start_time||'')||(a.game_no||0)-(b.game_no||0));chunks.push(`<section class="nw">${headHtml(title,fmtDate(w.date))}${matchList(D,ms,w.type==='results')}</section>`)}
        else if(w.type==='overall_table'){chunks.push(`<section class="nw">${headHtml(title,D.stage?.name||'')}${table(overall(D,D.settings))}</section>`)}
        else if(w.type==='group_table'){const g=D.groups.find(g=>Number(g.id)===Number(w.group_id));chunks.push(`<section class="nw">${headHtml(title,g?.name||g?.code||'')}${g?table(groupRows(D,g,D.settings)):'<div class="nw-empty">Группа не найдена.</div>'}</section>`)}
        else if(w.type==='all_group_tables'){const gs=[...D.groups].sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));chunks.push(`<section class="nw">${headHtml(title,D.stage?.name||'')}${gs.map(g=>`<div class="nw-head" style="border-top:1px solid var(--line)"><div><div class="nw-kicker">Группа</div><h3>${esc(g.name||g.code)}</h3></div></div>${table(groupRows(D,g,D.settings))}`).join('')}</section>`)}
        else if(w.type==='groups'){chunks.push(`<section class="nw">${headHtml(title,D.stage?.name||'')}${groupsHtml(D)}</section>`)}
      }
      container.innerHTML=chunks.join('');upgradeFrozenMatches(container);
    }catch(e){console.error('News widgets:',e);container.innerHTML='<div class="nw-empty">Не удалось загрузить виджеты: '+esc(e.message||String(e))+'</div>'}
  };
  queueUpgrade();
})();
