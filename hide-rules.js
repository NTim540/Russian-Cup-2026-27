(()=>{
  const style=document.createElement('style');
  style.id='hide-rules-section';
  style.textContent='#rules,#maintenance-notice{display:none!important}';
  document.head.appendChild(style);

  function cleanupLaunchUi(){
    document.querySelectorAll('.nav a[href="#rules"],.footer-nav a[href="#rules"]').forEach(a=>{
      a.href='/regulation.html';
      a.textContent='Регламент';
      a.style.display='';
    });
    document.getElementById('maintenance-notice')?.remove();
  }
  cleanupLaunchUi();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',cleanupLaunchUi,{once:true});

  if((location.pathname==='/'||location.pathname.endsWith('/index.html'))&&!document.querySelector('script[data-home-ice-motion]')){
    const s=document.createElement('script');
    s.src='/home-ice-motion.js?v=20260909-1';
    s.dataset.homeIceMotion='1';
    document.head.appendChild(s);
  }
})();
