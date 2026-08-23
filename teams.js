(()=>{
  const API='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup';
  const TEAM_LOGOS={
    'Динамо Москва':'https://drive.google.com/thumbnail?id=1I3KuJZEajmksDKtoBsdj4h_75fU0e_KY&sz=w512',
    'МАХ':'https://drive.google.com/thumbnail?id=1Veii4NYgKc06nRtxKmCRQv1YCE164YZP&sz=w512',
    'Торпедо':'https://drive.google.com/thumbnail?id=17NYLCFaSrX6q4g0T7jhBnmidrI1JzKl9&sz=w512',
    'Локомотив':'https://drive.google.com/thumbnail?id=1D6wJnaawN4kMt-1ZWTSvf-trYkslzyKi&sz=w512',
    'Авангард':'https://drive.google.com/thumbnail?id=1y6CZfZSXYDVqCAjOvv6xB_7Fwu1AQwvn&sz=w512',
    'Локомотив 2004':'https://drive.google.com/thumbnail?id=1sq7UHtBq_xiexekxmzWawF3yVTaEl-J-&sz=w512',
    'Крылья Советов':'https://drive.google.com/thumbnail?id=1n6ViHZhkRvq_R_Ul1PEHnFnX7HVNk6-p&sz=w512',
    'Сибирь':'https://drive.google.com/thumbnail?id=1Xul8VXC7juk2NHQfb28Cl9Jt_Kj0Obw-&sz=w512',
    'Лада':'https://drive.google.com/thumbnail?id=15mcwMoXT7OaH46jj8w90PCeTtJY54UAF&sz=w512',
    'Трактор':'https://drive.google.com/thumbnail?id=1qWTRWy-p36RDSMlAy4AqA60PrrUTaczd&sz=w512',
    'Ак Барс':'https://drive.google.com/thumbnail?id=1I09r6XwD-9L4r5ojPGKCHsJ5WGUyOFy1&sz=w512',
    'Спартак':'https://drive.google.com/thumbnail?id=19kJ3uz-yyb1Z2y8qvRbFwuw_2kjUUD2f&sz=w512',
    'Динамо СПБ':'https://drive.google.com/thumbnail?id=1x4KaAFMJ_qfmi26oVjnsc-huKpWtqBbh&sz=w512',
    'СКА-Стрельна':'https://drive.google.com/thumbnail?id=1DH_sKpyVZsh6vnt8Q1_ovBpDuVkPHrNh&sz=w512',
    'АКМ':'https://drive.google.com/thumbnail?id=1NmPj1OwI3C1yuNmgt2XX57HbEiiDauB7&sz=w512',
    'ЦСКА':'https://drive.google.com/thumbnail?id=1bT6o4afTqonyA05keLbe_nfQ78sAmNda&sz=w512',
    'Армия СКА':'https://drive.google.com/thumbnail?id=14XZX2FRyR5x_aVkU2SMLhW-Emk0RUkTo&sz=w512',
    'Нефтехимик':'https://drive.google.com/thumbnail?id=1csEdtjesEvgAFSsfnfhmWUnUE23Tnqeg&sz=w512',
    'Северсталь':'https://drive.google.com/thumbnail?id=10xBTOFy_ps1G3LNaHV3WpbQkuZ74pjRn&sz=w512',
    'Красная Машина Юниор':'https://drive.google.com/thumbnail?id=1qATM0WxWDCgYfemDQvhdy30Ub0sWSWWV&sz=w512'
  };
  const TEAM_CITIES={
    'Динамо Москва':'Москва','МАХ':'Москва','Торпедо':'Нижний Новгород','Локомотив':'Ярославль','Авангард':'Омск',
    'Локомотив 2004':'Ярославль','Крылья Советов':'Москва','Сибирь':'Новосибирск','Лада':'Тольятти','Трактор':'Челябинск',
    'Ак Барс':'Казань','Спартак':'Москва','Динамо СПБ':'Санкт-Петербург','СКА-Стрельна':'Санкт-Петербург','АКМ':'Новомосковск',
    'ЦСКА':'Москва','Армия СКА':'Санкт-Петербург','Нефтехимик':'Нижнекамск','Северсталь':'Череповец','Красная Машина Юниор':'Красногорск'
  };
  const $=s=>document.querySelector(s);
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  async function get(path){const r=await fetch(API+path,{cache:'no-store'});if(!r.ok)throw Error(await r.text());return r.json()}
  function initials(name){return name.split(/\s+/).map(x=>x[0]).join('').slice(0,3).toUpperCase()}
  function card(team){const logo=team.logo_url||TEAM_LOGOS[team.name],city=team.city||TEAM_CITIES[team.name]||'Город уточняется';return `
    <a class="team-card" data-team-id="${team.id}" href="/team.html?team=${team.id}" aria-label="Открыть страницу команды ${esc(team.name)}">
      <div class="team-logo-wrap">
        ${logo?`<img class="team-logo" src="${logo}" alt="Логотип ${esc(team.name)}" loading="lazy" decoding="async" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">`:''}
        <div class="team-logo-fallback" style="${logo?'':'display:grid'}">${esc(initials(team.name))}</div>
      </div>
      <h2 class="team-name">${esc(team.name)}</h2>
      <div class="team-city">${esc(city)}</div>
    </a>`}
  async function init(){
    try{
      const catalog=await get('/api/catalog');
      const tournament=catalog.tournaments?.[0];
      if(!tournament)throw Error('Турнир не найден');
      const stages=(catalog.stages||[]).filter(s=>Number(s.tournament_id)===Number(tournament.id)).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
      const stage=stages[0];
      if(!stage)throw Error('Этап не найден');
      const data=await get('/api/data?tournament_slug='+encodeURIComponent(tournament.slug)+'&stage_id='+encodeURIComponent(stage.id));
      const teams=[...(data.teams||[])].sort((a,b)=>a.name.localeCompare(b.name,'ru'));
      $('#teamCount').textContent=teams.length+' '+(teams.length%10===1&&teams.length%100!==11?'участник':([2,3,4].includes(teams.length%10)&&![12,13,14].includes(teams.length%100)?'участника':'участников'));
      $('#season').textContent=data.tournament?.season||'2026/27';
      $('#teamsGrid').innerHTML=teams.length?teams.map(card).join(''):'<div class="error">Команды пока не добавлены.</div>';
    }catch(e){$('#teamsGrid').innerHTML='<div class="error">Не удалось загрузить команды. Попробуйте обновить страницу.</div>';console.error(e)}
  }
  init();
})();