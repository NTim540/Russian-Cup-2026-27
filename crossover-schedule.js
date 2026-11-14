(()=>{'use strict';
const fixtures=[
[61,"2026-11-05","10:00","В–Г","ЛА «Море спорта»","26350481","Спартак — Локомотив","https://vkvideo.ru/live-133823152_456242231?pl=-133823152_14"],
[62,"2026-11-05","13:30","В–Г","ЛА «Море спорта»","26350485","Сибирь — Северсталь","https://vkvideo.ru/live-133823152_456242232?pl=-133823152_14"],
[63,"2026-11-05","13:30","В–Г","ЛА «Побережье Арена»","26350490","Армия СКА — Крылья Советов","https://vkvideo.ru/live-133823152_456242234?pl=-133823152_14"],
[64,"2026-11-05","17:30","В–Г","ЛА «Море спорта»","26350520","Трактор — МАХ","https://vkvideo.ru/live-133823152_456242233?pl=-133823152_14"],
[65,"2026-11-05","17:30","В–Г","ЛА «Побережье Арена»","26350522","Торпедо — Динамо-Джуниверс","https://vkvideo.ru/playlist/-133823152_14"],
[86,"2026-11-14","10:00","А–Б","ЛА «Море спорта»","26349916","Локомотив 2004 — Динамо СПБ"],
[87,"2026-11-14","13:00","А–Б","ЛА «Море спорта»","26349917","Динамо Москва — Авангард"],
[88,"2026-11-14","13:30","А–Б","ЛА «Побережье Арена»","26349918","Нефтехимик — АКМ"],
[89,"2026-11-14","17:00","А–Б","ЛА «Море спорта»","26349920","Ак Барс — ЦСКА"],
[90,"2026-11-14","17:30","А–Б","ЛА «Побережье Арена»","26349919","Красная Машина Юниор — СКА-Стрельна"]
]
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function init(){
 const anchor=document.getElementById('matches'),selector=document.getElementById('stage');
 if(!anchor||!selector||document.getElementById('crossovers'))return;
 const section=document.createElement('section');section.id='crossovers';section.className='section wrap';
 section.innerHTML='<div class="section-head"><div><div class="section-kicker">Второй тур · дополнительные игры</div><h2>Стыковые матчи</h2><div class="section-sub">Расписание ФХР. Участники стыковых матчей групп А–Б и В–Г определены. Стыковые матчи учитываются в общей таблице, но не влияют на места внутри групп.</div></div></div><div id="crossoverGrid"></div>';
 anchor.insertAdjacentElement('afterend',section);
 const style=document.createElement('style');style.textContent=`
 #crossoverGrid{display:grid;gap:20px}
 .cross-group{padding:22px}
 .cross-heading{font-size:18px;font-weight:800;margin-bottom:12px}
 .cross-date{font-size:12px;opacity:.7;margin-bottom:14px}
 .cross-list{display:grid;gap:9px}
 .cross-row{display:grid;grid-template-columns:90px 90px minmax(0,1fr) minmax(140px,1fr) auto;gap:12px;align-items:center;padding:12px 14px;border:1px solid rgba(128,145,180,.22);border-radius:12px}
 .cross-no,.cross-time{font-weight:750}
 .cross-teams{opacity:1;font-weight:800;line-height:1.35}
 .cross-venue{font-size:13px;opacity:.7}
 .cross-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
 .cross-link{color:#78a9ff;text-decoration:underline;text-underline-offset:3px;white-space:nowrap}
 .cross-link.stream{color:#ffb5c1;font-weight:850}

 @media(max-width:720px){.cross-group{padding:16px}.cross-row{grid-template-columns:64px 64px minmax(0,1fr);gap:8px}.cross-venue{grid-column:2/4}.cross-link{grid-column:2/4;justify-self:start}}
 `;document.head.appendChild(style);
 const grid=section.querySelector('#crossoverGrid');
 grid.innerHTML=[{group:'В–Г',date:'5 ноября 2026',note:'Группы В-II и Г-II'},{group:'А–Б',date:'14 ноября 2026',note:'Группы А-II и Б-II'}].map(g=>'<article class="card cross-group"><h3 class="cross-heading">'+g.note+'</h3><div class="cross-date">'+g.date+' · время московское</div><div class="cross-list">'+fixtures.filter(f=>f[3]===g.group).sort((a,b)=>a[2].localeCompare(b[2])).map(f=>'<div class="cross-row"><span class="cross-no">№'+f[0]+'</span><span class="cross-time">'+f[2]+'</span><span class="cross-teams">'+esc(f[6]||'Участники уточняются')+'</span><span class="cross-venue">'+esc(f[4])+'</span><span class="cross-actions"><a class="cross-link" href="https://junior.fhr.ru/games/'+f[5]+'/" target="_blank" rel="noopener noreferrer">Протокол ФХР ↗</a>'+(f[7]?'<a class="cross-link stream" href="'+esc(f[7])+'" target="_blank" rel="noopener noreferrer">▶ '+(f[0]===65?'Эфиры тура':'Трансляция')+'</a>':'')+'</span></div>').join('')+'</div></article>').join('');
 const update=()=>{section.style.display=String(selector.value)==='2'?'':'none'};
 selector.addEventListener('change',update);new MutationObserver(update).observe(document.getElementById('stageLabel')||selector,{childList:true,subtree:true});update();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
