(()=>{
'use strict';
if(!/\/mhl-test(?:\.html)?\/?$/i.test(location.pathname))return;

const COLORS={
 'ска 1946':'#2367b1','сахалинские акулы':'#173b63','динамо москва':'#1b62ad','мах':'#2387d9','торпедо':'#1f74b5','локомотив':'#c92f38','авангард':'#df2e36','локомотив 2004':'#c92f38','крылья советов':'#2f6fb5','сибирь':'#2387c9','лада':'#215ea7','трактор':'#20242a','ак барс':'#18855a','спартак':'#c82433','динамо спб':'#2b6fb8','динамо джуниверс':'#315eaa','ска стрельна':'#2367b1','акм':'#b82f3b','цска':'#d32d38','армия ска':'#2367b1','нефтехимик':'#275aa8','северсталь':'#d9a51b','красная машина юниор':'#df2e36'
};
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ё/gi,'е').replace(/[^a-zа-я0-9]+/gi,' ').trim().toLowerCase();
function inkFor(hex){const h=String(hex).replace('#','');if(h.length!==6)return'#fff';const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);return(.299*r+.587*g+.114*b)>175?'#07111f':'#fff'}
function team(card){return{name:card.querySelector('.event-team-name')?.textContent?.trim()||'',logo:card.querySelector('.event-team-logo,.event-logo')?.src||''}}

const style=document.createElement('style');
style.id='mhl-goal-replay-v2-style';
style.textContent=`
.timeline>.event{grid-template-columns:92px 58px minmax(0,1fr) auto!important}
.timeline>.event .escore{font-size:28px!important;font-weight:950!important;min-width:54px;text-align:right;align-self:center}
.timeline>.event.goal,.event-card.goal{cursor:pointer;position:relative!important;overflow:hidden!important;touch-action:manipulation;-webkit-tap-highlight-color:rgba(101,213,158,.20);user-select:none;-webkit-user-select:none}
.timeline>.event.goal:hover,.event-card.goal:hover{border-color:rgba(101,213,158,.34)!important;box-shadow:0 14px 32px rgba(0,0,0,.18),0 0 0 1px rgba(101,213,158,.12)}
.timeline>.event.goal:active,.event-card.goal:active{transform:scale(.993)}
.timeline>.event.goal:focus-visible,.event-card.goal:focus-visible{outline:2px solid rgba(101,213,158,.9);outline-offset:3px}
.mhl-goal-stage{position:absolute;inset:0;z-index:100;display:grid;grid-template-columns:minmax(0,1fr) 120px minmax(0,1fr);align-items:center;gap:20px;padding:0 34px;background:var(--mhl-goal-color,#2387d9);color:var(--mhl-goal-ink,#fff);clip-path:inset(0 0 100% 0);overflow:hidden;pointer-events:none}
.mhl-goal-logo{display:grid;place-items:center;min-width:0}.mhl-goal-logo img{display:block;max-width:92px;max-height:82px;object-fit:contain;filter:drop-shadow(0 8px 18px rgba(0,0,0,.25))}
.mhl-goal-word{font-size:clamp(22px,3vw,42px);font-weight:1000;letter-spacing:-.04em;white-space:nowrap;text-transform:uppercase;text-shadow:0 4px 16px rgba(0,0,0,.14)}.mhl-goal-left{text-align:right}.mhl-goal-right{text-align:left}
.mhl-goal-playing{pointer-events:auto!important}
@media(max-width:760px){
 .timeline>.event{grid-template-columns:60px 42px minmax(0,1fr)!important}
 .timeline>.event .escore{grid-column:3!important;font-size:22px!important;text-align:left;margin-top:2px}
 .timeline>.event.goal,.event-card.goal{min-height:104px!important}
 .mhl-goal-stage{grid-template-columns:minmax(0,1fr) 62px minmax(0,1fr);gap:8px;padding:0 10px}
 .mhl-goal-logo img{max-width:58px;max-height:54px}.mhl-goal-word{font-size:clamp(13px,4vw,22px);letter-spacing:-.05em}
}
`;
document.head.appendChild(style);

const states=new WeakMap();
function contentNodes(card){return [...card.children].filter(el=>!el.classList.contains('mhl-goal-stage')&&!el.classList.contains('goal-celebration-layer'))}
function stop(card){
 const st=states.get(card);
 if(st){st.animations.forEach(a=>{try{a.cancel()}catch{}});clearTimeout(st.timer);st.nodes.forEach(({el,opacity})=>{if(el.isConnected)el.style.opacity=opacity})}
 states.delete(card);
 card.classList.remove('mhl-goal-playing','goal-celebrating','goal-demo-loop','goal-demo');
 card.querySelector('.mhl-goal-stage')?.remove();
 card.querySelector('.goal-celebration-layer')?.remove();
}
function play(card,restart=true){
 if(!card||!card.isConnected)return false;
 if(states.has(card)){if(!restart)return false;stop(card)}
 /* Убираем слой общего event-ui, чтобы его таймер больше не мог погасить тестовую анимацию. */
 card.classList.remove('goal-celebrating','goal-demo-loop','goal-demo');
 card.querySelector('.goal-celebration-layer')?.remove();
 const t=team(card),color=COLORS[norm(t.name)]||'#2387d9',ink=inkFor(color);
 card.style.setProperty('--mhl-goal-color',color);card.style.setProperty('--mhl-goal-ink',ink);
 const stage=document.createElement('div');stage.className='mhl-goal-stage';
 stage.innerHTML=`<div class="mhl-goal-word mhl-goal-left">ГООООООООЛ!</div><div class="mhl-goal-logo">${t.logo?`<img src="${t.logo}" alt="">`:''}</div><div class="mhl-goal-word mhl-goal-right">ГООООООООЛ!</div>`;
 card.appendChild(stage);
 const nodes=contentNodes(card).filter(el=>el!==stage).map(el=>({el,opacity:el.style.opacity}));
 nodes.forEach(({el})=>{el.style.opacity='0'});
 card.classList.add('mhl-goal-playing');

 const duration=2650;
 const stageAnim=stage.animate([
  {clipPath:'inset(0 0 100% 0)',offset:0},
  {clipPath:'inset(0 0 100% 0)',offset:.07},
  {clipPath:'inset(0 0 0 0)',offset:.28},
  {clipPath:'inset(0 0 0 0)',offset:.62},
  {clipPath:'inset(0 0 100% 0)',offset:1}
 ],{duration,easing:'cubic-bezier(.65,0,.35,1)',fill:'both'});
 const nodeAnimations=nodes.map(({el})=>el.animate([
  {opacity:0,offset:0},{opacity:0,offset:.615},{opacity:1,offset:.625},{opacity:1,offset:1}
 ],{duration,easing:'linear',fill:'both'}));
 const drop=card.animate([{transform:'translateY(-18px)',opacity:.25},{transform:'translateY(0)',opacity:1}],{duration:340,easing:'cubic-bezier(.18,.8,.25,1)'});
 const animations=[stageAnim,...nodeAnimations,drop];
 const timer=setTimeout(()=>stop(card),duration+80);
 states.set(card,{animations,timer,nodes});
 return true;
}
window.MHLGoalReplay=card=>play(card,true);

let loopTimer=null,index=0;
function schedule(delay=12000){clearTimeout(loopTimer);loopTimer=setTimeout(tick,delay)}
function manual(card){play(card,true);schedule(12000)}
function bind(card){
 if(card.dataset.mhlGoalBound==='1')return;
 card.dataset.mhlGoalBound='1';card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label','Проиграть анимацию этого гола');card.title='Нажми, чтобы проиграть анимацию гола';
 let sx=0,sy=0,moved=false;
 card.addEventListener('touchstart',e=>{if(e.touches.length!==1)return;const t=e.touches[0];sx=t.clientX;sy=t.clientY;moved=false},{passive:true});
 card.addEventListener('touchmove',e=>{if(!e.touches.length)return;const t=e.touches[0];if(Math.hypot(t.clientX-sx,t.clientY-sy)>18)moved=true},{passive:true});
 card.addEventListener('touchend',e=>{if(moved)return;e.preventDefault();e.stopPropagation();manual(card)},{passive:false});
 card.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();manual(card)});
 card.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;e.preventDefault();manual(card)});
}
function bindGoals(){document.querySelectorAll('.timeline>.event.goal,.event-card.goal').forEach(bind)}
function tick(){bindGoals();const goals=[...document.querySelectorAll('.timeline>.event.goal,.event-card.goal')];if(goals.length){const card=goals[index%goals.length];if(play(card,false))index++}schedule(12000)}
const root=document.getElementById('app')||document.body;
new MutationObserver(bindGoals).observe(root,{childList:true,subtree:true});
bindGoals();schedule(12000);
})();
