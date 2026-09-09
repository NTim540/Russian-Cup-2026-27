(()=>{
'use strict';
if(!/\/mhl-test\.html$/i.test(location.pathname))return;
const COLORS={
 'ска 1946':'#2367b1','сахалинские акулы':'#173b63','динамо москва':'#1b62ad','мах':'#2387d9','торпедо':'#1f74b5','локомотив':'#c92f38','авангард':'#df2e36','локомотив 2004':'#c92f38','крылья советов':'#2f6fb5','сибирь':'#2387c9','лада':'#215ea7','трактор':'#20242a','ак барс':'#18855a','спартак':'#c82433','динамо спб':'#2b6fb8','динамо джуниверс':'#315eaa','ска стрельна':'#2367b1','акм':'#b82f3b','цска':'#d32d38','армия ска':'#2367b1','нефтехимик':'#275aa8','северсталь':'#d9a51b','красная машина юниор':'#df2e36'
};
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ё/gi,'е').replace(/[^a-zа-я0-9]+/gi,' ').trim().toLowerCase();
function inkFor(hex){const h=String(hex).replace('#','');if(h.length!==6)return'#fff';const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);return(.299*r+.587*g+.114*b)>175?'#07111f':'#fff'}
function team(card){const name=card.querySelector('.event-team-name')?.textContent?.trim()||'',logo=card.querySelector('.event-team-logo')?.src||'';return{name,logo}}
function play(card){
 if(!card||card.classList.contains('goal-celebrating'))return false;
 const t=team(card),color=COLORS[norm(t.name)]||'#2387d9',ink=inkFor(color);
 card.querySelector('.goal-celebration-layer')?.remove();
 card.style.setProperty('--goal-team-color',color);card.style.setProperty('--goal-team-ink',ink);
 const layer=document.createElement('div');layer.className='goal-celebration-layer';
 layer.innerHTML=`<div class="goal-word goal-word-left">ГООООООООЛ!</div><div class="goal-logo-stage">${t.logo?`<img src="${t.logo}" alt="">`:''}</div><div class="goal-word goal-word-right">ГООООООООЛ!</div>`;
 card.appendChild(layer);void card.offsetWidth;card.classList.add('goal-celebrating','goal-demo-loop');
 setTimeout(()=>{card.classList.remove('goal-celebrating','goal-demo-loop');card.querySelector('.goal-celebration-layer')?.remove()},2900);
 return true;
}
let index=0,timer=null;
function tick(){
 const goals=[...document.querySelectorAll('.timeline>.event.goal,.event-card.goal')];
 if(goals.length){const card=goals[index%goals.length];if(play(card))index++;}
 clearTimeout(timer);timer=setTimeout(tick,12000);
}
setTimeout(tick,12000);
})();