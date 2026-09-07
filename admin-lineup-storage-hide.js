(()=>{
  const BOX_ID='lineupStorageRows';
  function moveRows(){
    const form=document.querySelector('#teamAdminForm');if(!form)return;
    let box=form.querySelector('#'+BOX_ID);
    if(!box){box=document.createElement('div');box.id=BOX_ID;box.style.display='none';form.appendChild(box)}
    document.querySelectorAll('#arenaList .arena-row').forEach(row=>{
      const name=row.querySelector('.arena-name')?.value||'';
      if(String(name).startsWith('__LU_'))box.appendChild(row);
    });
  }
  let queued=false;const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;moveRows()})};
  new MutationObserver(queue).observe(document.body,{childList:true,subtree:true});
  setInterval(moveRows,800);moveRows();
})();
