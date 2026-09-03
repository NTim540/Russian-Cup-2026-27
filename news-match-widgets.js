/* News widgets for one selected match: announcement + result. */
(()=>{
  const CORE='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup';
  const RESULT='match_result';
  const ANNOUNCE='match_announce';
  const TYPES=new Set([RESULT,ANNOUNCE]);
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const validUrl=v=>{if(!v)return null;try{const u=new URL(String(v));return ['http:','https:'].includes(u.protocol)?u.toString():null}catch{return null}};
  const fmtDate=x=>x?new Date(x+'T12:00:00').toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long',year:'numeric'}):'';
  const fmtTime=v=>String(v||'—').slice(0,5);
  const team=(D,id)=>D?.teams?.find(t=>Number(t.id)===Number(id))||{name:'—',city:'',logo_url:''};
  const group=(D,id)=>D?.groups?.find(g=>Number(g.id)===Number(id));
  const initials=name=>String(name||'').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3).toUpperCase();
  const img=t=>t?.logo_url?`<img src="${esc(t.logo_url)}" alt="${esc(t.name||'')}" loading="lazy">`:`<span>${esc(initials(t?.name))}</span>`;
  const events=(D,id)=>(D?.match_events||[]).filter(e=>Number(e.match_id)===Number(id)).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0)||(Number(a.id)||0)-(Number(b.id)||0));
  const goals=(D,id,teamId)=>events(D,id).filter(e=>String(e.event_type||'').toUpperCase()==='GOAL'&&Number(e.team_id)===Number(teamId));
  const finish=m=>m?.finish_type==='OT'?'ОТ':m?.finish_type==='SO'?'Б':'';
  const periods=m=>{
    const a=[];
    [['p1_home','p1_away'],['p2_home','p2_away'],['p3_home','p3_away']].forEach(([h,v])=>{if(Number.isInteger(m?.[h])&&Number.isInteger(m?.[v]))a.push(`${m[h]}:${m[v]}`)});
    if(Number.isInteger(m?.ot_home)&&Number.isInteger(m?.ot_away))a.push(`${m.ot_home}:${m.ot_away}`);
    if(Number.isInteger(m?.so_home)&&Number.isInteger(m?.so_away))a.push(`${m.so_home}:${m.so_away}`);
    return a;
  };
  function goalMinute(e){
    const m=String(e?.clock||'').match(/^(\d{1,2}):(\d{2})/);if(!m)return String(e?.clock||'');
    const p=String(e?.period||'1').toUpperCase();let off=p==='2'?20:p==='3'?40:p==='OT'?60:0;
    const minute=Number(m[1])+(Number(m[2])>0?1:0)+off;return minute?`${minute}'`:String(e.clock||'');
  }
  const scorerText=e=>`${e?.player||'Игрок'}${goalMinute(e)?` ${goalMinute(e)}`:''}`;

  function ensureStyle(){
    if(document.getElementById('news-single-match-widgets-style'))return;
    const s=document.createElement('style');s.id='news-single-match-widgets-style';s.textContent=`
      .nwm{overflow:hidden}.nwm-top{padding:18px 20px;border-bottom:1px solid var(--line);background:linear-gradient(90deg,rgba(47,111,237,.12),rgba(127,198,255,.025))}.nwm-kicker{color:var(--ice);font-size:9px;text-transform:uppercase;letter-spacing:.15em;font-weight:950;margin-bottom:5px}.nwm-top h3{margin:0;font-size:22px;line-height:1.1;letter-spacing:-.025em}.nwm-sub{margin-top:6px;color:var(--muted);font-size:10px}
      .nwm-main{padding:24px 22px}.nwm-matchup{display:grid;grid-template-columns:minmax(0,1fr) 220px minmax(0,1fr);gap:18px;align-items:center}.nwm-team{display:grid;grid-template-columns:66px minmax(0,1fr);gap:13px;align-items:center;min-width:0}.nwm-team.away{grid-template-columns:minmax(0,1fr) 66px;text-align:right}.nwm-logo{width:66px;height:66px;border-radius:50%;display:grid;place-items:center;overflow:hidden;border:1px solid rgba(127,198,255,.18);background:rgba(127,198,255,.045);font-size:12px;font-weight:950;color:#cfeaff}.nwm-logo img{width:82%;height:82%;object-fit:contain}.nwm-name{font-size:17px;font-weight:900;line-height:1.2}.nwm-city{margin-top:5px;color:var(--muted);font-size:10px}.nwm-center{text-align:center;min-width:0}.nwm-score{font-size:44px;line-height:1;font-weight:950;letter-spacing:-.04em}.nwm-time{font-size:42px;line-height:1;font-weight:950;letter-spacing:-.035em}.nwm-periods{margin-top:8px;color:#bdcad9;font-size:12px;word-spacing:8px}.nwm-finish{display:inline-flex;margin-top:8px;padding:4px 7px;border-radius:999px;background:rgba(127,198,255,.08);border:1px solid rgba(127,198,255,.16);color:#a9d9ff;font-size:9px;font-weight:900}.nwm-date{margin-top:8px;color:var(--muted);font-size:10px;text-transform:capitalize}
      .nwm-goals{display:grid;grid-template-columns:1fr 1fr;gap:26px;margin-top:22px;padding-top:18px;border-top:1px solid rgba(255,255,255,.07)}.nwm-goal-side:last-child{text-align:right}.nwm-goal-label{color:#7890a8;font-size:9px;text-transform:uppercase;letter-spacing:.12em;font-weight:900;margin-bottom:8px}.nwm-goal{font-size:11px;line-height:1.7;color:#c7d2df}.nwm-no-goals{font-size:10px;color:#6f8296}
      .nwm-broadcast{margin-top:22px;padding-top:18px;border-top:1px solid rgba(255,255,255,.07)}.nwm-video{display:grid;grid-template-columns:52px minmax(0,1fr) auto;gap:13px;align-items:center;padding:15px 17px;border-radius:16px;border:1px solid rgba(127,198,255,.24);background:linear-gradient(135deg,rgba(29,122,230,.28),rgba(47,111,237,.16));transition:.18s ease}.nwm-video.live:hover{transform:translateY(-1px);border-color:rgba(127,198,255,.46);background:linear-gradient(135deg,rgba(29,122,230,.38),rgba(47,111,237,.22))}.nwm-video-icon{width:52px;height:52px;border-radius:15px;display:grid;place-items:center;background:linear-gradient(135deg,#2489e9,#2860d8);box-shadow:0 10px 26px rgba(31,112,225,.24)}.nwm-video-icon:before{content:'';margin-left:3px;border-left:13px solid #fff;border-top:8px solid transparent;border-bottom:8px solid transparent}.nwm-video-kicker{color:#9fd7ff;font-size:9px;text-transform:uppercase;letter-spacing:.13em;font-weight:950}.nwm-video-title{margin-top:4px;font-size:16px;font-weight:950}.nwm-video-note{margin-top:4px;color:#9fb1c5;font-size:10px}.nwm-video-action{color:#fff;font-size:11px;font-weight:900;padding:9px 11px;border-radius:10px;background:rgba(255,255,255,.10);white-space:nowrap}.nwm-video.off{opacity:.72;background:rgba(255,255,255,.025);border-color:rgba(255,255,255,.08)}.nwm-video.off .nwm-video-icon{background:#34475c;box-shadow:none}.nwm-venue{margin-top:13px;text-align:center;color:var(--muted);font-size:10px;line-height:1.5}
      @media(max-width:700px){.nwm-main{padding:18px 13px}.nwm-matchup{grid-template-columns:1fr 100px 1fr;gap:7px}.nwm-team{grid-template-columns:44px minmax(0,1fr);gap:7px}.nwm-team.away{grid-template-columns:minmax(0,1fr) 44px}.nwm-logo{width:44px;height:44px}.nwm-name{font-size:12px}.nwm-city{font-size:8px}.nwm-score{font-size:30px}.nwm-time{font-size:28px}.nwm-periods{font-size:9px;word-spacing:2px}.nwm-date{font-size:8px}.nwm-goals{gap:12px}.nwm-goal{font-size:9px}.nwm-video{grid-template-columns:42px 1fr;padding:12px;gap:10px}.nwm-video-icon{width:42px;height:42px;border-radius:12px}.nwm-video-action{grid-column:1/-1;text-align:center}.nwm-video-title{font-size:13px}}
    `;document.head.appendChild(s);
  }

  async function j(url){const r=await fetch(url,{cache:'no-store'}),b=await r.json().catch(()=>({}));if(!r.ok)throw Error(b.error||'Ошибка загрузки');return b}
  function titleFor(w,m,h,a){return w?.title||(w?.type===RESULT?`${h.name} — ${a.name}`:`${h.name} — ${a.name}`)}
  function header(w,D,m,h,a,label){const g=group(D,m.group_id),sub=[g?.name||g?.code,m.game_no?`Матч №${m.game_no}`:'',fmtDate(m.game_date)].filter(Boolean).join(' · ');return`<div class="nwm-top"><div class="nwm-kicker">${esc(label)}</div><h3>${esc(titleFor(w,m,h,a))}</h3><div class="nwm-sub">${esc(sub)}</div></div>`}
  function teamHtml(t,away=false){return`<div class="nwm-team${away?' away':''}">${away?`<div><div class="nwm-name">${esc(t.name)}</div><div class="nwm-city">${esc(t.city||'')}</div></div><div class="nwm-logo">${img(t)}</div>`:`<div class="nwm-logo">${img(t)}</div><div><div class="nwm-name">${esc(t.name)}</div><div class="nwm-city">${esc(t.city||'')}</div></div>`}</div>`}
  function goalsHtml(list){return list.length?list.map(e=>`<div class="nwm-goal">${esc(scorerText(e))}</div>`).join(''):'<div class="nwm-no-goals">Нет данных</div>'}

  function renderResult(w,D,m){
    const h=team(D,m.home_team_id),a=team(D,m.away_team_id),pp=periods(m),ft=finish(m),played=Number.isInteger(m.home_score)&&Number.isInteger(m.away_score);
    return`<section class="nw nwm">${header(w,D,m,h,a,'Итог матча')}<div class="nwm-main"><div class="nwm-matchup">${teamHtml(h)}<div class="nwm-center"><div class="nwm-score">${played?`${m.home_score} — ${m.away_score}`:'—'}</div>${pp.length?`<div class="nwm-periods">${esc(pp.join('   '))}</div>`:''}${ft?`<div class="nwm-finish">${esc(ft)}</div>`:''}<div class="nwm-date">${esc(fmtDate(m.game_date))}</div></div>${teamHtml(a,true)}</div><div class="nwm-goals"><div class="nwm-goal-side"><div class="nwm-goal-label">Авторы шайб · ${esc(h.name)}</div>${goalsHtml(goals(D,m.id,m.home_team_id))}</div><div class="nwm-goal-side"><div class="nwm-goal-label">Авторы шайб · ${esc(a.name)}</div>${goalsHtml(goals(D,m.id,m.away_team_id))}</div></div></div></section>`;
  }

  function renderAnnounce(w,D,m){
    const h=team(D,m.home_team_id),a=team(D,m.away_team_id),url=validUrl(m.stream_url),place=[m.city,m.arena].filter(Boolean).join(' · ');
    const video=url?`<a class="nwm-video live" href="${esc(url)}" target="_blank" rel="noopener noreferrer"><div class="nwm-video-icon"></div><div><div class="nwm-video-kicker">Видеотрансляция</div><div class="nwm-video-title">Смотреть матч в VK Видео</div><div class="nwm-video-note">Прямой эфир доступен по ссылке</div></div><div class="nwm-video-action">Смотреть →</div></a>`:`<div class="nwm-video off"><div class="nwm-video-icon"></div><div><div class="nwm-video-kicker">Видеотрансляция</div><div class="nwm-video-title">Ссылка появится позже</div><div class="nwm-video-note">После добавления ссылки к матчу виджет обновится автоматически</div></div><div class="nwm-video-action">Ожидаем</div></div>`;
    return`<section class="nw nwm">${header(w,D,m,h,a,'Анонс матча')}<div class="nwm-main"><div class="nwm-matchup">${teamHtml(h)}<div class="nwm-center"><div class="nwm-time">${esc(fmtTime(m.start_time))}</div><div class="nwm-date">${esc(fmtDate(m.game_date))}</div></div>${teamHtml(a,true)}</div><div class="nwm-broadcast">${video}</div>${place?`<div class="nwm-venue">${esc(place)}</div>`:''}</div></section>`;
  }

  async function install(){
    const base=window.renderNewsWidgets;if(typeof base!=='function')return false;if(base.__singleMatchWidgets)return true;
    ensureStyle();
    const wrapped=async function(news,container){
      if(!container)return;
      const widgets=Array.isArray(news?.widgets)?news.widgets:[];
      if(!widgets.some(w=>TYPES.has(w?.type)))return base(news,container);
      // Frozen news must keep the exact saved snapshot HTML.
      if(news?.widgets_auto_update!==true)return base(news,container);
      const cat=await j(CORE+'/api/catalog'),t=cat.tournaments.find(x=>Number(x.id)===Number(news.tournament_id));if(!t){container.innerHTML='<div class="nw-empty">Турнир для виджетов не найден.</div>';return}
      const cache=new Map();
      async function data(stageId){const sid=Number(stageId)||cat.stages.find(s=>Number(s.tournament_id)===Number(t.id))?.id;if(!sid)throw Error('Этап не найден');if(!cache.has(sid))cache.set(sid,j(CORE+'/api/data?tournament_slug='+encodeURIComponent(t.slug)+'&stage_id='+sid));return cache.get(sid)}
      const out=[];
      for(const w of widgets){
        if(TYPES.has(w?.type)){
          const D=await data(w.stage_id),m=D.matches?.find(x=>Number(x.id)===Number(w.match_id));
          out.push(m?(w.type===RESULT?renderResult(w,D,m):renderAnnounce(w,D,m)):'<section class="nw nwm"><div class="nw-empty">Выбранный матч не найден.</div></section>');
        }else{
          const tmp=document.createElement('div');await base({...news,widgets:[w],widgets_auto_update:true},tmp);out.push(tmp.innerHTML);
        }
      }
      container.innerHTML=out.join('');
    };
    wrapped.__singleMatchWidgets=true;window.renderNewsWidgets=wrapped;return true;
  }
  let tries=0;const timer=setInterval(async()=>{tries++;if(await install()||tries>100)clearInterval(timer)},80);
})();
