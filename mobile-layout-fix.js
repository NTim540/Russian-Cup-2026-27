(()=>{
  if(document.getElementById('mobile-layout-fix'))return;
  const style=document.createElement('style');
  style.id='mobile-layout-fix';
  style.textContent=`
    @media (max-width: 820px){
      html,body{width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:hidden!important}
      body{margin:0!important}
      .site-header,#maintenance-notice,main,footer,.hero,.section,#my-team-section{width:100%!important;max-width:100%!important;min-width:0!important}
      .wrap,#maintenance-notice .mn-inner{width:calc(100% - 20px)!important;max-width:calc(100% - 20px)!important;min-width:0!important;margin-left:auto!important;margin-right:auto!important}
      .header-inner{width:100%!important;max-width:100%!important;min-width:0!important;gap:10px!important}
      .brand{flex:0 1 auto!important;min-width:0!important;max-width:56%!important}
      .brand-copy{min-width:0!important;overflow:hidden!important}
      .brand-copy strong,.brand-copy small{overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
      .nav{flex:1 1 auto!important;min-width:0!important;max-width:44%!important;overflow-x:auto!important;overflow-y:hidden!important;justify-content:flex-start!important;-webkit-overflow-scrolling:touch;scrollbar-width:none}
      .nav::-webkit-scrollbar{display:none}
      .nav a{flex:0 0 auto!important;white-space:nowrap!important}
      .hero{overflow:hidden!important}
      .hero>*,.section>*,main>*{max-width:100%!important;min-width:0!important}
      .hero-actions,.hero-controls,.hero-stats,.tour-panel,.groups-grid,.upcoming-grid{max-width:100%!important;min-width:0!important}
      img,svg,canvas,video{max-width:100%}
      #maintenance-notice .mn-copy{min-width:0!important}
    }
    @supports (width: 100dvw){
      @media (max-width: 820px){
        html,body,.site-header,#maintenance-notice,main,footer,.hero,.section,#my-team-section{width:100dvw!important;max-width:100dvw!important}
        .wrap,#maintenance-notice .mn-inner{width:calc(100dvw - 20px)!important;max-width:calc(100dvw - 20px)!important}
      }
    }
  `;
  document.head.appendChild(style);

  function normalize(){
    if(!matchMedia('(max-width:820px)').matches)return;
    document.documentElement.style.maxWidth='100%';
    document.body.style.maxWidth='100%';
    document.body.style.width='100%';
  }
  normalize();
  addEventListener('resize',normalize,{passive:true});
  if(window.visualViewport)visualViewport.addEventListener('resize',normalize,{passive:true});
})();
