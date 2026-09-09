(()=>{
'use strict';
if(!/\/mhl-test\.html$/i.test(location.pathname))return;
const style=document.createElement('style');style.id='mhl-demo-loop-style';style.textContent=`
.timeline>.event{grid-template-columns:92px 58px minmax(0,1fr) auto!important}
.timeline>.event .escore{font-size:28px!important;font-weight:950!important;min-width:54px;text-align:right;align-self:center}
.timeline>.event.goal,.event-card.goal{cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:rgba(101,213,158,.18);user-select:none;-webkit-user-select:none}
.timeline>.event.goal:hover,.event-card.goal:hover{border-color:rgba(101,213,158,.34)!important;box-shadow:0 14px 32px rgba(0,0,0,.18),0 0 0 1px rgba(101,213,158,.12)}
.timeline>.event.goal:active,.event-card.goal:active{transform:scale(.992)}
.timeline>.event.goal:focus-visible,.event-card.goal:focus-visible{outline:2px solid rgba(101,213,158,.85);outline-offset:3px}
.timeline>.event.goal.goal-celebrating,.event-card.goal.goal-celebrating{pointer-events:auto!important}
.goal-celebration-layer{pointer-events:auto!important}
@media(max-width:760px){.timeline>.event{grid-template-columns:60px 42px minmax(0,1fr)!important}.timeline>.event .escore{grid-column:3!important;font-size:22px!important;text-align:left;margin-top:2px}.timeline>.event.goal,.event-card.goal{min-height:104px!important}}
`;document.head.appendChild(style);
const COLORS={
 'ска 1946':'#2367b1','сахалинские акулы':'#173b63','динамо москва':'#1b62ad','мах':'#2387d9','торпедо':'#1f74b5','локомотив':'#c92f38','авангард':'#df2e36','локомотив 2004':'#c92f38','крылья советов':'#2f6fb5','сибирь':'#2387c9','лада':'#215ea7','трактор':'#20242a','ак барс':'#18855a','спартак':'#c82433','динамо спб':'#2b6fb8','динамо джуниверс':'#315eaa','ска стрельна':'#2367b1','акм':'#b82f3b','цска':'#d32d38','армия ска':'#2367b1','нефтехимик':'#275aa8','северсталь':'#d9a51b','красная машина юниор':'#df2e36'
};
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ё/gi,'е').replace(/[^a-zа-я0-9]+/gi,' ').trim().toLowerCase();
function inkFor(hex){const h=String(hex).replace('#','');if(h.length!==6)return'#fff';const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);return(.299*r+.587*g+.114*b)>175?'#07111f':'#fff'}
function team(card){const name=card.querySelector('.event-team-name')?.textContent?.trim()||'',logo=card.querySelector('.event-team-logo')?.src||'';return{name,logo}}
const cleanupTimers=new WeakMap();
function stop(card){
 const old=cleanupTimers.get(card);if(old)clearTimeout(old);cleanupTimers.delete(card);
 card.classList.remove('goal-celebrating','goal-demo-loop');card.querySelector('.goal-celebration-layer')?.remove();
}
function play(card,restart=false){
 if(!card)return false;
 if(card.classList.contains('goal-celebrating')){if(!restart)return false;stop(card)}
 const t=team(card),color=COLORS[norm(t.name)]||'#2387d9',ink=inkFor(color);
 card.querySelector('.goal-celebration-layer')?.remove();
 card.style.setProperty('--goal-team-color',color);card.style.setProperty('--goal-team-ink',ink);
 const layer=document.createElement('div');layer.className='goal-celebration-layer';
 layer.innerHTML=`<div class="goal-word goal-word-left">ГООООООООЛ!</div><div class="goal-logo-stage">${t.logo?`<img src="${t.logo}" alt="">`:''}</div><div class="goal-word goal-word-right">ГООООООООЛ!</div>`;
 card.appendChild(layer);void card.offsetWidth;card.classList.add('goal-celebrating','goal-demo-loop');
 const timeout=setTimeout(()=>{stop(card)},2900);cleanupTimers.set(card,timeout);
 return true;
}
function markGoals(){
 document.querySelectorAll('.timeline>.event.goal,.event-card.goal').forEach(card=>{
  card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label','Проиграть анимацию гола');card.title='Нажми или коснись, чтобы повторить анимацию гола';
 });
}
let index=0,timer=null;
function scheduleTick(delay=12000){clearTimeout(timer);timer=setTimeout(tick,delay)}
function tick(){
 markGoals();
 const goals=[...document.querySelectorAll('.timeline>.event.goal,.event-card.goal')];
 if(goals.length){const card=goals[index%goals.length];if(play(card))index++;}
 scheduleTick(12000);
}
let lastManualCard=null,lastManualAt=0;
function manualReplay(card){
 if(!card)return;
 const now=performance.now();
 if(card===lastManualCard&&now-lastManualAt<350)return;
 lastManualCard=card;lastManualAt=now;
 play(card,true);scheduleTick(12000);
}
const pointerStarts=new Map();
if(window.PointerEvent){
 document.addEventListener('pointerdown',e=>{
  const card=e.target.closest?.('.timeline>.event.goal,.event-card.goal');if(!card||e.isPrimary===false)return;
  pointerStarts.set(e.pointerId,{card,x:e.clientX,y:e.clientY});
 },{capture:true,passive:true});
 document.addEventListener('pointerup',e=>{
  const start=pointerStarts.get(e.pointerId);pointerStarts.delete(e.pointerId);if(!start||e.isPrimary===false)return;
  const card=e.target.closest?.('.timeline>.event.goal,.event-card.goal');if(card!==start.card)return;
  if(Math.hypot(e.clientX-start.x,e.clientY-start.y)>18)return;
  manualReplay(card);
 },{capture:true,passive:true});
 document.addEventListener('pointercancel',e=>pointerStarts.delete(e.pointerId),{capture:true,passive:true});
}else{
 let touchStart=null;
 document.addEventListener('touchstart',e=>{
  if(e.touches.length!==1)return;const t=e.touches[0],card=e.target.closest?.('.timeline>.event.goal,.event-card.goal');
  touchStart=card?{card,x:t.clientX,y:t.clientY}:null;
 },{capture:true,passive:true});
 document.addEventListener('touchend',e=>{
  if(!touchStart||!e.changedTouches.length)return;const t=e.changedTouches[0],card=e.target.closest?.('.timeline>.event.goal,.event-card.goal'),start=touchStart;touchStart=null;
  if(card!==start.card||Math.hypot(t.clientX-start.x,t.clientY-start.y)>18)return;
  e.preventDefault();manualReplay(card);
 },{capture:true,passive:false});
 document.addEventListener('click',e=>{const card=e.target.closest?.('.timeline>.event.goal,.event-card.goal');if(card)manualReplay(card)});
}
document.addEventListener('keydown',e=>{
 if(e.key!=='Enter'&&e.key!==' ')return;
 const card=e.target.closest?.('.timeline>.event.goal,.event-card.goal');if(!card)return;
 e.preventDefault();manualReplay(card);
});
new MutationObserver(markGoals).observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
markGoals();scheduleTick(12000);
})();