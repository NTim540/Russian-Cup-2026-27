(()=>{
'use strict';
if(!/\/mhl-test\.html$/i.test(location.pathname))return;

const style=document.createElement('style');
style.id='mhl-demo-loop-style';
style.textContent=`
.timeline>.event{grid-template-columns:92px 58px minmax(0,1fr) auto!important}
.timeline>.event .escore{font-size:28px!important;font-weight:950!important;min-width:54px;text-align:right;align-self:center}
.timeline>.event.goal,.event-card.goal{cursor:pointer;position:relative;touch-action:manipulation;-webkit-tap-highlight-color:rgba(101,213,158,.18);user-select:none;-webkit-user-select:none}
.timeline>.event.goal:hover,.event-card.goal:hover{border-color:rgba(101,213,158,.34)!important;box-shadow:0 14px 32px rgba(0,0,0,.18),0 0 0 1px rgba(101,213,158,.12)}
.timeline>.event.goal:active,.event-card.goal:active{transform:scale(.992)}
.timeline>.event.goal.goal-celebrating,.event-card.goal.goal-celebrating{pointer-events:auto!important}
.goal-celebration-layer{pointer-events:none!important}
.goal-celebrating>.goal-replay-hit{animation:none!important;opacity:0!important}
.goal-replay-hit{position:absolute;inset:0;z-index:60;width:100%;height:100%;margin:0;padding:0;border:0;border-radius:inherit;background:transparent;opacity:0;cursor:pointer;appearance:none;-webkit-appearance:none;touch-action:manipulation;-webkit-tap-highlight-color:rgba(101,213,158,.20)}
.goal-replay-hit:focus-visible{opacity:1;background:rgba(101,213,158,.035);outline:2px solid rgba(101,213,158,.9);outline-offset:3px}
@media(max-width:760px){
 .timeline>.event{grid-template-columns:60px 42px minmax(0,1fr)!important}
 .timeline>.event .escore{grid-column:3!important;font-size:22px!important;text-align:left;margin-top:2px}
 .timeline>.event.goal,.event-card.goal{min-height:104px!important}
}
/* На тестовой странице анимация должна проигрываться даже если на iPhone включено «Уменьшение движения». */
@media(prefers-reduced-motion:reduce){
 .timeline>.event.goal.goal-celebrating,.event-card.goal.goal-celebrating{animation:goalCardDrop .34s cubic-bezier(.18,.8,.25,1) both!important}
 .timeline>.event.goal.goal-celebrating>:not(.goal-celebration-layer):not(.goal-replay-hit),.event-card.goal.goal-celebrating>:not(.goal-celebration-layer):not(.goal-replay-hit){animation:goalContentRevealVertical 2.65s linear both!important}
 .timeline>.event.goal .goal-celebration-layer,.event-card.goal .goal-celebration-layer{display:grid!important;animation:goalWipeVertical 2.65s cubic-bezier(.65,0,.35,1) both!important}
 .timeline>.event.goal .goal-logo-stage,.timeline>.event.goal .goal-word,.event-card.goal .goal-logo-stage,.event-card.goal .goal-word{display:block!important;opacity:1!important;transform:none!important}
}
`;
document.head.appendChild(style);

const COLORS={
 'ска 1946':'#2367b1','сахалинские акулы':'#173b63','динамо москва':'#1b62ad','мах':'#2387d9','торпедо':'#1f74b5','локомотив':'#c92f38','авангард':'#df2e36','локомотив 2004':'#c92f38','крылья советов':'#2f6fb5','сибирь':'#2387c9','лада':'#215ea7','трактор':'#20242a','ак барс':'#18855a','спартак':'#c82433','динамо спб':'#2b6fb8','динамо джуниверс':'#315eaa','ска стрельна':'#2367b1','акм':'#b82f3b','цска':'#d32d38','армия ска':'#2367b1','нефтехимик':'#275aa8','северсталь':'#d9a51b','красная машина юниор':'#df2e36'
};
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ё/gi,'е').replace(/[^a-zа-я0-9]+/gi,' ').trim().toLowerCase();
function inkFor(hex){const h=String(hex).replace('#','');if(h.length!==6)return'#fff';const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);return(.299*r+.587*g+.114*b)>175?'#07111f':'#fff'}
function team(card){const name=card.querySelector('.event-team-name')?.textContent?.trim()||'',logo=card.querySelector('.event-team-logo,.event-logo')?.src||'';return{name,logo}}

const cleanupTimers=new WeakMap();
function stop(card){
 const old=cleanupTimers.get(card);if(old)clearTimeout(old);cleanupTimers.delete(card);
 card.classList.remove('goal-celebrating','goal-demo-loop');
 card.querySelector('.goal-celebration-layer')?.remove();
}
function play(card,restart=false){
 if(!card||!card.isConnected)return false;
 if(card.classList.contains('goal-celebrating')){if(!restart)return false;stop(card)}
 const t=team(card),color=COLORS[norm(t.name)]||'#2387d9',ink=inkFor(color);
 card.style.setProperty('--goal-team-color',color);
 card.style.setProperty('--goal-team-ink',ink);
 const layer=document.createElement('div');
 layer.className='goal-celebration-layer';
 layer.innerHTML=`<div class="goal-word goal-word-left">ГООООООООЛ!</div><div class="goal-logo-stage">${t.logo?`<img src="${t.logo}" alt="">`:''}</div><div class="goal-word goal-word-right">ГООООООООЛ!</div>`;
 const hit=card.querySelector('.goal-replay-hit');
 if(hit)card.insertBefore(layer,hit);else card.appendChild(layer);
 void card.offsetWidth;
 card.classList.add('goal-celebrating','goal-demo-loop');
 const timeout=setTimeout(()=>stop(card),2900);
 cleanupTimers.set(card,timeout);
 return true;
}

let index=0,timer=null;
function scheduleTick(delay=12000){clearTimeout(timer);timer=setTimeout(tick,delay)}
function manualReplay(card){
 play(card,true);
 scheduleTick(12000);
}
function ensureButton(card){
 if(card.querySelector(':scope > .goal-replay-hit'))return;
 const btn=document.createElement('button');
 btn.type='button';
 btn.className='goal-replay-hit';
 btn.setAttribute('aria-label','Проиграть анимацию этого гола');
 btn.title='Нажми, чтобы повторить анимацию гола';
 btn.addEventListener('click',e=>{
  e.preventDefault();
  e.stopPropagation();
  manualReplay(card);
 },{passive:false});
 /* touchend — резерв для мобильного Safari, если синтетический click не пришёл. */
 let touchStart=null;
 btn.addEventListener('touchstart',e=>{
  if(e.touches.length!==1){touchStart=null;return}
  const t=e.touches[0];touchStart={x:t.clientX,y:t.clientY};
 },{passive:true});
 btn.addEventListener('touchend',e=>{
  if(!touchStart||!e.changedTouches.length)return;
  const t=e.changedTouches[0],dist=Math.hypot(t.clientX-touchStart.x,t.clientY-touchStart.y);touchStart=null;
  if(dist>22)return;
  e.preventDefault();
  e.stopPropagation();
  manualReplay(card);
 },{passive:false});
 btn.addEventListener('touchcancel',()=>{touchStart=null},{passive:true});
 card.appendChild(btn);
}
function markGoals(){
 document.querySelectorAll('.timeline>.event.goal,.event-card.goal').forEach(card=>{
  card.setAttribute('data-goal-replay','1');
  ensureButton(card);
 });
}
function tick(){
 markGoals();
 const goals=[...document.querySelectorAll('.timeline>.event.goal,.event-card.goal')];
 if(goals.length){const card=goals[index%goals.length];if(play(card))index++;}
 scheduleTick(12000);
}

const root=document.getElementById('app')||document.body;
new MutationObserver(()=>markGoals()).observe(root,{childList:true,subtree:true});
markGoals();
scheduleTick(12000);
})();
