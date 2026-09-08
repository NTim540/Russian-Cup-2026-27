(()=>{
  const ACCESS='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-access';
  const MAIN='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup';
  const SESSION_KEY='rc_admin_session_v2';
  const LABELS={matches:'Матчи и результаты',groups:'Группы и участники',teams:'Команды и составы',news:'Новости',tournament:'Настройки турнира',analytics:'Аналитика',users:'Аккаунты и права'};
  const PERMS=Object.keys(LABELS);
  let profile=null,accountsMounted=false,observer=null;

  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const q=s=>document.querySelector(s);
  const qa=s=>[...document.querySelectorAll(s)];
  const can=p=>Boolean(profile&&(profile.legacy_owner||profile.permissions?.includes('*')||profile.permissions?.includes(p)));
  window.adminCan=can;
  window.ADMIN_PROFILE=null;

  const style=document.createElement('style');
  style.textContent=`
    .admin-login-user{margin-bottom:10px}.admin-session-chip{display:inline-flex;align-items:center;gap:8px;padding:7px 10px;border:1px solid rgba(127,198,255,.18);border-radius:999px;background:rgba(127,198,255,.055);color:#cfeaff;font-size:11px;font-weight:800}.admin-session-dot{width:7px;height:7px;border-radius:50%;background:#48c38b;box-shadow:0 0 14px rgba(72,195,139,.6)}
    .access-grid{display:grid;grid-template-columns:minmax(320px,.78fr) minmax(0,1.22fr);gap:14px}.access-create,.access-list{padding:17px}.access-perms{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:9px}.access-check{display:flex;gap:8px;align-items:flex-start;padding:9px 10px;border:1px solid var(--line);border-radius:11px;background:rgba(255,255,255,.025);font-size:11px;color:#d8e4f1}.access-check input{margin-top:2px;accent-color:#2f6fed}.access-list-items{display:grid;gap:10px}.access-user{padding:14px;border:1px solid var(--line);border-radius:14px;background:rgba(255,255,255,.025)}.access-user.off{opacity:.58}.access-user-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:11px}.access-user-head strong{font-size:14px}.access-user-login{color:var(--muted);font-size:10px;margin-top:3px}.access-user-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.access-user-grid .wide{grid-column:1/-1}.access-user-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:11px}.access-badge{padding:5px 7px;border-radius:999px;border:1px solid var(--line);font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.07em}.access-badge.on{color:#85deb1;border-color:rgba(72,195,139,.28);background:rgba(72,195,139,.07)}.access-badge.off{color:#ff9ca4;border-color:rgba(226,58,71,.28);background:rgba(226,58,71,.07)}.access-note{padding:11px 12px;border:1px dashed var(--line);border-radius:12px;color:var(--muted);font-size:11px;line-height:1.5;margin-top:12px}.access-status{min-height:16px;margin-top:9px;color:#91a6bd;font-size:11px}.access-status.ok{color:#84dcb0}.access-status.bad{color:#ff9ca4}
    @media(max-width:900px){.access-grid{grid-template-columns:1fr}}@media(max-width:620px){.access-perms,.access-user-grid{grid-template-columns:1fr}.access-user-grid .wide{grid-column:auto}}
  `;
  document.head.appendChild(style);

  function enhanceLogin(){
    const login=q('#login'),pw=q('#pw'),btn=q('#loginBtn');if(!login||!pw||!btn)return;
    const p=login.querySelector('p.muted');if(p)p.textContent='Войдите по логину и паролю. Владелец может оставить логин пустым и использовать прежний пароль администратора.';
    if(!q('#adminUsername')){
      const f=document.createElement('div');f.className='field admin-login-user';f.innerHTML='<label>Логин</label><input id="adminUsername" class="input" autocomplete="username" placeholder="Например, editor">';
      pw.closest('.field')?.insertAdjacentElement('beforebegin',f);
    }
    pw.closest('.field')?.querySelector('label')?.replaceChildren(document.createTextNode('Пароль'));
    btn.onclick=customLogin;
    const onEnter=e=>{if(e.key==='Enter'){e.preventDefault();e.stopImmediatePropagation();customLogin()}};
    pw.addEventListener('keydown',onEnter,true);q('#adminUsername')?.addEventListener('keydown',onEnter,true);
  }

  async function access(path,opt={}){const r=await fetch(ACCESS+path,opt),b=await r.json().catch(()=>({}));if(!r.ok)throw Error(b.error||'Ошибка доступа');return b}
  async function mainCheck(cred){const r=await fetch(MAIN+'/api/admin-check',{method:'POST',headers:{'x-admin-password':cred}}),b=await r.json().catch(()=>({}));if(!r.ok)throw Error('Неверный пароль');return b}

  async function customLogin(){
    const username=q('#adminUsername')?.value.trim().toLowerCase()||'',password=q('#pw')?.value||'',msg=q('#loginMsg');if(msg)msg.textContent='Проверяю…';
    try{
      let p;
      if(username){const b=await access('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})});PW=b.token;p=b.user;sessionStorage.setItem(SESSION_KEY,b.token)}
      else{PW=password;const b=await mainCheck(PW);p=b.user||{username:'owner',display_name:'Владелец',permissions:['*'],legacy_owner:true};sessionStorage.removeItem(SESSION_KEY)}
      await openApp(p);
    }catch(e){if(msg)msg.textContent=e.message||'Не удалось войти'}
  }

  async function openApp(p){
    profile=p;window.ADMIN_PROFILE=p;q('#login')?.classList.add('hidden');q('#app')?.classList.remove('hidden');q('#loginMsg')&&(q('#loginMsg').textContent='');
    mountSessionChip();applyAccess();mountAccounts();startObserver();
    document.dispatchEvent(new CustomEvent('admin-auth-ready',{detail:{profile:p}}));
    try{await loadCatalog()}catch(e){console.error('Admin catalog:',e)}
    setTimeout(()=>{applyAccess();mountAccounts()},120);
  }

  function mountSessionChip(){
    if(q('#adminSessionChip'))return;const top=q('.top');if(!top)return;const actions=q('#logout')?.parentElement||top;const chip=document.createElement('div');chip.id='adminSessionChip';chip.className='admin-session-chip';chip.innerHTML='<span class="admin-session-dot"></span><span>'+esc(profile?.display_name||profile?.username||'Администратор')+'</span>';
    q('#logout')?.insertAdjacentElement('beforebegin',chip);
    const logout=q('#logout');if(logout)logout.onclick=async()=>{const tok=sessionStorage.getItem(SESSION_KEY);if(tok)await fetch(ACCESS+'/api/logout',{method:'POST',headers:{'x-admin-password':tok}}).catch(()=>{});sessionStorage.removeItem(SESSION_KEY);location.reload()};
  }

  const tabPerm={groups:'groups',matches:'matches',settings:'tournament',analytics:'analytics',teams:'teams',news:'news',accounts:'users'};
  function applyAccess(){
    if(!profile)return;
    qa('.tab[data-tab]').forEach(b=>{const p=tabPerm[b.dataset.tab];if(p)b.classList.toggle('hidden',!can(p))});
    Object.entries(tabPerm).forEach(([tab,p])=>q('#tab-'+tab)?.classList.toggle('access-denied',!can(p)));
    const ids={newTournament:'tournament',newStage:'tournament',saveSettings:'tournament',saveTournament:'tournament',deleteTournament:'tournament',addGroup:'groups',addMatch:'matches'};
    Object.entries(ids).forEach(([id,p])=>q('#'+id)?.classList.toggle('hidden',!can(p)));
    ['winPts','otPts','regPts'].forEach(id=>{const el=q('#'+id);if(el)el.disabled=!can('tournament')});
    if(!profile.legacy_owner)qa('.fhr-sync-box').forEach(x=>x.classList.add('hidden'));
    const active=q('.tab.active[data-tab]');if(active&&active.classList.contains('hidden')){
      const first=qa('.tab[data-tab]').find(x=>!x.classList.contains('hidden'));first?.click();
    }
  }

  function startObserver(){if(observer)return;let queued=false;observer=new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;applyAccess();if(can('users'))mountAccounts()})});observer.observe(document.body,{childList:true,subtree:true})}

  function permsHtml(selected=[]){const s=new Set(selected);return PERMS.map(p=>`<label class="access-check"><input type="checkbox" value="${p}" ${s.has(p)?'checked':''}><span>${esc(LABELS[p])}</span></label>`).join('')}
  function readPerms(box){return [...box.querySelectorAll('.access-check input:checked')].map(x=>x.value)}

  function mountAccounts(){
    if(!can('users')||accountsMounted)return;const tabs=q('.tabs'),settings=q('#tab-settings');if(!tabs||!settings)return;accountsMounted=true;
    const btn=document.createElement('button');btn.className='tab';btn.dataset.tab='accounts';btn.textContent='Аккаунты';tabs.appendChild(btn);
    const section=document.createElement('section');section.id='tab-accounts';section.className='hidden';section.innerHTML=`<div class="panel-title"><div><h2 style="margin:0">Аккаунты и права</h2><div class="muted">Отдельный вход для каждого администратора и доступ только к нужным разделам.</div></div><button id="accessReload" class="btn sec small">Обновить</button></div><div class="access-grid"><section class="card access-create"><h3 style="margin-top:0">Новый аккаунт</h3><div class="field"><label>Имя</label><input id="accessNewName" class="input" placeholder="Например, Редактор новостей"></div><div class="field" style="margin-top:9px"><label>Логин</label><input id="accessNewLogin" class="input" placeholder="editor"></div><div class="field" style="margin-top:9px"><label>Пароль</label><input id="accessNewPassword" class="input" type="password" autocomplete="new-password" placeholder="Минимум 8 символов"></div><div style="margin-top:12px"><div class="muted">Полномочия</div><div id="accessNewPerms" class="access-perms">${permsHtml([])}</div></div><button id="accessCreate" class="btn" style="margin-top:13px">Создать аккаунт</button><div id="accessCreateStatus" class="access-status"></div><div class="access-note">Право «Аккаунты и права» фактически позволяет управлять доступом других администраторов. Выдавайте его только тем, кому доверяете управление всей командой админки.</div></section><section class="card access-list"><div class="panel-title"><div><h3 style="margin:0">Администраторы</h3><div id="accessCount" class="muted"></div></div></div><div id="accessUsers" class="access-list-items"><div class="empty">Загружаю аккаунты…</div></div><div class="access-note">Твой прежний пароль владельца остаётся резервным полным доступом и специально не показывается в списке аккаунтов.</div></section></div>`;
    settings.insertAdjacentElement('afterend',section);
    btn.addEventListener('click',()=>openAccountsTab(btn,section));q('#accessReload').onclick=loadUsers;q('#accessCreate').onclick=createUser;loadUsers();
    applyAccess();
  }

  function openAccountsTab(btn,section){qa('.tab').forEach(x=>x.classList.toggle('active',x===btn));qa('[id^="tab-"]').forEach(x=>x.classList.toggle('hidden',x!==section));section.classList.remove('hidden');loadUsers()}

  async function usersApi(opt={}){opt.headers={...(opt.headers||{}),'x-admin-password':PW};return access('/api/users',opt)}
  async function createUser(){const btn=q('#accessCreate'),st=q('#accessCreateStatus');btn.disabled=true;st.className='access-status';st.textContent='Создаю…';try{await usersApi({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'create',display_name:q('#accessNewName').value.trim(),username:q('#accessNewLogin').value.trim(),password:q('#accessNewPassword').value,permissions:readPerms(q('#accessNewPerms'))})});q('#accessNewName').value='';q('#accessNewLogin').value='';q('#accessNewPassword').value='';q('#accessNewPerms').innerHTML=permsHtml([]);st.className='access-status ok';st.textContent='Аккаунт создан';await loadUsers()}catch(e){st.className='access-status bad';st.textContent=e.message||String(e)}finally{btn.disabled=false}}

  async function loadUsers(){const box=q('#accessUsers');if(!box)return;box.innerHTML='<div class="empty">Загружаю аккаунты…</div>';try{const b=await usersApi();const items=b.items||[];q('#accessCount').textContent=`Всего: ${items.length}`;box.innerHTML=items.length?items.map(userCard).join(''):'<div class="empty">Дополнительных аккаунтов пока нет.</div>';wireUsers()}catch(e){box.innerHTML='<div class="empty">'+esc(e.message||String(e))+'</div>'}}
  function userCard(u){const last=u.last_login_at?new Date(u.last_login_at).toLocaleString('ru-RU'):'ещё не входил';return `<article class="access-user ${u.is_active?'':'off'}" data-user="${u.id}"><div class="access-user-head"><div><strong>${esc(u.display_name||u.username)}</strong><div class="access-user-login">@${esc(u.username)} · ${esc(last)}</div></div><span class="access-badge ${u.is_active?'on':'off'}">${u.is_active?'Активен':'Отключён'}</span></div><div class="access-user-grid"><div class="field"><label>Имя</label><input class="input au-name" value="${esc(u.display_name||'')}"></div><div class="field"><label>Логин</label><input class="input au-login" value="${esc(u.username)}"></div><div class="wide"><div class="muted">Полномочия</div><div class="access-perms au-perms">${permsHtml(u.permissions||[])}</div></div></div><div class="access-user-actions"><button class="btn small au-save">Сохранить</button><button class="btn sec small au-password">Сменить пароль</button><button class="btn sec small au-toggle">${u.is_active?'Отключить':'Включить'}</button><button class="btn danger small au-delete">Удалить</button></div><div class="access-status au-status"></div></article>`}
  function wireUsers(){qa('.access-user').forEach(card=>{const id=Number(card.dataset.user),status=card.querySelector('.au-status');card.querySelector('.au-save').onclick=()=>updateUser(card,id,true,status);card.querySelector('.au-toggle').onclick=()=>updateUser(card,id,false,status);card.querySelector('.au-password').onclick=()=>setPassword(id,status);card.querySelector('.au-delete').onclick=()=>deleteUser(id,status)})}
  async function updateUser(card,id,keepState,status){const badge=card.querySelector('.access-badge'),currently=!card.classList.contains('off'),is_active=keepState?currently:!currently;status.textContent='Сохраняю…';status.className='access-status au-status';try{await usersApi({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'update',id,display_name:card.querySelector('.au-name').value.trim(),username:card.querySelector('.au-login').value.trim(),permissions:readPerms(card.querySelector('.au-perms')),is_active})});status.className='access-status au-status ok';status.textContent='Сохранено';await loadUsers()}catch(e){status.className='access-status au-status bad';status.textContent=e.message||String(e)}}
  async function setPassword(id,status){const password=prompt('Новый пароль (минимум 8 символов):');if(password===null)return;status.textContent='Меняю пароль…';try{await usersApi({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'set_password',id,password})});status.className='access-status au-status ok';status.textContent='Пароль изменён. Активные сессии пользователя завершены.'}catch(e){status.className='access-status au-status bad';status.textContent=e.message||String(e)}}
  async function deleteUser(id,status){if(!confirm('Удалить этот аккаунт?'))return;status.textContent='Удаляю…';try{await usersApi({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'delete',id})});await loadUsers()}catch(e){status.className='access-status au-status bad';status.textContent=e.message||String(e)}}

  async function restore(){const tok=sessionStorage.getItem(SESSION_KEY);if(!tok)return;try{PW=tok;const b=await access('/api/me',{headers:{'x-admin-password':tok}});await openApp(b.user)}catch{sessionStorage.removeItem(SESSION_KEY)}}

  enhanceLogin();restore();
})();
