(()=>{
  const FHR='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-fhr-roster';
  const PHOTO_PREFIX='__PP_',LINEUP_PREFIX='__LU_';
  const tabs=document.querySelector('.tabs'),settings=document.querySelector('#tab-settings');
  if(!tabs||!settings||document.querySelector('[data-tab="quality"]'))return;

  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm=x=>String(x||'').toLocaleLowerCase('ru-RU').replace(/ё/g,'е').replace(/[^a-zа-я0-9]+/gi,' ').replace(/\s+/g,' ').trim();
  const hiddenArena=a=>String(a?.name||'').startsWith('__');
  const hasScore=m=>Number.isInteger(m?.home_score)&&Number.isInteger(m?.away_score);
  const done=m=>hasScore(m)&&m.home_score!==m.away_score;
  const teamName=(data,id)=>data?.teams?.find(t=>Number(t.id)===Number(id))?.name||'Команда #'+id;
  let issues=[],stats={},filter='all',scanSeq=0,rosterCache=new Map(),staticRosters=null;

  const style=document.createElement('style');
  style.textContent=`
    .dq-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:14px}.dq-head h2{margin:0}.dq-tools{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.dq-tools .select{width:auto;min-width:180px}.dq-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin-bottom:14px}.dq-stat{padding:15px;border:1px solid var(--line);border-radius:14px;background:rgba(255,255,255,.025)}.dq-stat strong{display:block;font-size:25px;line-height:1;font-weight:950}.dq-stat span{display:block;margin-top:7px;color:var(--muted);font-size:9px;text-transform:uppercase;letter-spacing:.08em}.dq-stat.bad strong{color:#ff919b}.dq-stat.warn strong{color:#ffd17c}.dq-stat.good strong{color:#72d7a6}.dq-progress{margin:0 0 13px;padding:10px 12px;border:1px solid rgba(127,198,255,.13);border-radius:11px;background:rgba(127,198,255,.045);color:#a9c6dc;font-size:11px}.dq-filters{display:flex;gap:7px;overflow:auto;padding:1px 0 10px;scrollbar-width:thin}.dq-filter{flex:0 0 auto;border:1px solid var(--line);background:rgba(255,255,255,.035);color:var(--muted);border-radius:999px;padding:8px 11px;font-size:10px;font-weight:850;cursor:pointer}.dq-filter.active{color:#fff;border-color:rgba(47,111,237,.48);background:rgba(47,111,237,.16)}.dq-list{display:grid;gap:8px}.dq-item{display:grid;grid-template-columns:10px minmax(0,1fr) auto;gap:11px;align-items:center;padding:12px 13px;border:1px solid var(--line);border-radius:13px;background:rgba(255,255,255,.022)}.dq-dot{width:9px;height:9px;border-radius:50%;background:#70849a}.dq-item.error{border-color:rgba(226,58,71,.22)}.dq-item.error .dq-dot{background:#e23a47;box-shadow:0 0 13px rgba(226,58,71,.42)}.dq-item.warn .dq-dot{background:#e9b85b}.dq-item.info .dq-dot{background:#5aaee9}.dq-title{font-size:12px;font-weight:900}.dq-detail{margin-top:4px;color:var(--muted);font-size:10px;line-height:1.45}.dq-meta{margin-top:5px;color:#668098;font-size:9px;text-transform:uppercase;letter-spacing:.055em}.dq-action{white-space:nowrap}.dq-empty{padding:30px 18px;text-align:center;border:1px dashed var(--line);border-radius:14px;color:var(--muted)}.dq-empty strong{display:block;margin-bottom:5px;color:#77d5aa;font-size:17px}.dq-tab-badge{display:inline-grid;place-items:center;min-width:18px;height:18px;margin-left:5px;padding:0 5px;border-radius:999px;background:rgba(226,58,71,.16);color:#ffb0b7;font-size:9px;font-weight:950}.dq-tab-badge.zero{background:rgba(72,195,139,.13);color:#79d8ad}
    @media(max-width:760px){.dq-head{display:grid}.dq-tools{display:grid;grid-template-columns:1fr 1fr}.dq-tools .select{width:100%;min-width:0}.dq-tools .btn{width:100%}.dq-summary{grid-template-columns:1fr 1fr}.dq-item{grid-template-columns:9px minmax(0,1fr)}.dq-action{grid-column:2;width:100%}.dq-action .btn{width:100%}}
  `;
  document.head.appendChild(style);

  const btn=document.createElement('button');btn.className='tab';btn.dataset.tab='quality';btn.innerHTML='Контроль данных <span class="dq-tab-badge zero">0</span>';
  const settingsBtn=tabs.querySelector('[data-tab="settings"]');settingsBtn?tabs.insertBefore(btn,settingsBtn):tabs.appendChild(btn);
  const section=document.createElement('section');section.id='tab-quality';section.className='hidden';section.innerHTML=`
    <div class="dq-head"><div><h2>Контроль качества данных</h2><div class="muted">Автоматическая проверка календаря, протоколов, составов, игроков и карточек команд.</div></div><div class="dq-tools"><select id="dqScope" class="select"><option value="current">Текущий тур</option><option value="all">Весь турнир</option></select><button type="button" id="dqScan" class="btn">Проверить заново</button></div></div>
    <div id="dqSummary" class="dq-summary"></div><div id="dqProgress" class="dq-progress">Откройте раздел, чтобы запустить проверку.</div><div id="dqFilters" class="dq-filters"></div><div id="dqList" class="dq-list"></div>`;
  settings.parentNode.insertBefore(section,settings);
  const summary=section.querySelector('#dqSummary'),progress=section.querySelector('#dqProgress'),list=section.querySelector('#dqList'),filters=section.querySelector('#dqFilters'),scope=section.querySelector('#dqScope');

  function chunks(arenas,prefix){return (Array.isArray(arenas)?arenas:[]).filter(a=>String(a?.name||'').startsWith(prefix)).sort((a,b)=>String(a.name).localeCompare(String(b.name))).map(a=>String(a.address||'')).join('')}
  function decodeJson(arenas,prefix){const s=chunks(arenas,prefix);if(!s)return{};try{return JSON.parse(s)||{}}catch{return{}}}
  function manualPhotos(team){const raw=decodeJson(team?.arenas,PHOTO_PREFIX),out={};for(const[k,v]of Object.entries(raw)){let u=String(v||'');if(u.startsWith('~0:'))u='https://img.fhr.ru/players/'+u.slice(3);if(u.startsWith('~1:'))u='https://junior.fhr.ru/players/'+u.slice(3);if(u)out[norm(k)]=u}return out}
  function lineups(team){return decodeJson(team?.arenas,LINEUP_PREFIX)}

  function add(severity,category,title,detail,opt={}){issues.push({severity,category,title,detail,...opt})}
  function playerMatches(value,players){const v=norm(value);if(!v)return false;const p=v.split(' '),surname=p[0],first=p[1]||'';return players.some(x=>{const n=norm(x.name),a=n.split(' ');return n===v||(surname&&a[0]===surname&&(!first||!a[1]||a[1].startsWith(first.slice(0,2))||first.startsWith(a[1].slice(0,2))))})}
  function assistantParts(s){return String(s||'').split(/[,;\/]+/).map(x=>x.trim()).filter(Boolean)}
  function staticParse(){if(staticRosters)return Promise.resolve(staticRosters);return fetch('/rosters.js?v=20260903-1',{cache:'force-cache'}).then(r=>r.text()).then(text=>{const a=text.indexOf('const R={'),b=text.indexOf('const NOTES=',a);if(a<0||b<0)throw Error('static roster');let e=text.slice(a+'const R='.length,b).trim();if(e.endsWith(';'))e=e.slice(0,-1);staticRosters=Function('return ('+e+')')();return staticRosters}).catch(()=>staticRosters={})}
  async function roster(team){
    const id=Number(team.id);if(rosterCache.has(id))return rosterCache.get(id);
    let value={players:[],source:'none',verified:false};
    try{const r=await fetch(FHR+'?team='+id,{cache:'no-store'});if(r.ok){const b=await r.json();if(Array.isArray(b.players)&&b.players.length)value={players:b.players.map(p=>({name:String(p.name||'').trim(),number:p.number,pos:p.pos||'U',photo:p.photo||''})).filter(p=>p.name),source:'fhr',verified:true}}}catch{}
    if(!value.players.length){const all=await staticParse(),rows=all?.[team.name]||[];if(rows.length)value={players:rows.map(x=>({number:x[0],name:String(x[1]||'').trim(),pos:x[2]||'U',photo:''})).filter(p=>p.name),source:'static',verified:false}}
    rosterCache.set(id,value);return value;
  }

  async function datasetsForScope(){
    if(!D)return[];if(scope.value==='current')return[D];
    const stages=(C?.stages||[]).filter(s=>Number(s.tournament_id)===Number(D.tournament.id)).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
    progress.textContent='Загружаю все туры…';
    const out=[];for(const s of stages){try{out.push(await req('/api/data?tournament_slug='+encodeURIComponent(D.tournament.slug)+'&stage_id='+s.id))}catch(e){add('error','system','Не удалось загрузить тур',s.name+': '+(e.message||String(e)),{stageId:s.id})}}return out;
  }

  function auditStructure(data){
    const stage=data.stage,stageLabel=stage?.name||'Тур';
    const memByTeam=new Map;for(const m of data.memberships||[]){if(!memByTeam.has(Number(m.team_id)))memByTeam.set(Number(m.team_id),[]);memByTeam.get(Number(m.team_id)).push(m)}
    const active=new Set((data.memberships||[]).map(m=>Number(m.team_id)));for(const m of data.matches||[]){active.add(Number(m.home_team_id));active.add(Number(m.away_team_id))}
    for(const id of active){const n=memByTeam.get(id)?.length||0;if(n===0)add('error','team','Команда не состоит в группе',teamName(data,id)+' участвует в '+stageLabel+', но не имеет членства в группе.',{teamId:id,stageId:stage.id,action:'team'});if(n>1)add('error','team','Команда состоит сразу в нескольких группах',teamName(data,id)+' · '+n+' групп.',{teamId:id,stageId:stage.id,action:'team'})}
    const keyMap=new Map;for(const m of data.matches||[]){const key=String(m.group_id)+'|'+String(m.game_no);if(m.game_no!=null){if(keyMap.has(key))add('error','match','Дублируется номер матча','В одной группе номер №'+m.game_no+' назначен нескольким матчам.',{matchId:m.id,stageId:stage.id,action:'match'});else keyMap.set(key,m.id)}
      const groupMembers=new Set((data.memberships||[]).filter(x=>Number(x.group_id)===Number(m.group_id)).map(x=>Number(x.team_id)));for(const tid of [m.home_team_id,m.away_team_id])if(!groupMembers.has(Number(tid)))add('error','match','Команда матча не состоит в его группе',teamName(data,tid)+' · матч №'+(m.game_no??'—')+'.',{matchId:m.id,teamId:tid,stageId:stage.id,action:'match'});
      if(Number(m.home_team_id)===Number(m.away_team_id))add('error','match','Команда играет сама с собой','Матч №'+(m.game_no??'—')+'.',{matchId:m.id,stageId:stage.id,action:'match'});
    }
  }

  function auditMatch(data,m,rosters){
    const stageId=data.stage.id,home=teamName(data,m.home_team_id),away=teamName(data,m.away_team_id),label=`${home} — ${away} · №${m.game_no??'—'}`;
    if(!m.game_date)add('error','match','У матча нет даты',label,{matchId:m.id,stageId,action:'match'});
    if(!String(m.start_time||'').trim())add('warn','match','У матча не указано время',label,{matchId:m.id,stageId,action:'match'});
    if(!String(m.city||'').trim())add('warn','match','У матча не указан город',label,{matchId:m.id,stageId,action:'match'});
    if(!String(m.arena||'').trim())add('warn','match','У матча не указана арена',label,{matchId:m.id,stageId,action:'match'});
    if(hasScore(m)&&m.home_score===m.away_score)add('error','match','Итоговый счёт ничейный',label+' · '+m.home_score+':'+m.away_score,{matchId:m.id,stageId,action:'match'});
    if(!done(m))return;
    const events=(data.match_events||[]).filter(e=>Number(e.match_id)===Number(m.id));
    if(!events.length)add('error','protocol','Завершённый матч без событий протокола',label+' · итог '+m.home_score+':'+m.away_score,{matchId:m.id,stageId,action:'protocol'});
    const pkeys=m.finish_type==='REG'?['p1','p2','p3']:m.finish_type==='OT'?['p1','p2','p3','ot']:['p1','p2','p3','ot','so'];
    const allPeriods=pkeys.every(k=>Number.isInteger(m[k+'_home'])&&Number.isInteger(m[k+'_away']));
    if(!allPeriods)add('warn','protocol','Не заполнен счёт по периодам',label,{matchId:m.id,stageId,action:'protocol'});else{const sh=pkeys.reduce((s,k)=>s+m[k+'_home'],0),sa=pkeys.reduce((s,k)=>s+m[k+'_away'],0);if(sh!==m.home_score||sa!==m.away_score)add('error','protocol','Счёт по периодам не совпадает с итогом',label+` · периоды ${sh}:${sa}, итог ${m.home_score}:${m.away_score}.`,{matchId:m.id,stageId,action:'protocol'})}
    for(const side of [['home',m.home_team_id],['away',m.away_team_id]]){const team=data.teams.find(t=>Number(t.id)===Number(side[1])),map=lineups(team),selected=Array.isArray(map[String(m.id)])?map[String(m.id)]:[];if(!selected.length)add('warn','player','Не отмечен состав на завершённый матч',teamName(data,side[1])+' · '+label,{matchId:m.id,teamId:side[1],stageId,action:'protocol'});else{const rr=rosters.get(Number(side[1]));if(rr?.players?.length)for(const n of selected)if(!playerMatches(n,rr.players))add('warn','player','Игрок из состава на матч не найден в заявке',String(n)+' · '+teamName(data,side[1])+' · '+label,{matchId:m.id,teamId:side[1],playerName:n,stageId,action:'player'})}}
    for(const e of events){const et=String(e.event_type||'');if(['GOAL','PENALTY'].includes(et)&&!e.team_id)add('warn','protocol','У события не указана команда',label+' · '+et+(e.clock?' · '+e.clock:''),{matchId:m.id,stageId,action:'protocol'});if(e.team_id&&![Number(m.home_team_id),Number(m.away_team_id)].includes(Number(e.team_id)))add('error','protocol','В событии указана посторонняя команда',label+' · событие #'+e.id,{matchId:m.id,stageId,action:'protocol'});if(['GOAL','PENALTY'].includes(et)&&!String(e.player||'').trim())add('warn','protocol','У события не указан игрок',label+' · '+(et==='GOAL'?'гол':'штраф')+(e.clock?' · '+e.clock:''),{matchId:m.id,stageId,action:'protocol'});if(et==='PENALTY'&&!Number.isFinite(Number(e.penalty_minutes)))add('warn','protocol','У штрафа не указаны минуты',label+(e.player?' · '+e.player:''),{matchId:m.id,stageId,action:'protocol'});
      if(e.team_id&&String(e.player||'').trim()){const rr=rosters.get(Number(e.team_id));if(rr?.players?.length&&!playerMatches(e.player,rr.players))add('error','player','Игрок события не найден в заявке',e.player+' · '+teamName(data,e.team_id)+' · '+label,{matchId:m.id,teamId:e.team_id,playerName:e.player,stageId,action:'player'})}
      if(et==='GOAL'&&e.team_id&&e.assistants){const rr=rosters.get(Number(e.team_id));if(rr?.players?.length)for(const a of assistantParts(e.assistants))if(!playerMatches(a,rr.players))add('warn','player','Ассистент не найден в заявке',a+' · '+teamName(data,e.team_id)+' · '+label,{matchId:m.id,teamId:e.team_id,playerName:a,stageId,action:'player'})}
    }
  }

  function auditTeam(team,rr){
    const real=(Array.isArray(team.arenas)?team.arenas:[]).filter(a=>!hiddenArena(a)&&((a?.name||'').trim()||(a?.address||'').trim()));
    if(!String(team.city||'').trim())add('warn','team','У команды не указан город',team.name,{teamId:team.id,action:'team'});
    if(!real.length)add('warn','team','У команды не указана арена',team.name,{teamId:team.id,action:'team'});
    if(!rr.players.length){add('error','player','Не удалось найти состав команды',team.name,{teamId:team.id,action:'team'});return}
    if(!rr.verified)add('info','player','Состав ФХР временно не удалось проверить',team.name+' · используется резервный локальный состав. Проверка автоматических фотографий пропущена.',{teamId:team.id,action:'team'});
    const numbers=new Map;for(const p of rr.players){if(p.number==null||p.number==='')continue;const k=String(p.number);if(numbers.has(k))add('warn','player','Дублируется номер игрока',team.name+' · №'+k+' · '+numbers.get(k)+' / '+p.name,{teamId:team.id,playerName:p.name,action:'player'});else numbers.set(k,p.name)}
    if(rr.verified){const manual=manualPhotos(team);for(const p of rr.players)if(!String(p.photo||'').trim()&&!manual[norm(p.name)])add('warn','player','У игрока нет фотографии',team.name+' · №'+(p.number??'—')+' · '+p.name,{teamId:team.id,playerName:p.name,action:'player',photoMissing:true})}
  }

  async function scan(){
    const seq=++scanSeq;issues=[];stats={matches:0,teams:0,players:0,stages:0};progress.textContent='Запускаю проверку…';summary.innerHTML='';list.innerHTML='';filters.innerHTML='';btn.querySelector('.dq-tab-badge').textContent='…';
    if(!D){progress.textContent='Сначала выберите турнир и этап.';return}
    rosterCache=new Map();const sets=await datasetsForScope();if(seq!==scanSeq)return;stats.stages=sets.length;
    const teamMap=new Map;for(const data of sets){auditStructure(data);for(const t of data.teams||[])teamMap.set(Number(t.id),t);stats.matches+=(data.matches||[]).length}
    const activeIds=new Set;for(const data of sets){for(const m of data.memberships||[])activeIds.add(Number(m.team_id));for(const m of data.matches||[]){activeIds.add(Number(m.home_team_id));activeIds.add(Number(m.away_team_id))}}
    const activeTeams=[...activeIds].map(id=>teamMap.get(id)).filter(Boolean);stats.teams=activeTeams.length;progress.textContent='Проверяю заявки и фотографии игроков… 0 / '+activeTeams.length;
    const rosterMap=new Map;for(let i=0;i<activeTeams.length;i++){if(seq!==scanSeq)return;const t=activeTeams[i],rr=await roster(t);rosterMap.set(Number(t.id),rr);stats.players+=rr.players.length;auditTeam(t,rr);progress.textContent='Проверяю заявки и фотографии игроков… '+(i+1)+' / '+activeTeams.length}
    progress.textContent='Проверяю матчи, протоколы и составы на игру…';for(const data of sets)for(const m of data.matches||[])auditMatch(data,m,rosterMap);if(seq!==scanSeq)return;
    const uniq=new Map;for(const x of issues){const k=[x.severity,x.category,x.title,x.stageId,x.matchId,x.teamId,x.playerName,x.detail].join('|');if(!uniq.has(k))uniq.set(k,x)}issues=[...uniq.values()];
    progress.textContent=`Проверено: ${stats.stages} ${stats.stages===1?'тур':'туров'} · ${stats.matches} матчей · ${stats.teams} команд · ${stats.players} игроков.`;render();
  }

  function counts(){return{error:issues.filter(x=>x.severity==='error').length,warn:issues.filter(x=>x.severity==='warn').length,info:issues.filter(x=>x.severity==='info').length,photo:issues.filter(x=>x.photoMissing).length}}
  function render(){const c=counts(),badge=btn.querySelector('.dq-tab-badge'),problem=c.error+c.warn;badge.textContent=problem;badge.classList.toggle('zero',problem===0);summary.innerHTML=`<div class="dq-stat ${c.error?'bad':'good'}"><strong>${c.error}</strong><span>критичных</span></div><div class="dq-stat ${c.warn?'warn':'good'}"><strong>${c.warn}</strong><span>предупреждений</span></div><div class="dq-stat"><strong>${c.photo}</strong><span>без фото</span></div><div class="dq-stat good"><strong>${stats.matches||0}</strong><span>матчей проверено</span></div>`;
    const cats=[['all','Все',issues.length],['error','Критичные',c.error],['match','Матчи',issues.filter(x=>x.category==='match').length],['protocol','Протоколы',issues.filter(x=>x.category==='protocol').length],['team','Команды',issues.filter(x=>x.category==='team').length],['player','Игроки',issues.filter(x=>x.category==='player').length]];filters.innerHTML=cats.map(([k,l,n])=>`<button type="button" class="dq-filter${filter===k?' active':''}" data-dq-filter="${k}">${l} · ${n}</button>`).join('');filters.querySelectorAll('[data-dq-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.dqFilter;render()});
    const rows=issues.filter(x=>filter==='all'||(filter==='error'?x.severity==='error':x.category===filter)).sort((a,b)=>({error:0,warn:1,info:2}[a.severity]-({error:0,warn:1,info:2}[b.severity]))||a.title.localeCompare(b.title,'ru'));
    if(!rows.length){list.innerHTML='<div class="dq-empty"><strong>✓ Здесь всё чисто</strong>Проблем по выбранному фильтру не найдено.</div>';return}list.innerHTML=rows.map((x,i)=>`<article class="dq-item ${x.severity}"><span class="dq-dot"></span><div><div class="dq-title">${esc(x.title)}</div><div class="dq-detail">${esc(x.detail||'')}</div><div class="dq-meta">${x.severity==='error'?'Критично':x.severity==='warn'?'Нужно проверить':'Информация'}${x.stageId?' · этап #'+x.stageId:''}</div></div>${x.action?`<div class="dq-action"><button type="button" class="btn sec small" data-dq-action="${i}">${x.action==='protocol'?'Открыть протокол':x.action==='player'?'Открыть игрока':x.action==='team'?'Открыть команду':'Открыть матч'}</button></div>`:''}</article>`).join('');list.querySelectorAll('[data-dq-action]').forEach((b)=>{const row=rows[Number(b.dataset.dqAction)];b.onclick=()=>navigate(row)})}

  async function setStage(stageId){if(!stageId||Number(D?.stage?.id)===Number(stageId))return;const opt=[...document.querySelector('#stage').options].find(o=>Number(o.value)===Number(stageId));if(!opt)return;document.querySelector('#stage').value=String(stageId);await loadData(document.querySelector('#tournament').value,Number(stageId))}
  async function goMatch(x,protocol=false){await setStage(x.stageId);const b=document.querySelector('[data-tab="matches"]');b?.click();MATCH_GROUP_FILTER='all';renderMatchGroupFilters();renderMatches();await new Promise(r=>setTimeout(r,120));const card=document.querySelector(`.match-card[data-id="${x.matchId}"]`);card?.scrollIntoView({behavior:'smooth',block:'center'});if(protocol){await new Promise(r=>setTimeout(r,100));card?.querySelector('.protocol-btn')?.click()}}
  async function goTeam(x,player=false){await setStage(x.stageId);const b=document.querySelector('[data-tab="teams"]');if(!b){alert('Раздел «Команды» ещё загружается. Повторите через секунду.');return}b.click();await new Promise(r=>setTimeout(r,400));const sel=document.querySelector('#teamAdminSelect');if(sel&&x.teamId){sel.value=String(x.teamId);sel.dispatchEvent(new Event('change',{bubbles:true}))}if(player&&x.playerName){await new Promise(r=>setTimeout(r,450));const target=[...document.querySelectorAll('.player-photo-row')].find(r=>norm(r.dataset.playerName)===norm(x.playerName));target?.scrollIntoView({behavior:'smooth',block:'center'});target?.querySelector('.player-photo-input')?.focus()}else document.querySelector('#teamAdminForm')?.scrollIntoView({behavior:'smooth',block:'start'})}
  function navigate(x){if(x.action==='match')goMatch(x,false);else if(x.action==='protocol')goMatch(x,true);else if(x.action==='team')goTeam(x,false);else if(x.action==='player')goTeam(x,true)}

  section.querySelector('#dqScan').onclick=scan;scope.onchange=scan;
  btn.addEventListener('click',async()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===btn));document.querySelectorAll('[id^="tab-"]').forEach(x=>x.classList.toggle('hidden',x!==section));section.classList.remove('hidden');await scan()});
  function wireTabs(){document.querySelectorAll('.tab:not([data-tab="quality"])').forEach(x=>{if(x.dataset.dqWired)return;x.dataset.dqWired='1';x.addEventListener('click',()=>section.classList.add('hidden'))})}wireTabs();new MutationObserver(wireTabs).observe(tabs,{childList:true});
  document.querySelector('#tournament')?.addEventListener('change',()=>{issues=[];btn.querySelector('.dq-tab-badge').textContent='0';btn.querySelector('.dq-tab-badge').classList.add('zero')});
  document.querySelector('#stage')?.addEventListener('change',()=>{issues=[];btn.querySelector('.dq-tab-badge').textContent='0';btn.querySelector('.dq-tab-badge').classList.add('zero')});
})();
