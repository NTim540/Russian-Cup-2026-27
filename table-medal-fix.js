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

  function fix(){
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