(()=>{
  const KEY='russianCup.favoriteTeamId';
  const LOGOS={
    'Динамо Москва':'https://drive.google.com/thumbnail?id=1I3KuJZEajmksDKtoBsdj4h_75fU0e_KY&sz=w512','МАХ':'https://drive.google.com/thumbnail?id=1Veii4NYgKc06nRtxKmCRQv1YCE164YZP&sz=w512','Торпедо':'https://drive.google.com/thumbnail?id=17NYLCFaSrX6q4g0T7jhBnmidrI1JzKl9&sz=w512','Локомотив':'https://drive.google.com/thumbnail?id=1D6wJnaawN4kMt-1ZWTSvf-trYkslzyKi&sz=w512','Авангард':'https://drive.google.com/thumbnail?id=1y6CZfZSXYDVqCAjOvv6xB_7Fwu1AQwvn&sz=w512','Локомотив 2004':'https://drive.google.com/thumbnail?id=1sq7UHtBq_xiexekxmzWawF3yVTaEl-J-&sz=w512','Крылья Советов':'https://drive.google.com/thumbnail?id=1n6ViHZhkRvq_R_Ul1PEHnFnX7HVNk6-p&sz=w512','Сибирь':'https://drive.google.com/thumbnail?id=1Xul8VXC7juk2NHQfb28Cl9Jt_Kj0Obw-&sz=w512','Лада':'https://drive.google.com/thumbnail?id=15mcwMoXT7OaH46jj8w90PCeTtJY54UAF&sz=w512','Трактор':'https://drive.google.com/thumbnail?id=1qWTRWy-p36RDSMlAy4AqA60PrrUTaczd&sz=w512','Ак Барс':'https://drive.google.com/thumbnail?id=1I09r6XwD-9L4r5ojPGKCHsJ5WGUyOFy1&sz=w512','Спартак':'https://drive.google.com/thumbnail?id=19kJ3uz-yyb1Z2y8qvRbFwuw_2kjUUD2f&sz=w512','Динамо СПБ':'https://drive.google.com/thumbnail?id=1x4KaAFMJ_qfmi26oVjnsc-huKpWtqBbh&sz=w512','СКА-Стрельна':'https://drive.google.com/thumbnail?id=1DH_sKpyVZsh6vnt8Q1_ovBpDuVkPHrNh&sz=w512','АКМ':'https://drive.google.com/thumbnail?id=1NmPj1OwI3C1yuNmgt2XX57HbEiiDauB7&sz=w512','ЦСКА':'https://drive.google.com/thumbnail?id=1bT6o4afTqonyA05keLbe_nfQ78sAmNda&sz=w512','Армия СКА':'https://drive.google.com/thumbnail?id=14XZX2FRyR5x_aVkU2SMLhW-Emk0RUkTo&sz=w512','Нефтехимик':'https://drive.google.com/thumbnail?id=1csEdtjesEvgAFSsfnfhmWUnUE23Tnqeg&sz=w512','Северсталь':'https://drive.google.com/thumbnail?id=10xBTOFy_ps1G3LNaHV3WpbQkuZ74pjRn&sz=w512','Красная Машина Юниор':'https://drive.google.com/thumbnail?id=1qATM0WxWDCgYfemDQvhdy30Ub0sWSWWV&sz=w512'
  };
  const style=document.createElement('style');
  style.textContent=`
    .favorite-team-btn{margin-top:14px;min-height:42px;padding:0 15px;border:1px solid rgba(126,190,255,.18);border-radius:5px;background:rgba(255,255,255,.035);color:#e8f1fb;font-weight:900;font-size:10px;text-transform:uppercase;letter-spacing:.07em;cursor:pointer}.favorite-team-btn.active{border-color:rgba(72,195,139,.34);background:rgba(72,195,139,.10);color:#a6e8ca}
    #my-team-section{padding-top:24px;padding-bottom:22px}.my-team-card{display:grid;grid-template-columns:160px minmax(0,1fr) 300px;gap:22px;align-items:center;padding:24px 26px;border:1px solid rgba(126,190,255,.13);border-radius:7px;background:linear-gradient(115deg,rgba(35,135,217,.09),rgba(8,24,40,.94) 45%,rgba(227,31,43,.045));box-shadow:0 20px 60px rgba(0,0,0,.22)}.my-team-logo-wrap{display:grid;place-items:center;width:140px;height:140px;border-radius:50%;border:1px solid rgba(126,190,255,.11);background:rgba(126,190,255,.04)}.my-team-logo{max-width:100px;max-height:100px;object-fit:contain}.my-team-kicker{font-size:9px;text-transform:uppercase;letter-spacing:.17em;font-weight:950;color:#7fc6ff}.my-team-kicker:before{content:'// ';color:#e31f2b}.my-team-name{margin:7px 0 8px;font-size:clamp(30px,4vw,52px);line-height:.93;text-transform:uppercase;letter-spacing:-.05em}.my-team-meta{color:#8fa1b5;font-size:11px;text-transform:uppercase;letter-spacing:.07em}.my-team-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}.my-team-action{display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:0 13px;border-radius:4px;border:1px solid rgba(126,190,255,.12);background:rgba(255,255,255,.025);font-size:9px;text-transform:uppercase;letter-spacing:.07em;font-weight:900}.my-team-action.primary{background:#2387d9;border-color:#2387d9;color:#fff}.my-team-next{padding:18px;border:1px solid rgba(126,190,255,.10);border-radius:5px;background:rgba(3,15,26,.34)}.my-team-next small{display:block;color:#71869b;font-size:8px;text-transform:uppercase;letter-spacing:.12em;font-weight:900}.my-team-next strong{display:block;margin-top:7px;font-size:16px}.my-team-next-opponent{display:flex;align-items:center;gap:10px;margin-top:13px;font-weight:900;font-size:12px}.my-team-next-opponent img{width:36px;height:36px;object-fit:contain}.my-team-next-meta{margin-top:10px;color:#8194a8;font-size:10px;line-height:1.5}.my-team-empty{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:20px 22px;border:1px dashed rgba(126,190,255,.15);border-radius:6px;background:rgba(7,22,36,.48)}.my-team-empty span{display:block;margin-top:4px;color:#8295a9;font-size:11px}
    @media(max-width:900px){.my-team-card{grid-template-columns:120px minmax(0,1fr)}.my-team-logo-wrap{width:110px;height:110px}.my-team-logo{max-width:82px;max-height:82px}.my-team-next{grid-column:1/-1}}@media(max-width:620px){.my-team-card{grid-template-columns:80px minmax(0,1fr);padding:17px 13px;gap:11px}.my-team-logo-wrap{width:74px;height:74px}.my-team-logo{max-width:56px;max-height:56px}.my-team-name{font-size:29px}.my-team-empty{flex-direction:column;align-items:flex-start}.favorite-team-btn{width:100%}}
  `;
  document.head.appendChild(style);

  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const getFavorite=()=>Number(localStorage.getItem(KEY))||null;
  const setFavorite=id=>{localStorage.setItem(KEY,String(id));window.dispatchEvent(new CustomEvent('favorite-team-change',{detail:{teamId:Number(id)}}))};
  const done=m=>Number.isInteger(m?.home_score)&&Number.isInteger(m?.away_score)&&m.home_score!==m.away_score;
  const time=m=>String(m?.start_time||'').slice(0,5);
  const logo=t=>t?.logo_url||LOGOS[t?.name]||'';
  const fmtDate=d=>{try{return new Date(d+'T12:00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long'})}catch{return d||'—'}};
  const data=()=>{try{return typeof D!=='undefined'&&D?.teams?D:null}catch{return null}};

  function setupTeamPage(){
    const socials=document.querySelector('#socials');if(!socials||document.querySelector('#favoriteTeamBtn'))return;
    const id=Number(new URL(location.href).searchParams.get('team'));if(!id)return;
    const b=document.createElement('button');b.id='favoriteTeamBtn';b.type='button';b.className='favorite-team-btn';
    const paint=()=>{const active=getFavorite()===id;b.classList.toggle('active',active);b.textContent=active?'★ Моя команда':'☆ Следить за командой';b.setAttribute('aria-pressed',String(active))};
    b.onclick=()=>{setFavorite(id);paint()};socials.insertAdjacentElement('afterend',b);paint();window.addEventListener('favorite-team-change',paint)
  }

  function getSection(){let s=document.querySelector('#my-team-section');if(s)return s;const upcoming=document.querySelector('#upcoming');if(!upcoming)return null;s=document.createElement('section');s.id='my-team-section';s.className='wrap';upcoming.insertAdjacentElement('beforebegin',s);return s}
  function renderHome(){
    const d=data(),s=getSection();if(!d||!s)return;
    const team=d.teams.find(t=>Number(t.id)===Number(getFavorite()));
    if(!team){s.innerHTML='<div class="my-team-empty"><div><strong>Выберите свою команду</strong><span>Сайт будет показывать её ближайший матч прямо на главной.</span></div><a class="my-team-action primary" href="/teams.html">Выбрать команду</a></div>';return}
    const mem=d.memberships?.find(x=>Number(x.team_id)===Number(team.id)),g=d.groups?.find(x=>Number(x.id)===Number(mem?.group_id));
    const m=[...(d.matches||[])].filter(x=>!done(x)&&[Number(x.home_team_id),Number(x.away_team_id)].includes(Number(team.id))).sort((a,b)=>String(a.game_date||'').localeCompare(String(b.game_date||''))||time(a).localeCompare(time(b))||((a.game_no||0)-(b.game_no||0)))[0];
    let next='<div class="my-team-next"><small>Ближайший матч</small><strong>Матч пока не опубликован</strong></div>';
    if(m){const oppId=Number(m.home_team_id)===Number(team.id)?m.away_team_id:m.home_team_id,opp=d.teams.find(t=>Number(t.id)===Number(oppId)),place=[m.city,m.arena].filter(Boolean).join(' · ');next=`<a class="my-team-next" href="/?match=${m.id}"><small>Ближайший матч</small><strong>${fmtDate(m.game_date)} · ${time(m)||'время уточняется'}</strong><div class="my-team-next-opponent">${opp&&logo(opp)?`<img src="${esc(logo(opp))}" alt="">`:''}<span>${esc(opp?.name||'Соперник уточняется')}</span></div><div class="my-team-next-meta">${esc(place||'Место уточняется')} · матч №${m.game_no??'—'}</div></a>`}
    const src=logo(team);s.innerHTML=`<article class="my-team-card"><div class="my-team-logo-wrap">${src?`<img class="my-team-logo" src="${esc(src)}" alt="Логотип ${esc(team.name)}">`:''}</div><div><div class="my-team-kicker">Моя команда</div><h2 class="my-team-name">${esc(team.name)}</h2><div class="my-team-meta">${g?`Группа ${esc(g.code||g.name||'')}`:'Участник турнира'}</div><div class="my-team-actions"><a class="my-team-action primary" href="/team.html?team=${team.id}">Страница команды</a><a class="my-team-action" href="#matches">Все матчи</a><a class="my-team-action" href="/teams.html">Сменить команду</a></div></div>${next}</article>`
  }

  setupTeamPage();
  if(document.querySelector('#upcoming')){
    let attempts=0;const wait=setInterval(()=>{attempts++;if(data()){clearInterval(wait);renderHome()}else if(attempts>80)clearInterval(wait)},250);
    setInterval(()=>{if(data())renderHome()},15000);
    window.addEventListener('favorite-team-change',renderHome);
    window.addEventListener('storage',e=>{if(e.key===KEY)renderHome()});
  }
})();