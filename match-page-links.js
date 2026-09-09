(()=>{
  const here=location.pathname.replace(/\/+$/,'')||'/';
  if(here==='/'||here==='/index.html'){
    const old=Number(new URL(location.href).searchParams.get('match'));
    if(Number.isInteger(old)&&old>0){location.replace('/match.html?id='+old);return}
  }
  function matchIdFrom(el){
    const direct=Number(el?.dataset?.matchId);if(Number.isInteger(direct)&&direct>0)return direct;
    const href=el?.getAttribute?.('href');if(!href)return null;
    try{const u=new URL(href,location.href),id=Number(u.searchParams.get('match')||u.searchParams.get('id'));return Number.isInteger(id)&&id>0?id:null}catch{return null}
  }
  function rewrite(){
    document.querySelectorAll('a[href*="?match="],a[href*="&match="]').forEach(a=>{const id=matchIdFrom(a);if(id)a.href='/match.html?id='+id});
    document.querySelectorAll('[data-match-id]').forEach(el=>{const id=matchIdFrom(el);if(id)el.setAttribute('aria-label',(el.getAttribute('aria-label')||'Открыть матч')+' на отдельной странице')});
  }
  document.addEventListener('click',e=>{
    const el=e.target.closest?.('[data-match-id],a[href*="?match="],a[href*="&match="]');if(!el)return;
    const id=matchIdFrom(el);if(!id)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    location.href='/match.html?id='+id;
  },true);
  document.addEventListener('keydown',e=>{
    if(e.key!=='Enter'&&e.key!==' ')return;
    const el=e.target.closest?.('[data-match-id]');if(!el)return;
    const id=matchIdFrom(el);if(!id)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();location.href='/match.html?id='+id;
  },true);
  rewrite();
  let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;rewrite()})}).observe(document.body,{childList:true,subtree:true});
})();