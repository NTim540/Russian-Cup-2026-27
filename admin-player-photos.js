(()=>{
  const EDGE='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-fhr-roster';
  const PREFIX='__PP_';
  const CHUNK=360;
  const POS={G:'Вратари',D:'Защитники',F:'Нападающие',U:'Игроки'};
  let STATIC_ROSTERS=null;
  let renderToken=0;

  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cleanName=x=>String(x||'').replace(/\s+/g,' ').trim();
  const isStorageName=x=>String(x||'').startsWith(PREFIX);

  const style=document.createElement('style');
  style.textContent=`
    .player-photo-editor{grid-column:1/-1;min-width:0;margin-top:14px;padding-top:16px;border-top:1px solid var(--line)}
    .player-photo-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:11px}.player-photo-head h4{margin:0;font-size:15px}.player-photo-head .muted{max-width:720px}
    .player-photo-groups{display:grid;gap:16px}.player-photo-group-title{margin:0 0 7px;color:#dce9f7;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.07em}
    .player-photo-list{display:grid;gap:6px}.player-photo-row{display:grid;grid-template-columns:42px 46px minmax(180px,.8fr) minmax(260px,1.5fr);gap:9px;align-items:center;min-width:0;padding:7px 8px;border:1px solid rgba(255,255,255,.07);border-radius:11px;background:rgba(255,255,255,.02)}
    .player-photo-num{text-align:center;font-weight:950;color:#dce9f7}.player-photo-avatar{width:42px;height:42px;display:grid;place-items:center;overflow:hidden;border-radius:8px;border:1px solid rgba(127,198,255,.15);background:#0b2035;color:#8fa8c0;font-size:11px;font-weight:900}.player-photo-avatar img{width:100%;height:100%;object-fit:cover;object-position:center top}.player-photo-name{min-width:0;font-size:12px;font-weight:800;line-height:1.3}.player-photo-url{min-width:0}.player-photo-controls{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:6px;align-items:center}.player-photo-url .input{min-width:0;padding:8px 9px;font-size:11px}.player-photo-action{height:36px;padding:0 9px!important;white-space:nowrap}.player-photo-url-note{margin-top:4px;color:#65778c;font-size:9px;line-height:1.3}.player-photo-summary{color:#7fc6ff;font-size:10px;font-weight:800;white-space:nowrap}
    .player-photo-storage-row{display:none!important}
    @media(max-width:760px){
      #tab-teams .team-admin-editor{min-width:0;padding:12px}
      .player-photo-editor{margin-top:12px;padding-top:14px}
      .player-photo-head{display:grid;gap:5px;margin-bottom:12px}.player-photo-summary{white-space:normal}
      .player-photo-groups{gap:18px}.player-photo-list{gap:9px}
      .player-photo-row{grid-template-columns:52px minmax(0,1fr);grid-template-areas:"avatar name" "num name" "url url";gap:5px 10px;align-items:start;padding:10px;border-radius:13px;background:rgba(255,255,255,.025)}
      .player-photo-avatar{grid-area:avatar;width:48px;height:48px;border-radius:9px}
      .player-photo-num{grid-area:num;width:48px;padding-top:2px;font-size:12px;color:#8fa8c0}
      .player-photo-num:before{content:"№ ";font-weight:700}
      .player-photo-name{grid-area:name;align-self:center;font-size:13px;line-height:1.35;padding:4px 0}
      .player-photo-url{grid-area:url;margin-top:5px}
      .player-photo-controls{grid-template-columns:minmax(0,1fr) auto;gap:7px}
      .player-photo-url .input{font-size:16px!important;min-height:44px;padding:10px!important}
      .player-photo-action{height:44px;min-width:76px;padding:0 11px!important}
      .player-photo-clear{grid-column:1/-1;height:36px;min-width:0;width:100%;opacity:.78}
      .player-photo-url-note{font-size:10px;margin-top:6px}
      #tab-teams .team-admin-actions{position:sticky;bottom:calc(8px + env(safe-area-inset-bottom));z-index:18;margin:16px -4px 0;padding:9px;border:1px solid rgba(127,198,255,.18);border-radius:14px;background:rgba(7,17,31,.94);backdrop-filter:blur(14px);box-shadow:0 14px 34px rgba(0,0,0,.35)}
      #tab-teams .team-admin-actions #saveTeamProfile{min-height:46px;flex:1}
    }
    @media(max-width:420px){
      .player-photo-row{grid-template-columns:48px minmax(0,1fr);padding:9px}.player-photo-avatar{width:44px;height:44px}.player-photo-num{width:44px}.player-photo-name{font-size:12px}
      .player-photo-controls{grid-template-columns:1fr}.player-photo-action{width:100%}.player-photo-clear{grid-column:auto}
    }
  `;
  document.head.appendChild(style);

  function directPhotoUrl(url){
    const s=String(url||'').trim();
    if(!s)return'';
    try{const u=new URL(s);return u.protocol==='https:'?u.toString():''}catch{return''}
  }

  function packUrl(url){
    const s=directPhotoUrl(url);if(!s)return'';
    const prefixes=['https://img.fhr.ru/players/','https://junior.fhr.ru/players/'];
    for(let i=0;i<prefixes.length;i++)if(s.startsWith(prefixes[i]))return `~${i}:${s.slice(prefixes[i].length)}`;
    return s;
  }
  function unpackUrl(url){
    const s=String(url||'');
    if(s.startsWith('~0:'))return'https://img.fhr.ru/players/'+s.slice(3);
    if(s.startsWith('~1:'))return'https://junior.fhr.ru/players/'+s.slice(3);
    return s;
  }

  function storageRows(){
    return [...document.querySelectorAll('#arenaList .arena-row')].map(r=>({
      row:r,
      name:r.querySelector('.arena-name')?.value||'',
      address:r.querySelector('.arena-address')?.value||''
    })).filter(x=>isStorageName(x.name));
  }
  function readMap(){
    const parts=storageRows().sort((a,b)=>a.name.localeCompare(b.name)).map(x=>x.address).join('');
    if(!parts)return{};
    try{const raw=JSON.parse(parts),out={};for(const [name,url] of Object.entries(raw||{})){const u=unpackUrl(url);if(cleanName(name)&&directPhotoUrl(u))out[cleanName(name)]=u}return out}catch{return{}}
  }
  function compactMap(map){
    const out={};
    for(const [name,url] of Object.entries(map||{})){const n=cleanName(name),u=directPhotoUrl(url);if(n&&u)out[n]=packUrl(u)}
    return out;
  }
  function encodeChunks(map){
    const text=JSON.stringify(compactMap(map));
    if(text==='{}')return[];
    const chunks=[];for(let i=0;i<text.length;i+=CHUNK)chunks.push(text.slice(i,i+CHUNK));
    return chunks;
  }
  function hideStorageRows(){
    storageRows().forEach(x=>{x.row.classList.add('player-photo-storage-row');x.row.setAttribute('aria-hidden','true')});
  }
  function writeStorage(map){
    const list=document.querySelector('#arenaList');if(!list)return;
    storageRows().forEach(x=>x.row.remove());
    encodeChunks(map).forEach((chunk,i)=>{
      const row=document.createElement('div');row.className='arena-row player-photo-storage-row';row.dataset.playerPhotoStorage='1';
      row.innerHTML=`<div class="field"><label>Служебные данные</label><input class="input arena-name" value="${PREFIX}${String(i+1).padStart(2,'0')}"></div><div class="field"><label>Данные</label><input class="input arena-address" value="${esc(chunk)}"></div><button type="button" class="btn danger small arena-remove">×</button>`;
      list.appendChild(row);
    });
  }

  async function loadStatic(){
    if(STATIC_ROSTERS)return STATIC_ROSTERS;
    try{
      const text=await fetch('/rosters.js?v=20260903-1',{cache:'force-cache'}).then(r=>r.text());
      const a=text.indexOf('const R={'),b=text.indexOf('const NOTES=',a);
      if(a<0||b<0)throw Error('Roster data not found');
      let expr=text.slice(a+'const R='.length,b).trim();if(expr.endsWith(';'))expr=expr.slice(0,-1);
      STATIC_ROSTERS=Function(`"use strict";return (${expr})`)();
    }catch(e){console.warn('Static roster data:',e);STATIC_ROSTERS={}}
    return STATIC_ROSTERS;
  }

  async function playersFor(team){
    try{
      const r=await fetch(`${EDGE}?team=${team.id}`,{mode:'cors',cache:'no-store'});
      if(r.ok){const b=await r.json();if(Array.isArray(b.players)&&b.players.length)return b.players.map(p=>({number:p.number,name:cleanName(p.name),pos:p.pos||'U'}))}
    }catch{}
    const all=await loadStatic(),rows=all?.[team.name]||[];
    return rows.map(x=>({number:x[0],name:cleanName(x[1]),pos:x[2]||'U'}));
  }

  function currentTeam(){
    try{
      const id=Number(document.querySelector('#teamAdminSelect')?.value);
      if(!id||typeof D==='undefined'||!D?.teams)return null;
      return D.teams.find(t=>Number(t.id)===id)||null;
    }catch{return null}
  }

  function avatarFallback(name){return cleanName(name).split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'—'}
  function previewHtml(name,url){const u=directPhotoUrl(url);return u?`<img src="${esc(u)}" alt="" referrerpolicy="no-referrer">`:esc(avatarFallback(name))}

  function refreshRowPreview(input){
    const row=input.closest('.player-photo-row'),name=row.dataset.playerName,av=row.querySelector('.player-photo-avatar'),url=directPhotoUrl(input.value);
    av.innerHTML=previewHtml(name,url);const img=av.querySelector('img');if(img)img.onerror=()=>{av.textContent=avatarFallback(name)};
    const box=input.closest('.player-photo-editor'),n=[...box.querySelectorAll('.player-photo-input')].filter(i=>directPhotoUrl(i.value)).length;box.querySelector('.player-photo-summary').textContent=`${n} фото указано`;
  }

  async function pasteInto(input,btn){
    const old=btn.textContent;
    try{
      if(!navigator.clipboard?.readText)throw Error('clipboard unavailable');
      const text=(await navigator.clipboard.readText()).trim();
      if(!text)throw Error('empty');
      input.value=text;input.dispatchEvent(new Event('input',{bubbles:true}));btn.textContent='Готово';
    }catch{
      input.focus();input.select();btn.textContent='Вставь вручную';
    }
    setTimeout(()=>btn.textContent=old,1400);
  }

  async function renderEditor(){
    const form=document.querySelector('#teamAdminForm'),team=currentTeam();if(!form||!team)return;
    hideStorageRows();
    if(form.querySelector('.player-photo-editor')?.dataset.teamId===String(team.id))return;
    form.querySelector('.player-photo-editor')?.remove();
    const token=++renderToken,map=readMap(),players=await playersFor(team);if(token!==renderToken||currentTeam()?.id!==team.id)return;
    const grouped=['G','D','F','U'].map(pos=>[pos,players.filter(p=>(p.pos||'U')===pos)]).filter(([,a])=>a.length);
    const box=document.createElement('div');box.className='player-photo-editor';box.dataset.teamId=String(team.id);
    box.innerHTML=`<div class="player-photo-head"><div><h4>Фотографии игроков</h4><div class="muted">Вставляй прямую ссылку на фотографию с ФХР. Ручная ссылка имеет приоритет над автоматической загрузкой.</div></div><div class="player-photo-summary"></div></div>${players.length?`<div class="player-photo-groups">${grouped.map(([pos,list])=>`<section><div class="player-photo-group-title">${POS[pos]}</div><div class="player-photo-list">${list.sort((a,b)=>(a.number??999)-(b.number??999)||a.name.localeCompare(b.name,'ru')).map(p=>{const u=map[p.name]||'';return `<div class="player-photo-row" data-player-name="${esc(p.name)}"><div class="player-photo-num">${p.number??'—'}</div><div class="player-photo-avatar">${previewHtml(p.name,u)}</div><div class="player-photo-name">${esc(p.name)}</div><div class="player-photo-url"><div class="player-photo-controls"><input class="input player-photo-input" type="url" inputmode="url" autocapitalize="off" autocomplete="off" spellcheck="false" value="${esc(u)}" placeholder="https://..."><button type="button" class="btn sec small player-photo-action player-photo-paste">Вставить</button><button type="button" class="btn sec small player-photo-action player-photo-clear">Очистить</button></div><div class="player-photo-url-note">На телефоне: скопируй адрес изображения на ФХР и нажми «Вставить».</div></div></div>`}).join('')}</div></section>`).join('')}</div>`:'<div class="empty">Состав этой команды пока не найден.</div>'}`;
    const actions=form.querySelector('.team-admin-actions');if(actions)actions.insertAdjacentElement('beforebegin',box);else form.appendChild(box);
    box.querySelectorAll('.player-photo-input').forEach(input=>input.addEventListener('input',()=>refreshRowPreview(input)));
    box.querySelectorAll('.player-photo-paste').forEach(btn=>btn.addEventListener('click',()=>pasteInto(btn.closest('.player-photo-url').querySelector('.player-photo-input'),btn)));
    box.querySelectorAll('.player-photo-clear').forEach(btn=>btn.addEventListener('click',()=>{const input=btn.closest('.player-photo-url').querySelector('.player-photo-input');input.value='';input.dispatchEvent(new Event('input',{bubbles:true}))}));
    const count=[...box.querySelectorAll('.player-photo-input')].filter(i=>directPhotoUrl(i.value)).length;box.querySelector('.player-photo-summary').textContent=`${count} фото указано`;
  }

  function mapFromEditor(){
    const box=document.querySelector('.player-photo-editor'),map={};if(!box)return map;
    box.querySelectorAll('.player-photo-row').forEach(row=>{const name=cleanName(row.dataset.playerName),url=directPhotoUrl(row.querySelector('.player-photo-input')?.value);if(name&&url)map[name]=url});
    return map;
  }

  document.addEventListener('click',e=>{
    if(e.target.closest?.('#saveTeamProfile'))writeStorage(mapFromEditor());
  },true);

  document.addEventListener('change',e=>{
    if(e.target.matches?.('#teamAdminSelect'))setTimeout(renderEditor,30);
  });

  const form=document.querySelector('#teamAdminForm');
  if(form)new MutationObserver(()=>{hideStorageRows();setTimeout(renderEditor,0)}).observe(form,{childList:true,subtree:true});
  let n=0;const timer=setInterval(()=>{n++;const f=document.querySelector('#teamAdminForm');if(f){hideStorageRows();renderEditor()}if(n>120)clearInterval(timer)},250);
})();
