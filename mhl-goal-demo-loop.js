(()=>{
'use strict';
if(!/\/mhl-test\.html$/i.test(location.pathname))return;
const style=document.createElement('style');style.id='mhl-demo-loop-style';style.textContent=`
.timeline>.event{grid-template-columns:92px 58px minmax(0,1fr) auto!important}
.timeline>.event .escore{font-size:28px!important;font-weight:950!important;min-width:54px;text-align:right;align-self:center}
.timeline>.event.goal,.event-card.goal{cursor:pointer}
.timeline>.event.goal:hover,.event-card.goal:hover{border-color:rgba(101,213,158,.34)!important;box-shadow:0 14px 32px rgba(0,0,0,.18),0 0 0 1px rgba(101,213,158,.12)}
.timeline>.event.goal:focus-visible,.event-card.goal:focus-visible{outline:2px solid rgba(101,213,158,.85);outline-offset:3px}
@media(max-width:760px){.timeline>.event{grid-template-columns:60px 42px minmax(0,1fr)!important}.timeline>.event .escore{grid-column:3!important;font-size:22px!important;text-align:left;margin-top:2px}}
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
  card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label','Проиграть анимацию гола');card.title='Нажми, чтобы повторить анимацию гола';
 });
}
let index=0,timer=null;
function tick(){
 markGoals();
 const goals=[...document.querySelectorAll('.timeline>.event.goal,.event-card.goal')];
 if(goals.length){const card=goals[index%goals.length];if(play(card))index++;}
 clearTimeout(timer);timer=setTimeout(tick,12000);
}
document.addEventListener('click',e=>{
 const card=e.target.closest?.('.timeline>.event.goal,.event-card.goal');if(!card)return;
 play(card,true);
});
document.addEventListener('keydown',e=>{
 if(e.key!=='Enter'&&e.key!==' ')return;
 const card=e.target.closest?.('.timeline>.event.goal,.event-card.goal');if(!card)return;
 e.preventDefault();play(card,true);
});
new MutationObserver(markGoals).observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
markGoals();setTimeout(tick,12000);
})();