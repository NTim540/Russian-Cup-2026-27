(()=>{
'use strict';
const API='/api/fhm-clip-demo';
const STORE='fhmClipCapturesV5_game17349';
const captures=new Map(Object.entries(JSON.parse(localStorage.getItem(STORE)||'{}')));
let data=null,player=null,lastVideoTime=NaN,known=new Set(),inClip=false,clipTimer=null,newKeys=new Set();
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const save=()=>localStorage.setItem(STORE,JSON.stringify(Object.fromEntries(captures)));
function team(side){return side==='away'?data?.teams?.away:data?.teams?.home}
function teamName(side){return team(side)?.name||''}
function teamLogo(side){return team(side)?.logo||''}
function colorTeamName(name=''){return String(name).replace(/\s+20\d{2}\s*$/,'').trim()}
function logoHtml(t){return t?.logo?`<img src="${esc(t.logo)}" alt="">`:'<div class="ph">U16</div>'}
function setPlayerState(text,cls=''){const e=$('#playerState');if(!e)return;e.textContent=text;e.className='pstate '+cls}
function current(){try{const n=Number(player?.getCurrentTime?.());if(Number.isFinite(n)){lastVideoTime=n;return n}}catch{}return lastVideoTime}
function fmtVideo(n){if(!Number.isFinite(Number(n)))return'—';n=Math.max(0,Math.floor(Number(n)));return`${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`}
function effectiveStatus(){
 if(!data)return'LIVE';
 const startMs=Date.parse(data.start||'');
 if(Number.isFinite(startMs)){
  if(Date.now()<startMs)return'SCHEDULED';
  const age=Date.now()-startMs;
  if(data.status==='FINAL'&&!(data.events||[]).some(e=>e.type==='MATCH_END')&&age<2.5*60*60*1000)return'LIVE';
 }
 return data.status||'LIVE';
}
function titleFor(e){return({GOAL:'Гол',PENALTY:'Удаление',MATCH_START:'Начало матча',MATCH_END:'Матч завершён',PERIOD_START:'Начало периода',PERIOD_END:'Конец периода',TIMEOUT:'Тайм-аут',GOALIE:'Смена вратаря'})[e.type]||e.rawName||'Событие'}
function detailsFor(e){if(e.type==='GOAL'){const a=[e.assist1,e.assist2].filter(Boolean);return a.length?`Передачи: ${a.join(', ')}`:'Без результативных передач'}if(e.type==='PENALTY')return`${e.penaltyMinutes?e.penaltyMinutes+' мин. · ':''}${e.violation||'Нарушение правил'}`;if(e.type==='MATCH_START')return'Матч начался';if(e.type==='MATCH_END')return'Финальная сирена';if(e.type==='PERIOD_START')return`${e.period} период начался`;if(e.type==='PERIOD_END')return`${e.period} период завершён`;if(e.type==='TIMEOUT')return`${teamName(e.side)||'Команда'} берёт тайм-аут`;return e.player||e.rawName||''}
function renderScore(pop=false){
 if(!data)return;
 const st=effectiveStatus();
 $('#matchTitle').textContent=data.title||'Матч';
 $('#matchPhase').textContent=st==='FINAL'?'Завершён':st==='SCHEDULED'?'Скоро':'LIVE · '+data.currentPeriod+' период';
 $('#mainScore').textContent=`${data.score?.home??0}:${data.score?.away??0}`;
 $('#periodLabel').textContent=st==='FINAL'?'Матч завершён':st==='SCHEDULED'?'До начала':`${data.currentPeriod} период`;
 $('#homeTeam').innerHTML=`${logoHtml(data.teams?.home)}<strong>${esc(data.teams?.home?.name||'Команда 1')}</strong>`;
 $('#awayTeam').innerHTML=`${logoHtml(data.teams?.away)}<strong>${esc(data.teams?.away?.name||'Команда 2')}</strong>`;
 $('#periodScores').innerHTML=[1,2,3].map(n=>{const p=(data.periodScores||[]).find(x=>x.period===n)||{home:0,away:0};return`<div class="pc ${n===data.currentPeriod&&st==='LIVE'?'active':''}"><span>${n} период</span><strong>${p.home}:${p.away}</strong></div>`}).join('');
 if(pop){const box=$('#scoreBox');box.classList.remove('pop');void box.offsetWidth;box.classList.add('pop')}
}
function systemCard(type,period,time,text){return`<article class="event system"><div class="etime"><strong>${esc(time)}</strong><small>${period?period+' период':''}</small></div><div class="emain"><span class="etype">${esc(titleFor({type,period}))}</span><strong>${esc(text)}</strong><p>${esc(detailsFor({type,period}))}</p></div><div class="eicon">•</div></article>`}
function eventCard(e){const isVideo=e.type==='GOAL'||e.type==='PENALTY',cap=captures.get(e.key),active=!!(cap&&Number.isFinite(Number(cap.start))),cls=e.type==='GOAL'?'goal':e.type==='PENALTY'?'penalty':'system',logo=teamLogo(e.side),name=teamName(e.side),colorName=colorTeamName(name);return`<article class="event ${cls} ${newKeys.has(e.key)?'new':''}" data-event-key="${esc(e.key)}" data-event-type="${esc(e.type)}" data-team-name="${esc(colorName)}" data-team-logo="${esc(logo)}" data-penalty-minutes="${esc(e.penaltyMinutes||2)}" data-penalty-reason="${esc(e.violation||'Нарушение правил')}"><div class="etime"><strong>${esc(e.time||'—')}</strong><small>${e.period?e.period+' период':''}</small></div>${logo?`<img class="event-team-logo" src="${esc(logo)}" alt="${esc(name)}">`:''}<div class="emain"><span class="etype">${esc(titleFor(e))}${e.type==='GOAL'?` <span class="escore">${esc(e.score)}</span>`:''}</span><strong>${e.number?`№${esc(e.number)} `:''}${esc(e.player||name||titleFor(e))}</strong>${name?`<span class="event-team-name">${esc(name)}</span>`:''}<p>${esc(detailsFor(e))}${active?' · <span style="color:#81ddb5">видео готово</span>':''}</p></div>${isVideo?`<button class="play ${active?'':'wait'}" type="button" data-key="${esc(e.key)}" ${active?'':'disabled'} aria-label="${active?'Смотреть видео':'Видео ещё синхронизируется'}"></button>`:`<div class="eicon">•</div>`}</article>`}
function renderFeed(){
 if(!data)return;
 const st=effectiveStatus(),events=(data.events||[]).filter(e=>!(st==='SCHEDULED'&&e.type==='MATCH_START'));
 if(st==='SCHEDULED'){$('#feed').innerHTML='<div class="info">Матч ещё не начался. Протокол подключён и начнёт заполняться автоматически.</div>';return}
 let html='';
 for(let p=3;p>=1;p--){
  const xs=events.filter(e=>(e.period||1)===p&&e.type!=='MATCH_START').reverse();
  if(!xs.length&&p>data.currentPeriod&&st!=='FINAL')continue;
  html+=`<div class="divider"><span>${p} период</span></div>`;
  const completed=st==='FINAL'||p<data.currentPeriod;
  if(st==='FINAL'&&p===3)html+=systemCard('MATCH_END',3,'60:00','Матч завершён');
  if(completed)html+=systemCard('PERIOD_END',p,p===1?'20:00':p===2?'40:00':'60:00',`Конец ${p} периода`);
  html+=xs.map(eventCard).join('');
  if(p>1&&(st==='FINAL'||p<=data.currentPeriod))html+=systemCard('PERIOD_START',p,p===2?'20:00':'40:00',`Начало ${p} периода`);
 }
 const start=events.find(e=>e.type==='MATCH_START');
 if(start)html+=`<div class="divider"><span>Старт матча</span></div>${eventCard(start)}`;
 $('#feed').innerHTML=html||'<div class="info">LIVE-протокол подключён. Ждём первое событие матча.</div>';
}
function render(pop=false){renderScore(pop);renderFeed()}
function cardFor(e){return[...document.querySelectorAll('[data-event-key]')].find(el=>el.dataset.eventKey===e.key)||null}
function animateEvent(e){const card=cardFor(e);if(!card)return;if(e.type==='GOAL')window.CupMHLAnimations?.goal?.(card);else if(e.type==='PENALTY')window.CupMHLAnimations?.penalty?.(card)}
function storeWindow(e,start,end,source='live'){if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start)return;captures.set(e.key,{start:Math.max(0,start),end:Math.max(0,end),source,capturedAt:new Date().toISOString()});save()}
function captureNew(e){const t=current();if(!Number.isFinite(t)||captures.has(e.key))return;if(e.type==='GOAL')storeWindow(e,t-40,t+15,'live-detection');else if(e.type==='PENALTY')storeWindow(e,t-30,t+12,'live-detection')}
function goLive(){if(!player)return;clearInterval(clipTimer);inClip=false;try{player.seekLive?.();player.mute?.();player.play?.()}catch{}$('#clipBar').classList.remove('show');setPlayerState('LIVE · синхронизация','sync')}
function seek(sec){try{player?.seek?.(Math.max(0,Number(sec)||0));player?.play?.()}catch{}}
function playClip(key){const cap=captures.get(key);if(!cap||!player)return;const e=(data.events||[]).find(x=>x.key===key);inClip=true;clearInterval(clipTimer);seek(cap.start);try{player.unmute?.()}catch{}$('#clipText').textContent=`${titleFor(e)} · ${e?.time||''} · ${e?.player||''}`;$('#clipBar').classList.add('show');setPlayerState(`Видео момента · ${fmtVideo(cap.start)}–${fmtVideo(cap.end)}`,'ok');clipTimer=setInterval(()=>{const t=current();if(Number.isFinite(t)&&t>=Number(cap.end))goLive()},300)}
function nudge(delta){const t=current();if(Number.isFinite(t))seek(t+delta)}
async function poll(first=false){
 try{
  const r=await fetch(`${API}?_=${Date.now()}`,{cache:'no-store'}),b=await r.json();if(!r.ok)throw Error(b.error||'Ошибка протокола');
  const prevScore=data?`${data.score?.home}:${data.score?.away}`:null,oldKnown=known;data=b;
  const keys=new Set((b.events||[]).map(e=>e.key)),added=first?[]:(b.events||[]).filter(e=>!oldKnown.has(e.key));
  for(const e of added){newKeys.add(e.key);if(e.type==='GOAL'||e.type==='PENALTY')captureNew(e)}
  known=keys;render(prevScore&&prevScore!==`${b.score?.home}:${b.score?.away}`);
  const st=effectiveStatus();$('#watchStatus').textContent=st==='FINAL'?'Матч завершён':st==='SCHEDULED'?'Ожидаем старт':'LIVE';
  $('#updated').textContent='обновлено '+new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  added.filter(e=>e.type==='GOAL'||e.type==='PENALTY').forEach((e,i)=>setTimeout(()=>animateEvent(e),120+i*6100));
  if(added.length)setTimeout(()=>{newKeys.clear();renderFeed()},7000)
 }catch(e){$('#watchStatus').textContent='Ошибка';setPlayerState(String(e),'err')}
}
function initPlayer(){if(!data)return;const frame=$('#vkPlayer');frame.src=data.video.embed+'&autoplay=1';const hook=()=>{try{if(!window.VK?.VideoPlayer)return setTimeout(hook,250);player=VK.VideoPlayer(frame);player.on?.('inited',()=>{setPlayerState('VK подключён · LIVE','sync');setTimeout(()=>goLive(),450)});player.on?.('timeupdate',s=>{const n=Number(s?.time??s);if(Number.isFinite(n))lastVideoTime=n;if(!inClip&&Number.isFinite(n))setPlayerState(`LIVE · ${fmtVideo(n)}`,'sync')});player.on?.('error',()=>setPlayerState('Ошибка VK-плеера','err'))}catch{setTimeout(hook,450)}};hook()}
$('#feed').addEventListener('click',e=>{const play=e.target.closest('.play[data-key]:not(.wait)');if(play){e.preventDefault();e.stopPropagation();playClip(play.dataset.key);return}const card=e.target.closest('.event[data-event-key]');if(!card)return;const ev=(data?.events||[]).find(x=>x.key===card.dataset.eventKey);if(ev&&(ev.type==='GOAL'||ev.type==='PENALTY'))animateEvent(ev)});
$('#backLive').addEventListener('click',goLive);$('#clipBack').addEventListener('click',()=>nudge(-10));$('#clipForward').addEventListener('click',()=>nudge(10));
(async()=>{await poll(true);initPlayer();setInterval(()=>poll(false),2000)})();
})();
