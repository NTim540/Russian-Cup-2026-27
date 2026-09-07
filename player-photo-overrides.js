(()=>{
  const API='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup';
  const EDGE='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-fhr-roster';
  const PREFIX='__PP_';
  const teamId=Number(new URL(location.href).searchParams.get('team'));
  if(!Number.isInteger(teamId)||teamId<1)return;

  const clean=x=>String(x||'').replace(/\s+/g,' ').trim();
  const isStorage=x=>String(x?.name||'').startsWith(PREFIX);
  let PHOTO_MAP={};
  let queued=false;

  function unpackUrl(url){
    const s=String(url||'');
    if(s.startsWith('~0:'))return'https://img.fhr.ru/players/'+s.slice(3);
    if(s.startsWith('~1:'))return'https://junior.fhr.ru/players/'+s.slice(3);
    return s;
  }
  function validUrl(raw){try{const u=new URL(String(raw||''));return u.protocol==='https:'?u.toString():''}catch{return''}}
  function decodeMap(arenas){
    const parts=(Array.isArray(arenas)?arenas:[]).filter(isStorage).sort((a,b)=>String(a.name).localeCompare(String(b.name))).map(x=>String(x.address||'')).join('');
    if(!parts)return{};
    try{const raw=JSON.parse(parts),out={};for(const [name,url] of Object.entries(raw||{})){const u=validUrl(unpackUrl(url));if(clean(name)&&u)out[clean(name)]=u}return out}catch{return{}}
  }
  function initials(name){return clean(name).split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'—'}
  function fhrProxy(url){try{const u=new URL(url);return u.hostname==='fhr.ru'||u.hostname.endsWith('.fhr.ru')?`${EDGE}?photo=${encodeURIComponent(url)}`:''}catch{return''}}

  function fallbackAvatar(avatar,name){
    avatar.className='roster-avatar roster-avatar-fallback';avatar.replaceChildren();
    const span=document.createElement('span');span.className='roster-avatar-initials';span.textContent=initials(name);avatar.appendChild(span);
  }

  function loadInto(row,url){
    if(row.dataset.manualPhotoLoading===url||row.dataset.manualPhotoApplied===url)return;
    row.dataset.manualPhotoLoading=url;
    const name=clean(row.querySelector('.roster-name')?.textContent);
    const direct=validUrl(url);if(!direct){delete row.dataset.manualPhotoLoading;return}
    const attempts=[direct,fhrProxy(direct)].filter(Boolean);let idx=0;
    const tryNext=()=>{
      if(idx>=attempts.length){delete row.dataset.manualPhotoLoading;row.dataset.manualPhotoFailed=direct;return}
      const src=attempts[idx++],probe=new Image();probe.referrerPolicy='no-referrer';
      probe.onload=()=>{
        const avatar=row.querySelector('.roster-avatar')||(()=>{const a=document.createElement('span');a.className='roster-avatar';row.querySelector('.roster-num')?.insertAdjacentElement('afterend',a);return a})();
        avatar.className='roster-avatar';avatar.replaceChildren();
        const img=document.createElement('img');img.src=src;img.alt=name?`Фото игрока ${name}`:'Фото игрока';img.loading='lazy';img.decoding='async';img.referrerPolicy='no-referrer';img.dataset.manualPhoto='1';img.dataset.manualPhotoSource=direct;
        img.onerror=()=>{row.dataset.manualPhotoApplied='';delete row.dataset.manualPhotoLoading;fallbackAvatar(avatar,name)};
        avatar.appendChild(img);row.dataset.manualPhotoApplied=direct;delete row.dataset.manualPhotoLoading;delete row.dataset.manualPhotoFailed;
      };
      probe.onerror=tryNext;probe.src=src;
    };
    tryNext();
  }

  function apply(){
    if(!Object.keys(PHOTO_MAP).length)return;
    document.querySelectorAll('#rosterSection .roster-player').forEach(row=>{
      const name=clean(row.querySelector('.roster-name')?.textContent),url=PHOTO_MAP[name];if(!name||!url)return;
      const current=row.querySelector('.roster-avatar img[data-manual-photo="1"]');
      if(current?.dataset.manualPhotoSource===url){row.dataset.manualPhotoApplied=url;return}
      if(row.dataset.manualPhotoFailed===url)return;
      loadInto(row,url);
    });
  }
  function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}

  async function init(){
    try{
      const cat=await fetch(API+'/api/catalog',{cache:'no-store'}).then(r=>r.json()),t=cat.tournaments?.[0];if(!t)return;
      const stages=(cat.stages||[]).filter(s=>Number(s.tournament_id)===Number(t.id)).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0)),stage=stages[0];if(!stage)return;
      const data=await fetch(API+'/api/data?tournament_slug='+encodeURIComponent(t.slug)+'&stage_id='+stage.id,{cache:'no-store'}).then(r=>r.json()),team=data.teams?.find(x=>Number(x.id)===teamId);if(!team)return;
      const arenas=Array.isArray(team.arenas)?team.arenas:[],real=arenas.filter(a=>!isStorage(a));
      PHOTO_MAP=decodeMap(arenas);
      const arenaEl=document.querySelector('#teamArena');if(arenaEl){const text=real.map(a=>[a.name,a.address].filter(Boolean).join(' — ')).filter(Boolean).join(' · ');if(text)arenaEl.textContent=text;else if(team.city)arenaEl.textContent=team.city+' · адрес арены будет добавлен'}
      apply();
      const root=document.getElementById('rosterSection')||document.body;
      new MutationObserver(queue).observe(root,{childList:true,subtree:true});
      setTimeout(apply,300);setTimeout(apply,900);setTimeout(apply,2200);
    }catch(e){console.warn('Manual player photos:',e)}
  }
  init();
})();
