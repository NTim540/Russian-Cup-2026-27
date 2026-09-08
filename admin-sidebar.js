(()=>{
  const app=document.querySelector('#app');
  const tabs=app?.querySelector('.tabs');
  if(!app||!tabs||app.dataset.sidebarReady==='1')return;
  app.dataset.sidebarReady='1';

  const style=document.createElement('style');
  style.textContent=`
    #app{width:min(1500px,calc(100vw - 28px));margin:0 auto}
    .admin-shell{display:grid;grid-template-columns:246px minmax(0,1fr);gap:28px;align-items:start}
    .admin-sidebar{position:sticky;top:86px;height:calc(100vh - 104px);display:flex;flex-direction:column;padding:13px;border:1px solid var(--line);border-radius:18px;background:linear-gradient(180deg,rgba(14,29,48,.97),rgba(8,20,35,.97));box-shadow:0 22px 65px rgba(0,0,0,.24);overflow:hidden}
    .admin-sidebar-head{padding:7px 8px 13px;border-bottom:1px solid var(--line);margin-bottom:10px}
    .admin-sidebar-kicker{font-size:9px;font-weight:900;letter-spacing:.15em;text-transform:uppercase;color:#6f89a4}
    .admin-sidebar-title{margin-top:5px;font-size:15px;font-weight:950;letter-spacing:-.02em}
    .admin-sidebar .tabs{display:flex;flex:1;min-height:0;flex-direction:column;gap:4px;margin:0;padding:0 2px;overflow-y:auto;overflow-x:hidden;scrollbar-width:thin}
    .admin-sidebar .tab{position:relative;width:100%;min-height:43px;display:flex;align-items:center;gap:10px;white-space:normal;text-align:left;border:1px solid transparent;background:transparent;color:#91a5bb;border-radius:11px;padding:10px 11px;font-size:12px;font-weight:760;line-height:1.25;transition:.16s ease}
    .admin-sidebar .tab:hover{color:#fff;background:rgba(255,255,255,.045);border-color:rgba(255,255,255,.055)}
    .admin-sidebar .tab.active{color:#fff;background:linear-gradient(90deg,rgba(47,111,237,.23),rgba(47,111,237,.08));border-color:rgba(76,132,239,.30);box-shadow:inset 3px 0 0 #3980ef}
    .admin-sidebar .tab::before{content:'•';width:18px;flex:0 0 18px;display:grid;place-items:center;color:#6d849b;font-size:14px;font-weight:950}
    .admin-sidebar .tab.active::before{color:#7fc6ff}
    .admin-sidebar .tab[data-tab='groups']::before{content:'▦'}
    .admin-sidebar .tab[data-tab='matches']::before{content:'◫'}
    .admin-sidebar .tab[data-tab='quality']::before,.admin-sidebar .tab[data-tab='data-quality']::before{content:'✓'}
    .admin-sidebar .tab[data-tab='settings']::before{content:'⚙'}
    .admin-sidebar .tab[data-tab='teams']::before{content:'◆'}
    .admin-sidebar .tab[data-tab='analytics']::before{content:'↗'}
    .admin-sidebar .tab[data-tab='news']::before{content:'≡'}
    .admin-sidebar .tab[data-tab='accounts']::before{content:'◎'}
    .admin-sidebar .tab[href*='infographics']::before{content:'▤'}
    .admin-sidebar .tab[href]{margin-top:auto}
    .admin-sidebar-foot{padding:11px 8px 4px;margin-top:10px;border-top:1px solid var(--line);font-size:9px;line-height:1.45;color:#60758d}
    .admin-main{min-width:0;padding-bottom:42px}
    .admin-main>.top{margin-top:27px}
    .admin-sidebar-toggle{display:none;width:42px;height:42px;border:1px solid var(--line);border-radius:11px;background:rgba(255,255,255,.05);color:#fff;cursor:pointer;align-items:center;justify-content:center;padding:0}
    .admin-sidebar-toggle span,.admin-sidebar-toggle::before,.admin-sidebar-toggle::after{content:'';display:block;width:17px;height:2px;border-radius:2px;background:currentColor;position:absolute;transition:.18s ease}
    .admin-sidebar-toggle{position:relative}.admin-sidebar-toggle::before{transform:translateY(-5px)}.admin-sidebar-toggle::after{transform:translateY(5px)}
    .admin-sidebar-backdrop{display:none}
    @media(max-width:1050px){
      #app{width:min(100% - 24px,1240px)}
      .admin-shell{grid-template-columns:218px minmax(0,1fr);gap:18px}
    }
    @media(max-width:820px){
      #app{width:min(100% - 16px,1240px)}
      .admin-shell{display:block}
      .admin-sidebar{position:fixed;z-index:80;top:0;left:0;width:min(310px,86vw);height:100dvh;border-radius:0 18px 18px 0;padding:18px 13px;transform:translateX(-104%);transition:transform .2s ease;box-shadow:30px 0 70px rgba(0,0,0,.42)}
      body.admin-sidebar-open{overflow:hidden}
      body.admin-sidebar-open .admin-sidebar{transform:translateX(0)}
      .admin-sidebar-backdrop{display:block;position:fixed;z-index:79;inset:0;background:rgba(2,8,16,.64);backdrop-filter:blur(2px);opacity:0;pointer-events:none;transition:opacity .18s ease}
      body.admin-sidebar-open .admin-sidebar-backdrop{opacity:1;pointer-events:auto}
      .admin-sidebar-toggle{display:inline-flex}
      .admin-main>.top{margin-top:18px;align-items:center}
    }
  `;
  document.head.appendChild(style);

  const shell=document.createElement('div');
  shell.className='admin-shell';
  const sidebar=document.createElement('aside');
  sidebar.className='admin-sidebar';
  sidebar.setAttribute('aria-label','Разделы админки');
  const sidebarHead=document.createElement('div');
  sidebarHead.className='admin-sidebar-head';
  sidebarHead.innerHTML='<div class="admin-sidebar-kicker">Панель управления</div><div class="admin-sidebar-title">Разделы</div>';
  const sidebarFoot=document.createElement('div');
  sidebarFoot.className='admin-sidebar-foot';
  sidebarFoot.textContent='Кубок России U16 · 2026/27';
  const main=document.createElement('div');
  main.className='admin-main';

  const children=[...app.children];
  sidebar.append(sidebarHead,tabs,sidebarFoot);
  children.forEach(node=>{if(node!==tabs)main.appendChild(node)});
  shell.append(sidebar,main);
  app.appendChild(shell);

  const backdrop=document.createElement('div');
  backdrop.className='admin-sidebar-backdrop';
  backdrop.setAttribute('aria-hidden','true');
  document.body.appendChild(backdrop);

  const top=main.querySelector('.top');
  if(top){
    const toggle=document.createElement('button');
    toggle.type='button';
    toggle.className='admin-sidebar-toggle';
    toggle.setAttribute('aria-label','Открыть меню');
    toggle.innerHTML='<span></span>';
    top.insertBefore(toggle,top.firstChild);
    toggle.addEventListener('click',()=>document.body.classList.toggle('admin-sidebar-open'));
  }
  backdrop.addEventListener('click',()=>document.body.classList.remove('admin-sidebar-open'));
  tabs.addEventListener('click',e=>{if(e.target.closest('.tab')&&matchMedia('(max-width:820px)').matches)document.body.classList.remove('admin-sidebar-open')});
  addEventListener('keydown',e=>{if(e.key==='Escape')document.body.classList.remove('admin-sidebar-open')});

  const normalize=()=>{
    [...tabs.children].forEach(el=>{
      if(!el.classList.contains('tab'))el.classList.add('tab');
      if(el.matches('a[href*="admin-infographics"]'))el.setAttribute('title','Открыть инфографику');
    });
  };
  new MutationObserver(normalize).observe(tabs,{childList:true});
  normalize();
})();
