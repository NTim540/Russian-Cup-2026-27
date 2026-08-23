(()=>{
  const KEY='russianCup.favoriteTeamId';
  const LOGOS={
    'Динамо Москва':'https://drive.google.com/thumbnail?id=1I3KuJZEajmksDKtoBsdj4h_75fU0e_KY&sz=w512','МАХ':'https://drive.google.com/thumbnail?id=1Veii4NYgKc06nRtxKmCRQv1YCE164YZP&sz=w512','Торпедо':'https://drive.google.com/thumbnail?id=17NYLCFaSrX6q4g0T7jhBnmidrI1JzKl9&sz=w512','Локомотив':'https://drive.google.com/thumbnail?id=1D6wJnaawN4kMt-1ZWTSvf-trYkslzyKi&sz=w512','Авангард':'https://drive.google.com/thumbnail?id=1y6CZfZSXYDVqCAjOvv6xB_7Fwu1AQwvn&sz=w512','Локомотив 2004':'https://drive.google.com/thumbnail?id=1sq7UHtBq_xiexekxmzWawF3yVTaEl-J-&sz=w512','Крылья Советов':'https://drive.google.com/thumbnail?id=1n6ViHZhkRvq_R_Ul1PEHnFnX7HVNk6-p&sz=w512','Сибирь':'https://drive.google.com/thumbnail?id=1Xul8VXC7juk2NHQfb28Cl9Jt_Kj0Obw-&sz=w512','Лада':'https://drive.google.com/thumbnail?id=15mcwMoXT7OaH46jj8w90PCeTtJY54UAF&sz=w512','Трактор':'https://drive.google.com/thumbnail?id=1qWTRWy-p36RDSMlAy4AqA60PrrUTaczd&sz=w512','Ак Барс':'https://drive.google.com/thumbnail?id=1I09r6XwD-9L4r5ojPGKCHsJ5WGUyOFy1&sz=w512','Спартак':'https://drive.google.com/thumbnail?id=19kJ3uz-yyb1Z2y8qvRbFwuw_2kjUUD2f&sz=w512','Динамо СПБ':'https://drive.google.com/thumbnail?id=1x4KaAFMJ_qfmi26oVjnsc-huKpWtqBbh&sz=w512','СКА-Стрельна':'https://drive.google.com/thumbnail?id=1DH_sKpyVZsh6vnt8Q1_ovBpDuVkPHrNh&sz=w512','АКМ':'https://drive.google.com/thumbnail?id=1NmPj1OwI3C1yuNmgt2XX57HbEiiDauB7&sz=w512','ЦСКА':'https://drive.google.com/thumbnail?id=1bT6o4afTqonyA05keLbe_nfQ78sAmNda&sz=w512','Армия СКА':'https://drive.google.com/thumbnail?id=14XZX2FRyR5x_aVkU2SMLhW-Emk0RUkTo&sz=w512','Нефтехимик':'https://drive.google.com/thumbnail?id=1csEdtjesEvgAFSsfnfhmWUnUE23Tnqeg&sz=w512','Северсталь':'https://drive.google.com/thumbnail?id=10xBTOFy_ps1G3LNaHV3WpbQkuZ74pjRn&sz=w512','Красная Машина Юниор':'https://drive.google.com/thumbnail?id=1qATM0WxWDCgYfemDQvhdy30Ub0sWSWWV&sz=w512'
  };
  const style=document.createElement('style');
  style.id='my-team-style';
  style.textContent=`
    .favorite-team-btn{margin-top:14px;min-height:42px;padding:0 15px;border:1px solid rgba(126,190,255,.18);border-radius:5px;background:rgba(255,255,255,.035);color:#e8f1fb;font-weight:900;font-size:10px;text-transform:uppercase;letter-spacing:.07em;cursor:pointer;transition:.16s ease}.favorite-team-btn:hover{transform:translateY(-1px);border-color:rgba(35,135,217,.52);background:rgba(35,135,217,.10)}.favorite-team-btn.active{border-color:rgba(72,195,139,.34);background:rgba(72,195,139,.10);color:#a6e8ca;cursor:default}.favorite-team-btn.active:hover{transform:none}
    #my-team-section{padding-top:24px;padding-bottom:22px}.my-team-card{position:relative;display:grid;grid-template-columns:190px minmax(0,1fr) 310px;gap:24px;align-items:center;padding:25px 28px;border:1px solid rgba(126,190,255,.13);border-radius:7px;background:linear-gradient(115deg,rgba(35,135,217,.09),rgba(8,24,40,.94) 45%,rgba(227,31,43,.045));overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.22)}.my-team-card:after{content:'MY TEAM';position:absolute;right:18px;top:-20px;font-size:76px;font-weight:950;letter-spacing:-.06em;color:rgba(126,190,255,.035);pointer-events:none}.my-team-logo-wrap{position:relative;z-index:1;display:grid;place-items:center;width:160px;height:160px;border-radius:50%;border:1px solid rgba(126,190,255,.11);background:radial-gradient(circle,rgba(126,190,255,.07),rgba(4,17,29,.25));box-shadow:0 0 0 22px rgba(126,190,255,.016)}.my-team-logo{max-width:118px;max-height:118px;object-fit:contain;filter:drop-shadow(0 12px 22px rgba(0,0,0,.35))}.my-team-copy{position:relative;z-index:1;min-width:0}.my-team-kicker{font-size:9px;text-transform:uppercase;letter-spacing:.17em;font-weight:950;color:#7fc6ff}.my-team-kicker:before{content:'// ';color:#e31f2b}.my-team-name{margin:7px 0 8px;font-size:clamp(30px,4vw,54px);line-height:.93;text-transform:uppercase;letter-spacing:-.05em}.my-team-meta{color:#8fa1b5;font-size:11px;text-transform:uppercase;letter-spacing:.07em}.my-team-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:17px}.my-team-action{display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:0 13px;border-radius:4px;border:1px solid rgba(126,190,255,.12);background:rgba(255,255,255,.025);font-size:9px;text-transform:uppercase;letter-spacing:.07em;font-weight:900}.my-team-action.primary{background:#2387d9;border-color:#2387d9;color:#fff}.my-team-action:hover{filter:brightness(1.08)}.my-team-next{position:relative;z-index:1;padding:18px;border:1px solid rgba(126,190,255,.10);border-radius:5px;background:rgba(3,15,26,.34)}.my-team-next small{display:block;color:#71869b;font-size:8px;text-transform:uppercase;letter-spacing:.12em;font-weight:900}.my-team-next strong{display:block;margin-top:7px;font-size:16px}.my-team-next-opponent{display:flex;align-items:center;gap:10px;margin-top:13px;font-weight:900;font-size:12px}.my-team-next-opponent img{width:36px;height:36px;object-fit:contain}.my-team-next-meta{margin-top:10px;color:#8194a8;font-size:10px;line-height:1.5}.my-team-empty{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:20px 22px;border:1px dashed rgba(126,190,255,.15);border-radius:6px;background:rgba(7,22,36,.48)}.my-team-empty strong{font-size:16px}.my-team-empty span{display:block;margin-top:4px;color:#8295a9;font-size:11px}
    html[data-theme='light'] .favorite-team-btn{background:#fff;color:#20354d;border-color:rgba(20,45,80,.12)}html[data-theme='light'] .favorite-team-btn.active{background:rgba(72,195,139,.09);color:#267653}html[data-theme='light'] .my-team-card{background:linear-gradient(115deg,#f2f8fd,#fff 52%,#fdf4f5);border-color:rgba(20,45,80,.10);color:#102139}html[data-theme='light'] .my-team-next{background:#f6f9fc;border-color:rgba(20,45,80,.08)}html[data-theme='light'] .my-team-empty{background:#fff;color:#102139;border-color:rgba(20,45,80,.12)}
    @media(max-width:900px){.my-team-card{grid-template-columns:140px minmax(0,1fr);gap:18px}.my-team-logo-wrap{width:125px;height:125px}.my-team-logo{max-width:92px;max-height:92px}.my-team-next{grid-column:1/-1}}
    @media(max-width:620px){#my-team-section{padding-top:14px}.my-team-card{grid-template-columns:90px minmax(0,1fr);padding:18px 14px;gap:12px}.my-team-card:after{font-size:44px}.my-team-logo-wrap{width:82px;height:82px;box-shadow:none}.my-team-logo{max-width:62px;max-height:62px}.my-team-name{font-size:30px}.my-team-actions{margin-top:12px}.my-team-action{min-height:37px;font-size:8px;padding:0 10px}.my-team-next{padding:14px}.my-team-empty{align-items:flex-start;flex-direction:column}.favorite-team-btn{width:100%}}
  `;
  document.head.appendChild(style);

  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const getFavorite=()=>Number(localStorage.getItem(KEY))||null;
  const setFavorite=id=>{localStorage.setItem(KEY,String(id));window.dispatchEvent(new CustomEvent('favorite-team-change',{detail:{teamId:Number(id)}}))};
  const logo=t=>t?.logo_url||LOGOS[t?.name]||'';
  const done=m=>Number.isInteger(m?.home_score)&&Number.isInteger(m?.away_score)&&m.home_score!==m.away_score;
  const time=m=>String(m?.start_time||'').slice(0,5);
  const fmtDate=d=>{try{return new Date(d+'T12:00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long'})}catch{return d||'—'}};

  function setupTeamPage(){
    const copy=document.querySelector('.team-copy'),socials=document.querySelector('#socials');if(!copy||!socials)return;
    if(document.querySelector('#favoriteTeamBtn'))return;
    const id=Number(new URL(location.href).searchParams.get('team'));if(!id)return;
    const b=document.createElement('button');b.id='favoriteTeamBtn';b.type='button';b.className='favorite-team-btn';
    function paint(){const active=getFavorite()===id;b.classList.toggle('active',active);b.textContent=active?'★ Моя команда':'☆ Следить за командой';b.setAttribute('aria-pressed',String(active))}
    b.addEventListener('click',()=>{if(getFavorite()===id)return;setFavorite(id);paint()});
    socials.insertAdjacentElement('afterend',b);paint();window.addEventListener('favorite-team-change',paint);
  }

  function currentData(){try{return typeof D!=='undefined'&&D?.teams?D:null}catch{return null}}
  function groupFor(team,data){const mem=data.memberships?.find(m=>Number(m.team_id)===Number(team.id));return data.groups?.find(g=>Number(g.id)===Number(mem?.group_id))||null}
  function nextMatch(team,data){return [...(data.matches||[])].filter(m=>!done(m)&&[Number(m.home_team_id),Number(m.away_team_id)].includes(Number(team.id))).sort((a,b)=>String(a.game_date||'').localeCompare(String(b.game_date||''))||time(a).localeCompare(time(b))||((a.game_no||0)-(b.game_no||0)))[0]||null}
  function section(){
    let s=document.querySelector('#my-team-section');if(s)return s;
    const upcoming=document.querySelector('#upcoming');if(!upcoming)return null;
    s=document.createElement('section');s.id='my-team-section';s.className='wrap reveal';upcoming.insertAdjacentElement('beforebegin',s);return s;
  }
  function renderHome(){
    const s=section(),data=currentData();if(!s||!data)return;
    const id=getFavorite(),team=data.teams.find(t=>Number(t.id)===Number(id));
    if(!team){s.innerHTML=`<div class="my-team-empty"><div><strong>Выберите свою команду</strong><span>Сайт будет показывать её ближайший матч прямо на главной.</span></div><a class="my-team-action primary" href="/teams.html">Выбрать команду</a></div>`;return}
    const g=groupFor(team,data),m=nextMatch(team,data),src=logo(team);
    let next='<div class="my-team-next"><small>Ближайший матч</small><strong>Расписание текущего тура завершено</strong><div class="my-team-next-meta">Следующий матч появится после публикации календаря нового этапа.</div></div>';
    if(m){const oppId=Number(m.home_team_id)===Number(team.id)?m.away_team_id:m.home_team_id,opp=data.teams.find(t=>Number(t.id)===Number(oppId)),place=[m.city,m.arena].filter(Boolean).join(' · ');next=`<a class="my-team-next" href="/?match=${m.id}"><small>Ближайший матч</small><strong>${fmtDate(m.game_date)} · ${time(m)||'время уточняется'}</strong><div class="my-team-next-opponent">${opp&&logo(opp)?`<img src="${esc(logo(opp))}" alt="">`:''}<span>${esc(opp?.name||'Соперник уточняется')}</span></div><div class="my-team-next-meta">${esc(place||'Место уточняется')} · матч №${m.game_no??'—'}</div></a>`}
    s.innerHTML=`<article class="my-team-card"><div class="my-team-logo-wrap">${src?`<img class="my-team-logo" src="${esc(src)}" alt="Логотип ${esc(team.name)}">`:''}</div><div class="my-team-copy"><div class="my-team-kicker">Моя команда</div><h2 class="my-team-name">${esc(team.name)}</h2><div class="my-team-meta">${g?`Группа ${esc(g.code||g.name||'')}`:'Участник турнира'}</div><div class="my-team-actions"><a class="my-team-action primary" href="/team.html?team=${team.id}">Страница команды</a><a class="my-team-action" href="#matches">Все матчи</a><a class="my-team-action" href="/teams.html">Сменить команду</a></div></div>${next}</article>`;
  }

  setupTeamPage();
  if(document.querySelector('#upcoming')){
    let tries=0;const timer=setInterval(()=>{tries++;if(currentData()){renderHome();if(tries>4)clearInterval(timer)}else if(tries>80)clearInterval(timer)},250);
    new MutationObserver(()=>{if(currentData())renderHome()}).observe(document.body,{childList:true,subtree:true});
    window.addEventListener('favorite-team-change',renderHome);
    window.addEventListener('storage',e=>{if(e.key===KEY)renderHome()});
  }
})();