(()=>{
  const ID='overall-equal-place';
  if(document.documentElement.dataset[ID]==='1')return;
  document.documentElement.dataset[ID]='1';

  const norm=s=>String(s??'').replace(/\s+/g,' ').trim().toUpperCase();
  const num=s=>Number(String(s??'').replace(/[^0-9-]/g,''));

  function isOpeningTieFromDom(table){
    const head=[...table.querySelectorAll('thead th')].map(th=>norm(th.textContent));
    const gameIndex=head.findIndex(x=>x==='И');
    const pointsIndex=head.findIndex(x=>x==='О'||x==='ОЧКИ'||x==='ОЧК');
    const rows=[...table.querySelectorAll('tbody tr')];
    if(!rows.length||gameIndex<0||pointsIndex<0)return false;
    return rows.every(tr=>{
      const cells=[...tr.children];
      return cells[gameIndex]&&cells[pointsIndex]&&num(cells[gameIndex].textContent)===0&&num(cells[pointsIndex].textContent)===0;
    });
  }

  function isOpeningTieFromData(){
    try{
      if(typeof D==='undefined'||!D||!window.CupStandings)return false;
      const rows=window.CupStandings.overall(D,D.settings);
      return rows.length>0&&rows.every(r=>Number(r.gp)===0&&Number(r.pts)===0);
    }catch{return false}
  }

  function apply(){
    const table=document.querySelector('#overallTable');
    if(!table)return;
    const openingTie=isOpeningTieFromDom(table)||isOpeningTieFromData();
    if(!openingTie)return;

    table.querySelectorAll('tbody tr').forEach(tr=>{
      const place=tr.querySelector('td.place,td:first-child');
      if(!place)return;
      if(norm(place.textContent)==='1'&&!place.querySelector('.place-medal'))return;
      place.textContent='1';
    });
  }

  const watch=()=>{
    const table=document.querySelector('#overallTable');
    if(!table)return false;
    new MutationObserver(apply).observe(table,{childList:true,subtree:true,characterData:true});
    apply();
    return true;
  };

  if(!watch()){
    const bodyObserver=new MutationObserver(()=>{if(watch())bodyObserver.disconnect()});
    bodyObserver.observe(document.body,{childList:true,subtree:true});
  }
  document.addEventListener('DOMContentLoaded',apply,{once:true});
  setInterval(apply,500);
})();
