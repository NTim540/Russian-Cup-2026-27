(()=>{
'use strict';
const EDGE='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-match-center';
const matchId=Number(new URL(location.href).searchParams.get('id'));
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* Main score / extra periods. */
function parsePair(text){const m=String(text||'').match(/(\d+)\s*:\s*(\d+)/);return m?[Number(m[1]),Number(m[2])]:null}
function hasNonZero(chip){const p=parsePair(chip?.querySelector('strong')?.textContent);return Boolean(p&&(p[0]>0||p[1]>0))}
function normalizeExtraPeriods(){
  const chips=[...document.querySelectorAll('.score-center .period-chip')];
  const state=String(document.querySelector('.match-state')?.textContent||'').toLocaleLowerCase('ru-RU');
  const ot=chips.find(c=>/овертайм|\bот\b/i.test(c.querySelector('span')?.textContent||''));
  const so=chips.find(c=>/бул/i.test(c.querySelector('span')?.textContent||''));
  const soReal=/бул/i.test(state)||hasNonZero(so),otReal=/овертайм/i.test(state)||hasNonZero(ot)||soReal;
  if(ot)ot.hidden=!otReal;if(so)so.hidden=!soReal;
}
function overallScore(){
  const row=[...document.querySelectorAll('.mini-game.current .mini-team > b')].map(x=>Number(String(x.textContent||'').trim())).filter(Number.isFinite);
  if(row.length===2)return row;
  let h=0,a=0,found=false;
  document.querySelectorAll('.score-center .period-chip:not([hidden]) strong').forEach(el=>{const p=parsePair(el.textContent);if(!p)return;h+=p[0];a+=p[1];found=true});
  return found?[h,a]:null;
}
function ensureMainScore(){
  const center=$('.score-center'),periodLine=center?.querySelector('.period-line');if(!center||!periodLine)return;
  let score=center.querySelector('.main-score-restored');if(!score){score=document.createElement('div');score.className='main-score-restored';periodLine.before(score)}
  const pair=overallScore(),next=pair?`${pair[0]}:${pair[1]}`:'— : —';if(score.textContent!==next)score.textContent=next;score.classList.toggle('pending',!pair);
}

/* Native stream block. VK links are always normalized to the stable vk.com embed host. */
function streamEmbedUrl(raw){
  const url=String(raw||'').trim();if(!url)return'';
  try{
    const u=new URL(url),h=u.hostname.replace(/^www\./,'').toLowerCase();
    if(h==='youtu.be'){const id=u.pathname.split('/').filter(Boolean)[0];return id?`https://www.youtube.com/embed/${id}`:''}
    if(h.endsWith('youtube.com')){const id=u.searchParams.get('v')||u.pathname.match(/\/(?:embed|shorts|live)\/([^/?#]+)/)?.[1];return id?`https://www.youtube.com/embed/${id}`:''}
    if(h.endsWith('rutube.ru')){const id=u.pathname.match(/\/(?:video|play\/embed)\/([a-z0-9_-]+)/i)?.[1];return id?`https://rutube.ru/play/embed/${id}`:''}
    if(h.endsWith('vk.com')||h.endsWith('vkvideo.ru')||h.endsWith('vk.ru')){
      if(/video_ext\.php/i.test(u.pathname)){u.hostname='vk.com';u.protocol='https:';return u.toString()}
      const m=u.pathname.match(/\/video(-?\d+)_(-?\d+)/i);if(m)return`https://vk.com/video_ext.php?oid=${m[1]}&id=${m[2]}&hd=2&autoplay=0`;
      return'';
    }
    if(/\/(embed|player)\//i.test(u.pathname)||/player|embed/i.test(u.pathname))return url;
    return'';
  }catch{return''}
}
function installStreamCss(){
  if(document.getElementById('match-stream-native-css'))return;
  const s=document.createElement('style');s.id='match-stream-native-css';s.textContent=`#stream{padding-top:8px}.match-stream-shell{border:1px solid rgba(127,198,255,.14);border-radius:14px;background:linear-gradient(180deg,rgba(10,27,45,.92),rgba(6,18,31,.96));padding:14px;box-shadow:0 8px 24px rgba(0,0,0,.14)}.match-stream-frame{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;border-radius:10px;background:#07111f}.match-stream-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0;background:#000}.match-stream-placeholder{position:absolute;inset:0;display:grid;place-items:center;padding:24px;text-align:center}.match-stream-play{width:74px;height:74px;margin:0 auto 17px;border:1px solid rgba(127,198,255,.22);border-radius:50%;display:grid;place-items:center;background:rgba(35,135,217,.12);font-size:27px;padding-left:4px}.match-stream-placeholder strong{display:block;font-size:clamp(22px,3vw,34px)}.match-stream-placeholder p{margin:9px auto 0;color:#8fa2b7;font-size:11px;line-height:1.6}.match-stream-open{display:inline-flex;margin-top:16px;padding:10px 14px;border-radius:8px;background:#1c66be;color:#fff!important;font-size:10px;font-weight:950}.match-stream-caption{display:flex;justify-content:space-between;gap:12px;padding:11px 3px 0;color:#7f93a8;font-size:9px}.match-stream-live{color:#ff717b;font-weight:950;text-transform:uppercase}@media(max-width:760px){.match-stream-shell{padding:8px}.match-stream-frame{border-radius:8px}.match-stream-caption{flex-direction:column}}`;
  document.head.appendChild(s);
}
function buildStream(raw){
  const src=streamEmbedUrl(raw),has=Boolean(raw),section=document.createElement('section');section.className='section wrap';section.id='stream';section.dataset.streamKey=raw||'none';
  section.innerHTML=`<div class="section-head"><div><div class="section-kicker">Видео · матч</div><h2 class="section-title">Трансляция</h2></div><div class="section-note">Смотрите матч прямо в матч-центре, не покидая страницу.</div></div><div class="match-stream-shell"><div class="match-stream-frame">${src?`<iframe src="${esc(src)}" title="Трансляция матча" allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock" allowfullscreen></iframe>`:`<div class="match-stream-placeholder"><div><div class="match-stream-play">▶</div><strong>${has?'Трансляция доступна':'Трансляция появится здесь'}</strong><p>${has?'Откройте эфир на площадке трансляции.':'Как только к матчу будет добавлена ссылка на эфир, видео появится здесь автоматически.'}</p>${has?`<a class="match-stream-open" href="${esc(raw)}" target="_blank" rel="noopener noreferrer">Смотреть трансляцию</a>`:''}</div></div>`}</div><div class="match-stream-caption"><span>${has?'Источник трансляции привязан к этому матчу':'Ожидаем ссылку на трансляцию'}</span><span class="match-stream-live">${has?'Видео':'Матч-центр'}</span></div></div>`;
  return section;
}
function ensureStream(){
  installStreamCss();const lines=$('#lines');if(!lines)return;const raw=$('.stream-btn')?.href||'',key=raw||'none';let sec=$('#stream');
  if(!sec||sec.dataset.streamKey!==key){const next=buildStream(raw);if(sec)sec.replaceWith(next);else lines.insertAdjacentElement('afterend',next)}else if(sec.previousElementSibling!==lines)lines.insertAdjacentElement('afterend',sec);
  const nav=$('.section-tabs');if(nav&&!nav.querySelector('a[href="#stream"]')){const a=document.createElement('a');a.href='#stream';a.textContent='Трансляция';nav.appendChild(a)}
}

/* Keep the existing page and video iframe alive while the protocol refreshes. */
function installStableMainUpdates(){
  const main=$('#main');if(!main||main.dataset.stableLiveUpdates==='1')return;
  const desc=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');if(!desc?.get||!desc?.set)return;
  Object.defineProperty(main,'innerHTML',{
    configurable:true,
    get(){return desc.get.call(this)},
    set(value){
      const html=String(value??'');
      if(!this.querySelector('.score-section')){desc.set.call(this,html);return}
      const tpl=document.createElement('template');tpl.innerHTML=html;const next=tpl.content;
      if(!next.querySelector('.score-section')){desc.set.call(this,html);return}
      const y=window.scrollY,oldBehavior=document.documentElement.style.scrollBehavior;
      let changed=false;
      const replace=selector=>{
        const cur=this.querySelector(selector),fresh=next.querySelector(selector);if(!cur||!fresh)return;
        if(cur.outerHTML===fresh.outerHTML)return;
        cur.replaceWith(fresh.cloneNode(true));changed=true;
      };
      replace('.dayrail');
      replace('.score-section');
      replace('#live');
      replace('#rosters');
      replace('#lines');
      if(changed){
        document.documentElement.style.scrollBehavior='auto';
        window.scrollTo(0,y);
        requestAnimationFrame(()=>{window.scrollTo(0,y);requestAnimationFrame(()=>{window.scrollTo(0,y);document.documentElement.style.scrollBehavior=oldBehavior})});
        this.dispatchEvent(new CustomEvent('cup:soft-refresh'));
      }
    }
  });
  main.dataset.stableLiveUpdates='1';
}
installStableMainUpdates();

/* Production LIVE rules. */
let D=null,lastMarkerSig='';const observedCompleted=new Set();
const liveCss=document.createElement('style');liveCss.id='cup-live-rules-css';liveCss.textContent=`
#main{overflow-anchor:none}.main-score-restored{font-size:clamp(58px,8vw,88px);font-weight:950;line-height:.9;letter-spacing:-.07em;margin:12px 0 4px}.main-score-restored.pending{color:#7f90a3}.match-state.preparation{color:#bfe4ff!important}
.live-track.show{display:block!important;position:relative!important;width:190px!important;height:3px!important;margin:10px auto 15px!important;background:rgba(227,31,43,.12)!important;overflow:hidden!important;border-radius:999px!important}.live-track.show:after{content:""!important;position:absolute!important;left:0!important;top:0!important;width:72px!important;height:100%!important;background:linear-gradient(90deg,transparent,#ff4652 18%,#ff4652 82%,transparent)!important;animation:cupLivePingPong 1.45s ease-in-out infinite alternate!important;transform:none}@keyframes cupLivePingPong{from{transform:translateX(0)}to{transform:translateX(118px)}}
.timeline>.cup-system-marker{display:grid!important;grid-template-columns:82px minmax(0,1fr) auto!important;align-items:center!important;gap:14px!important;min-height:72px!important;padding:13px 17px!important;border:1px solid rgba(127,198,255,.15)!important;border-left:4px solid rgba(127,198,255,.6)!important;border-radius:12px!important;background:linear-gradient(90deg,rgba(23,54,78,.78),rgba(8,22,37,.94))!important}.cup-marker-time{font-size:20px;font-weight:950;letter-spacing:-.035em;white-space:nowrap}.cup-marker-label{font-size:13px;font-weight:950;letter-spacing:.07em;text-transform:uppercase}.cup-marker-result{display:flex;align-items:center;justify-content:flex-end;gap:9px;white-space:nowrap}.cup-marker-result img{width:34px;height:34px;object-fit:contain}.cup-marker-result strong{min-width:58px;text-align:center;font-size:19px;font-weight:1000;letter-spacing:-.035em}.cup-system-marker.final{border-left-color:rgba(72,195,139,.8)!important;background:linear-gradient(90deg,rgba(31,82,68,.35),rgba(8,22,37,.96))!important}
@media(max-width:820px){.main-score-restored{font-size:48px}}
@media(max-width:620px){
  .score-card{padding:24px 14px!important}.match-kicker{margin-bottom:18px!important}
  .score-grid{grid-template-columns:minmax(0,1fr) 94px minmax(0,1fr)!important;grid-template-rows:auto auto auto auto!important;gap:8px 10px!important;align-items:center!important}
  .score-center{display:contents!important;min-width:0!important}.score-grid>.score-team:first-child{grid-column:1!important;grid-row:3!important}.score-grid>.score-team:last-child{grid-column:3!important;grid-row:3!important}
  .score-grid .match-state{grid-column:1/-1!important;grid-row:1!important;justify-self:center!important;min-height:18px!important;text-align:center!important}.score-grid .live-track{grid-column:1/-1!important;grid-row:2!important;justify-self:center!important}
  .score-grid .main-score-restored{grid-column:2!important;grid-row:3!important;align-self:center!important;justify-self:center!important;margin:0!important;font-size:50px!important;white-space:nowrap!important}
  .score-grid .period-line{grid-column:1/-1!important;grid-row:4!important;justify-self:center!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;width:min(100%,330px)!important;margin:10px 0 0!important;gap:7px!important}
  .score-grid .period-chip-main{min-width:0!important;width:100%!important;padding:8px 5px!important}.score-grid .period-chip-main span{font-size:7px!important;white-space:nowrap!important}.score-grid .period-chip-main strong{font-size:14px!important}
  .score-grid .score-logo{height:68px!important;margin-bottom:8px!important}.score-grid .score-logo img{max-width:66px!important;max-height:66px!important}.score-grid .score-team h1{max-width:122px!important;margin:0 auto!important;font-size:16px!important;line-height:1.05!important}.score-grid .score-team p{margin-top:5px!important;font-size:9px!important}
  .live-track.show{width:170px!important}.live-track.show:after{width:66px!important}@keyframes cupLivePingPong{from{transform:translateX(0)}to{transform:translateX(104px)}}
  .timeline>.cup-system-marker{grid-template-columns:57px minmax(0,1fr) auto!important;gap:8px!important;min-height:60px!important;padding:10px 11px!important}.cup-marker-time{font-size:16px}.cup-marker-label{font-size:9px;letter-spacing:.045em}.cup-marker-result{gap:5px}.cup-marker-result img{width:27px;height:27px}.cup-marker-result strong{min-width:47px;font-size:15px}
}
@media(max-width:520px){.main-score-restored{font-size:39px}}
@media(max-width:390px){
  .score-grid{grid-template-columns:minmax(0,1fr) 82px minmax(0,1fr)!important;gap:7px!important}.score-grid .main-score-restored{font-size:44px!important}.score-grid .score-logo{height:58px!important}.score-grid .score-logo img{max-width:56px!important;max-height:56px!important}.score-grid .score-team h1{max-width:105px!important;font-size:14px!important}.score-grid .period-line{width:100%!important;gap:5px!important}.score-grid .period-chip-main{padding:7px 3px!important}.score-grid .period-chip-main span{font-size:6.5px!important}.live-track.show{width:156px!important}.live-track.show:after{width:60px!important}@keyframes cupLivePingPong{from{transform:translateX(0)}to{transform:translateX(96px)}}
  .timeline>.cup-system-marker{grid-template-columns:51px minmax(0,1fr) auto!important;gap:6px!important}.cup-marker-label{font-size:8px}.cup-marker-result img{width:24px;height:24px}.cup-marker-result strong{font-size:14px;min-width:42px}
}
`;document.head.appendChild(liveCss);
function scheduledStart(){const m=D?.match,t=String(m?.start_time||'').slice(0,5);return m?.game_date&&/^\d{2}:\d{2}$/.test(t)?Date.parse(`${m.game_date}T${t}:00+03:00`):NaN}
function finalState(){const m=D?.match,l=D?.live,db=String(m?.fhr_live_state||'').toUpperCase();return l?.status==='FINAL'||Boolean(m?.fhr_live_final_at)||db==='FINAL'}
function activeState(){if(finalState())return false;const start=scheduledStart();if(Number.isFinite(start)&&Date.now()<start)return false;const m=D?.match,l=D?.live,db=String(m?.fhr_live_state||'').toUpperCase();return l?.status==='ACTIVE'||['WATCHING','ERROR'].includes(db)}
function applyPregame(){
  const el=$('.match-state');if(!el||!D)return;const start=scheduledStart(),now=Date.now();
  if(!finalState()&&Number.isFinite(start)&&now>=start-15*60*1000&&now<start){el.textContent='ПОДГОТОВКА К МАТЧУ';el.classList.remove('live');el.classList.add('preparation')}
  else el.classList.remove('preparation');
}
function teamLogos(){const xs=[...document.querySelectorAll('.score-team .score-logo img')].map(x=>x.src).filter(Boolean);return[xs[0]||'',xs[1]||'']}
function periodPair(i){
  const l=D?.live||{},m=D?.match||{},p=Array.isArray(l.period_scores?.[i])?l.period_scores[i]:null;
  if(p&&Number.isInteger(p[0])&&Number.isInteger(p[1]))return l.orientation==='reverse'?[p[1],p[0]]:[p[0],p[1]];
  const fb=[[m.p1_home,m.p1_away],[m.p2_home,m.p2_away],[m.p3_home,m.p3_away],[m.ot_home,m.ot_away],[m.so_home,m.so_away]][i];return fb&&Number.isInteger(fb[0])&&Number.isInteger(fb[1])?fb:null;
}
function totalThrough(n){let h=0,a=0,found=false;for(let i=0;i<n;i++){const p=periodPair(i);if(!p)continue;h+=p[0];a+=p[1];found=true}return found?[h,a]:null}
function finalPair(){const m=D?.match||{},l=D?.live||{};if(Number.isInteger(m.home_score)&&Number.isInteger(m.away_score))return[m.home_score,m.away_score];if(Array.isArray(l.headline_score)&&Number.isInteger(l.headline_score[0])&&Number.isInteger(l.headline_score[1]))return l.orientation==='reverse'?[l.headline_score[1],l.headline_score[0]]:[l.headline_score[0],l.headline_score[1]];return totalThrough(5)}
function finishSuffix(){const ft=String(D?.match?.finish_type||'').toUpperCase(),txt=String(D?.live?.status_text||'');if(ft==='SO'||/буллит/i.test(txt))return'Б';if(ft==='OT'||/овертайм/i.test(txt))return'ОТ';return''}
function marker(kind,time,label,pair=null,suffix=''){
  const [hl,al]=teamLogos(),el=document.createElement('article');el.className=`event-card cup-system-marker ${kind}`;const score=pair?`${pair[0]}:${pair[1]}${suffix?` ${suffix}`:''}`:'';
  el.innerHTML=`<div class="cup-marker-time">${esc(time)}</div><div class="cup-marker-label">${esc(label)}</div><div class="cup-marker-result">${hl?`<img src="${esc(hl)}" alt="">`:''}${pair?`<strong>${esc(score)}</strong>`:''}${al?`<img src="${esc(al)}" alt="">`:''}</div>`;return el;
}
function cardPeriod(card){const t=String(card.querySelector('.event-time span')?.textContent||'').toUpperCase();if(/БУЛ/.test(t))return 5;if(/\bОТ\b|ОВЕРТАЙМ/.test(t))return 4;const m=t.match(/([1-3])/);return m?Number(m[1]):0}
function detectedCompleted(){
  const l=D?.live||{},raw=String(l.current_period||'1').toUpperCase(),txt=String(l.status_text||''),ft=String(D?.match?.finish_type||'').toUpperCase();let out=[];
  if(finalState()){out=ft==='OT'||ft==='SO'?[1,2,3]:[1,2];if(ft==='SO')out.push(4)}
  else if(raw==='SO')out=[1,2,3,4];else if(raw==='OT')out=[1,2,3];else{const n=Number(raw);if(Number.isInteger(n)&&n>=1){for(let p=1;p<n;p++)out.push(p);if(/перерыв/i.test(txt)&&n<=3)out.push(n)}}
  out.forEach(p=>observedCompleted.add(p));return[...observedCompleted].sort((a,b)=>a-b);
}
function ensureTimeline(){let t=$('#live .timeline');if(t)return t;if(!activeState()&&!finalState())return null;const empty=$('#live .empty');if(!empty)return null;t=document.createElement('div');t.className='timeline';empty.replaceWith(t);return t}
function applyMarkers(){
  if(!D)return;const timeline=ensureTimeline();if(!timeline)return;const periods=detectedCompleted(),fin=finalState(),base=[...timeline.querySelectorAll(':scope > .event-card:not(.cup-system-marker)')];
  const sig=[base.map(c=>c.textContent).join('|'),periods.join(','),fin,JSON.stringify(D.live?.period_scores||[]),D.match?.home_score,D.match?.away_score,D.match?.finish_type].join('::');if(sig===lastMarkerSig&&timeline.querySelector('.cup-system-marker'))return;lastMarkerSig=sig;
  timeline.querySelectorAll(':scope > .cup-system-marker').forEach(x=>x.remove());const cards=[...timeline.querySelectorAll(':scope > .event-card:not(.cup-system-marker)')];
  for(const p of periods){const isOT=p===4,time=isOT?'60:00':`${p*20}:00`,label=isOT?'КОНЕЦ ОВЕРТАЙМА':`КОНЕЦ ${p} ПЕРИОДА`,mk=marker('period',time,label,totalThrough(p)),ref=cards.find(c=>cardPeriod(c)===p);if(ref)timeline.insertBefore(mk,ref);else timeline.appendChild(mk)}
  if(fin)timeline.prepend(marker('final','60:00','КОНЕЦ МАТЧА',finalPair(),finishSuffix()));
  if(activeState()||fin)timeline.appendChild(marker('start','00:00','НАЧАЛО МАТЧА'));
}
async function refreshRules(){if(!Number.isInteger(matchId)||matchId<1)return;try{const r=await fetch(`${EDGE}?match_id=${matchId}&_=${Date.now()}`,{cache:'no-store'}),b=await r.json();if(r.ok){D=b;applyPregame();applyMarkers()}}catch{}}

function applyLayout(){normalizeExtraPeriods();ensureMainScore();ensureStream();applyPregame();applyMarkers()}
let queued=false;const main=$('#main');if(main){new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;applyLayout()})}).observe(main,{childList:true});main.addEventListener('cup:soft-refresh',()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;applyLayout()})})}
setInterval(()=>{applyPregame();applyMarkers()},1000);setInterval(refreshRules,12000);applyLayout();refreshRules();

/* Existing approved goal / penalty / line-up enhancements. */
function loadScript(src,key){if(document.querySelector(`script[data-${key}]`))return;const s=document.createElement('script');s.src=src;s.async=true;s.setAttribute(`data-${key}`,'1');document.body.appendChild(s)}
function loadGoalV2(){if(document.querySelector('script[data-goal-animation-v2]'))return;const g=document.createElement('script');g.src='/goal-animation-v2.js?v=20260909-1';g.async=true;g.dataset.goalAnimationV2='1';document.body.appendChild(g)}
loadScript('/match-penalty-animation.js?v=20260910-3','match-penalty-animation');loadScript('/match-lineups-live.js?v=20260910-3','match-lineups-live');
const existing=document.querySelector('script[data-match-event-ui]');if(!existing){const s=document.createElement('script');s.src='/match-event-ui.js?v=20260909-3';s.async=true;s.dataset.matchEventUi='1';s.onload=loadGoalV2;document.body.appendChild(s)}else if(existing.dataset.loaded==='1')loadGoalV2();else{existing.addEventListener('load',loadGoalV2,{once:true});setTimeout(loadGoalV2,1000)}
})();