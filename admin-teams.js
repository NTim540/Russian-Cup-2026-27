(()=>{
  const load=src=>new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src=src;
    s.onload=resolve;
    s.onerror=()=>reject(new Error('Не удалось загрузить '+src));
    document.head.appendChild(s);
  });

  load('/admin-sidebar.js?v=20260908-1').catch(e=>console.error('Admin sidebar:',e));
  load('/admin-access-ui.js?v=20260908-1').catch(e=>console.error('Admin access:',e));
  load('/admin-match-cards-v2.js?v=20260908-1').catch(e=>console.error('Match cards:',e));
  load('/admin-news-link.js?v=20260908-1').catch(e=>console.error('News link:',e));
  load('/admin-homepage.js?v=20260910-1').catch(e=>console.error('Homepage admin:',e));

  // Independent admin helpers: one failed module should not block the others.
  load('/admin-regulation-results.js?v=20260908-1').catch(e=>console.error('Regulation results:',e));
  load('/admin-player-lineups-v2.js?v=20260908-1').catch(e=>console.error('Player lineups:',e));
  load('/admin-lineup-storage-hide.js?v=20260907-1').catch(e=>console.error('Lineup storage:',e));
  load('/admin-data-quality.js?v=20260908-1').catch(e=>console.error('Data quality:',e));

  load('/admin-teams-core.js?v=20260823-2')
    .then(()=>load('/admin-team-hero-upload.js?v=20260908-1'))
    .then(()=>load('/admin-team-preview.js?v=20260823-2'))
    .then(()=>load('/admin-player-photos.js?v=20260907-2'))
    .catch(e=>console.error('Team admin:',e));

  // FHR synchronization remains an owner-only maintenance tool for now.
  document.addEventListener('admin-auth-ready',e=>{
    if(e.detail?.profile?.legacy_owner){
      load('/admin-fhr-sync.js?v=20260827-5')
        .then(()=>load('/admin-fhr-live-status.js?v=20260908-1'))
        .catch(err=>console.error('FHR sync:',err));
    }
  },{once:true});
})();
