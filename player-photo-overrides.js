(()=>{
  const API='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup';
  const EDGE='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-fhr-roster';
  const PHOTO_PREFIX='__PP_';
  const teamId=Number(new URL(location.href).searchParams.get('team'));
  if(!Number.isInteger(teamId)||teamId<1)return;

  const clean=x=>String(x||'').replace(/\s+/g,' ').trim();
  const key=x=>clean(x).toLocaleLowerCase('ru-RU').replace(/ё/g,'е').replace(/[^a-zа-я0-9]+/gi,' ').replace(/\s+/g,' ').trim();
  const isPhotoStorage=x=>String(x?.name||'').startsWith(PHOTO_PREFIX);
  const isHiddenStorage=x=>{const n=String(x?.name||'');return n.startsWith('__PP_')||n.startsWith('__LU_')};
  let MANUAL_MAP={};
  let AUTO_MAP={};
  let queued=false;

  function unpackUrl(url){
    const s=String(url||'');
    if(s.startsWith('~0:'))return'https://img.fhr.ru/players/'+s.slice(3);
    if(s.startsWith('~1:'))return'https://junior.fhr.ru/players/'+s.slice(3);
    return s;
  }
  function validUrl(raw){try{const u=new URL(String(raw||''));return u.protocol==='https:'?u.toString():''}catch{return''}}
  function decodeMap(arenas){
    const parts=(Array.isArray(arenas)?arenas:[]).filter(isPhotoStorage).sort((a,b)=>String(a.name).localeCompare(String(b.name))).map(x=>String(x.address||'')).join('');
    if(!parts)return{};
    try{
      const raw=JSON.parse(parts),out={};
      for(const [name,url] of Object.entries(raw||{})){const u=validUrl(unpackUrl(url)),k=key(name);if(k&&u)out[k]=u}
      return out;
    }catch{return{}}
  }
  function initials(name){return clean(name).split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'—'}
  function fhrProxy(url){try{const u=new URL(url);return u.hostname==='fhr.ru'||u.hostname.endsWith('.fhr.ru')?`${EDGE}?photo=${encodeURIComponent(url)}`:''}catch{return''}}
  function attemptsFor(url){
    const direct=validUrl(url);if(!direct)return[];
    const proxy=fhrProxy(direct);
    return [...new Set([proxy,direct].filter(Boolean))];
  }

  function ensureAvatar(row){
    let avatar=row.querySelector('.roster-avatar');
    if(!avatar){avatar=document.createElement('span');avatar.className='roster-avatar';row.querySelector('.roster-num')?.insertAdjacentElement('afterend',avatar)}
    return avatar;
  }
  function fallbackAvatar(avatar,name){
    avatar.className='roster-avatar roster-avatar-fallback';avatar.replaceChildren();
    const span=document.createElement('span');span.className='roster-avatar-initials';span.textContent=initials(name);avatar.appendChild(span);
  }

  function loadInto(row,urls){
    const originals=[...new Set((urls||[]).map(validUrl).filter(Boolean))];if(!originals.length)return;
    const signature=originals.join('|');
    if(row.dataset.rosterPhotoLoading===signature||row.dataset.rosterPhotoSignature===signature)return;
    row.dataset.rosterPhotoLoading=signature;
    const name=clean(row.querySelector('.roster-name')?.textContent),attempts=[];
    originals.forEach(original=>attemptsFor(original).forEach(src=>attempts.push({src,original})));
    let idx=0;
    const tryNext=()=>{
      if(idx>=attempts.length){delete row.dataset.rosterPhotoLoading;row.dataset.rosterPhotoFailed=signature;return}
      const {src,original}=attempts[idx++],probe=new Image();probe.referrerPolicy='no-referrer';
      probe.onload=()=>{
        const avatar=ensureAvatar(row);avatar.className='roster-avatar';avatar.replaceChildren();
        const img=document.createElement('img');img.src=src;img.alt=name?`Фото игрока ${name}`:'Фото игрока';img.loading='lazy';img.decoding='async';img.referrerPolicy='no-referrer';img.dataset.rosterPhoto='1';img.dataset.rosterPhotoSource=original;
        img.onerror=()=>{delete row.dataset.rosterPhotoSignature;delete row.dataset.rosterPhotoLoading;queue()};
        avatar.appendChild(img);row.dataset.rosterPhotoSignature=signature;delete row.dataset.rosterPhotoLoading;delete row.dataset.rosterPhotoFailed;
      };
      probe.onerror=tryNext;probe.src=src;
    };
    tryNext();
  }

  function apply(){
    if(!Object.keys(MANUAL_MAP).length&&!Object.keys(AUTO_MAP).length)return;
    document.querySelectorAll('#rosterSection .roster-player').forEach(row=>{
      const name=clean(row.querySelector('.roster-name')?.textContent),k=key(name);if(!k)return;
      const urls=[MANUAL_MAP[k],AUTO_MAP[k]].filter(Boolean);if(!urls.length)return;
      const signature=[...new Set(urls)].join('|');
      const current=row.querySelector('.roster-avatar img[data-roster-photo="1"]');
      if(current&&row.dataset.rosterPhotoSignature===signature)return;
      if(row.dataset.rosterPhotoFailed===signature)return;
      loadInto(row,urls);
    });
  }
  function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}

  async function loadAutoPhotos(){
    try{
      const r=await fetch(`${EDGE}?team=${teamId}`,{mode:'cors',cache:'no-store'});if(!r.ok)return;
      const b=await r.json(),out={};
      (Array.isArray(b.players)?b.players:[]).forEach(p=>{const k=key(p?.name),u=validUrl(p?.photo);if(k&&u)out[k]=u});
      AUTO_MAP=out;apply();
    }catch(e){console.warn('FHR roster photos:',e)}
  }

  async function init(){
    try{
      const cat=await fetch(API+'/api/catalog',{cache:'no-store'}).then(r=>r.json()),t=cat.tournaments?.[0];if(!t)return;
      const stages=(cat.stages||[]).filter(s=>Number(s.tournament_id)===Number(t.id)).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0)),stage=stages[0];if(!stage)return;
      const data=await fetch(API+'/api/data?tournament_slug='+encodeURIComponent(t.slug)+'&stage_id='+stage.id,{cache:'no-store'}).then(r=>r.json()),team=data.teams?.find(x=>Number(x.id)===teamId);if(!team)return;
      const arenas=Array.isArray(team.arenas)?team.arenas:[],real=arenas.filter(a=>!isHiddenStorage(a));
      MANUAL_MAP=decodeMap(arenas);
      const arenaEl=document.querySelector('#teamArena');if(arenaEl){const text=real.map(a=>[a.name,a.address].filter(Boolean).join(' — ')).filter(Boolean).join(' · ');if(text)arenaEl.textContent=text;else if(team.city)arenaEl.textContent=team.city+' · адрес арены будет добавлен'}
      apply();loadAutoPhotos();
      const root=document.getElementById('rosterSection')||document.body;
      new MutationObserver(queue).observe(root,{childList:true,subtree:true});
      setTimeout(apply,300);setTimeout(apply,900);setTimeout(apply,2200);setTimeout(apply,4500);
    }catch(e){console.warn('Player photos:',e);loadAutoPhotos()}
  }
  init();
})();
