(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .fhr-live-auto{display:inline-flex;align-items:center;gap:6px;margin-left:auto;margin-right:6px;padding:5px 8px;border:1px solid rgba(127,198,255,.2);border-radius:999px;background:rgba(127,198,255,.06);color:#a9d7fb;font-size:9px;font-weight:950;letter-spacing:.07em;text-transform:uppercase;white-space:nowrap}
    .fhr-live-auto.live{color:#8ee0b9;border-color:rgba(72,195,139,.3);background:rgba(72,195,139,.08)}
    .fhr-live-auto.final{color:#d7e1ec;border-color:rgba(255,255,255,.12);background:rgba(255,255,255,.04)}
    .fhr-live-auto.error{color:#ff9ca4;border-color:rgba(226,58,71,.3);background:rgba(226,58,71,.08)}
    .fhr-live-meta{margin-top:7px;padding:8px 10px;border:1px solid rgba(127,198,255,.11);border-radius:9px;background:rgba(127,198,255,.025);color:#7f91a6;font-size:9px;line-height:1.5}
  `;
  document.head.appendChild(style);

  const fmt=x=>{if(!x)return'';try{return new Date(x).toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'})}catch{return String(x)}};
  function getMatch(id){try{return D?.matches?.find(m=>Number(m.id)===Number(id))||null}catch{return null}}
  function label(m){
    if(!m?.fhr_sync_enabled||!m?.fhr_live_auto)return['AUTO выкл.',''];
    if(m.fhr_live_state==='FINAL')return['AUTO · финал','final'];
    if(m.fhr_live_state==='WATCHING')return['● LIVE AUTO','live'];
    if(m.fhr_live_state==='ERROR')return['AUTO · повтор','error'];
    return['AUTO · ожидание',''];
  }
  function decorate(){
    document.querySelectorAll('#matches .match-card[data-id]').forEach(card=>{
      const m=getMatch(card.dataset.id),box=card.querySelector('.fhr-sync-box'),head=box?.querySelector('.fhr-sync-head');if(!m||!box||!head)return;
      const [text,cls]=label(m);let chip=head.querySelector('.fhr-live-auto');if(!chip){chip=document.createElement('span');chip.className='fhr-live-auto';const status=head.querySelector('.fhr-sync-badge');if(status)head.insertBefore(chip,status);else head.appendChild(chip)}chip.className='fhr-live-auto'+(cls?' '+cls:'');chip.textContent=text;
      let meta=box.querySelector('.fhr-live-meta');if(!meta){meta=document.createElement('div');meta.className='fhr-live-meta';const st=box.querySelector('.fhr-sync-status');st?.insertAdjacentElement('afterend',meta)}
      if(meta){const parts=['Автосинхронизация проверяет LIVE-матчи раз в минуту'];if(m.fhr_live_last_poll_at)parts.push('автоопрос: '+fmt(m.fhr_live_last_poll_at));if(m.fhr_live_started_at)parts.push('LIVE с '+fmt(m.fhr_live_started_at));if(m.fhr_live_final_at)parts.push('финал: '+fmt(m.fhr_live_final_at));meta.textContent=parts.join(' · ')}
    });
  }
  let queued=false;const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})};
  new MutationObserver(queue).observe(document.body,{childList:true,subtree:true});
  setInterval(decorate,1500);decorate();
})();
