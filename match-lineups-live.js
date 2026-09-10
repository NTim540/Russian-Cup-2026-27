(()=>{
'use strict';
if(!/\/match(?:\.html)?\/?$/i.test(location.pathname))return;
const EDGE='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-match-lineups';
const id=Number(new URL(location.href).searchParams.get('id'));
if(!Number.isInteger(id)||id<1)return;
const LOGOS={
'Динамо Москва':'https://drive.google.com/thumbnail?id=1I3KuJZEajmksDKtoBsdj4h_75fU0e_KY&sz=w512','МАХ':'https://drive.google.com/thumbnail?id=1Veii4NYgKc06nRtxKmCRQv1YCE164YZP&sz=w512','Торпедо':'https://drive.google.com/thumbnail?id=17NYLCFaSrX6q4g0T7jhBnmidrI1JzKl9&sz=w512','Локомотив':'https://drive.google.com/thumbnail?id=1D6wJnaawN4kMt-1ZWTSvf-trYkslzyKi&sz=w512','Авангард':'https://drive.google.com/thumbnail?id=1y6CZfZSXYDVqCAjOvv6xB_7Fwu1AQwvn&sz=w512','Локомотив 2004':'https://drive.google.com/thumbnail?id=1sq7UHtBq_xiexekxmzWawF3yVTaEl-J-&sz=w512','Крылья Советов':'https://drive.google.com/thumbnail?id=1n6ViHZhkRvq_R_Ul1PEHnFnX7HVNk6-p&sz=w512','Сибирь':'https://drive.google.com/thumbnail?id=1Xul8VXC7juk2NHQfb28Cl9Jt_Kj0Obw-&sz=w512','Лада':'https://drive.google.com/thumbnail?id=15mcwMoXT7OaH46jj8w90PCeTtJY54UAF&sz=w512','Трактор':'https://drive.google.com/thumbnail?id=1qWTRWy-p36RDSMlAy4AqA60PrrUTaczd&sz=w512','Ак Барс':'https://drive.google.com/thumbnail?id=1I09r6XwD-9L4r5ojPGKCHsJ5WGUyOFy1&sz=w512','Спартак':'https://drive.google.com/thumbnail?id=19kJ3uz-yyb1Z2y8qvRbFwuw_2kjUUD2f&sz=w512','Динамо СПБ':'https://drive.google.com/thumbnail?id=1x4KaAFMJ_qfmi26oVjnsc-huKpWtqBbh&sz=w512','Динамо-Джуниверс':'https://drive.google.com/thumbnail?id=1HTqvh6fg5ZzOLFwOtY62zucjnRZyOXmu&sz=w512','АКМ':'https://drive.google.com/thumbnail?id=1NmPj1OwI3C1yuNmgt2XX57HbEiiDauB7&sz=w512','ЦСКА':'https://drive.google.com/thumbnail?id=1bT6o4afTqonyA05keLbe_nfQ78sAmNda&sz=w512','Армия СКА':'https://drive.google.com/thumbnail?id=14XZX2FRyR5x_aVkU2SMLhW-Emk0RUkTo&sz=w512','Нефтехимик':'https://drive.google.com/thumbnail?id=1csEdtjesEvgAFSsfnfhmWUnUE23Tnqeg&sz=w512','Северсталь':'https://drive.google.com/thumbnail?id=10xBTOFy_ps1G3LNaHV3WpbQkuZ74pjRn&sz=w512','Красная Машина Юниор':'https://drive.google.com/thumbnail?id=1qATM0WxWDCgYfemDQvhdy30Ub0sWSWWV&sz=w512'};
let CACHE=null,selectedLine=1,fetching=false,timer=null,queued=false;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const logo=t=>t?.logo_url||LOGOS[t?.name]||'';
const list=side=>Array.isArray(CACHE?.lineups?.[side])?CACHE.lineups[side]:[];
const team=side=>side==='away'?CACHE?.away_team:CACHE?.home_team;
function installCss(){if(document.getElementById('match-live-lineups-css'))return;const s=document.createElement('style');s.id='match-live-lineups-css';s.textContent=`
#rosters[data-live-lineups="1"] .roster-team{position:relative}
#rosters[data-live-lineups="1"] .roster-head{padding-right:155px}
#rosters[data-live-lineups="1"] .roster-source{position:absolute;top:15px;right:15px;z-index:2;background:rgba(7,17,31,.72);backdrop-filter:blur(8px)}
#rosters[data-live-lineups="1"] .roster-sync-note{padding:8px 14px;border-top:1px solid rgba(255,255,255,.045);color:#668097;font-size:8px;text-transform:uppercase;letter-spacing:.08em}
@media(max-width:680px){
  #rosters[data-live-lineups="1"] .roster-head{padding-right:120px}
  #rosters[data-live-lineups="1"] .roster-source{top:13px;right:11px;font-size:7px;padding:4px 6px}

  /* Mobile rink: show the whole five-man unit at once, without horizontal panning. */
  #rinkRoot{max-width:100%!important;overflow:hidden!important}
  #rinkRoot .rink-shell{width:100%!important;max-width:100%!important;overflow:hidden!important;padding:10px!important}
  #rinkRoot .line-tabs{justify-content:center!important;gap:4px!important;margin-bottom:10px!important}
  #rinkRoot .line-tab{padding:6px 9px!important;font-size:8px!important}
  #rinkRoot .rink{width:100%!important;min-width:0!important;max-width:100%!important;aspect-ratio:2/1!important;margin:0 auto!important;border-width:3px!important}
  #rinkRoot .rink-player{width:54px!important}
  #rinkRoot .rink-avatar{width:44px!important;height:44px!important;border-width:2px!important;box-shadow:0 3px 8px rgba(0,0,0,.14)!important}
  #rinkRoot .rink-number{right:-8px!important;top:-5px!important;min-width:24px!important;width:auto!important;height:24px!important;padding:0 5px!important;font-size:10px!important}
  #rinkRoot .rink-name{margin-top:3px!important;font-size:6.5px!important;line-height:1.1!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
  #rinkRoot .center-dot{width:7px!important;height:7px!important}
  #rinkRoot .faceoff{border-width:1.5px!important}
  #rinkRoot .goalies{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:8px!important;margin-top:10px!important}
  #rinkRoot .goalie-card{min-width:0!important;padding:8px!important;font-size:7.5px!important;line-height:1.35!important}
  #rinkRoot .goalie-card strong{font-size:8px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
  #rinkRoot .rink-legend{display:grid!important;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr)!important;gap:5px!important;align-items:center!important;font-size:6.5px!important;line-height:1.25!important}
  #rinkRoot .rink-legend span{min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
  #rinkRoot .rink-legend span:nth-child(2){text-align:center!important}
  #rinkRoot .rink-legend span:last-child{text-align:right!important}
}
@media(max-width:390px){
  #rinkRoot .rink-shell{padding:8px!important}
  #rinkRoot .rink-player{width:48px!important}
  #rinkRoot .rink-avatar{width:40px!important;height:40px!important}
  #rinkRoot .rink-number{min-width:22px!important;height:22px!important;font-size:9px!important}
  #rinkRoot .rink-name{font-size:6px!important}
}
`;document.head.appendChild(s)}
function rows(xs){return xs.map(p=>`<div class="player-row"><span class="player-num">${p.number??'—'}</span><span class="player-avatar">${p.photo_proxy||p.photo?`<img src="${esc(p.photo_proxy||p.photo)}" alt="${esc(p.name)}" loading="lazy">`:(p.number??'')}</span><span class="player-name">${esc(p.name)}<small>${p.position==='G'?'Вратарь':p.position==='D'?'Защитник':p.position==='F'?'Нападающий':''}</small></span><span class="player-tag">${esc(p.goalie_role||p.captain||(p.line?`${p.line} зв.`:''))}</span></div>`).join('')}
function roster(side){const t=team(side),xs=list(side),l=logo(t),groups=[['G','Вратари'],['D','Защитники'],['F','Нападающие']];return`<article class="roster-team"><div class="roster-head">${l?`<img src="${esc(l)}" alt="">`:''}<div><strong>${esc(t?.name||'Команда')}</strong></div><div class="roster-source">Состав на матч · ФХР</div></div>${xs.length?groups.map(([pos,title])=>{const ps=xs.filter(p=>p.position===pos);return ps.length?`<div class="roster-group-title">${title}</div>${rows(ps)}`:''}).join(''):'<div class="empty">Заявка этой команды пока не найдена в протоколе ФХР.</div>'}<div class="roster-sync-note">Официальная заявка конкретного матча</div></article>`}
function availableLines(){return[1,2,3,4].filter(n=>list('home').some(p=>Number(p.line)===n)||list('away').some(p=>Number(p.line)===n))}
function linePlayers(side,line){const xs=list(side),d=xs.filter(p=>p.position==='D'&&Number(p.line)===line).slice(0,2),f=xs.filter(p=>p.position==='F'&&Number(p.line)===line).slice(0,3),g=xs.find(p=>p.position==='G'&&p.goalie_role==='ОВ')||xs.find(p=>p.position==='G'&&p.goalie_role==='РВ')||xs.find(p=>p.position==='G');return{d,f,g}}
function rinkPlayer(p,cls,away=false){if(!p)return'';const src=p.photo_proxy||p.photo||'',surname=String(p.name||'').split(' ')[0];return`<div class="rink-player ${away?'away':''} ${cls}"><div class="rink-avatar">${src?`<img src="${esc(src)}" alt="${esc(p.name)}">`:''}<span class="rink-number">${p.number??'—'}</span></div><div class="rink-name">${esc(surname)}</div></div>`}
function rink(){const lines=availableLines();if(!lines.length)return'<div class="empty">Сочетания появятся после публикации официального состава на матч с номерами звеньев.</div>';if(!lines.includes(selectedLine))selectedLine=lines[0];const h=linePlayers('home',selectedLine),a=linePlayers('away',selectedLine),buttons=lines.map(n=>`<button class="line-tab ${n===selectedLine?'active':''}" type="button" data-live-line="1" data-line="${n}">${n}-е сочетание</button>`).join('');return`<div class="rink-shell"><div class="line-tabs">${buttons}</div><div class="rink"><span class="center-dot"></span><span class="faceoff f1"></span><span class="faceoff f2"></span><span class="faceoff f3"></span><span class="faceoff f4"></span>${rinkPlayer(h.d[0],'pos-hd1')}${rinkPlayer(h.d[1],'pos-hd2')}${rinkPlayer(h.f[0],'pos-hf1')}${rinkPlayer(h.f[1],'pos-hf2')}${rinkPlayer(h.f[2],'pos-hf3')}${rinkPlayer(a.d[0],'pos-ad1',true)}${rinkPlayer(a.d[1],'pos-ad2',true)}${rinkPlayer(a.f[0],'pos-af1',true)}${rinkPlayer(a.f[1],'pos-af2',true)}${rinkPlayer(a.f[2],'pos-af3',true)}</div><div class="goalies"><div class="goalie-card"><div><strong>${esc(team('home')?.name||'')}</strong>${h.g?`№${h.g.number} ${esc(h.g.name)}`:'Вратарь не указан'}</div></div><div class="goalie-card"><div><strong>${esc(team('away')?.name||'')}</strong>${a.g?`№${a.g.number} ${esc(a.g.name)}`:'Вратарь не указан'}</div></div></div><div class="rink-legend"><span>${esc(team('home')?.name||'')} · слева</span><span>${selectedLine}-е сочетание</span><span>${esc(team('away')?.name||'')} · справа</span></div></div>`}
function apply(){if(!CACHE)return;installCss();const rosters=document.querySelector('#rosters .roster-grid'),root=document.getElementById('rinkRoot');if(rosters){rosters.innerHTML=roster('home')+roster('away');document.getElementById('rosters')?.setAttribute('data-live-lineups','1')}if(root)root.innerHTML=rink()}
async function load(){if(fetching)return;fetching=true;try{const r=await fetch(`${EDGE}?match_id=${id}&_=${Date.now()}`,{cache:'no-store'}),b=await r.json();if(!r.ok)throw Error(b.error||'Lineup fetch failed');const total=(b.lineups?.home?.length||0)+(b.lineups?.away?.length||0);if(total){CACHE=b;apply()}}catch(e){console.warn('Match lineups:',e)}finally{fetching=false;schedule()}}
function schedule(){clearTimeout(timer);timer=setTimeout(load,CACHE?300000:45000)}
document.addEventListener('click',e=>{const b=e.target.closest?.('#rinkRoot .line-tab[data-live-line="1"]');if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();selectedLine=Number(b.dataset.line)||selectedLine;const root=document.getElementById('rinkRoot');if(root)root.innerHTML=rink()},true);
const main=document.getElementById('main');if(main)new MutationObserver(()=>{if(!CACHE||queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}).observe(main,{childList:true});
load();
})();
