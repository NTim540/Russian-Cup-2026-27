(()=>{
  if(document.getElementById('mobile-standings-fix'))return;
  const style=document.createElement('style');
  style.id='mobile-standings-fix';
  style.textContent=`
    @media (max-width:760px){
      #overall .table-wrap,
      #groupTables .table-wrap{
        position:relative!important;
        width:100%!important;
        max-width:100%!important;
        overflow-x:auto!important;
        overflow-y:visible!important;
        -webkit-overflow-scrolling:touch!important;
        scrollbar-width:thin;
        isolation:isolate;
      }

      #overallTable,
      #groupTables table{
        width:max-content!important;
        min-width:920px!important;
        table-layout:auto!important;
        border-collapse:separate!important;
        border-spacing:0!important;
      }

      #overallTable th,
      #overallTable td,
      #groupTables table th,
      #groupTables table td{
        box-sizing:border-box!important;
        min-width:64px!important;
        width:64px!important;
        max-width:64px!important;
        padding:13px 9px!important;
        white-space:nowrap!important;
        overflow:hidden!important;
        text-overflow:ellipsis!important;
        background-clip:padding-box!important;
      }

      /* Logos.js must not turn a table cell into flex — it breaks column geometry on iOS. */
      #overallTable td.team.logo-ready,
      #groupTables table td.team.logo-ready{
        display:table-cell!important;
      }
      #overallTable td.team.logo-ready .team-logo-img,
      #groupTables table td.team.logo-ready .team-logo-img{
        display:inline-block!important;
        width:26px!important;
        height:26px!important;
        margin:0 8px 0 0!important;
        vertical-align:middle!important;
        flex:none!important;
      }

      /* Fixed rank column. */
      #overallTable th:first-child,
      #overallTable td:first-child,
      #groupTables table th:first-child,
      #groupTables table td:first-child{
        position:sticky!important;
        left:0!important;
        z-index:7!important;
        min-width:52px!important;
        width:52px!important;
        max-width:52px!important;
        text-align:center!important;
        background:#0b1d30!important;
      }

      /* Fixed team column. */
      #overallTable th.team,
      #overallTable td.team,
      #groupTables table th.team,
      #groupTables table td.team{
        position:sticky!important;
        left:52px!important;
        z-index:6!important;
        min-width:230px!important;
        width:230px!important;
        max-width:230px!important;
        text-align:left!important;
        background:#0b1d30!important;
        box-shadow:1px 0 0 rgba(127,198,255,.16),10px 0 18px rgba(2,10,18,.18)!important;
      }

      #overallTable thead th:first-child,
      #overallTable thead th.team,
      #groupTables table thead th:first-child,
      #groupTables table thead th.team{
        z-index:10!important;
        background:#0d2238!important;
      }

      #overallTable td.team,
      #groupTables table td.team{
        font-size:12px!important;
        font-weight:850!important;
      }

      #overallTable td.team.logo-ready,
      #groupTables table td.team.logo-ready{
        line-height:26px!important;
      }

      /* Keep zone/row colouring while making sticky cells opaque. */
      #overallTable tbody tr:nth-child(-n+8) td:first-child,
      #overallTable tbody tr:nth-child(-n+8) td.team{
        background:#162b34!important;
      }

      html[data-theme="light"] #overallTable th:first-child,
      html[data-theme="light"] #overallTable td:first-child,
      html[data-theme="light"] #overallTable th.team,
      html[data-theme="light"] #overallTable td.team,
      html[data-theme="light"] #groupTables table th:first-child,
      html[data-theme="light"] #groupTables table td:first-child,
      html[data-theme="light"] #groupTables table th.team,
      html[data-theme="light"] #groupTables table td.team{
        background:#f4f8fc!important;
        color:#102139!important;
      }

      html[data-theme="light"] #overallTable thead th:first-child,
      html[data-theme="light"] #overallTable thead th.team,
      html[data-theme="light"] #groupTables table thead th:first-child,
      html[data-theme="light"] #groupTables table thead th.team{
        background:#eaf2f9!important;
      }
    }
  `;
  document.head.appendChild(style);
})();
