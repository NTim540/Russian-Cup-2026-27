(()=>{
'use strict';
if(document.getElementById('goal-animation-v2-style'))return;
const s=document.createElement('style');
s.id='goal-animation-v2-style';
s.textContent=`
@keyframes goalWipeVertical{0%,7%{clip-path:inset(0 0 100% 0)}28%,62%{clip-path:inset(0 0 0 0)}100%{clip-path:inset(0 0 100% 0)}}
@keyframes goalContentRevealVertical{0%,61%{opacity:0}62%,100%{opacity:1}}
.goal-celebrating>:not(.goal-celebration-layer){animation:goalContentRevealVertical 2.65s linear both!important}
.goal-celebration-layer{clip-path:inset(0 0 100% 0)!important;animation:goalWipeVertical 2.65s cubic-bezier(.65,0,.35,1) both!important;will-change:clip-path}
.goal-logo-stage,.goal-word-left,.goal-word-right{opacity:1!important;transform:none!important;animation:none!important}
#live .cup-referee-card{position:relative!important;display:grid!important;grid-template-columns:82px minmax(0,1fr)!important;gap:14px!important;align-items:stretch!important;padding:0!important;min-height:118px!important;border:1px solid rgba(255,255,255,.18)!important;border-left:0!important;border-radius:14px!important;overflow:hidden!important;background:repeating-linear-gradient(90deg,#f5f5f2 0 15px,#121212 15px 30px)!important}
#live .cup-referee-time{display:flex;align-items:center;justify-content:center;background:rgba(5,10,16,.88);font-size:20px;font-weight:950;letter-spacing:-.035em;white-space:nowrap}
#live .cup-referee-body{margin:8px 8px 8px 0;padding:13px 15px;border-radius:9px;background:rgba(7,17,31,.96);display:grid;gap:12px;align-content:center}
#live .cup-referee-row{display:flex;align-items:center;gap:11px;min-width:0;flex-wrap:wrap}
#live .cup-referee-tag{flex:0 0 auto;padding:6px 9px;border-radius:4px;font-size:9px;font-weight:1000;letter-spacing:.09em;text-transform:uppercase;white-space:nowrap}
#live .cup-referee-tag.main{background:#e87525;color:#fff}
#live .cup-referee-tag.lines{border:1.5px solid rgba(255,255,255,.9);color:#fff;background:transparent}
#live .cup-referee-names{font-size:13px;font-weight:850;line-height:1.35;color:#eef3f8;min-width:0}
#live .event-card.goal,#live .event-card.penalty{cursor:pointer}
.match-penalty-reason{overflow:visible!important;text-overflow:clip!important}
.match-penalty-reason.long{font-size:clamp(15px,2.45vw,28px)!important}.match-penalty-reason.very-long{font-size:clamp(12px,1.9vw,22px)!important;letter-spacing:-.05em!important}
@media(max-width:620px){#live .cup-referee-card{grid-template-columns:58px minmax(0,1fr)!important;gap:8px!important;min-height:108px!important}#live .cup-referee-time{font-size:16px}#live .cup-referee-body{margin:6px 6px 6px 0;padding:10px 11px;gap:9px}#live .cup-referee-row{gap:7px}#live .cup-referee-tag{font-size:7px;padding:5px 7px}#live .cup-referee-names{font-size:10px}.match-penalty-reason.long{font-size:13px!important}.match-penalty-reason.very-long{font-size:10.5px!important;letter-spacing:-.05em!important}}
@media(prefers-reduced-motion:reduce){.goal-celebration-layer{display:none!important}}
`;
document.head.appendChild(s);

const matchId=Number(new URL(location.href).searchParams.get('id'));
const OFFICIALS='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-officials';
const TEAM_COLORS={'ска 1946':'#2367b1','сахалинские акулы':'#173b63','динамо москва':'#1b62ad','мах':'#2387d9','торпедо':'#1f74b5','локомотив':'#c92f38','авангард':'#df2e36','локомотив 2004':'#c92f38','крылья советов':'#2f6fb5','сибирь':'#2387c9','лада':'#215ea7','трактор':'#20242a','ак барс':'#18855a','спартак':'#c82433','динамо спб':'#2b6fb8','динамо джуниверс':'#315eaa','ска стрельна':'#2367b1','акм':'#b82f3b','цска':'#d32d38','армия ска':'#2367b1','нефтехимик':'#275aa8','северсталь':'#d9a51b','красная машина юниор':'#df2e36'};
const norm=v=>String(v||'').toLocaleLowerCase('ru-RU').replace(/[«»"']/g,'').replace(/ё/g,'е').replace(/\s+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const goalSeen=new Set(),penaltySeen=new Set();
let armed=false,officials=null,officialsSig='',officialsLoading=false;

function guardMainRefresh(){
 const main=document.getElementById('main');if(!main||main.dataset.rawRefreshGuard==='1')return;
 const d=Object.getOwnPropertyDescriptor(main,'innerHTML');if(!d?.get||!d?.set)return;
 let lastIncoming='';
 Object.defineProperty(main,'innerHTML',{configurable:true,get(){return d.get.call(this)},set(v){const next=String(v??'');if(lastIncoming&&next===lastIncoming)return;lastIncoming=next;d.set.call(this,next)}});
 main.dataset.rawRefreshGuard='1';
}

guardMainRefresh();

function guardExtraPeriods(){
 const chips=[...document.querySelectorAll('.score-center .period-chip')];if(!chips.length)return;
 const ot=chips.find(c=>/овертайм|\bот\b/i.test(c.querySelector('span')?.textContent||''));
 const so=chips.find(c=>/бул/i.test(c.querySelector('span')?.textContent||''));
 const state=norm(document.querySelector('.match-state')?.textContent||'');
 const eventPeriods=norm([...document.querySelectorAll('#live .event-time span')].map(x=>x.textContent||'').join(' '));
 const finalScore=norm(document.querySelector('#live .cup-system-marker.final .cup-marker-result strong')?.textContent||'');
 const soReal=state.includes('буллит')||eventPeriods.includes('буллит')||/(^|\s)б$/.test(finalScore);
 const otReal=soReal||state.includes('овертайм')||/(^|\s)от(\s|$)/.test(state)||/(^|\s)от(\s|$)/.test(eventPeriods)||/(^|\s)от$/.test(finalScore);
 if(ot)ot.hidden=!otReal;if(so)so.hidden=!soReal;
}

function eventKey(card){return card.dataset.eventKey||[card.classList.contains('goal')?'goal':card.classList.contains('penalty')?'penalty':'event',card.querySelector('.event-time strong')?.textContent,card.querySelector('.event-time span')?.textContent,card.querySelector('.event-copy strong')?.textContent,card.querySelector('.event-copy p')?.textContent].map(norm).join('|')}
function teamFor(card){const src=card.querySelector('.event-logo')?.src||'';return [...document.querySelectorAll('.score-team')].map(x=>({name:x.querySelector('h1')?.textContent?.trim()||'',logo:x.querySelector('.score-logo img')?.src||''})).find(x=>src&&x.logo===src)||null}
function inkFor(hex){const h=String(hex).replace('#','');if(h.length!==6)return'#fff';const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);return(.299*r+.587*g+.114*b)>175?'#07111f':'#fff'}
function goalLayer(card){
 const team=teamFor(card),color=TEAM_COLORS[norm(team?.name)]||'#2387d9',ink=inkFor(color),logo=team?.logo||card.querySelector('.event-logo')?.src||'';
 card.querySelector('.goal-celebration-layer')?.remove();card.style.setProperty('--goal-team-color',color);card.style.setProperty('--goal-team-ink',ink);
 const layer=document.createElement('div');layer.className='goal-celebration-layer';layer.innerHTML=`<div class="goal-word goal-word-left">ГООООООООЛ!</div><div class="goal-logo-stage">${logo?`<img src="${esc(logo)}" alt="">`:''}</div><div class="goal-word goal-word-right">ГООООООООЛ!</div>`;card.appendChild(layer)
}
function playGoal(card){if(!card)return;card.classList.remove('goal-celebrating');card.querySelector('.goal-celebration-layer')?.remove();void card.offsetWidth;goalLayer(card);card.classList.add('goal-celebrating');setTimeout(()=>{card.classList.remove('goal-celebrating');card.querySelector('.goal-celebration-layer')?.remove()},2900)}
function penaltyData(card){const text=String(card.querySelector('.event-copy p')?.textContent||'').trim(),m=text.match(/(\d+(?:\+\d+)?)\s*мин\.?/i);let reason=m?text.replace(m[0],''):text;reason=reason.replace(/^[\s·—–-]+|[\s·—–-]+$/g,'').trim()||'Удаление';return{minutes:`${m?.[1]||'2'}′`,reason}}
function reasonClass(s){return s.length>31?'very-long':s.length>20?'long':''}
function playPenalty(card){
 if(!card)return;const {minutes,reason}=penaltyData(card),logo=card.querySelector('.event-logo')?.src||'';card.classList.remove('match-penalty-playing');card.querySelector('.match-penalty-layer')?.remove();void card.offsetWidth;
 const layer=document.createElement('div');layer.className='match-penalty-layer';layer.setAttribute('aria-hidden','true');layer.innerHTML=`<div class="match-penalty-inner match-penalty-back"><div class="match-penalty-minutes">${esc(minutes)}</div><div class="match-penalty-reason ${reasonClass(reason)}">${esc(reason)}</div></div><div class="match-penalty-cover"><div class="match-penalty-inner match-penalty-front"><span class="match-penalty-big-whistle"></span><div class="match-penalty-word">Удаление</div>${logo?`<img class="match-penalty-logo" src="${esc(logo)}" alt="">`:'<span></span>'}</div></div>`;card.appendChild(layer);card.classList.add('match-penalty-playing');setTimeout(()=>{card.classList.remove('match-penalty-playing');card.querySelector('.match-penalty-layer')?.remove()},5950)
}
function bindReplay(card,type){if(card.dataset.animationReplayBound==='1')return;card.dataset.animationReplayBound='1';card.addEventListener('click',e=>{if(e.target.closest('a,button,summary,details'))return;if(type==='goal')playGoal(card);else playPenalty(card)})}
function scanEvents(){
 const goals=[...document.querySelectorAll('#live .event-card.goal')],penalties=[...document.querySelectorAll('#live .event-card.penalty')];
 goals.forEach(c=>bindReplay(c,'goal'));penalties.forEach(c=>bindReplay(c,'penalty'));
 if(!armed){goals.forEach(c=>goalSeen.add(eventKey(c)));penalties.forEach(c=>penaltySeen.add(eventKey(c)));armed=true;return}
 for(const card of goals){const k=eventKey(card);if(goalSeen.has(k))continue;goalSeen.add(k);setTimeout(()=>{if(card.isConnected&&!card.classList.contains('goal-celebrating'))playGoal(card)},140)}
 for(const card of penalties){const k=eventKey(card);if(penaltySeen.has(k))continue;penaltySeen.add(k);setTimeout(()=>{if(card.isConnected&&!card.classList.contains('match-penalty-playing'))playPenalty(card)},160)}
}

function startMarker(){return document.querySelector('#live .cup-opening-marker.match-start,#live .cup-system-marker.start')}
function officialsCard(){
 const main=Array.isArray(officials?.main)?officials.main:[],lines=Array.isArray(officials?.lines)?officials.lines:[];if(!main.length&&!lines.length)return null;
 const el=document.createElement('article');el.className='event-card cup-referee-card';el.dataset.officialsSig=officialsSig;el.innerHTML=`<div class="cup-referee-time">00:00</div><div class="cup-referee-body">${main.length?`<div class="cup-referee-row"><span class="cup-referee-tag main">Главные судьи</span><span class="cup-referee-names">${main.map(esc).join(' · ')}</span></div>`:''}${lines.length?`<div class="cup-referee-row"><span class="cup-referee-tag lines">Линейные судьи</span><span class="cup-referee-names">${lines.map(esc).join(' · ')}</span></div>`:''}</div>`;return el
}
function renderOfficials(){
 const start=startMarker(),timeline=document.querySelector('#live .timeline');if(!start||!timeline)return;const old=timeline.querySelector(':scope > .cup-referee-card');if(old?.dataset.officialsSig===officialsSig)return;old?.remove();const card=officialsCard();if(card)start.insertAdjacentElement('afterend',card)
}
async function fetchOfficials(){if(!Number.isInteger(matchId)||matchId<1||officialsLoading)return;officialsLoading=true;try{const r=await fetch(`${OFFICIALS}?match_id=${matchId}&_=${Date.now()}`,{cache:'no-store'}),b=await r.json();if(r.ok){const next=b.officials||{main:[],lines:[]},sig=JSON.stringify(next);if(sig!==officialsSig){officials=next;officialsSig=sig;renderOfficials()}}}catch{}finally{officialsLoading=false}}

let queued=false;function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;guardExtraPeriods();scanEvents();renderOfficials()})}
const root=document.getElementById('main')||document.body;new MutationObserver(queue).observe(root,{childList:true,subtree:true});
queue();fetchOfficials();setInterval(fetchOfficials,45000);setInterval(queue,1000);
})();
