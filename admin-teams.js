(()=>{
  const load=src=>new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src=src;
    s.onload=resolve;
    s.onerror=()=>reject(new Error('Не удалось загрузить '+src));
    document.head.appendChild(s);
  });
  load('/admin-teams-core.js?v=20260823-2')
    .then(()=>load('/admin-team-preview.js?v=20260823-2'))
    .then(()=>load('/admin-fhr-sync.js?v=20260827-2'))
    .catch(e=>console.error(e));
})();
