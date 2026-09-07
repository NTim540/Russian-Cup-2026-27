(()=>{
  const team=Number(new URL(location.href).searchParams.get('team'));
  if(!Number.isInteger(team)||team<1)return;

  const EDGE='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-fhr-roster';
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safePhoto=url=>{try{const u=new URL(url);const h=u.hostname.toLowerCase();return u.protocol==='https:'&&(h==='img.fhr.ru'||h==='junior.fhr.ru'||h==='fhr.ru'||h.endsWith('.fhr.ru'))?u.toString():''}catch{return''}};
  const proxyPhoto=url=>url?`${EDGE}?photo=${encodeURIComponent(url)}`:'';
  const labels={G:'Вратари',D:'Защитники',F:'Нападающие',U:'Игроки'};
  const classes={G:'g',D:'d',F:'f',U:'u'};

  function makeSection(){
    let sec=document.getElementById('rosterSection');
    if(sec)return sec;
    sec=document.createElement('section');
    sec.id='rosterSection';
    sec.className='section wrap';
    sec.innerHTML='<div class="section-head"><div><div class="section-kicker">Команда</div><h2 class="section-title">Состав</h2><div class="section-sub">Актуальная заявка Кубка России по данным ФХР.</div></div></div><div class="roster-grid"></div>';
    const next=document.getElementById('nextMatch');
    const anchor=next?.closest('section');
    if(anchor)anchor.insertAdjacentElement('beforebegin',sec);else document.querySelector('footer')?.insertAdjacentElement('beforebegin',sec);
    return sec;
  }

  function row(p){
    const photo=safePhoto(p.photo),proxy=proxyPhoto(photo);
    return `<div class="roster-player" data-photo="${esc(photo)}"><span class="roster-num">${esc(p.number)}</span><span class="roster-avatar">${photo?`<img src="${esc(proxy)}" data-direct-photo="${esc(photo)}" alt="${esc(p.name)}" loading="lazy" decoding="async" referrerpolicy="no-referrer">`:''}</span><span class="roster-name">${esc(p.name)}</span></div>`;
  }

  function render(players){
    const sec=makeSection();
    let grid=sec.querySelector('.roster-grid');
    if(!grid){grid=document.createElement('div');grid.className='roster-grid';sec.appendChild(grid)}
    const groups=['G','D','F','U'].map(code=>[code,players.filter(p=>(p.pos||'U')===code)]).filter(([,list])=>list.length);
    grid.innerHTML=groups.map(([code,list])=>`<div class="roster-card ${classes[code]}"><div class="roster-card-head"><strong>${labels[code]}</strong><span>${list.length}</span></div><div class="roster-list">${list.sort((a,b)=>(a.number??999)-(b.number??999)||String(a.name).localeCompare(String(b.name),'ru')).map(row).join('')}</div></div>`).join('');
    sec.dataset.source='fhr-edge';
    const sub=sec.querySelector('.section-sub');
    if(sub)sub.textContent=`Актуальная заявка Кубка России по данным ФХР · ${players.length} игроков`;
  }

  async function load(){
    try{
      const r=await fetch(`${EDGE}?team=${team}&v=2`,{mode:'cors',cache:'no-store'});
      if(!r.ok){let detail='';try{detail=await r.text()}catch{};throw Error(`Roster ${r.status} ${detail}`)}
      const b=await r.json();
      if(!Array.isArray(b.players)||!b.players.length)throw Error('Empty roster');
      render(b.players);
    }catch(e){
      console.warn('FHR roster Edge unavailable, keeping local roster',e);
      const sec=document.getElementById('rosterSection');
      sec?.setAttribute('data-source','local-fallback');
      const sub=sec?.querySelector('.section-sub');
      if(sub)sub.textContent='Резервный состав · источник ФХР временно недоступен';
    }
  }

  load();
})();
