(()=>{
  const STYLE_ID='rosters-fhr-view-style';
  const PLACEHOLDER=`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" rx="10" fill="#10243a"/><circle cx="40" cy="29" r="14" fill="#5f7891"/><path d="M15 72c2-17 12-26 25-26s23 9 25 26" fill="#5f7891"/></svg>`)}`;
  const labels={g:'Вратари',d:'Защитники',f:'Нападающие',u:'Игроки'};
  const order=['g','d','f','u'];

  function addStyles(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      #rosterSection .roster-grid{display:block!important}
      #rosterSection .roster-card{display:block!important;max-width:none!important;margin:0 0 24px!important;border:0!important;background:transparent!important;overflow:visible!important}
      #rosterSection .roster-card-head{padding:0 0 9px!important;margin:0 0 6px!important;border:0!important;border-bottom:1px solid var(--line,rgba(255,255,255,.1))!important;background:transparent!important}
      #rosterSection .roster-card-head strong{font-size:15px!important;letter-spacing:.01em!important;text-transform:none!important}
      #rosterSection .roster-card-head strong:after{content:none!important}
      #rosterSection .roster-card-head span{display:none!important}
      #rosterSection .roster-list{display:block!important}
      #rosterSection .roster-player{display:grid!important;grid-template-columns:54px 58px minmax(0,1fr)!important;align-items:center!important;gap:14px!important;min-height:72px!important;padding:8px 10px!important;border-bottom:1px solid rgba(255,255,255,.065)!important;background:transparent!important}
      #rosterSection .roster-player:last-child{border-bottom:0!important}
      #rosterSection .roster-num{width:auto!important;height:auto!important;display:block!important;background:transparent!important;border-radius:0!important;color:var(--text,#fff)!important;font-size:18px!important;line-height:1!important;font-weight:950!important;text-align:center!important}
      #rosterSection .roster-avatar{width:52px;height:52px;border-radius:7px;overflow:hidden;border:1px solid rgba(127,198,255,.14);background:rgba(127,198,255,.05);display:block}
      #rosterSection .roster-avatar img{display:block;width:100%;height:100%;object-fit:cover;object-position:center top}
      #rosterSection .roster-name{font-size:14px!important;line-height:1.25!important;font-weight:800!important;white-space:normal!important}
      #rosterSection .roster-player:hover{background:rgba(127,198,255,.035)!important}
      html[data-theme='light'] #rosterSection .roster-player{border-bottom-color:rgba(20,45,80,.08)!important}
      html[data-theme='light'] #rosterSection .roster-num{color:#102139!important}
      html[data-theme='light'] #rosterSection .roster-avatar{border-color:rgba(20,45,80,.10);background:#eef4f9}
      @media(max-width:620px){
        #rosterSection .roster-player{grid-template-columns:38px 48px minmax(0,1fr)!important;gap:10px!important;min-height:62px!important;padding:7px 4px!important}
        #rosterSection .roster-avatar{width:46px;height:46px;border-radius:6px}
        #rosterSection .roster-num{font-size:16px!important}
        #rosterSection .roster-name{font-size:12px!important}
        #rosterSection .roster-card{margin-bottom:20px!important}
        #rosterSection .roster-card-head strong{font-size:14px!important}
      }
    `;
    document.head.appendChild(s);
  }

  function codeFor(card){return order.find(x=>card.classList.contains(x))||'u'}

  function apply(){
    const sec=document.getElementById('rosterSection');
    if(!sec)return false;
    addStyles();
    const grid=sec.querySelector('.roster-grid');
    if(!grid)return true;

    const current=[...grid.querySelectorAll(':scope > .roster-card')];
    const sorted=[...current].sort((a,b)=>order.indexOf(codeFor(a))-order.indexOf(codeFor(b)));
    const needsReorder=current.some((card,i)=>card!==sorted[i]);
    if(needsReorder)sorted.forEach(card=>grid.appendChild(card));

    sorted.forEach(card=>{
      const code=codeFor(card);
      const title=card.querySelector('.roster-card-head strong');
      if(title&&title.textContent!==labels[code])title.textContent=labels[code];
      card.querySelectorAll('.roster-player').forEach(row=>{
        if(row.querySelector('.roster-avatar'))return;
        const avatar=document.createElement('span');
        avatar.className='roster-avatar';
        const img=document.createElement('img');
        img.alt='Фото игрока';
        img.loading='lazy';
        img.decoding='async';
        img.src=row.dataset.photo||PLACEHOLDER;
        img.onerror=()=>{if(img.src!==PLACEHOLDER)img.src=PLACEHOLDER};
        avatar.appendChild(img);
        row.querySelector('.roster-num')?.insertAdjacentElement('afterend',avatar);
      });
    });
    sec.dataset.fhrView='1';
    return true;
  }

  let queued=false;
  const queue=()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;apply()});
  };

  let tries=0;
  const timer=setInterval(()=>{tries++;if(apply()||tries>40)clearInterval(timer)},200);
  const obs=new MutationObserver(queue);
  obs.observe(document.body,{childList:true,subtree:true});
  setTimeout(()=>obs.disconnect(),12000);
  apply();
})();