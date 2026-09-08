(()=>{
  const TEAM_API='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-team-admin';
  const FHR='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-fhr-roster';
  const PREFIX='__LU_';
  const CHUNK=360;
  let lastMatchId=null,STATIC_ROSTERS=null,renderToken=0;
  const clean=x=>String(x||'').replace(/\s+/g,' ').trim();
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const style=document.createElement('style');
  style.textContent=`
    .ap-lineup{margin-bottom:22px}.ap-lineup-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:10px}.ap-lineup-head h4{margin:0 0 3px}.ap-lineup-head .muted{max-width:620px}
    .ap-lineup-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.ap-lineup-team{border:1px solid rgba(255,255,255,.08);border-radius:12px;background:rgba(255,255,255,.022);overflow:hidden}.ap-lineup-team-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 11px;border-bottom:1px solid rgba(255,255,255,.07)}.ap-lineup-team-head strong{font-size:12px}.ap-lineup-tools{display:flex;gap:5px}.ap-lineup-tools button{border:1px solid rgba(127,198,255,.16);background:rgba(127,198,255,.05);color:#bcdcf3;border-radius:7px;padding:5px 7px;font-size:9px;cursor:pointer}.ap-lineup-list{max-height:330px;overflow:auto;padding:6px}.ap-lineup-player{display:grid;grid-template-columns:22px 34px 1fr;gap:7px;align-items:center;padding:6px 5px;border-radius:7px;font-size:10px}.ap-lineup-player:hover{background:rgba(127,198,255,.04)}.ap-lineup-player input{width:16px;height:16px;accent-color:#2f6fed}.ap-lineup-num{color:#8aa3ba;font-weight:900;text-align:center}.ap-lineup-status{min-height:16px;margin-top:8px;color:#7fc6ff;font-size:10px}.ap-lineup-save{margin-top:9px;display:flex;justify-content:flex-end}
    @media(max-width:700px){.ap-lineup-grid{grid-template-columns:1fr}.ap-lineup-list{max-height:260px}.ap-lineup-player{font-size:11px;padding:8px 5px}.ap-lineup-save .btn{width:100%}}
  `;
  document.head.appendChild(style);

  function chunks(arenas){return (Array.isArray(arenas)?arenas:[]).filter(a=>String(a?.name||'').startsWith(PREFIX)).sort((a,b)=>String(a.name).localeCompare(String(b.name))).map(a=>String(a.address||'')).join('')}
  function readMap(arenas){const s=chunks(arenas);if(!s)return{};try{return JSON.parse(s)||{}}catch{return{}}}
  function writeMap(arenas,map){const keep=(Array.isArray(arenas)?arenas:[]).filter(a=>!String(a?.name||'').startsWith(PREFIX));const text=JSON.stringify(map||{});if(text==='{}')return keep;for(let i=0,n=1;i<text.length;i+=CHUNK,n++)keep.push({name:PREFIX+String(n).padStart(2,'0'),address:text.slice(i,i+CHUNK)});return keep}
  async function loadStatic(){if(STATIC_ROSTERS)return STATIC_ROSTERS;try{const text=await fetch('/rosters.js?v=20260903-1',{cache:'force-cache'}).then(r=>r.text()),a=text.indexOf('const R={'),b=text.indexOf('const NOTES=',a);if(a<0||b<0)throw Error();let expr=text.slice(a+'const R='.length,b).trim();if(expr.endsWith(';'))expr=expr.slice(0,-1);STATIC_ROSTERS=Function('return ('+expr+')')()}catch{STATIC_ROSTERS={}}return STATIC_ROSTERS}
  async function roster(team){try{const r=await fetch(FHR+'?team='+team.id,{cache:'no-store'});if(r.ok){const b=await r.json();if(Array.isArray(b.players)&&b.players.length)return b.players.map(p=>({number:p.number,name:clean(p.name),pos:p.pos||'U'}))}}catch{}const all=await loadStatic(),rows=all?.[team.name]||[];return rows.map(x=>({number:x[0],name:clean(x[1]),pos:x[2]||'U'}))}
  function teamById(id){try{return D?.teams?.find(t=>Number(t.id)===Number(id))||null}catch{return null}}
  function matchById(id){try{return D?.matches?.find(m=>Number(m.id)===Number(id))||null}catch{return null}}
  function selectedNames(box,side){return [...box.querySelectorAll(`[data-lineup-side="${side}"] input[type="checkbox"]:checked`)].map(i=>clean(i.dataset.name)).filter(Boolean)}
  function teamHtml(side,team,players,selected){const set=new Set((selected||[]).map(clean));return `<section class="ap-lineup-team" data-lineup-side="${side}"><div class="ap-lineup-team-head"><strong>${esc(team.name)}</strong><div class="ap-lineup-tools"><button type="button" data-lineup-all="${side}">Все</button><button type="button" data-lineup-none="${side}">Снять</button></div></div><div class="ap-lineup-list">${players.length?players.map(p=>`<label class="ap-lineup-player"><input type="checkbox" data-name="${esc(p.name)}" ${set.has(clean(p.name))?'checked':''}><span class="ap-lineup-num">${p.number??'—'}</span><span>${esc(p.name)}</span></label>`).join(''):'<div class="ap-empty">Состав команды пока не загружен</div>'}</div></section>`}

  async function freshProfiles(){
    const tid=Number(D?.tournament?.id);if(!tid)throw Error('Не удалось определить турнир');
    const r=await fetch(TEAM_API+'?tournament_id='+encodeURIComponent(tid),{headers:{'x-admin-password':PW},cache:'no-store'}),b=await r.json().catch(()=>({}));
    if(!r.ok)throw Error(b.error||'Не удалось получить свежие данные команд');
    return new Map((Array.isArray(b.teams)?b.teams:[]).map(t=>[Number(t.id),t]));
  }
  async function saveTeam(profile,arenas){
    const body={action:'update_team_profile',id:profile.id,city:profile.city||'',logo_url:profile.logo_url||'',hero_image_url:profile.hero_image_url||'',vk_url:profile.vk_url||'',telegram_url:profile.telegram_url||'',max_url:profile.max_url||'',website_url:profile.website_url||'',arenas};
    const r=await fetch(TEAM_API,{method:'POST',headers:{'Content-Type':'application/json','x-admin-password':PW},body:JSON.stringify(body)}),b=await r.json().catch(()=>({}));
    if(!r.ok)throw Error(b.error||'Не удалось сохранить состав');return b;
  }

  async function inject(){
    const overlay=document.querySelector('.ap-overlay.open'),body=overlay?.querySelector('#apBody');if(!body||!lastMatchId)return;
    const m=matchById(lastMatchId);if(!m)return;if(body.querySelector('.ap-lineup')?.dataset.matchId===String(m.id))return;body.querySelector('.ap-lineup')?.remove();
    const home=teamById(m.home_team_id),away=teamById(m.away_team_id);if(!home||!away)return;
    const token=++renderToken,[hp,ap]=await Promise.all([roster(home),roster(away)]);if(token!==renderToken||!document.querySelector('.ap-overlay.open')||lastMatchId!==m.id)return;
    const hmap=readMap(home.arenas),amap=readMap(away.arenas),hs=hmap[String(m.id)]||[],as=amap[String(m.id)]||[];
    const sec=document.createElement('section');sec.className='ap-section ap-lineup';sec.dataset.matchId=String(m.id);sec.innerHTML=`<div class="ap-lineup-head"><div><h4>Состав на матч</h4><div class="muted">Отметьте игроков, которые действительно приняли участие. Сохранение состава не изменяет фото города, логотип, соцсети и другие данные команды.</div></div></div><div class="ap-lineup-grid">${teamHtml('home',home,hp,hs)}${teamHtml('away',away,ap,as)}</div><div class="ap-lineup-status"></div><div class="ap-lineup-save"><button type="button" class="btn" data-save-lineup>Сохранить состав на матч</button></div>`;
    const sections=body.querySelectorAll('.ap-section');if(sections[1])body.insertBefore(sec,sections[1]);else body.appendChild(sec);
    sec.querySelectorAll('[data-lineup-all]').forEach(b=>b.onclick=()=>sec.querySelectorAll(`[data-lineup-side="${b.dataset.lineupAll}"] input[type="checkbox"]`).forEach(i=>i.checked=true));
    sec.querySelectorAll('[data-lineup-none]').forEach(b=>b.onclick=()=>sec.querySelectorAll(`[data-lineup-side="${b.dataset.lineupNone}"] input[type="checkbox"]`).forEach(i=>i.checked=false));
    sec.querySelector('[data-save-lineup]').onclick=()=>saveLineup(sec,m,home,away);
  }

  async function saveLineup(sec,m,home,away){
    const btn=sec.querySelector('[data-save-lineup]'),status=sec.querySelector('.ap-lineup-status');btn.disabled=true;status.textContent='Сохраняю…';
    try{
      const profiles=await freshProfiles(),freshHome=profiles.get(Number(home.id)),freshAway=profiles.get(Number(away.id));
      if(!freshHome||!freshAway)throw Error('Свежие данные одной из команд не найдены — сохранение отменено, чтобы не перезаписать карточку команды');
      const hm=readMap(freshHome.arenas),am=readMap(freshAway.arenas),hsel=selectedNames(sec,'home'),asel=selectedNames(sec,'away');
      if(hsel.length)hm[String(m.id)]=hsel;else delete hm[String(m.id)];if(asel.length)am[String(m.id)]=asel;else delete am[String(m.id)];
      await Promise.all([saveTeam(freshHome,writeMap(freshHome.arenas,hm)),saveTeam(freshAway,writeMap(freshAway.arenas,am))]);
      status.textContent=`Сохранено: ${hsel.length} + ${asel.length} игроков`;await loadData(D.tournament.slug,D.stage.id);
    }catch(e){status.textContent='Ошибка: '+(e.message||String(e))}finally{btn.disabled=false}
  }

  document.addEventListener('click',e=>{const b=e.target.closest?.('.protocol-btn');if(b){const card=b.closest('.match-card');lastMatchId=Number(card?.dataset.id)||null;setTimeout(inject,50)}},true);
  const obs=new MutationObserver(()=>{if(document.querySelector('.ap-overlay.open'))setTimeout(inject,0)});obs.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
})();
