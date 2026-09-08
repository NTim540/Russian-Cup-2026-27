(()=>{
  if(document.getElementById('overall-final-zones-style'))return;
  const style=document.createElement('style');
  style.id='overall-final-zones-style';
  style.textContent=`
    /* Overall table: 1–8 -> Gold Final, 9–20 -> Silver Final */
    html #overallTable tbody tr:nth-child(-n+8) td{
      background:rgba(202,156,43,.075)!important;
    }
    html #overallTable tbody tr:nth-child(n+9):nth-child(-n+20) td{
      background:rgba(176,190,204,.055)!important;
    }
    html #overallTable tbody tr:nth-child(-n+8):hover td{
      background:rgba(202,156,43,.125)!important;
    }
    html #overallTable tbody tr:nth-child(n+9):nth-child(-n+20):hover td{
      background:rgba(176,190,204,.095)!important;
    }
    html #overallTable tbody tr:nth-child(-n+8) td.place{
      box-shadow:inset 3px 0 0 rgba(224,180,66,.72);
      color:#f1d680!important;
    }
    html #overallTable tbody tr:nth-child(n+9):nth-child(-n+20) td.place{
      box-shadow:inset 3px 0 0 rgba(180,194,209,.62);
      color:#d7e0e9!important;
    }
    html #overallTable tbody tr:nth-child(9) td{
      border-top:2px solid rgba(176,190,204,.30)!important;
    }

    /* Temporarily remove medal treatment from places 1–3. */
    html #overallTable td.place .place-medal,
    html #overallTable tbody tr:nth-child(1) td.place .place-medal,
    html #overallTable tbody tr:nth-child(2) td.place .place-medal,
    html #overallTable tbody tr:nth-child(3) td.place .place-medal{
      display:inline!important;
      width:auto!important;
      height:auto!important;
      border-radius:0!important;
      padding:0!important;
      background:transparent!important;
      color:inherit!important;
      box-shadow:none!important;
    }

    html[data-theme="light"] #overallTable tbody tr:nth-child(-n+8) td{
      background:rgba(202,156,43,.075)!important;
    }
    html[data-theme="light"] #overallTable tbody tr:nth-child(n+9):nth-child(-n+20) td{
      background:rgba(112,130,149,.055)!important;
    }
    html[data-theme="light"] #overallTable tbody tr:nth-child(-n+8):hover td{
      background:rgba(202,156,43,.13)!important;
    }
    html[data-theme="light"] #overallTable tbody tr:nth-child(n+9):nth-child(-n+20):hover td{
      background:rgba(112,130,149,.095)!important;
    }
    html[data-theme="light"] #overallTable tbody tr:nth-child(-n+8) td.place{
      color:#8d6900!important;
    }
    html[data-theme="light"] #overallTable tbody tr:nth-child(n+9):nth-child(-n+20) td.place{
      color:#667483!important;
    }
  `;
  document.head.appendChild(style);
})();
