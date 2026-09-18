(()=>{
  if(window.__cupMobileNav)return;window.__cupMobileNav=true;
  const style=document.createElement('style');style.id='cup-mobile-nav-style';style.textContent=`
    .mobile-menu-toggle{display:none}
    @media(max-width:820px){
      html .site-header{overflow:visible!important}
      html .header-inner{min-height:62px!important;display:grid!important;grid-template-columns:minmax(0,1fr) 38px 38px!important;align-items:center!important;gap:8px!important;position:relative}
      html .brand{min-width:0!important;gap:9px!important}
      html .brand-mark{width:38px!important;height:38px!important;flex:0 0 38px!important}
      html .brand-mark.logo-ready img{width:28px!important;height:28px!important}
      html .brand-copy{min-width:0!important}
      html .brand-copy small{font-size:7px!important;letter-spacing:.10em!important;margin-bottom:1px!important}
      html .brand-copy strong{font-size:12px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
      html .theme-toggle{width:38px!important;height:38px!important;margin:0!important}
      html .mobile-menu-toggle{display:inline-grid;width:38px;height:38px;place-items:center;border:1px solid var(--line);background:rgba(255,255,255,.025);color:var(--text);padding:0;cursor:pointer}
      html .mobile-menu-toggle svg{width:19px;height:19px;display:block}
      html .nav{position:absolute!important;left:0!important;right:0!important;top:calc(100% + 1px)!important;z-index:120!important;display:none!important;max-width:none!important;width:100%!important;margin:0!important;padding:10px!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:6px!important;overflow:auto!important;max-height:calc(100vh - 76px)!important;background:rgba(4,14,24,.985)!important;border:1px solid rgba(126,190,255,.12)!important;border-top:0!important;box-shadow:0 24px 60px rgba(0,0,0,.42)!important;backdrop-filter:blur(18px)!important}
      html .nav.mobile-open{display:grid!important}
      html .nav a{display:flex!important;align-items:center!important;min-height:44px!important;padding:10px 11px!important;border:1px solid rgba(126,190,255,.08)!important;background:rgba(255,255,255,.018)!important;color:#9fb1c4!important;font-size:9px!important;line-height:1.25!important;letter-spacing:.055em!important;white-space:normal!important;text-transform:uppercase!important}
      html .nav a:hover,html .nav a:focus{background:rgba(35,135,217,.08)!important;border-color:rgba(35,135,217,.20)!important;color:#fff!important}
      html .nav a.concept-home{display:flex!important;color:#fff!important}
      html .nav a.concept-home:after{display:none!important}
      html body.mobile-menu-open{overflow:hidden!important}
      html[data-theme="light"] .mobile-menu-toggle{background:#fff;color:#183856;border-color:rgba(20,45,80,.12)}
      html[data-theme="light"] .nav{background:rgba(248,251,255,.985)!important;border-color:rgba(20,45,80,.10)!important;box-shadow:0 24px 60px rgba(27,53,87,.16)!important}
      html[data-theme="light"] .nav a{background:#fff!important;border-color:rgba(20,45,80,.08)!important;color:#61748a!important}
      html[data-theme="light"] .nav a:hover,html[data-theme="light"] .nav a:focus{background:rgba(47,111,237,.06)!important;color:#102139!important}
    }
    @media(max-width:430px){
      html .header-inner{grid-template-columns:minmax(0,1fr) 36px 36px!important;gap:6px!important}
      html .theme-toggle,html .mobile-menu-toggle{width:36px!important;height:36px!important}
      html .brand-copy strong{font-size:11px!important}
      html .nav{grid-template-columns:1fr 1fr!important;padding:8px!important}
    }
  `;document.head.appendChild(style);

  const iconOpen='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const iconClose='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

  function mount(){
    const header=document.querySelector('.header-inner'),nav=header?.querySelector('.nav');if(!header||!nav||document.querySelector('#mobileMenuToggle'))return;
    const btn=document.createElement('button');btn.type='button';btn.id='mobileMenuToggle';btn.className='mobile-menu-toggle';btn.innerHTML=iconOpen;btn.setAttribute('aria-label','Открыть меню');btn.setAttribute('aria-expanded','false');
    header.appendChild(btn);
    const close=()=>{
      nav.classList.remove('mobile-open');document.body.classList.remove('mobile-menu-open');btn.innerHTML=iconOpen;btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-label','Открыть меню');
    };
    const toggle=()=>{
      const open=!nav.classList.contains('mobile-open');nav.classList.toggle('mobile-open',open);document.body.classList.toggle('mobile-menu-open',open);btn.innerHTML=open?iconClose:iconOpen;btn.setAttribute('aria-expanded',String(open));btn.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');
    };
    btn.addEventListener('click',toggle);
    nav.addEventListener('click',e=>{if(e.target.closest('a'))close()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    document.addEventListener('click',e=>{if(window.innerWidth<=820&&nav.classList.contains('mobile-open')&&!header.contains(e.target))close()});
    window.addEventListener('resize',()=>{if(window.innerWidth>820)close()});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();