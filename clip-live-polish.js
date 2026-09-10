(()=>{
'use strict';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* Compact match start/end markers. End marker: home logo + final score + OT/SO suffix + away logo. */
const css=document.createElement('style');
css.id='clip-live-polish-style';
css.textContent=`
.timeline>.event.match-marker{display:grid!important;grid-template-columns:74px minmax(0,1fr) auto!important;align-items:center!important;gap:14px!important;min-height:74px!important;padding:14px 18px!important;border-left:4px solid rgba(127,198,255,.55)!important;background:rgba(11,29,48,.7)!important}
.match-marker .match-marker-time{font-size:20px;font-weight:1000;letter-spacing:-.035em;color:#fff;white-space:nowrap}.match-marker .match-marker-label{font-size:15px;font-weight:1000;letter-spacing:.07em;text-transform:uppercase;color:#fff}.match-marker .match-marker-logos{display:flex;align-items:center;justify-content:flex-end;gap:8px;white-space:nowrap}.match-marker .match-marker-logos img{width:34px;height:34px;object-fit:contain;display:block}.match-marker .match-marker-score{font-size:19px;font-weight:1000;letter-spacing:-.035em;color:#fff;white-space:nowrap}.match-marker .match-marker-suffix{margin-left:3px;font-size:12px;font-weight:1000;letter-spacing:.04em;color:#9fd1ff;vertical-align:middle}
@media(max-width:580px){.timeline>.event.match-marker{grid-template-columns:58px minmax(0,1fr) auto!important;gap:9px!important;min-height:62px!important;padding:11px 13px!important}.match-marker .match-marker-time{font-size:17px}.match-marker .match-marker-label{font-size:11px;letter-spacing:.045em}.match-marker .match-marker-logos{gap:5px}.match-marker .match-marker-logos img{width:27px;height:27px}.match-marker .match-marker-score{font-size:16px}.match-marker .match-marker-suffix{font-size:10px;margin-left:2px}}
`;
document.head.appendChild(css);

function teamLogos(){return [$('#homeTeam img')?.src,$('#awayTeam img')?.src].filter(Boolean)}
function resultSuffix(){
  const explicit=String(document.documentElement.dataset.resultType||window.__cupLiveResultType||'').trim().toUpperCase();
  if(['Б','SO','SHOOTOUT','БУЛЛИТЫ'].includes(explicit))return'Б';
  if(['ОТ','OT','OVERTIME'].includes(explicit))return'ОТ';
  const txt=[document.querySelector('#matchPhase')?.textContent,document.querySelector('#periodLabel')?.textContent,document.querySelector('#periodScores')?.textContent,document.querySelector('#feed')?.textContent].filter(Boolean).join(' ');
  if(/буллит|shootout/i.test(txt))return'Б';
  if(/овертайм|\bOT\b|\bОТ\b/i.test(txt))return'ОТ';
  return'';
}
function scoreHtml(){
  const score=$('#mainScore')?.textContent?.trim()||'';
  const suffix=resultSuffix();
  return score?`<span class="match-marker-score">${esc(score)}${suffix?` <span class="match-marker-suffix">${esc(suffix)}</span>`:''}</span>`:'';
}
function markerVisual(type){
  const logos=teamLogos();
  if(type==='end'){
    const left=logos[0]?`<img src="${esc(logos[0])}" alt="">`:'';
    const right=logos[1]?`<img src="${esc(logos[1])}" alt="">`:'';
    return `${left}${scoreHtml()}${right}`;
  }
  return logos.map(src=>`<img src="${esc(src)}" alt="">`).join('');
}
function polishMatchMarkers(){
  document.querySelectorAll('#feed .event.system:not(.match-marker)').forEach(card=>{
    const main=card.querySelector('.emain strong')?.textContent?.trim().toLowerCase()||'';
    const type=main==='начало матча'?'start':(main==='матч завершён'||main==='конец матча')?'end':'';
    if(!type)return;
    const time=card.querySelector('.etime strong')?.textContent?.trim()||(type==='start'?'00:00':'60:00');
    card.className='event system match-marker';
    card.dataset.markerType=type;
    card.innerHTML=`<div class="match-marker-time">${esc(time)}</div><div class="match-marker-label">${type==='start'?'НАЧАЛО МАТЧА':'КОНЕЦ МАТЧА'}</div><div class="match-marker-logos">${markerVisual(type)}</div>`;
  });
  document.querySelectorAll('#feed .match-marker[data-marker-type="end"] .match-marker-logos').forEach(box=>{box.innerHTML=markerVisual('end')});
}
const feed=$('#feed');
if(feed){new MutationObserver(polishMatchMarkers).observe(feed,{childList:true,subtree:true});polishMatchMarkers()}
new MutationObserver(polishMatchMarkers).observe(document.documentElement,{attributes:true,attributeFilter:['data-result-type']});

/* Same approved penalty animation, but the penalty detail screen stays readable longer. */
const RED='#e31f2b';
const whistle=`<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="22" cy="40" r="11" fill="none" stroke="currentColor" stroke-width="5"/><path d="M31 34h15c5 0 9 4 9 9s-4 9-9 9H31M27 30l9-16 8 4-7 13M43 16l7-7" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const timers=new WeakMap();
function contentNodes(card){return[...card.children].filter(el=>!el.classList.contains('penalty-demo-layer'))}
function stop(card){clearTimeout(timers.get(card));card.querySelector('.penalty-demo-layer')?.remove();card.classList.remove('penalty-demo-playing')}
function reasonClass(s){return s.length>31?'very-long':s.length>20?'long':''}
function penalty(card){
  if(!card||!card.isConnected)return false;
  stop(card);
  const logo=card.dataset.teamLogo||card.querySelector('.event-team-logo')?.src||'';
  const mins=card.dataset.penaltyMinutes||'2';
  const reason=card.dataset.penaltyReason||'Нарушение правил';
  const layer=document.createElement('div');layer.className='penalty-demo-layer';
  layer.innerHTML=`<div class="penalty-demo-inner penalty-demo-back"><div class="penalty-demo-mins">${esc(mins)}′</div><div class="penalty-demo-reason ${reasonClass(reason)}">${esc(reason)}</div></div><div class="penalty-demo-cover"><div class="penalty-demo-inner penalty-demo-front"><div class="penalty-demo-whistle">${whistle}</div><div class="penalty-demo-word">Удаление</div>${logo?`<img class="penalty-demo-logo" src="${esc(logo)}" alt="">`:'<span></span>'}</div></div>`;
  card.appendChild(layer);
  const nodes=contentNodes(card).map(el=>({el,opacity:el.style.opacity}));nodes.forEach(({el})=>el.style.opacity='0');
  const duration=5800;
  const outer=layer.animate([
    {clipPath:'inset(0 100% 0 0)',transform:'translateY(0)',offset:0},
    {clipPath:'inset(0 100% 0 0)',transform:'translateY(0)',offset:.04},
    {clipPath:'inset(0 0 0 0)',transform:'translateY(0)',offset:.22},
    {clipPath:'inset(0 0 0 0)',transform:'translateY(0)',offset:.88},
    {clipPath:'inset(0 0 0 0)',transform:'translateY(-102%)',offset:1}
  ],{duration,easing:'cubic-bezier(.65,0,.35,1)',fill:'both'});
  const cover=layer.querySelector('.penalty-demo-cover').animate([
    {clipPath:'inset(0 0 0 0)',offset:0},
    {clipPath:'inset(0 0 0 0)',offset:.28},
    {clipPath:'inset(0 100% 0 0)',offset:.45},
    {clipPath:'inset(0 100% 0 0)',offset:1}
  ],{duration,easing:'cubic-bezier(.65,0,.35,1)',fill:'both'});
  const under=nodes.map(({el})=>el.animate([{opacity:0,offset:0},{opacity:0,offset:.87},{opacity:1,offset:.9},{opacity:1,offset:1}],{duration,easing:'linear',fill:'both'}));
  card.classList.add('penalty-demo-playing');
  timers.set(card,setTimeout(()=>{try{outer.cancel();cover.cancel();under.forEach(a=>a.cancel())}catch{}nodes.forEach(({el,opacity})=>{if(el.isConnected)el.style.opacity=opacity});stop(card)},duration+150));
  return true;
}
if(window.CupMHLAnimations)window.CupMHLAnimations.penalty=penalty;
})();