(()=>{
'use strict';
const EDGE='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-match-center-v3';
const matchId=Number(new URL(location.href).searchParams.get('id'));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let data=null,queued=false;
function periodText(ev){const p=String(ev?.period||'').toUpperCase();return p==='SO'?'Буллиты':p==='OT'?'ОТ':p?`${p} период`:''}
function eventKey(ev){const n=Number(ev?.absolute_seconds);return Number.isFinite(n)?String(n):`${String(ev?.period||'')}:${String(ev?.clock||'')}`}
function team(side){return side==='away'?data?.away_team:data?.home_team}
function logo(side){return team(side)?.logo_url||''}
function goalieBlock(ev,side){
  const t=team(side)||{},isEmpty=Boolean(ev?.empty_net),player=String(ev?.player||'').trim(),num=Number(ev?.number),photo=String(ev?.player_photo||'').trim();
  const title=isEmpty?(t.name||'Пустые ворота'):`${Number.isFinite(num)&&num>0?`№${num} `:''}${player||'Вратарь'}`;
  const label=isEmpty?'Пустые ворота':'Вратарь';
  const detail=isEmpty?'Команда играет без вратаря':(t.name||'');
  return `<div class="goalkeeper-pair-team ${side}">${logo(side)?`<img class="goalkeeper-pair-logo" src="${esc(logo(side))}" alt="${esc(t.name||'')}">`:''}<div class="goalkeeper-pair-player">${photo?`<img class="goalkeeper-pair-photo" src="${esc(photo)}" alt="${esc(player)}">`:''}<div class="goalkeeper-pair-copy"><span class="goalkeeper-pair-label">${esc(label)}</span><strong>${esc(title)}</strong><p>${esc(detail)}</p></div></div></div>`;
}
function matchPeriod(card,ev){
  const txt=String(card.querySelector('.event-time span')?.textContent||'').toUpperCase();
  const p=String(ev?.period||'').toUpperCase();
  if(p==='SO')return /БУЛ/.test(txt);
  if(p==='OT')return !txt||/\bОТ\b|ОВЕРТАЙМ/.test(txt);
  return new RegExp(`\\b${p}\\b`).test(txt);
}
function cardsFor(group){
  const first=group[0],clock=String(first?.clock||'');
  return [...document.querySelectorAll('#live .timeline > .event-card.goalkeeper:not(.goalkeeper-pair)')].filter(card=>String(card.querySelector('.event-time strong')?.textContent||'').trim()===clock&&matchPeriod(card,first));
}
function renderPairs(){
  if(!data)return;
  const timeline=document.querySelector('#live .timeline');if(!timeline)return;
  const goalies=(Array.isArray(data?.live?.events)?data.live.events:[]).filter(e=>String(e?.event_type||'').toUpperCase()==='GOALKEEPER');
  const groups=new Map();for(const ev of goalies){const k=eventKey(ev);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(ev)}
  for(const [k,group] of groups){
    const home=group.find(e=>e.side==='home'),away=group.find(e=>e.side==='away');if(!home||!away)continue;
    const pairKey=`gk:${k}`,existing=timeline.querySelector(`[data-goalie-pair-key="${CSS.escape(pairKey)}"]`);if(existing)continue;
    const cards=cardsFor(group),anchor=cards[0];if(!anchor)continue;
    const ev=home||away,article=document.createElement('article');article.className='event-card goalkeeper goalkeeper-pair';article.dataset.goaliePairKey=pairKey;
    const p=periodText(ev);article.innerHTML=`<div class="event-time"><strong>${esc(ev.clock||'—')}</strong>${p?`<span>${esc(p)}</span>`:''}</div><div class="goalkeeper-pair-body">${goalieBlock(home,'home')}<div class="goalkeeper-pair-divider"><span>↔</span></div>${goalieBlock(away,'away')}</div>`;
    anchor.parentNode.insertBefore(article,anchor);cards.forEach(c=>c.remove());
  }
}
function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;renderPairs()})}
function injectCss(){if(document.getElementById('goalkeeper-pair-css'))return;const s=document.createElement('style');s.id='goalkeeper-pair-css';s.textContent=`
.goalkeeper-pair{grid-template-columns:92px minmax(0,1fr)!important;gap:18px!important;min-height:118px!important}.goalkeeper-pair>.event-time{align-self:center}.goalkeeper-pair-body{grid-column:2/-1;display:grid;grid-template-columns:minmax(0,1fr) 34px minmax(0,1fr);gap:14px;align-items:center}.goalkeeper-pair-team{min-width:0;display:grid;grid-template-columns:46px minmax(0,1fr);gap:11px;align-items:center}.goalkeeper-pair-team.away{text-align:right;grid-template-columns:minmax(0,1fr) 46px}.goalkeeper-pair-team.away .goalkeeper-pair-logo{grid-column:2}.goalkeeper-pair-team.away .goalkeeper-pair-player{grid-column:1;grid-row:1;justify-content:flex-end}.goalkeeper-pair-logo{width:44px;height:44px;object-fit:contain}.goalkeeper-pair-player{display:flex;align-items:center;gap:10px;min-width:0}.goalkeeper-pair-team.away .goalkeeper-pair-player{flex-direction:row-reverse}.goalkeeper-pair-photo{width:58px;height:58px;border-radius:50%;object-fit:cover;background:#11263e;border:1px solid rgba(255,255,255,.10);flex:0 0 58px}.goalkeeper-pair-copy{min-width:0}.goalkeeper-pair-label{display:block;color:#62b2ff;font-size:9px;font-weight:950;letter-spacing:.11em;text-transform:uppercase;margin-bottom:5px}.goalkeeper-pair-copy strong{display:block;font-size:16px;line-height:1.15}.goalkeeper-pair-copy p{margin:5px 0 0;color:#96a9bd;font-size:10px}.goalkeeper-pair-divider{display:grid;place-items:center;color:#62b2ff;font-size:18px;opacity:.8}.goalkeeper-pair .event-type-icon,.goalkeeper-pair .event-label-row,.goalkeeper-pair>.event-logo,.goalkeeper-pair>.event-main{display:none!important}
@media(max-width:760px){.goalkeeper-pair{grid-template-columns:58px minmax(0,1fr)!important;gap:8px!important;padding:14px 11px!important}.goalkeeper-pair-body{grid-template-columns:1fr!important;gap:9px}.goalkeeper-pair-divider{display:none}.goalkeeper-pair-team,.goalkeeper-pair-team.away{grid-template-columns:34px minmax(0,1fr);text-align:left;gap:8px;padding:4px 0}.goalkeeper-pair-team.away .goalkeeper-pair-logo{grid-column:1}.goalkeeper-pair-team.away .goalkeeper-pair-player{grid-column:2;grid-row:1;justify-content:flex-start;flex-direction:row}.goalkeeper-pair-logo{width:32px;height:32px}.goalkeeper-pair-photo{width:42px;height:42px;flex-basis:42px}.goalkeeper-pair-copy strong{font-size:13px}.goalkeeper-pair-copy p{font-size:9px}.goalkeeper-pair-label{font-size:8px}}
`;document.head.appendChild(s)}
async function refresh(){if(!Number.isInteger(matchId)||matchId<1)return;try{const r=await fetch(`${EDGE}?match_id=${matchId}&goalie_pair=${Date.now()}`,{cache:'no-store'}),b=await r.json();if(r.ok){data=b;queue()}}catch{}}
injectCss();const main=document.getElementById('main');if(main)new MutationObserver(queue).observe(main,{childList:true,subtree:true});refresh();setInterval(refresh,15000);setInterval(queue,1500);
})();