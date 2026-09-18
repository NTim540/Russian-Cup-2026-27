(()=>{
  if(window.__cupMobileNav)return;window.__cupMobileNav=true;
  const style=document.createElement('style');style.id='cup-mobile-nav-style';style.textContent=`
    .mobile-menu-toggle,.mobile-theme-entry{display:none}
    @media(max-width:820px){
      html .site-header{overflow:visible!important}
      html .header-inner{
        min-height:58px!important;
        display:flex!important;
        align-items:center!important;
        gap:10px!important;
        position:relative!important;
      }
      html .brand{
        flex:1 1 auto!important;
        min-width:0!important;
        gap:9px!important;
        overflow:hidden!important;
      }
      html .brand-mark{
        width:34px!important;
        height:34px!important;
        flex:0 0 34px!important;
        border-radius:8px!important;
      }
      html .brand-mark.logo-ready img{
        width:25px!important;
        height:25px!important;
      }
      html .brand-copy{
        min-width:0!important;
        display:block!important;
      }
      html .brand-copy small{
        display:none!important;
      }
      html .brand-copy strong{
        display:block!important;
        font-size:12px!important;
        line-height:1.15!important;
        white-space:nowrap!important;
        overflow:hidden!important;
        text-overflow:ellipsis!important;
        letter-spacing:.01em!important;
      }

      html .theme-toggle{display:none!important}

      html .mobile-menu-toggle{
        display:inline-grid!important;
        width:38px!important;
        height:38px!important;
        flex:0 0 38px!important;
        place-items:center!important;
        margin-left:auto!important;
        border:1px solid rgba(126,190,255,.14)!important;
        border-radius:8px!important;
        background:rgba(255,255,255,.025)!important;
        color:var(--text)!important;
        padding:0!important;
        cursor:pointer!important;
      }
      html .mobile-menu-toggle svg{width:19px;height:19px;display:block}

      html .nav{
        position:absolute!important;
        left:-9px!important;
        right:-9px!important;
        top:calc(100% + 1px)!important;
        z-index:120!important;
        display:none!important;
        max-width:none!important;
        width:auto!important;
        margin:0!important;
        padding:10px!important;
        grid-template-columns:1fr!important;
        gap:5px!important;
        overflow:auto!important;
        max-height:calc(100vh - 72px)!important;
        background:rgba(4,14,24,.99)!important;
        border:1px solid rgba(126,190,255,.12)!important;
        border-top:0!important;
        box-shadow:0 24px 60px rgba(0,0,0,.48)!important;
        backdrop-filter:blur(20px)!important;
      }
      html .nav.mobile-open{display:grid!important}

      html .nav a,
      html .mobile-theme-entry{
        display:flex!important;
        align-items:center!important;
        justify-content:space-between!important;
        min-height:44px!important;
        padding:0 12px!important;
        border:1px solid rgba(126,190,255,.07)!important;
        border-radius:5px!important;
        background:rgba(255,255,255,.016)!important;
        color:#a8b8c9!important;
        font:inherit!important;
        font-size:10px!important;
        font-weight:850!important;
        line-height:1.2!important;
        letter-spacing:.055em!important;
        white-space:nowrap!important;
        text-transform:uppercase!important;
        text-align:left!important;
        cursor:pointer!important;
      }
      html .nav a:after{
        content:"→"!important;
        position:static!important;
        width:auto!important;
        height:auto!important;
        background:none!important;
        color:#4d7394!important;
        font-size:13px!important;
      }
      html .nav a:hover,
      html .nav a:focus,
      html .mobile-theme-entry:hover,
      html .mobile-theme-entry:focus{
        background:rgba(35,135,217,.07)!important;
        border-color:rgba(35,135,217,.20)!important;
        color:#fff!important;
      }
      html .nav a.concept-home{
        display:flex!important;
        color:#fff!important;
        border-left:2px solid var(--concept-red,#e31f2b)!important;
      }
      html .nav a.concept-home:after{
        content:"→"!important;
        display:block!important;
        position:static!important;
      }
      html .mobile-theme-entry{
        border-left:2px solid var(--concept-blue,#2387d9)!important;
      }
      html .mobile-theme-entry span:last-child{
        color:#6991b2!important;
        font-size:9px!important;
      }
      html body.mobile-menu-open{overflow:hidden!important}

      html[data-theme="light"] .mobile-menu-toggle{
        background:#fff!important;
        color:#183856!important;
        border-color:rgba(20,45,80,.12)!important;
      }
      html[data-theme="light"] .nav{
        background:rgba(248,251,255,.99)!important;
        border-color:rgba(20,45,80,.10)!important;
        box-shadow:0 24px 60px rgba(27,53,87,.16)!important;
      }
      html[data-theme="light"] .nav a,
      html[data-theme="light"] .mobile-theme-entry{
        background:#fff!important;
        border-color:rgba(20,45,80,.08)!important;
        color:#5f7288!important;
      }
      html[data-theme="light"] .nav a:hover,
      html[data-theme="light"] .nav a:focus,
      html[data-theme="light"] .mobile-theme-entry:hover,
      html[data-theme="light"] .mobile-theme-entry:focus{
        background:rgba(47,111,237,.05)!important;
        color:#102139!important;
      }
      html[data-theme="light"] .nav a.concept-home{color:#102139!important}
    }

    @media(max-width:430px){
      html .header-inner{min-height:56px!important;gap:8px!important}
      html .brand-mark{width:32px!important;height:32px!important;flex-basis:32px!important}
      html .brand-mark.logo-ready img{width:23px!important;height:23px!important}
      html .brand-copy strong{font-size:11px!important}
      html .mobile-menu-toggle{width:36px!important;height:36px!important;flex-basis:36px!important}
      html .nav{left:-9px!important;right:-9px!important;padding:8px!important}
      html .nav a,html .mobile-theme-entry{min-height:42px!important;font-size:9px!important}
    }
  `;document.head.appendChild(style);

  const iconOpen='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const iconClose='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

  function mount(){
    const header=document.querySelector('.header-inner'),nav=header?.querySelector('.nav');
    if(!header||!nav||document.querySelector('#mobileMenuToggle'))return;

    const themeEntry=document.createElement('button');
    themeEntry.type='button';
    themeEntry.className='mobile-theme-entry';
    themeEntry.innerHTML='<span>Тема сайта</span><span>сменить</span>';
    themeEntry.addEventListener('click',()=>{
      const theme=document.querySelector('#themeToggle');
      if(theme)theme.click();
    });
    nav.appendChild(themeEntry);

    const btn=document.createElement('button');
    btn.type='button';
    btn.id='mobileMenuToggle';
    btn.className='mobile-menu-toggle';
    btn.innerHTML=iconOpen;
    btn.setAttribute('aria-label','Открыть меню');
    btn.setAttribute('aria-expanded','false');
    header.appendChild(btn);

    const close=()=>{
      nav.classList.remove('mobile-open');
      document.body.classList.remove('mobile-menu-open');
      btn.innerHTML=iconOpen;
      btn.setAttribute('aria-expanded','false');
      btn.setAttribute('aria-label','Открыть меню');
    };
    const toggle=()=>{
      const open=!nav.classList.contains('mobile-open');
      nav.classList.toggle('mobile-open',open);
      document.body.classList.toggle('mobile-menu-open',open);
      btn.innerHTML=open?iconClose:iconOpen;
      btn.setAttribute('aria-expanded',String(open));
      btn.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');
    };
    btn.addEventListener('click',toggle);
    nav.addEventListener('click',e=>{if(e.target.closest('a'))close()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    document.addEventListener('click',e=>{
      if(window.innerWidth<=820&&nav.classList.contains('mobile-open')&&!header.contains(e.target))close();
    });
    window.addEventListener('resize',()=>{if(window.innerWidth>820)close()});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();