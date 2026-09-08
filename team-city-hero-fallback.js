(()=>{
  const TEAM_CITY={
    'Динамо Москва':'Москва','МАХ':'Москва','Крылья Советов':'Москва','Спартак':'Москва','ЦСКА':'Москва',
    'Торпедо':'Нижний Новгород','Локомотив':'Ярославль','Локомотив 2004':'Ярославль','Авангард':'Омск',
    'Сибирь':'Новосибирск','Лада':'Тольятти','Трактор':'Челябинск','Ак Барс':'Казань',
    'Динамо СПБ':'Санкт-Петербург','Армия СКА':'Санкт-Петербург','СКА-Стрельна':'Санкт-Петербург',
    'АКМ':'Новомосковск','Нефтехимик':'Нижнекамск','Северсталь':'Череповец','Красная Машина Юниор':'Красногорск'
  };
  const CACHE_KEY='team_city_hero_v1:';
  const MAX_AGE=7*24*60*60*1000;

  function hasOwnHero(hero){
    if(!hero)return false;
    const bg=String(hero.style.backgroundImage||'').trim();
    return hero.classList.contains('has-image')&&bg&&bg!=='none';
  }
  function readCache(city){
    try{const x=JSON.parse(localStorage.getItem(CACHE_KEY+city)||'null');if(x&&x.url&&Date.now()-x.ts<MAX_AGE)return x.url}catch{}return'';
  }
  function saveCache(city,url){try{localStorage.setItem(CACHE_KEY+city,JSON.stringify({url,ts:Date.now()}))}catch{}}
  function addCredit(card,city){
    if(!card||card.querySelector('.city-hero-credit'))return;
    const a=document.createElement('a');
    a.className='city-hero-credit';
    a.href='https://ru.wikipedia.org/wiki/'+encodeURIComponent(city);
    a.target='_blank';a.rel='noopener noreferrer';
    a.textContent='Фото города: Wikipedia';
    card.appendChild(a);
  }
  function ensureStyle(){
    if(document.getElementById('city-hero-fallback-style'))return;
    const s=document.createElement('style');s.id='city-hero-fallback-style';
    s.textContent='.city-hero-credit{position:absolute;right:10px;bottom:8px;z-index:4;padding:4px 6px;border-radius:4px;background:rgba(3,10,18,.48);color:rgba(226,238,248,.58);font-size:8px;line-height:1;text-decoration:none;backdrop-filter:blur(5px)}.city-hero-credit:hover{color:#fff;background:rgba(3,10,18,.72)}@media(max-width:760px){.city-hero-credit{font-size:7px;right:7px;bottom:6px}}';
    document.head.appendChild(s);
  }
  function apply(hero,card,city,url){
    if(!url||hasOwnHero(hero))return;
    const img=new Image();
    img.onload=()=>{if(hasOwnHero(hero))return;hero.style.backgroundImage=`url("${String(url).replace(/["\\]/g,'')}")`;hero.classList.add('has-image');hero.dataset.cityFallback='1';addCredit(card,city)};
    img.src=url;
  }
  async function fetchCityImage(city){
    const cached=readCache(city);if(cached)return cached;
    const api='https://ru.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&piprop=thumbnail&pithumbsize=1600&titles='+encodeURIComponent(city);
    const r=await fetch(api,{mode:'cors',cache:'force-cache'});if(!r.ok)throw Error('city image');
    const b=await r.json(),page=Object.values(b?.query?.pages||{})[0],url=page?.thumbnail?.source||'';
    if(url)saveCache(city,url);return url;
  }
  async function run(){
    const hero=document.querySelector('#teamHeroBg'),name=document.querySelector('#teamName')?.textContent?.trim(),card=document.querySelector('.team-hero-card');
    if(!hero||!name||name==='Команда')return false;
    if(hasOwnHero(hero))return true;
    const city=TEAM_CITY[name];if(!city)return true;
    ensureStyle();
    try{const url=await fetchCityImage(city);if(url)apply(hero,card,city,url)}catch(e){console.warn('City hero fallback:',e)}
    return true;
  }
  let n=0;
  const wait=()=>{n++;Promise.resolve(run()).then(done=>{if(!done&&n<24)setTimeout(wait,250)})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();
