(()=>{
  const load=src=>new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src=src;
    s.onload=resolve;
    s.onerror=()=>reject(new Error('Не удалось загрузить '+src));
    document.head.appendChild(s);
  });

  // FHR sync is intentionally independent from the team-admin chain.
  // Even if a team preview helper fails, match synchronization must remain available.
  load('/admin-fhr-sync.js?v=20260827-4').catch(e=>console.error('FHR sync:',e));

  load('/admin-teams-core.js?v=20260823-2')
    .then(()=>load('/admin-team-preview.js?v=20260823-2'))
    .catch(e=>console.error('Team admin:',e));
})();
