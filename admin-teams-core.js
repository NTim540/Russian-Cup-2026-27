(()=>{
  const API='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-team-admin';
  const tabs=document.querySelector('.tabs'),settings=document.querySelector('#tab-settings');
  if(!tabs||!settings)return;

  const style=document.createElement('style');
  style.textContent=`
    .team-admin-layout{display:grid;grid-template-columns:280px minmax(0,1fr);gap:14px}.team-admin-list,.team-admin-editor{padding:16px}.team-admin-picker{display:grid;gap:7px}.team-admin-count{margin-top:7px;color:var(--muted);font-size:11px}.team-admin-preview{display:grid;place-items:center;min-height:190px;margin-top:12px;border:1px solid var(--line);border-radius:14px;background:rgba(255,255,255,.025);overflow:hidden;text-align:center;padding:12px}.team-admin-preview img{max-width:150px;max-height:150px;object-fit:contain;filter:drop-shadow(0 10px 22px rgba(0,0,0,.28))}.team-admin-preview span{color:var(--muted);font-size:12px;line-height:1.5}.team-admin-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.team-admin-grid .wide{grid-column:1/-1}.arena-list{display:grid;gap:9px;margin-top:10px}.arena-row{display:grid;grid-template-columns:.8fr 1.4fr auto;gap:8px;align-items:end;padding:10px;border:1px solid var(--line);border-radius:12px;background:rgba(255,255,255,.02)}.arena-remove{min-width:42px;height:42px}.team-admin-actions{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:14px}.team-admin-status{color:var(--muted);font-size:11px}.team-admin-note{margin-top:10px;padding:10px 12px;border:1px dashed var(--line);border-radius:11px;color:var(--muted);font-size:11px;line-height:1.5}
    @media(max-width:850px){.team-admin-layout{grid-template-columns:1fr}.team-admin-grid{grid-template-columns:1fr}.team-admin-grid .wide{grid-column:auto}.arena-row{grid-template-columns:1fr}.arena-remove{width:100%}}
  `;
  document.head.appendChild(style);

  const btn=document.createElement('button');
  btn.className='tab';btn.dataset.tab='teams';btn.textContent='Команды';
  const analyticsBtn=tabs.querySelector('[data-tab="analytics"]');
  if(analyticsBtn)tabs.insertBefore(btn,analyticsBtn);else tabs.appendChild(btn);

  const section=document.createElement('section');
  section.id='tab-teams';section.className='hidden';
  section.innerHTML=`
    <div class="panel-title"><div><h2 style="margin:0">Команды</h2><div class="muted">Логотип, фон города/арены, город, арены, соцсети и официальный сайт.</div></div><button type="button" id="teamAdminReload" class="btn sec small">Обновить список</button></div>
    <div class="team-admin-layout">
      <section class="card team-admin-list">
        <div class="team-admin-picker"><div class="field"><label>Команда</label><select id="teamAdminSelect" class="select"></select></div><div id="teamAdminCount" class="team-admin-count"></div></div>
        <div id="teamAdminPreview" class="team-admin-preview"><span>Выберите команду</span></div>
        <div class="team-admin-note">Можно оставить поле пустым — тогда на публичной странице соответствующая ссылка или дополнительная арена показываться не будет.</div>
      </section>
      <section class="card team-admin-editor">
        <div id="teamAdminForm"><div class="empty">Откройте раздел после загрузки турнира.</div></div>
      </section>
    </div>`;
  settings.insertAdjacentElement('afterend',section);

  const sel=section.querySelector('#teamAdminSelect'),preview=section.querySelector('#teamAdminPreview'),form=section.querySelector('#teamAdminForm'),count=section.querySelector('#teamAdminCount'),reload=section.querySelector('#teamAdminReload');
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let selectedId=null,TEAM_ROWS=[];

  function teams(){return [...TEAM_ROWS].sort((a,b)=>a.name.localeCompare(b.name,'ru'))}
  function team(){const list=teams();return list.find(t=>Number(t.id)===Number(selectedId))||list[0]||null}
  async function loadTeams(){
    const tid=Number(D?.tournament?.id);
    if(!tid){TEAM_ROWS=[];return}
    const r=await fetch(API+'?tournament_id='+encodeURIComponent(tid),{headers:{'x-admin-password':PW},cache:'no-store'});
    const b=await r.json().catch(()=>({}));
    if(!r.ok)throw Error(b.error||'Не удалось загрузить команды');
    TEAM_ROWS=Array.isArray(b.teams)?b.teams:[];
  }
  function renderPreview(t){const src=t?.logo_url||'';preview.innerHTML=src?`<img src="${esc(src)}" alt="Логотип ${esc(t.name)}" onerror="this.remove();this.parentElement.innerHTML='<span>Не удалось загрузить логотип</span>'">`:'<span>Собственный логотип не задан.<br>На сайте используется текущий стандартный логотип.</span>'}
  function arenaRows(items){const a=Array.isArray(items)?items:[];return a.map((x,i)=>`<div class="arena-row" data-arena="${i}"><div class="field"><label>Название арены</label><input class="input arena-name" value="${esc(x?.name||'')}" placeholder="Например, G-Drive Арена"></div><div class="field"><label>Адрес</label><input class="input arena-address" value="${esc(x?.address||'')}" placeholder="Город, улица, дом"></div><button type="button" class="btn danger small arena-remove" title="Удалить арену">×</button></div>`).join('')}
  function wireArenaRemove(){form.querySelectorAll('.arena-remove').forEach(b=>b.onclick=()=>b.closest('.arena-row')?.remove())}
  function addArena(){const list=form.querySelector('#arenaList');if(!list)return;const row=document.createElement('div');row.className='arena-row';row.innerHTML=`<div class="field"><label>Название арены</label><input class="input arena-name" placeholder="Например, G-Drive Арена"></div><div class="field"><label>Адрес</label><input class="input arena-address" placeholder="Город, улица, дом"></div><button type="button" class="btn danger small arena-remove" title="Удалить арену">×</button>`;list.appendChild(row);wireArenaRemove()}
  function renderForm(){const t=team();if(!t){form.innerHTML='<div class="empty">Команды не загружены.</div>';preview.innerHTML='<span>Нет данных</span>';return}selectedId=t.id;sel.value=String(t.id);renderPreview(t);form.innerHTML=`
      <div class="panel-title"><div><h3 style="margin:0">${esc(t.name)}</h3><div class="muted">Данные карточки команды</div></div><a class="btn sec small" target="_blank" href="/team.html?team=${t.id}">Открыть страницу ↗</a></div>
      <div class="team-admin-grid">
        <div class="field"><label>Город</label><input id="teamCity" class="input" value="${esc(t.city||'')}" placeholder="Например, Омск"></div>
        <div class="field"><label>Логотип · URL</label><input id="teamLogoUrl" class="input" value="${esc(t.logo_url||'')}" placeholder="https://..."></div>
        <div class="field wide"><label>Фото города / арены · URL</label><input id="teamHeroImageUrl" class="input" value="${esc(t.hero_image_url||'')}" placeholder="https://..."><div class="muted" style="margin-top:5px">Используется как затемнённый фон верхнего блока на странице команды.</div></div>
        <div class="field"><label>ВКонтакте</label><input id="teamVk" class="input" value="${esc(t.vk_url||'')}" placeholder="https://vk.com/..."></div>
        <div class="field"><label>Telegram</label><input id="teamTg" class="input" value="${esc(t.telegram_url||'')}" placeholder="https://t.me/..."></div>
        <div class="field"><label>MAX</label><input id="teamMax" class="input" value="${esc(t.max_url||'')}" placeholder="https://max.ru/..."></div>
        <div class="field"><label>Официальный сайт</label><input id="teamWeb" class="input" value="${esc(t.website_url||'')}" placeholder="https://..."></div>
        <div class="wide"><div class="panel-title" style="margin-top:6px"><div><strong>Арены</strong><div class="muted">Можно добавить несколько домашних арен.</div></div><button type="button" id="addArenaBtn" class="btn sec small">+ Арена</button></div><div id="arenaList" class="arena-list">${arenaRows(t.arenas)}</div></div>
      </div>
      <div class="team-admin-actions"><div id="teamAdminStatus" class="team-admin-status"></div><button type="button" id="saveTeamProfile" class="btn">Сохранить команду</button></div>`;
    form.querySelector('#addArenaBtn').onclick=addArena;wireArenaRemove();
    form.querySelector('#teamLogoUrl').addEventListener('input',e=>{const v=e.target.value.trim();preview.innerHTML=v?`<img src="${esc(v)}" alt="Предпросмотр логотипа">`:'<span>Собственный логотип не задан.</span>'});
    form.querySelector('#saveTeamProfile').onclick=save;
  }
  function renderPicker(){const list=teams();const keep=list.some(t=>Number(t.id)===Number(selectedId))?selectedId:list[0]?.id;selectedId=keep||null;sel.innerHTML=list.map(t=>`<option value="${t.id}">${esc(t.name)}</option>`).join('');count.textContent=list.length?`В списке: ${list.length} команд`:'Команды не найдены';if(selectedId)sel.value=String(selectedId);renderForm()}
  async function refreshPicker(){form.innerHTML='<div class="empty">Загружаю команды…</div>';try{await loadTeams();renderPicker()}catch(e){TEAM_ROWS=[];sel.innerHTML='';count.textContent='';preview.innerHTML='<span>Ошибка загрузки</span>';form.innerHTML='<div class="empty">'+esc(e.message||String(e))+'</div>'}}

  async function save(){const t=team();if(!t)return;const saveBtn=form.querySelector('#saveTeamProfile'),status=form.querySelector('#teamAdminStatus');const arenas=[...form.querySelectorAll('.arena-row')].map(r=>({name:r.querySelector('.arena-name').value.trim(),address:r.querySelector('.arena-address').value.trim()})).filter(x=>x.name||x.address);const body={action:'update_team_profile',id:t.id,city:form.querySelector('#teamCity').value.trim(),logo_url:form.querySelector('#teamLogoUrl').value.trim(),hero_image_url:form.querySelector('#teamHeroImageUrl').value.trim(),vk_url:form.querySelector('#teamVk').value.trim(),telegram_url:form.querySelector('#teamTg').value.trim(),max_url:form.querySelector('#teamMax').value.trim(),website_url:form.querySelector('#teamWeb').value.trim(),arenas};saveBtn.disabled=true;status.textContent='Сохраняю…';try{const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json','x-admin-password':PW},body:JSON.stringify(body)});const b=await r.json().catch(()=>({}));if(!r.ok)throw Error(b.error||'Не удалось сохранить');status.textContent='Сохранено';selectedId=t.id;await Promise.all([loadTeams(),loadData(D.tournament.slug,D.stage.id)]);renderPicker()}catch(e){status.textContent='Ошибка: '+(e.message||String(e))}finally{saveBtn.disabled=false}}

  sel.addEventListener('change',()=>{selectedId=Number(sel.value);renderForm()});
  reload.addEventListener('click',refreshPicker);
  btn.addEventListener('click',async()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===btn));document.querySelectorAll('[id^="tab-"]').forEach(x=>x.classList.toggle('hidden',x!==section));section.classList.remove('hidden');await refreshPicker()});
  document.querySelectorAll('.tab:not([data-tab="teams"])').forEach(x=>x.addEventListener('click',()=>section.classList.add('hidden')));
  document.querySelector('#tournament')?.addEventListener('change',()=>setTimeout(()=>{if(!section.classList.contains('hidden'))refreshPicker()},350));
  document.querySelector('#stage')?.addEventListener('change',()=>setTimeout(()=>{if(!section.classList.contains('hidden'))refreshPicker()},350));
})();