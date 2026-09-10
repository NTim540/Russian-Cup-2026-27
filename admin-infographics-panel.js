(()=>{
'use strict';
const CORE='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup';
const MEDIA='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-media';
const MATCH_CENTER='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-match-center';
const CUP_LOGO='https://drive.google.com/thumbnail?id=1hwFp1ukBAQ_Qd-nI5okdiejSRlUrfLeB&sz=w512';
const LOGOS={
'Динамо Москва':'https://drive.google.com/thumbnail?id=1I3KuJZEajmksDKtoBsdj4h_75fU0e_KY&sz=w512','МАХ':'https://drive.google.com/thumbnail?id=1Veii4NYgKc06nRtxKmCRQv1YCE164YZP&sz=w512','Торпедо':'https://drive.google.com/thumbnail?id=17NYLCFaSrX6q4g0T7jhBnmidrI1JzKl9&sz=w512','Локомотив':'https://drive.google.com/thumbnail?id=1D6wJnaawN4kMt-1ZWTSvf-trYkslzyKi&sz=w512','Авангард':'https://drive.google.com/thumbnail?id=1y6CZfZSXYDVqCAjOvv6xB_7Fwu1AQwvn&sz=w512','Локомотив 2004':'https://drive.google.com/thumbnail?id=1sq7UHtBq_xiexekxmzWawF3yVTaEl-J-&sz=w512','Крылья Советов':'https://drive.google.com/thumbnail?id=1n6ViHZhkRvq_R_Ul1PEHnFnX7HVNk6-p&sz=w512','Сибирь':'https://drive.google.com/thumbnail?id=1Xul8VXC7juk2NHQfb28Cl9Jt_Kj0Obw-&sz=w512','Лада':'https://drive.google.com/thumbnail?id=15mcwMoXT7OaH46jj8w90PCeTtJY54UAF&sz=w512','Трактор':'https://drive.google.com/thumbnail?id=1qWTRWy-p36RDSMlAy4AqA60PrrUTaczd&sz=w512','Ак Барс':'https://drive.google.com/thumbnail?id=1I09r6XwD-9L4r5ojPGKCHsJ5WGUyOFy1&sz=w512','Спартак':'https://drive.google.com/thumbnail?id=19kJ3uz-yyb1Z2y8qvRbFwuw_2kjUUD2f&sz=w512','Динамо СПБ':'https://drive.google.com/thumbnail?id=1x4KaAFMJ_qfmi26oVjnsc-huKpWtqBbh&sz=w512','Динамо-Джуниверс':'https://drive.google.com/thumbnail?id=1HTqvh6fg5ZzOLFwOtY62zucjnRZyOXmu&sz=w512','АКМ':'https://drive.google.com/thumbnail?id=1NmPj1OwI3C1yuNmgt2XX57HbEiiDauB7&sz=w512','ЦСКА':'https://drive.google.com/thumbnail?id=1bT6o4afTqonyA05keLbe_nfQ78sAmNda&sz=w512','Армия СКА':'https://drive.google.com/thumbnail?id=14XZX2FRyR5x_aVkU2SMLhW-Emk0RUkTo&sz=w512','Нефтехимик':'https://drive.google.com/thumbnail?id=1csEdtjesEvgAFSsfnfhmWUnUE23Tnqeg&sz=w512','Северсталь':'https://drive.google.com/thumbnail?id=10xBTOFy_ps1G3LNaHV3WpbQkuZ74pjRn&sz=w512','Красная Машина Юниор':'https://drive.google.com/thumbnail?id=1qATM0WxWDCgYfemDQvhdy30Ub0sWSWWV&sz=w512'};

let DATA=null,DETAIL=null,renderSeq=0;
const cache=new Map();
const q=s=>document.querySelector(s);
const qa=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function credential(){try{return PW||sessionStorage.getItem('rc_admin_session_v2')||''}catch{return sessionStorage.getItem('rc_admin_session_v2')||''}}
async function api(path){const r=await fetch(CORE+path,{cache:'no-store',headers:{'x-admin-password':credential()}}),b=await r.json().catch(()=>({}));if(!r.ok)throw Error(b.error||'Не удалось загрузить данные');return b}
async function matchDetail(id){const r=await fetch(`${MATCH_CENTER}?match_id=${id}&_=${Date.now()}`,{cache:'no-store'}),b=await r.json().catch(()=>({}));if(!r.ok)throw Error(b.error||'Не удалось загрузить матч-центр');return b}

function mount(){
  const tabs=q('.tabs'),anchor=q('#tab-settings')||q('#tab-matches');
  if(!tabs||!anchor||q('#tab-infographics'))return;
  const btn=document.createElement('button');btn.className='tab';btn.dataset.tab='infographics';btn.textContent='Инфографика';tabs.appendChild(btn);
  const section=document.createElement('section');section.id='tab-infographics';section.className='hidden';section.innerHTML=`
    <div class="ig-head"><div><h2>Инфографика</h2><div class="muted">Автоматические карточки 1080×1350 из данных турнира — без ручной верстки каждого матча.</div></div><div class="ig-head-actions"><button id="igRefresh" class="btn sec small">Обновить данные</button><button id="igDownload" class="btn small">Скачать PNG</button></div></div>
    <div class="ig-layout">
      <aside class="card ig-controls">
        <div class="ig-block"><div class="ig-label">1. Формат</div><div class="ig-types">
          <button type="button" class="ig-type active" data-type="announcement"><b>Анонс матча</b><span>Дата, время, арена, команды</span></button>
          <button type="button" class="ig-type" data-type="result"><b>Результат матча</b><span>Счёт, периоды, авторы голов</span></button>
          <button type="button" class="ig-type" data-type="gamesday"><b>Игровой день</b><span>Все матчи выбранной даты</span></button>
          <button type="button" class="ig-type" data-type="resultsday"><b>Итоги дня</b><span>Все результаты выбранной даты</span></button>
        </div></div>
        <div class="ig-block"><div class="ig-label">2. Данные</div>
          <div id="igMatchFields"><div class="field"><label>Матч</label><select id="igMatch" class="select"></select></div></div>
          <div id="igDayFields" class="hidden"><div class="field"><label>Дата</label><select id="igDate" class="select"></select></div><div id="igDayHint" class="muted ig-hint"></div></div>
        </div>
        <div class="ig-block"><div class="ig-label">3. Настройка</div>
          <div class="field"><label>Верхняя строка</label><input id="igEyebrow" class="input" placeholder="Автоматически"></div>
          <div class="field"><label>Дополнительная подпись</label><input id="igNote" class="input" placeholder="Необязательно"></div>
          <label class="ig-check"><input id="igShowVenue" type="checkbox" checked><span>Показывать арену и город</span></label>
          <label class="ig-check"><input id="igShowStream" type="checkbox" checked><span>Показывать отметку трансляции</span></label>
        </div>
        <div class="ig-block ig-auto"><div><b>Автоматический режим</b><p>Логотипы, названия, дата, время, группа, счёт, периоды и события берутся с сайта. Длинные названия уменьшаются автоматически.</p></div><span>ON</span></div>
        <div id="igStatus" class="muted ig-status">Готово к работе.</div>
      </aside>
      <section class="ig-preview-column">
        <div class="ig-preview-toolbar"><div><b id="igPreviewTitle">Анонс матча</b><span>1080 × 1350 · PNG</span></div><button id="igDownloadTop" class="btn small">Скачать PNG</button></div>
        <div class="ig-canvas-shell"><canvas id="igCanvas" width="1080" height="1350"></canvas></div>
      </section>
    </div>`;
  anchor.insertAdjacentElement('afterend',section);
  injectCss();wire(btn,section);syncData().catch(showError);
}

function injectCss(){if(q('#admin-infographics-panel-css'))return;const s=document.createElement('style');s.id='admin-infographics-panel-css';s.textContent=`
.admin-sidebar .tab[data-tab='infographics']::before{content:'▤'}
.ig-head{display:flex;justify-content:space-between;align-items:flex-end;gap:18px;margin:0 0 16px}.ig-head h2{font-size:31px;letter-spacing:-.04em;margin:0}.ig-head-actions{display:flex;gap:8px}.ig-layout{display:grid;grid-template-columns:minmax(300px,380px) minmax(0,1fr);gap:16px;align-items:start}.ig-controls{padding:16px;position:sticky;top:86px}.ig-block{padding:15px 0;border-bottom:1px solid var(--line)}.ig-block:first-child{padding-top:0}.ig-block:last-child{border-bottom:0}.ig-label{font-size:9px;font-weight:950;letter-spacing:.13em;text-transform:uppercase;color:#7188a0;margin-bottom:10px}.ig-types{display:grid;grid-template-columns:1fr 1fr;gap:8px}.ig-type{min-height:82px;text-align:left;border:1px solid var(--line);border-radius:12px;padding:11px;background:rgba(255,255,255,.025);color:#dce6f1;cursor:pointer;transition:.15s ease}.ig-type:hover{border-color:rgba(127,198,255,.28);background:rgba(127,198,255,.05)}.ig-type.active{border-color:rgba(61,128,242,.55);background:linear-gradient(145deg,rgba(47,111,237,.20),rgba(35,135,217,.08));box-shadow:inset 3px 0 0 #3b80ef}.ig-type b{display:block;font-size:12px}.ig-type span{display:block;margin-top:5px;color:#7f93a8;font-size:9px;line-height:1.35}.ig-controls .field+.field{margin-top:9px}.ig-check{display:flex;gap:8px;align-items:center;margin-top:10px;color:#aebdce;font-size:11px}.ig-check input{accent-color:#2f6fed}.ig-hint{margin-top:8px}.ig-auto{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.ig-auto b{font-size:12px}.ig-auto p{font-size:10px;line-height:1.45;color:#768aa0;margin:5px 0 0}.ig-auto>span{padding:5px 7px;border-radius:999px;border:1px solid rgba(72,195,139,.28);background:rgba(72,195,139,.07);color:#7de0ae;font-size:9px;font-weight:950}.ig-status{min-height:17px;padding-top:12px}.ig-preview-column{min-width:0}.ig-preview-toolbar{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:10px;padding:0 2px}.ig-preview-toolbar b{display:block;font-size:13px}.ig-preview-toolbar span{display:block;color:#74879b;font-size:9px;margin-top:3px}.ig-canvas-shell{position:relative;width:min(100%,760px);margin:0 auto;border:1px solid rgba(127,198,255,.16);border-radius:14px;padding:10px;background:linear-gradient(145deg,rgba(15,31,51,.96),rgba(6,17,30,.98));box-shadow:0 24px 70px rgba(0,0,0,.25)}#igCanvas{display:block;width:100%;height:auto;aspect-ratio:4/5;border-radius:8px;background:#07111f}.ig-controls .hidden{display:none!important}@media(max-width:1050px){.ig-layout{grid-template-columns:330px minmax(0,1fr)}.ig-types{grid-template-columns:1fr}}@media(max-width:820px){.ig-head{align-items:flex-start;flex-direction:column}.ig-head-actions{width:100%}.ig-head-actions .btn{flex:1}.ig-layout{grid-template-columns:1fr}.ig-controls{position:static}.ig-types{grid-template-columns:1fr 1fr}.ig-canvas-shell{width:100%}}@media(max-width:520px){.ig-types{grid-template-columns:1fr}.ig-preview-toolbar{align-items:flex-start}.ig-preview-toolbar .btn{display:none}}
`;document.head.appendChild(s)}

function wire(btn,section){
  btn.onclick=()=>{qa('.tab').forEach(x=>x.classList.toggle('active',x===btn));qa('[id^="tab-"]').forEach(x=>x.classList.toggle('hidden',x!==section));section.classList.remove('hidden');syncData().catch(showError)};
  q('.tabs')?.addEventListener('click',e=>{const other=e.target.closest('.tab');if(other&&other!==btn)section.classList.add('hidden')});
  section.querySelectorAll('.ig-type').forEach(x=>x.onclick=()=>{section.querySelectorAll('.ig-type').forEach(y=>y.classList.toggle('active',y===x));switchType();loadDetail().then(render)});
  ['igEyebrow','igNote'].forEach(id=>q('#'+id)?.addEventListener('input',render));
  ['igShowVenue','igShowStream'].forEach(id=>q('#'+id)?.addEventListener('change',render));
  q('#igMatch')?.addEventListener('change',()=>{loadDetail().then(render)});
  q('#igDate')?.addEventListener('change',()=>{updateDayHint();render()});
  q('#igRefresh').onclick=()=>syncData(true).catch(showError);q('#igDownload').onclick=download;q('#igDownloadTop').onclick=download;
  q('#tournament')?.addEventListener('change',()=>setTimeout(()=>syncData().catch(showError),250));q('#stage')?.addEventListener('change',()=>setTimeout(()=>syncData().catch(showError),250));
}

function currentType(){return q('.ig-type.active')?.dataset.type||'announcement'}
async function syncData(force=false){
  const slug=q('#tournament')?.value,stage=q('#stage')?.value;if(!slug||!stage)return;
  status('Загружаю данные…');
  DATA=await api('/api/data?tournament_slug='+encodeURIComponent(slug)+'&stage_id='+encodeURIComponent(stage));
  fillSelectors();await loadDetail();status(force?'Данные обновлены.':'Готово к работе.');render();
}
function fillSelectors(){
  const ms=[...(DATA?.matches||[])].sort((a,b)=>String(a.game_date).localeCompare(String(b.game_date))||String(a.start_time||'').localeCompare(String(b.start_time||''))||(a.game_no||0)-(b.game_no||0));
  const oldMatch=q('#igMatch')?.value,oldDate=q('#igDate')?.value;
  q('#igMatch').innerHTML=ms.map(m=>`<option value="${m.id}">№${m.game_no} · ${esc(team(m.home_team_id).name)} — ${esc(team(m.away_team_id).name)}</option>`).join('');
  const dates=[...new Set(ms.map(m=>m.game_date))];q('#igDate').innerHTML=dates.map(d=>`<option value="${d}">${fmtDateLong(d)}</option>`).join('');
  if(ms.some(m=>String(m.id)===String(oldMatch)))q('#igMatch').value=oldMatch;if(dates.includes(oldDate))q('#igDate').value=oldDate;updateDayHint();switchType();
}
function switchType(){const day=['gamesday','resultsday'].includes(currentType());q('#igMatchFields')?.classList.toggle('hidden',day);q('#igDayFields')?.classList.toggle('hidden',!day);const labels={announcement:'Анонс матча',result:'Результат матча',gamesday:'Игровой день',resultsday:'Итоги игрового дня'};q('#igPreviewTitle').textContent=labels[currentType()]||'Инфографика'}
async function loadDetail(){DETAIL=null;if(!DATA||!['announcement','result'].includes(currentType()))return;const id=Number(q('#igMatch')?.value);if(!id)return;try{DETAIL=await matchDetail(id)}catch(e){console.warn('Infographics detail:',e)}}
function updateDayHint(){const n=dayMatches().length;q('#igDayHint').textContent=n?`На эту дату: ${n} ${pluralWord(n,'матч','матча','матчей')}. Макет автоматически подстроится под количество игр.`:'На эту дату матчей нет.'}
function team(id){return DATA?.teams?.find(t=>Number(t.id)===Number(id))||{id,name:'—'}}
function group(id){return DATA?.groups?.find(g=>Number(g.id)===Number(id))||null}
function match(){return DATA?.matches?.find(m=>Number(m.id)===Number(q('#igMatch')?.value))||null}
function dayMatches(){const d=q('#igDate')?.value;return (DATA?.matches||[]).filter(m=>m.game_date===d).sort((a,b)=>String(a.start_time||'').localeCompare(String(b.start_time||''))||(a.game_no||0)-(b.game_no||0))}
function logo(t){return t?.logo_url||LOGOS[t?.name]||''}
function done(m){return Number.isInteger(m?.home_score)&&Number.isInteger(m?.away_score)&&m.home_score!==m.away_score}
function fmtDateLong(d){try{return new Date(d+'T12:00:00').toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long'}).replace(/^./,x=>x.toUpperCase())}catch{return d||''}}
function fmtDateShort(d){try{return new Date(d+'T12:00:00').toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit'})}catch{return d||''}}
function time(m){return String(m?.start_time||'').slice(0,5)||'—:—'}
function place(m){return [m?.city,m?.arena].filter(Boolean).join(' · ')}
function pluralWord(n,a,b,c){const d=n%10,h=n%100;return d===1&&h!==11?a:[2,3,4].includes(d)&&![12,13,14].includes(h)?b:c}
function status(t,bad=false){const el=q('#igStatus');if(el){el.textContent=t;el.style.color=bad?'#ff9099':''}}
function showError(e){console.error(e);status(e.message||String(e),true)}

async function img(src){if(!src)return null;if(cache.has(src))return cache.get(src);const p=new Promise(resolve=>{const i=new Image();i.crossOrigin='anonymous';i.onload=()=>resolve(i);i.onerror=()=>resolve(null);i.src=MEDIA+'?url='+encodeURIComponent(src)});cache.set(src,p);return p}
function c(){return q('#igCanvas')?.getContext('2d')}
function rounded(ctx,x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}}
function text(ctx,s,x,y,size,weight='700',color='#fff',align='left',max){ctx.save();ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline='alphabetic';ctx.font=`${weight} ${size}px Inter, Arial, sans-serif`;ctx.fillText(String(s??''),x,y,max);ctx.restore()}
function fitText(ctx,s,max,base,min=24,weight='900'){let z=base;while(z>min){ctx.font=`${weight} ${z}px Inter, Arial, sans-serif`;if(ctx.measureText(String(s)).width<=max)break;z-=2}return z}
function contain(ctx,i,x,y,w,h){if(!i)return;const sc=Math.min(w/i.width,h/i.height),dw=i.width*sc,dh=i.height*sc;ctx.drawImage(i,x+(w-dw)/2,y+(h-dh)/2,dw,dh)}
function base(ctx,kicker,title){
  const g=ctx.createLinearGradient(0,0,1080,1350);g.addColorStop(0,'#05101d');g.addColorStop(.54,'#08192b');g.addColorStop(1,'#07111f');ctx.fillStyle=g;ctx.fillRect(0,0,1080,1350);
  const glow=ctx.createRadialGradient(160,130,0,160,130,620);glow.addColorStop(0,'rgba(47,111,237,.31)');glow.addColorStop(1,'rgba(47,111,237,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,1080,760);
  ctx.save();ctx.translate(850,-20);ctx.rotate(-.22);ctx.fillStyle='rgba(226,58,71,.14)';ctx.fillRect(0,0,220,1500);ctx.fillStyle='rgba(35,135,217,.10)';ctx.fillRect(-80,0,74,1500);ctx.restore();
  ctx.strokeStyle='rgba(255,255,255,.028)';ctx.lineWidth=1;for(let y=88;y<1350;y+=88){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(1080,y);ctx.stroke()}
  text(ctx,kicker,70,82,24,'900','#7fc6ff');text(ctx,title,70,165,68,'950','#fff');
  ctx.fillStyle='#e23a47';ctx.fillRect(70,194,76,6);ctx.fillStyle='#2387d9';ctx.fillRect(146,194,142,6);
  text(ctx,'КУБОК РОССИИ U16 · 2026/27',70,1290,20,'900','#7b8da3');
}
async function cupMark(ctx){const i=await img(CUP_LOGO);if(i)contain(ctx,i,920,48,95,95)}
function userEyebrow(def){return q('#igEyebrow')?.value.trim()||def}
function userNote(){return q('#igNote')?.value.trim()||''}
function infoPill(ctx,s,x,y,w){rounded(ctx,x,y,w,54,14,'rgba(127,198,255,.07)','rgba(127,198,255,.16)');text(ctx,s,x+w/2,y+35,20,'850','#cfeaff','center')}
async function teamBlock(ctx,t,x,y,w,side){const l=await img(logo(t));rounded(ctx,x,y,w,345,26,'rgba(255,255,255,.035)','rgba(255,255,255,.09)');if(l)contain(ctx,l,x+45,y+30,w-90,180);else{text(ctx,String(t.name||'?').slice(0,3),x+w/2,y+140,62,'950','#8195ab','center')}const size=fitText(ctx,t.name,w-48,39,24,'950');text(ctx,t.name,x+w/2,y+258,size,'950','#fff','center',w-42);text(ctx,t.city||'',x+w/2,y+302,20,'700','#7f93a8','center',w-42);ctx.fillStyle=side==='home'?'#2387d9':'#e23a47';ctx.fillRect(x+30,y+325,w-60,4)}
async function renderAnnouncement(ctx){const m=match();if(!m)return empty(ctx,'Выберите матч');const h=team(m.home_team_id),a=team(m.away_team_id),g=group(m.group_id);base(ctx,userEyebrow('АНОНС МАТЧА'),'MATCHDAY');await cupMark(ctx);await Promise.all([teamBlock(ctx,h,70,280,430,'home'),teamBlock(ctx,a,580,280,430,'away')]);text(ctx,'VS',540,475,42,'950','#7fc6ff','center');infoPill(ctx,fmtDateLong(m.game_date).toUpperCase(),70,682,430);infoPill(ctx,time(m),520,682,180);infoPill(ctx,(g?.code||'ГРУППА').toUpperCase(),720,682,290);let y=805;if(q('#igShowVenue')?.checked){rounded(ctx,70,y,940,112,20,'rgba(255,255,255,.035)','rgba(255,255,255,.08)');text(ctx,'МЕСТО ПРОВЕДЕНИЯ',100,y+35,16,'900','#70879f');text(ctx,place(m)||'Место уточняется',100,y+78,29,'850','#fff','left',870);y+=137}if(q('#igShowStream')?.checked&&m.stream_url){rounded(ctx,70,y,285,56,14,'rgba(226,58,71,.13)','rgba(226,58,71,.28)');text(ctx,'● ТРАНСЛЯЦИЯ',212,y+36,18,'950','#ff8e97','center')}const n=userNote();if(n)text(ctx,n,70,1195,24,'800','#cbd7e4','left',820)}
function periodPairs(m){return [['1 ПЕРИОД',m.p1_home,m.p1_away],['2 ПЕРИОД',m.p2_home,m.p2_away],['3 ПЕРИОД',m.p3_home,m.p3_away],['ОТ',m.ot_home,m.ot_away],['БУЛЛИТЫ',m.so_home,m.so_away]].filter((x,i)=>i<3||(Number.isInteger(x[1])&&Number.isInteger(x[2])&&(x[1]+x[2]>0))||m.finish_type===(i===3?'OT':'SO'))}
function goalEvents(){const ev=DETAIL?.live?.events||[];return ev.filter(x=>String(x.event_type||'').toUpperCase()==='GOAL')}
function goalLines(events){return events.slice(0,5).map(e=>{const tm=e.side==='away'?DETAIL?.away_team:DETAIL?.home_team;return `${e.clock||''}  ${e.player||tm?.name||'Гол'}`.trim()})}
async function renderResult(ctx){const baseMatch=match();const m=DETAIL?.match||baseMatch;if(!m)return empty(ctx,'Выберите матч');const h=team(m.home_team_id),a=team(m.away_team_id),g=group(m.group_id);base(ctx,userEyebrow('МАТЧ ЗАВЕРШЁН'),'FINAL');await cupMark(ctx);const hl=await img(logo(h)),al=await img(logo(a));if(hl)contain(ctx,hl,90,292,230,210);if(al)contain(ctx,al,760,292,230,210);const hs=done(m)?m.home_score:'—',as=done(m)?m.away_score:'—';text(ctx,h.name,205,555,fitText(ctx,h.name,280,34,21), '950','#fff','center',280);text(ctx,a.name,875,555,fitText(ctx,a.name,280,34,21),'950','#fff','center',280);text(ctx,`${hs}:${as}`,540,485,118,'950','#fff','center');text(ctx,(m.finish_type==='OT'?'ОВЕРТАЙМ':m.finish_type==='SO'?'БУЛЛИТЫ':'ОСНОВНОЕ ВРЕМЯ'),540,548,19,'900','#7fc6ff','center');const ps=periodPairs(m);const totalW=Math.min(940,ps.length*170+(ps.length-1)*10),sx=(1080-totalW)/2;ps.forEach((p,i)=>{const x=sx+i*(170+10);rounded(ctx,x,640,170,78,16,'rgba(255,255,255,.035)','rgba(255,255,255,.09)');text(ctx,p[0],x+85,666,12,'900','#71879f','center');text(ctx,Number.isInteger(p[1])?`${p[1]}:${p[2]}`:'—',x+85,703,25,'950','#fff','center')});const goals=goalLines(goalEvents());let y=790;if(goals.length){text(ctx,'ГОЛЫ',70,y,16,'950','#70879f');goals.forEach((s,i)=>{rounded(ctx,70,y+25+i*61,660,50,12,'rgba(72,195,139,.055)','rgba(72,195,139,.13)');text(ctx,s,94,y+58+i*61,21,'800','#dff7eb','left',610)});y+=25+goals.length*61}else{rounded(ctx,70,y,660,70,14,'rgba(255,255,255,.028)','rgba(255,255,255,.07)');text(ctx,'Авторы голов появятся после синхронизации протокола ФХР',95,y+43,18,'700','#8296aa','left',610);y+=95}rounded(ctx,760,790,250,170,20,'rgba(35,135,217,.07)','rgba(127,198,255,.13)');text(ctx,fmtDateShort(m.game_date),885,837,24,'950','#7fc6ff','center');text(ctx,time(m),885,884,42,'950','#fff','center');text(ctx,(g?.code||'').toUpperCase(),885,925,18,'900','#8699ad','center');const n=userNote();if(n)text(ctx,n,70,1195,24,'800','#cbd7e4','left',820)}

function dayLayout(count){
  const top=300,bottom=1218,gap=18,usable=bottom-top;
  if(count===1)return[{x:70,y:top,w:940,h:usable}];
  if(count===2){const h=(usable-gap)/2;return[0,1].map(i=>({x:70,y:top+i*(h+gap),w:940,h}))}
  if(count===3){const h=(usable-gap)/2,w=(940-gap)/2;return[{x:70,y:top,w:940,h},{x:70,y:top+h+gap,w,h},{x:70+w+gap,y:top+h+gap,w,h}]}
  const cols=2,rows=Math.ceil(count/cols),w=(940-gap)/2,h=(usable-gap*(rows-1))/rows;
  return Array.from({length:count},(_,i)=>({x:70+(i%2)*(w+gap),y:top+Math.floor(i/2)*(h+gap),w,h}));
}
function dayCardMetrics(h,count){
  if(count===1)return{logo:220,name:34,main:74,meta:20,pad:42};
  if(count===2)return{logo:132,name:29,main:58,meta:18,pad:32};
  if(count<=4)return{logo:105,name:24,main:46,meta:15,pad:24};
  if(count<=6)return{logo:80,name:20,main:38,meta:13,pad:18};
  return{logo:62,name:17,main:31,meta:11,pad:14};
}
async function drawDayCard(ctx,m,box,result,count,index){
  const hTeam=team(m.home_team_id),aTeam=team(m.away_team_id),g=group(m.group_id),M=dayCardMetrics(box.h,count);
  const [hl,al]=await Promise.all([img(logo(hTeam)),img(logo(aTeam))]);
  const {x,y,w,h}=box,large=count<=2;
  const grad=ctx.createLinearGradient(x,y,x+w,y+h);grad.addColorStop(0,index%2?'rgba(226,58,71,.055)':'rgba(35,135,217,.075)');grad.addColorStop(1,'rgba(255,255,255,.026)');
  rounded(ctx,x,y,w,h,large?28:20,grad,'rgba(255,255,255,.09)');
  ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,h,large?28:20);ctx.clip();ctx.fillStyle=index%2?'rgba(226,58,71,.7)':'rgba(35,135,217,.75)';ctx.fillRect(x,y,7,h);ctx.restore();
  text(ctx,'№'+(m.game_no||'—'),x+M.pad,y+M.pad,Math.max(11,M.meta),'900','#6f859c');
  text(ctx,(g?.code||'').toUpperCase(),x+w-M.pad,y+M.pad,Math.max(11,M.meta),'900','#7fc6ff','right');
  const logoY=large?y+78:y+50;
  const logoSize=Math.min(M.logo,h*(large?.42:.34));
  const leftX=x+M.pad,rightX=x+w-M.pad-logoSize;
  if(hl)contain(ctx,hl,leftX,logoY,logoSize,logoSize);else text(ctx,hTeam.name.slice(0,3),leftX+logoSize/2,logoY+logoSize*.62,34,'950','#7890a8','center');
  if(al)contain(ctx,al,rightX,logoY,logoSize,logoSize);else text(ctx,aTeam.name.slice(0,3),rightX+logoSize/2,logoY+logoSize*.62,34,'950','#7890a8','center');
  const center=x+w/2,main=result?(done(m)?`${m.home_score}:${m.away_score}`:'— : —'):time(m);
  text(ctx,main,center,logoY+logoSize*.58,M.main,'950','#fff','center');
  if(!result&&q('#igShowStream')?.checked&&m.stream_url)text(ctx,'● LIVE',center,logoY+logoSize*.78,Math.max(11,M.meta),'950','#ff7d87','center');
  if(result&&m.finish_type&&m.finish_type!=='REG')text(ctx,m.finish_type==='OT'?'ОТ':'БУЛЛИТЫ',center,logoY+logoSize*.78,Math.max(11,M.meta),'900','#7fc6ff','center');
  const nameY=large?logoY+logoSize+62:logoY+logoSize+34;
  const nameMax=large?w*.38:w*.40;
  const hSize=fitText(ctx,hTeam.name,nameMax,M.name,Math.max(14,M.name-7),'900'),aSize=fitText(ctx,aTeam.name,nameMax,M.name,Math.max(14,M.name-7),'900');
  text(ctx,hTeam.name,x+M.pad,nameY,hSize,'900','#fff','left',nameMax);text(ctx,aTeam.name,x+w-M.pad,nameY,aSize,'900','#fff','right',nameMax);
  if(large){text(ctx,'ХОЗЯЕВА',x+M.pad,nameY+34,14,'900','#607b95');text(ctx,'ГОСТИ',x+w-M.pad,nameY+34,14,'900','#607b95','right')}
  const metaY=y+h-M.pad;
  const location=q('#igShowVenue')?.checked?(m.arena||m.city||''):m.city||'';
  if(location)text(ctx,location,x+M.pad,metaY,Math.max(11,M.meta),'750','#8da0b3','left',w*.58);
  if(m.city&&location!==m.city)text(ctx,m.city,x+w-M.pad,metaY,Math.max(11,M.meta),'750','#8da0b3','right',w*.30);
  if(count===1){
    const lineY=y+h-115;ctx.strokeStyle='rgba(255,255,255,.08)';ctx.beginPath();ctx.moveTo(x+M.pad,lineY);ctx.lineTo(x+w-M.pad,lineY);ctx.stroke();
    text(ctx,fmtDateLong(m.game_date).toUpperCase(),center,lineY+48,20,'850','#cde8ff','center');
  }
}
async function renderDay(ctx,result=false){
  const ms=dayMatches(),date=q('#igDate')?.value;base(ctx,userEyebrow(result?'ИТОГИ ИГРОВОГО ДНЯ':'ИГРОВОЙ ДЕНЬ'),result?'RESULTS':'GAMES');await cupMark(ctx);
  text(ctx,fmtDateLong(date).toUpperCase(),70,244,28,'900','#cfe8ff');text(ctx,(ms.length+' '+pluralWord(ms.length,'МАТЧ','МАТЧА','МАТЧЕЙ')).toUpperCase(),1010,244,20,'850','#798da2','right');
  if(!ms.length)return emptyBody(ctx,'Матчей на выбранную дату нет');
  const shown=ms.slice(0,10),layout=dayLayout(shown.length);
  for(let i=0;i<shown.length;i++)await drawDayCard(ctx,shown[i],layout[i],result,shown.length,i);
  if(ms.length>shown.length)text(ctx,`+ ЕЩЁ ${ms.length-shown.length}`,1010,1248,16,'900','#7fc6ff','right');
  const n=userNote();if(n){rounded(ctx,70,1227,720,48,12,'rgba(7,17,31,.78)','rgba(255,255,255,.06)');text(ctx,n,90,1258,18,'800','#cbd7e4','left',680)}
}
function empty(ctx,msg){base(ctx,'ИНФОГРАФИКА','PREVIEW');emptyBody(ctx,msg)}function emptyBody(ctx,msg){rounded(ctx,70,330,940,360,24,'rgba(255,255,255,.025)','rgba(255,255,255,.07)');text(ctx,msg,540,525,32,'850','#8296aa','center')}
async function render(){const canvas=q('#igCanvas'),ctx=c();if(!canvas||!ctx)return;const my=++renderSeq;ctx.clearRect(0,0,1080,1350);try{const t=currentType();if(t==='announcement')await renderAnnouncement(ctx);else if(t==='result')await renderResult(ctx);else if(t==='gamesday')await renderDay(ctx,false);else await renderDay(ctx,true);if(my!==renderSeq)return}catch(e){console.error(e);empty(ctx,'Не удалось собрать макет');status(e.message||String(e),true)}}
function download(){const canvas=q('#igCanvas');if(!canvas)return;render().then(()=>canvas.toBlob(blob=>{if(!blob)return status('Не удалось создать PNG',true);const a=document.createElement('a'),t=currentType(),m=match(),date=q('#igDate')?.value||m?.game_date||'card';a.href=URL.createObjectURL(blob);a.download=`cup-u16-${t}-${date}${m?'-'+m.game_no:''}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1200);status('PNG готов.')},'image/png'))}

function boot(){mount()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
document.addEventListener('admin-auth-ready',()=>setTimeout(()=>{mount();syncData().catch(showError)},80));
})();
