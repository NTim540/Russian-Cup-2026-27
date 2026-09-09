(()=>{
'use strict';
const EDGE='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-mhl-test?id=903037';
let DATA=null,last=0,timer=null,line=1;
const $=s=>document.querySelector(s);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function logo(side){return DATA?.team_logos?.[side]||''}
function roster(side){return DATA?.lineups?.[side]||[]}
function teamName(side){return side==='away'?DATA.away:DATA.home}
function teamLogo(side){return logo(side==='away'?'away':'home')}
function pair(x){return Array.isArray(x)&&x.length>=2&&Number.isFinite(Number(x[0]))&&Number.isFinite(Number(x[1]))?[Number(x[0]),Number(x[1])]:null}
function overallScore(){
 const direct=pair(DATA?.score)||pair(DATA?.total_score);
 if(direct)return direct;
 if(Number.isFinite(Number(DATA?.home_score))&&Number.isFinite(Number(DATA?.away_score)))return[Number(DATA.home_score),Number(DATA.away_score)];
 let h=0,a=0,found=false;
 (DATA?.period_scores||[]).slice(0,4).forEach(p=>{const v=pair(p);if(v){h+=v[0];a+=v[1];found=true}});
 return found?[h,a]:null;
}
function hasPeriod(kind){
 const txt=String(DATA?.status_text||'');
 const ev=DATA?.events||[];
 if(kind==='OT')return /оверт|\bOT\b|\bОТ\b/i.test(txt)||ev.some(e=>String(e.period).toUpperCase()==='OT'||String(e.period).toUpperCase()==='ОТ');
 if(kind==='SO')return /бул|shootout|\bSO\b/i.test(txt)||ev.some(e=>['SO','Б','БУЛЛИТЫ'].includes(String(e.period).toUpperCase()));
 return false;
}
function periodCards(){
 const ps=DATA?.period_scores||[],defs=[['1-й период',0],['2-й период',1],['3-й период',2]];
 if(hasPeriod('OT')||((pair(ps[3])||[]).some(n=>n>0)))defs.push(['Овертайм',3]);
 if(hasPeriod('SO')||((pair(ps[4])||[]).some(n=>n>0)))defs.push(['Буллиты',4]);
 return defs.map(([t,i])=>{const p=pair(ps[i]);return`<div class="period"><span>${t}</span><strong>${p?`${p[0]}:${p[1]}`:'— : —'}</strong></div>`}).join('');
}
function statusText(){
 const s=String(DATA?.status_text||'').trim();
 if(DATA?.status==='FINAL')return'Матч завершён';
 if(/перерыв/i.test(s))return `${s.match(/\d-й перерыв/i)?.[0]||'Перерыв'} · LIVE`;
 if(DATA?.status==='ACTIVE')return s?`● LIVE · ${s}`:'● LIVE';
 return'Матч не начался';
}
function player(side,n){return roster(side).find(p=>Number(p.number)===Number(n))||null}
function eventType(e){const t=String(e.event_type||'').toUpperCase();return t==='GOAL'?'goal':t==='PENALTY'?'penalty':t==='TIMEOUT'?'goalkeeper':'goalkeeper'}
function eventLabel(e){const t=String(e.event_type||'').toUpperCase();if(t==='GOAL')return'Гол';if(t==='PENALTY')return'Удаление';if(t==='TIMEOUT')return'Тайм-аут';return e.empty_net?'Пустые ворота':'Вратарь'}
function eventsHtml(){
 const ev=DATA?.events||[];
 if(!ev.length)return'<div class="empty">Событий пока нет.</div>';
 return`<div class="timeline">${ev.map(e=>{
   const type=eventType(e),label=eventLabel(e),side=e.side==='away'?'away':'home',name=teamName(side),l=teamLogo(side);
   const title=String(e.event_type||'').toUpperCase()==='GOAL'?`${e.number?`№${e.number} `:''}${e.player||''}`.trim():String(e.event_type||'').toUpperCase()==='PENALTY'?`${e.number?`№${e.number} `:''}${e.player||'Командный штраф'}`.trim():(e.player||name||'');
   const desc=String(e.event_type||'').toUpperCase()==='GOAL'?[e.assistants?`Передачи: ${e.assistants}`:'',e.power_play?'В большинстве':''].filter(Boolean).join(' · '):String(e.event_type||'').toUpperCase()==='PENALTY'?[e.penalty_minutes?`${e.penalty_minutes} мин.`:'',e.description||''].filter(Boolean).join(' · '):(e.description||'');
   const p=player(side,e.number),photo=p?.photo||'',score=pair(e.score);
   const period=e.period==='OT'||e.period==='ОТ'?'ОТ':e.period==='SO'?'Буллиты':`${e.period||'—'} период`;
   return`<article class="event ${type}" data-demo-side="${side}"><time>${esc(e.clock||'—')}<small>${esc(period)}</small></time>${l?`<img class="event-team-logo" src="${esc(l)}" alt="Логотип ${esc(name)}">`:''}<div class="eventperson">${photo?`<img src="${esc(photo)}" alt="${esc(e.player||'')}">`:''}<div><span class="etype">${esc(label)}</span><strong>${esc(title)}</strong><span class="event-team-name">${esc(name||'')}</span><p>${esc(desc)}</p></div></div>${score?`<div class="escore">${score[0]}:${score[1]}</div>`:''}</article>`;
 }).join('')}</div>`;
}
function rows(side){
 const xs=roster(side);if(!xs.length)return'<div class="empty">Матчевая заявка не найдена.</div>';
 const group=(pos,title)=>{const list=xs.filter(p=>p.position===pos);return list.length?`<div class="rg">${title}</div>${list.map(p=>`<div class="prow"><span>${p.number}</span>${p.photo?`<img src="${esc(p.photo)}" alt="${esc(p.name)}">`:'<span class="pempty"></span>'}<b>${esc(p.name)}</b><small>${esc(p.goalie_role||p.captain||(p.line?`${p.line} зв.`:''))}</small></div>`).join('')}`:''};
 return group('G','Вратари')+group('D','Защитники')+group('F','Нападающие');
}
function rosterHtml(){const team=(side,name)=>`<article class="rteam"><div class="rhead">${logo(side)?`<img src="${esc(logo(side))}" alt="Логотип ${esc(name)}">`:''}<div><b>${esc(name)}</b><small>Официальная заявка именно на этот матч · МХЛ</small></div></div>${rows(side)}</article>`;return`<div class="rgrid">${team('home',DATA.home)}${team('away',DATA.away)}</div>`}
function lines(){return[1,2,3,4].filter(n=>roster('home').some(p=>Number(p.line)===n)||roster('away').some(p=>Number(p.line)===n))}
function lp(side,pos,n){return roster(side).filter(p=>Number(p.line)===line&&p.position===pos).slice(0,n)}
function rinkP(p,cls,away=false){if(!p)return'';return`<div class="rp ${away?'away':''} ${cls}"><div class="rpic">${p.photo?`<img src="${esc(p.photo)}" alt="${esc(p.name)}">`:''}<span>${p.number}</span></div><b>${esc(String(p.name).split(' ')[0])}</b></div>`}
function rinkHtml(){
 const ls=lines();if(!ls.length)return'<div class="empty">Сочетания не найдены.</div>';if(!ls.includes(line))line=ls[0];
 const hd=lp('home','D',2),hf=lp('home','F',3),ad=lp('away','D',2),af=lp('away','F',3),hg=roster('home').find(p=>p.position==='G'&&p.goalie_role==='ОВ')||roster('home').find(p=>p.position==='G'),ag=roster('away').find(p=>p.position==='G'&&p.goalie_role==='ОВ')||roster('away').find(p=>p.position==='G');
 return`<div class="linebtns">${ls.map(n=>`<button data-line="${n}" class="${n===line?'active':''}">${n}-е сочетание</button>`).join('')}</div><div class="rink"><i class="blue b1"></i><i class="blue b2"></i><i class="red"></i>${rinkP(hd[0],'hd1')}${rinkP(hd[1],'hd2')}${rinkP(hf[0],'hf1')}${rinkP(hf[1],'hf2')}${rinkP(hf[2],'hf3')}${rinkP(ad[0],'ad1',true)}${rinkP(ad[1],'ad2',true)}${rinkP(af[0],'af1',true)}${rinkP(af[1],'af2',true)}${rinkP(af[2],'af3',true)}</div><div class="keepers"><span>${esc(DATA.home)} · ${hg?`№${hg.number} ${esc(hg.name)}`:'—'}</span><b>${line}-е сочетание</b><span>${esc(DATA.away)} · ${ag?`№${ag.number} ${esc(ag.name)}`:'—'}</span></div>`;
}
function style(){
 if($('#mhlv3'))return;const s=document.createElement('style');s.id='mhlv3';s.textContent=`
 .teamlogo{height:108px;display:grid;place-items:center;margin-bottom:12px}.teamlogo img{max-width:100px;max-height:100px;object-fit:contain;filter:drop-shadow(0 10px 18px rgba(0,0,0,.25))}.main-score{font-size:clamp(62px,8vw,94px);font-weight:1000;line-height:.88;letter-spacing:-.075em;margin:13px 0 6px;color:#fff}.main-score.pending{color:#75899e}.demo-tabs{position:sticky;top:64px;z-index:8;border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:rgba(7,17,31,.91);backdrop-filter:blur(16px)}.demo-tabs>div{display:flex;gap:6px;overflow-x:auto;padding:8px 0}.demo-tabs a{white-space:nowrap;padding:8px 10px;border-radius:8px;color:#8fa2b8;font-size:9px;font-weight:900;text-transform:uppercase}.demo-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 9px;border:1px solid rgba(127,198,255,.2);border-radius:999px;color:#acd8ff;background:rgba(35,135,217,.08)}.eventperson{display:flex;align-items:center;gap:10px}.eventperson>img{width:44px;height:44px;border-radius:50%;object-fit:cover}.event-team-name{display:block;margin-top:4px;color:#c1d2e2;font-size:9px;font-weight:850}.escore{font-size:22px;font-weight:950;text-align:right}.rgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.rteam{border:1px solid var(--line);border-radius:11px;overflow:hidden;background:rgba(10,25,42,.8)}.rhead{display:flex;align-items:center;gap:10px;padding:13px;border-bottom:1px solid var(--line)}.rhead img{width:42px;height:42px;object-fit:contain}.rhead b{display:block}.rhead small{display:block;color:var(--muted);font-size:8px;margin-top:3px}.rg{padding:9px 12px 5px;color:#7f91a7;text-transform:uppercase;font-size:8px;font-weight:900}.prow{display:grid;grid-template-columns:28px 34px 1fr auto;align-items:center;gap:8px;padding:7px 12px;border-top:1px solid rgba(255,255,255,.045);font-size:10px}.prow img,.pempty{width:32px;height:32px;border-radius:50%;object-fit:cover;background:#10243a}.prow small{color:#86b9e5}.linebtns{display:flex;justify-content:center;gap:6px;margin-bottom:12px;flex-wrap:wrap}.linebtns button{border:1px solid var(--line);border-radius:999px;padding:7px 11px;background:rgba(255,255,255,.025);color:#8397ab;font-size:9px;font-weight:900}.linebtns button.active{color:#fff;border-color:rgba(127,198,255,.4);background:rgba(35,135,217,.14)}.rink{position:relative;width:min(100%,1000px);aspect-ratio:2/1;margin:auto;background:#eef5f8;border:4px solid #64a8cc;border-radius:15%/28%;overflow:hidden}.rink .blue,.rink .red{position:absolute;top:0;bottom:0;width:2px;z-index:1}.rink .blue{background:#72aec8}.rink .red{background:#df8994;left:50%}.rink .b1{left:25%}.rink .b2{left:75%}.rp{position:absolute;width:78px;transform:translate(-50%,-50%);text-align:center;color:#18283a;z-index:2}.rpic{position:relative;width:58px;height:58px;margin:auto;border:3px solid #2d6aa7;border-radius:50%;background:#dce7ec}.away .rpic{border-color:#263a4e}.rpic img{width:100%;height:100%;border-radius:50%;object-fit:cover}.rpic span{position:absolute;right:-10px;top:-6px;width:27px;height:27px;border-radius:50%;display:grid;place-items:center;background:#2d6aa7;color:#fff;font-size:11px;font-weight:900}.away .rpic span{background:#263a4e}.rp>b{display:block;font-size:8px;margin-top:4px}.hd1{left:17%;top:32%}.hd2{left:17%;top:68%}.hf1{left:38%;top:20%}.hf2{left:41%;top:50%}.hf3{left:38%;top:80%}.ad1{left:83%;top:32%}.ad2{left:83%;top:68%}.af1{left:62%;top:20%}.af2{left:59%;top:50%}.af3{left:62%;top:80%}.keepers{display:flex;justify-content:space-between;gap:10px;margin:10px auto 0;max-width:950px;color:var(--muted);font-size:9px}.keepers span:last-child{text-align:right}@media(max-width:760px){.rgrid{grid-template-columns:1fr}.rink{min-width:680px}.rinkwrap{overflow-x:auto}.keepers{min-width:680px}.teamlogo{height:70px}.teamlogo img{max-height:66px;max-width:66px}.main-score{font-size:49px}.demo-tabs{top:58px}.escore{grid-column:3}}
 `;document.head.appendChild(s);
}
function bind(){document.querySelectorAll('[data-line]').forEach(b=>b.onclick=()=>{line=Number(b.dataset.line);$('#rinkroot').innerHTML=rinkHtml();bind()})}
function render(){
 document.title=`TEST · ${DATA.home} — ${DATA.away}`;
 const score=overallScore(),scoreText=score?`${score[0]}:${score[1]}`:'— : —';
 $('#app').innerHTML=`<section class="hero wrap"><article class="card"><div class="kicker">МХЛ · тест будущего матч-центра ФХР · матч №${DATA.game_no||'—'}</div><div class="teams"><div class="team"><div class="teamlogo">${logo('home')?`<img src="${esc(logo('home'))}" alt="Логотип ${esc(DATA.home)}">`:''}</div><h1>${esc(DATA.home)}</h1><p>Санкт-Петербург</p></div><div class="center"><div class="live">${esc(statusText())}</div><div class="live-sweep"></div><div class="main-score ${score?'':'pending'}">${esc(scoreText)}</div><div class="periods">${periodCards()}</div></div><div class="team"><div class="teamlogo">${logo('away')?`<img src="${esc(logo('away'))}" alt="Логотип ${esc(DATA.away)}">`:''}</div><h1>${esc(DATA.away)}</h1><p>Южно-Сахалинск</p></div></div><div class="meta"><span>${esc(DATA.date_text||'9 сентября 2026')}</span><span class="demo-badge">Голевая анимация · повтор каждые ~12 сек.</span><span id="age">Обновлено только что</span></div></article></section><div class="demo-tabs"><div class="wrap"><a href="#live">Ход матча</a><a href="#rosters">Составы</a><a href="#lines">Пятёрки на льду</a></div></div><section class="section wrap" id="live"><h2>Ход тестового матча</h2><div class="note">События, логотипы, фото игроков и LIVE-данные читаются из официального матч-центра МХЛ. В матчах Кубка здесь будет использоваться источник ФХР.</div>${eventsHtml()}</section><section class="section wrap" id="rosters"><h2>Составы на матч</h2><div class="note">Показывается именно заявка текущей игры, а не общая карточка команды — по той же логике, которую используем для ФХР.</div>${rosterHtml()}</section><section class="section wrap" id="lines"><h2>Пятёрки на хоккейной карте</h2><div class="note">Сочетания построены только по опубликованным в конкретном матче звеньям.</div><div id="rinkroot" class="rinkwrap">${rinkHtml()}</div><div class="source">Источник теста: <a target="_blank" rel="noopener noreferrer" href="${esc(DATA.source)}">официальный текстовый матч-центр МХЛ</a>. Тест полностью изолирован от базы и таблиц Кубка России.</div></section>`;
 last=Date.now();bind();syncLiveSweep();
}
function syncLiveSweep(){const live=$('.live'),bar=$('.live-sweep');if(!live||!bar)return;bar.classList.toggle('show',/LIVE|перерыв/i.test(live.textContent||''))}
function age(){const el=$('#age');if(!el||!last)return;const s=Math.floor((Date.now()-last)/1000);el.textContent=s<5?'Обновлено только что':`Обновлено ${s} сек. назад`}
async function load(){try{const r=await fetch(`${EDGE}&_=${Date.now()}`,{cache:'no-store'}),b=await r.json();if(!r.ok)throw Error(b.error||'Ошибка тестового источника');DATA=b;render()}catch(e){if(!DATA)$('#app').innerHTML=`<div class="wrap status">${esc(e.message||'Не удалось загрузить тест.')}</div>`}clearTimeout(timer);timer=setTimeout(load,30000)}
style();setInterval(age,1000);load();
})();