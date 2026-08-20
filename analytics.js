(()=>{
  const API='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-analytics';
  const id=()=>{try{return crypto.randomUUID().replace(/-/g,'')}catch{return Math.random().toString(36).slice(2)+Date.now().toString(36)}};
  function stored(store,key){try{let v=store.getItem(key);if(!v){v=id();store.setItem(key,v)}return v}catch{return id()}}
  const visitor=stored(localStorage,'rc_analytics_visitor');
  const session=stored(sessionStorage,'rc_analytics_session');
  const device=(()=>{const ua=navigator.userAgent||'',w=Math.min(screen.width||innerWidth,screen.height||innerHeight);if(/iPad|Tablet|PlayBook|Silk/i.test(ua)||(w>=600&&/Android/i.test(ua)))return'tablet';if(/Mobi|iPhone|Android/i.test(ua)||w<600)return'mobile';return'desktop'})();
  const source=(()=>{if(!document.referrer)return'direct';try{const u=new URL(document.referrer);return u.hostname===location.hostname?'internal':u.hostname.replace(/^www\./,'')}catch{return'direct'}})();
  const base=()=>({visitor_id:visitor,session_id:session,path:location.pathname||'/',device_type:device});
  function send(action,extra={}){const body=JSON.stringify({...base(),action,...extra});fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body,keepalive:true}).catch(()=>{})}
  function currentMatch(){const overlay=document.querySelector('#matchCenterOverlay.open,.mc-overlay.open');if(!overlay)return null;const marker=overlay.querySelector('#mcH2H[data-match-id]');const match_id=Number(marker?.dataset.matchId);if(!Number.isInteger(match_id)||match_id<1)return null;const match_label=(overlay.querySelector('#mcTitle')?.textContent||'').trim();return{match_id,match_label}}
  function heartbeat(){if(document.visibilityState==='hidden')return;send('heartbeat',currentMatch()||{})}
  send('pageview',{source});
  heartbeat();
  setInterval(heartbeat,30000);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')heartbeat()});

  let openKey='';
  function inspectMatch(){const m=currentMatch();const key=m?String(m.match_id):'';if(key&&key!==openKey){openKey=key;send('match_open',m)}else if(!key){openKey=''}}
  let queued=false;const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;inspectMatch()})};
  new MutationObserver(queue).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-match-id']});
  document.addEventListener('click',e=>{
    const a=e.target.closest?.('.broadcast-link,.broadcast-inline,.mc-broadcast-link');
    if(!a)return;
    let m=currentMatch();
    if(!m){const card=a.closest?.('[data-match-id]');const match_id=Number(card?.dataset.matchId);const label=(card?.getAttribute('aria-label')||'').replace(/^Открыть матч-центр:\s*/,'').trim();if(Number.isInteger(match_id)&&match_id>0)m={match_id,match_label:label}}
    send('stream_click',m||{});
  },true);
  inspectMatch();
})();