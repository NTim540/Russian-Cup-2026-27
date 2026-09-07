(()=>{
  const team=Number(new URL(location.href).searchParams.get('team'));
  if(!Number.isInteger(team)||team<1)return;
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safePhoto=url=>{try{const u=new URL(url);return u.protocol==='https:'&&u.hostname==='img.fhr.ru'?u.toString():''}catch{return''}};
  const proxyPhoto=url=>url?`/api/fhr-photo?src=${encodeURIComponent(url)}`:'';
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
    return `<div class="roster-player" data-photo="${esc(photo)}"><span class="roster-num">${esc(p.number)}</span><span class="roster-avatar">${photo?`<img src="${esc(photo)}" data-proxy-photo="${esc(proxy)}" alt="${esc(p.name)}" loading="lazy" decoding="async" referrerpolicy="no-referrer">`:''}</span><span class="roster-name">${esc(p.name)}</span></div>`;
  }
  function render(players){
    const sec=makeSection();
    let grid=sec.querySelector('.roster-grid');
    if(!grid){grid=document.createElement('div');grid.className='roster-grid';sec.appendChild(grid)}
    const groups=['G','D','F','U'].map(code=>[code,players.filter(p=>(p.pos||'U')===code)]).filter(([,list])=>list.length);
    grid.innerHTML=groups.map(([code,list])=>`<div class="roster-card ${classes[code]}"><div class="roster-card-head"><strong>${labels[code]}</strong><span>${list.length}</span></div><div class="roster-list">${list.sort((a,b)=>(a.number??999)-(b.number??999)||String(a.name).localeCompare(String(b.name),'ru')).map(row).join('')}</div></div>`).join('');
    sec.dataset.source='fhr-live';
    const sub=sec.querySelector('.section-sub');if(sub)sub.textContent='Актуальная заявка Кубка России по данным ФХР.';
  }

  async function load(){
    try{
      const r=await fetch(`/api/fhr-roster?team=${team}&v=20260907-2`,{cache:'no-store'});
      if(!r.ok)throw Error(`Roster ${r.status}`);
      const b=await r.json();
      if(Array.isArray(b.players)&&b.players.length)render(b.players);
    }catch(e){console.warn('FHR roster unavailable, keeping local roster',e)}
  }
  load();
})();
