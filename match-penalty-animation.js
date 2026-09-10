/* Production note: penalty animation is intentionally handled only by clip-mhl-animations.js via goal-animation-v2.js. */

/* Match №1 opening ceremony timeline. */
(()=>{
'use strict';
if(!/\/match\.html$/i.test(location.pathname))return;
const FHR_LOGO='https://fhr.ru/local/templates/fhr/images/logo-bottom.svg';
const OPENING=[
  {minutes:13*60+15,time:'13:15',text:'Начало церемонии открытия турнира «Кубок России» 2026/27',fhr:true},
  {minutes:13*60+20,time:'13:20',text:'Выступление артистов и приветственные слова почетных гостей'},
  {minutes:13*60+35,time:'13:35',text:'Звучит Гимн Российской Федерации'}
];
function isMatchOne(){return /МАТЧ\s*№\s*1(?:\D|$)/i.test(document.querySelector('.match-kicker')?.textContent||'')}
function moscowMinutes(){const parts=new Intl.DateTimeFormat('ru-RU',{timeZone:'Europe/Moscow',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());const h=Number(parts.find(x=>x.type==='hour')?.value||0),m=Number(parts.find(x=>x.type==='minute')?.value||0);return h*60+m}
function logos(){return[...document.querySelectorAll('.score-team .score-logo img')].map(x=>x.src).filter(Boolean).slice(0,2)}
function timeline(){let t=document.querySelector('#live .timeline');if(t)return t;const empty=document.querySelector('#live .empty');if(!empty)return null;t=document.createElement('div');t.className='timeline';empty.replaceWith(t);return t}
function css(){if(document.getElementById('cup-opening-ceremony-css'))return;const s=document.createElement('style');s.id='cup-opening-ceremony-css';s.textContent=`
#live .cup-opening-marker{display:grid;grid-template-columns:92px minmax(0,1fr) auto;gap:14px;align-items:center;min-height:66px;padding:13px 17px;border:1px solid rgba(127,198,255,.15);border-left:4px solid rgba(127,198,255,.62);border-radius:12px;background:linear-gradient(90deg,rgba(23,54,78,.62),rgba(8,22,37,.94))}
#live .cup-opening-marker .opening-time{font-size:18px;font-weight:950;letter-spacing:-.03em;white-space:nowrap}#live .cup-opening-marker .opening-time small{display:block;margin-top:2px;color:#7f93a8;font-size:8px;letter-spacing:.12em}#live .cup-opening-marker .opening-text{font-size:12px;font-weight:850;line-height:1.35}#live .cup-opening-marker .opening-logo{width:42px;height:42px;object-fit:contain;filter:drop-shadow(0 6px 14px rgba(0,0,0,.25))}
#live .cup-opening-marker.match-start{border-left-color:rgba(72,195,139,.82);background:linear-gradient(90deg,rgba(31,82,68,.34),rgba(8,22,37,.96))}#live .cup-opening-marker .opening-teams{display:flex;align-items:center;gap:8px}#live .cup-opening-marker .opening-teams img{width:34px;height:34px;object-fit:contain}
@media(max-width:620px){#live .cup-opening-marker{grid-template-columns:64px minmax(0,1fr) auto;gap:8px;padding:11px 12px;min-height:60px}#live .cup-opening-marker .opening-time{font-size:15px}#live .cup-opening-marker .opening-text{font-size:10px}#live .cup-opening-marker .opening-logo{width:32px;height:32px}#live .cup-opening-marker .opening-teams{gap:5px}#live .cup-opening-marker .opening-teams img{width:28px;height:28px}}
`;document.head.appendChild(s)}
function ceremonyMarker(item){const el=document.createElement('article');el.className='event-card cup-opening-marker ceremony';el.dataset.openingKey=item.time;el.innerHTML=`<div class="opening-time">${item.time}<small>МСК</small></div><div class="opening-text">${item.text}</div>${item.fhr?`<img class="opening-logo" src="${FHR_LOGO}" alt="ФХР">`:'<span></span>'}`;return el}
function startMarker(){const ls=logos(),el=document.createElement('article');el.className='event-card cup-opening-marker match-start';el.dataset.openingKey='00:00';el.innerHTML=`<div class="opening-time">00:00</div><div class="opening-text">МАТЧ НАЧАЛСЯ</div><div class="opening-teams">${ls.map(src=>`<img src="${src}" alt="">`).join('')}</div>`;return el}
function render(){if(!isMatchOne())return;css();const t=timeline();if(!t)return;t.querySelectorAll('.cup-system-marker.start').forEach(x=>x.remove());const now=moscowMinutes(),items=[];if(now>=13*60+39)items.push({key:'00:00',node:startMarker});OPENING.filter(x=>now>=x.minutes).slice().reverse().forEach(item=>items.push({key:item.time,node:()=>ceremonyMarker(item)}));const desired=items.map(x=>x.key).join('|'),current=[...t.querySelectorAll(':scope > .cup-opening-marker')].map(x=>x.dataset.openingKey||'').join('|');if(desired===current)return;t.querySelectorAll(':scope > .cup-opening-marker').forEach(x=>x.remove());items.forEach(x=>t.appendChild(x.node()))}
let busy=false;function queue(){if(busy)return;busy=true;requestAnimationFrame(()=>{busy=false;render()})}
css();queue();const main=document.getElementById('main');if(main)new MutationObserver(queue).observe(main,{childList:true,subtree:true});setInterval(queue,1000);
})();

/* LIVE timeline rule: the match always ends at 60:00. No OT/SO labels or suffixes in the text broadcast. */
(()=>{
'use strict';
if(!/\/match\.html$/i.test(location.pathname))return;
function normalizeEndMarkers(){
  const timeline=document.querySelector('#live .timeline');if(!timeline)return;
  timeline.querySelectorAll(':scope > .cup-system-marker').forEach(card=>{
    const label=card.querySelector('.cup-marker-label');
    const text=String(label?.textContent||'').trim().toUpperCase();
    if(/ОВЕРТАЙМ|БУЛЛИТ/.test(text)){card.remove();return}
    if(card.classList.contains('final')||text==='КОНЕЦ МАТЧА'){
      const time=card.querySelector('.cup-marker-time');if(time)time.textContent='60:00';if(label)label.textContent='КОНЕЦ МАТЧА';
      const score=card.querySelector('.cup-marker-result strong');if(score)score.textContent=String(score.textContent||'').replace(/\s+(ОТ|Б)\s*$/i,'').trim();
    }
  });
}
let queued=false;function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;normalizeEndMarkers()})}
queue();const main=document.getElementById('main');if(main)new MutationObserver(queue).observe(main,{childList:true,subtree:true,characterData:true});setInterval(normalizeEndMarkers,1000);
})();