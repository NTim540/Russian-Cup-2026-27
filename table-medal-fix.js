(()=>{
  const style=document.createElement('style');
  style.id='table-medal-fix';
  style.textContent=`
    html #overallTable tbody tr:nth-child(1) td.place,
    html #overallTable tbody tr:nth-child(2) td.place,
    html #overallTable tbody tr:nth-child(3) td.place{
      display:table-cell!important;
      width:auto!important;
      min-width:40px!important;
      height:auto!important;
      margin:0!important;
      border-radius:0!important;
      text-align:center!important;
      vertical-align:middle!important;
    }
    html #overallTable td.place .place-medal{
      display:inline-grid;
      place-items:center;
      width:24px;
      height:24px;
      border-radius:50%;
      font-weight:950;
      line-height:1;
    }
    html #overallTable tbody tr:nth-child(1) td.place .place-medal{background:rgba(215,176,54,.18);color:#f2ce67}
    html #overallTable tbody tr:nth-child(2) td.place .place-medal{background:rgba(166,181,197,.16);color:#d7e0e9}
    html #overallTable tbody tr:nth-child(3) td.place .place-medal{background:rgba(180,116,72,.17);color:#dca477}
    html[data-theme="light"] #overallTable tbody tr:nth-child(1) td.place .place-medal{background:rgba(215,176,54,.16);color:#a77d00}
    html[data-theme="light"] #overallTable tbody tr:nth-child(2) td.place .place-medal{background:rgba(108,126,145,.13);color:#65717e}
    html[data-theme="light"] #overallTable tbody tr:nth-child(3) td.place .place-medal{background:rgba(180,116,72,.14);color:#a8663f}
  `;
  document.head.appendChild(style);

  const norm=s=>String(s||'').replace(/\s+/g,' ').trim().toUpperCase();

  function reorderStandingsTable(table){
    const head=table.querySelector('thead tr');
    if(!head)return;
    const cells=[...head.children];
    const labels=cells.map(c=>norm(c.textContent));
    const iLoss=labels.findIndex(x=>x==='П');
    const iOtWin=labels.findIndex(x=>x==='ВО/Б'||x==='В ОТ/Б');
    const iOtLoss=labels.findIndex(x=>x==='ПО/Б'||x==='П ОТ/Б');

    if(iOtWin>=0){
      cells[iOtWin].textContent='В ОТ/Б';
      cells[iOtWin].title='Победы в овертайме или по буллитам';
    }
    if(iOtLoss>=0){
      cells[iOtLoss].textContent='П ОТ/Б';
      cells[iOtLoss].title='Поражения в овертайме или по буллитам';
    }

    if(iLoss<0||iOtWin<0||iOtWin<iLoss)return;
    head.insertBefore(cells[iOtWin],cells[iLoss]);
    table.querySelectorAll('tbody tr').forEach(tr=>{
      const row=[...tr.children];
      if(row[iOtWin]&&row[iLoss])tr.insertBefore(row[iOtWin],row[iLoss]);
    });
  }

  function fix(){
    document.querySelectorAll('#overallTable, #groupTables table').forEach(reorderStandingsTable);
    document.querySelectorAll('#overallTable tbody tr:nth-child(-n+3) td.place').forEach(td=>{
      if(td.querySelector('.place-medal'))return;
      const value=(td.textContent||'').trim();
      td.textContent='';
      const span=document.createElement('span');
      span.className='place-medal';
      span.textContent=value;
      td.appendChild(span);
    });
  }
  let queued=false;
  const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;fix()})};
  new MutationObserver(queue).observe(document.body,{childList:true,subtree:true});
  setInterval(fix,800);
  fix();
})();