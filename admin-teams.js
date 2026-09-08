(()=>{
  const load=src=>new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src=src;
    s.onload=resolve;
    s.onerror=()=>reject(new Error('Не удалось загрузить '+src));
    document.head.appendChild(s);
  });

  // Independent admin helpers: one failed module should not block the others.
  load('/admin-fhr-sync.js?v=20260827-5').catch(e=>console.error('FHR sync:',e));
  load('/admin-player-lineups-v2.js?v=20260908-1').catch(e=>console.error('Player lineups:',e));
  load('/admin-lineup-storage-hide.js?v=20260907-1').catch(e=>console.error('Lineup storage:',e));
  load('/admin-data-quality.js?v=20260908-1').catch(e=>console.error('Data quality:',e));
  load('/admin-news.js?v=20260903-4')
    .then(()=>load('/admin-news-freeze.js?v=20260903-2'))
    .then(()=>load('/admin-news-match-widgets.js?v=20260904-1'))
    .catch(e=>console.error('News admin:',e));

  load('/admin-teams-core.js?v=20260823-2')
    .then(()=>load('/admin-team-preview.js?v=20260823-2'))
    .then(()=>load('/admin-player-photos.js?v=20260907-2'))
    .catch(e=>console.error('Team admin:',e));
})();
