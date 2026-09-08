(()=>{
  const ID='overall-equal-place';
  if(document.documentElement.dataset[ID]==='1')return;
  document.documentElement.dataset[ID]='1';

  function apply(){
    try{
      if(typeof D==='undefined'||!D||!window.CupStandings)return;
      const rows=window.CupStandings.overall(D,D.settings);
      if(!rows.length)return;

      // Пока турнир не начался и у всех команд абсолютно одинаковые
      // показатели (0 игр / 0 очков), в общей таблице все делят 1-е место.
      const openingTie=rows.every(r=>Number(r.gp)===0&&Number(r.pts)===0);
      if(!openingTie)return;

      document.querySelectorAll('#overallTable tbody tr').forEach(tr=>{
        const place=tr.querySelector('td.place,td:first-child');
        if(place)place.textContent='1';
      });
    }catch(e){console.warn('Overall equal place:',e)}
  }

  const box=document.querySelector('#overallTable');
  if(box)new MutationObserver(apply).observe(box,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',apply,{once:true});
  apply();
  setInterval(apply,1200);
})();
