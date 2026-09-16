(()=>{
  const HEALTH='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-protocol-health';
  let healthMap=new Map(),healthAt=0,loading=false;
  const style=document.createElement('style');
  style.textContent=`
    .fhr-live-auto{display:inline-flex;align-items:center;gap:6px;margin-left:auto;margin-right:6px;padding:5px 8px;border:1px solid rgba(127,198,255,.2);border-radius:999px;background:rgba(127,198,255,.06);color:#a9d7fb;font-size:9px;font-weight:950;letter-spacing:.07em;text-transform:uppercase;white-space:nowrap}
    .fhr-live-auto.live,.fhr-live-auto.verified{color:#8ee0b9;border-color:rgba(72,195,139,.3);background:rgba(72,195,139,.08)}
    .fhr-live-auto.final{color:#d7e1ec;border-color:rgba(255,255,255,.12);background:rgba(255,255,255,.04)}
    .fhr-live-auto.verifying{color:#ffd584;border-color:rgba(255,191,71,.28);background:rgba(255,191,71,.08)}
    .fhr-live-auto.error,.fhr-live-auto.stale{color:#ff9ca4;border-color:rgba(226,58,71,.3);background:rgba(226,58,71,.08)}
    .fhr-live-meta{margin-top:7px;padding:9px 10px;border:1px solid rgba(127,198,255,.11);border-radius:9px;background:rgba(127,198,255,.025);color:#7f91a6;font-size:9px;line-height:1.55}
    .fhr-health-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px 12px}.fhr-health-grid b{color:#cbd9e7}.fhr-health-ok{color:#77d7aa!important}.fhr-health-warn{color:#ffc86c!important}.fhr-health-bad{color:#ff8d97!important}.fhr-health-note{grid-column:1/-1;padding-top:5px;border-top:1px solid rgba(127,198,255,.08);overflow-wrap:anywhere}
    @media(max-width:620px){.fhr-health-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  const fmt=x=>{if(!x)return'—';try{return new Date(x).toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'})}catch{return String(x)}};
  const age=x=>x?Math.max(0,Math.round((Date.now()-new Date(x).getTime())/1000)):null;
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function getMatch(id){try{return D?.matches?.find(m=>Number(m.id)===Number(id))||null}catch{return null}}
  function health(id){return healthMap.get(Number(id))||null}
  function label(m,h){
    if(h?.verified===true)return['✓ VERIFIED','verified'];
    if(h?.health==='VERIFYING')return['FINALIZING','verifying'];
    const pollAge=age(h?.last_poll_at||m?.fhr_live_last_poll_at),active=(h?.state||m?.fhr_live_state)==='WATCHING';
    if(active&&pollAge!==null&&pollAge>40)return['LIVE · НЕТ СВЯЗИ','stale'];
    if(h?.state==='ERROR'||h?.sync_status==='ERROR'||h?.health==='WARNING'||m?.fhr_live_state==='ERROR')return['AUTO · ОШИБКА','error'];
    if(!m?.fhr_sync_enabled||!m?.fhr_live_auto)return['AUTO выкл.',''];
    if((h?.state||m.fhr_live_state)==='FINAL')return['AUTO · финал','final'];
    if((h?.state||m.fhr_live_state)==='WATCHING')return['● LIVE AUTO','live'];
    return['AUTO · ожидание',''];
  }
  function metaHtml(m,h){
    if(!h)return`<div class="fhr-health-grid"><span>LIVE-опрос: <b>каждые 10 сек.</b></span><span>Монитор: <b>${healthAt?'обновляется':'загрузка…'}</b></span></div>`;
    const poll=h.last_poll_at||h.last_checked_at,pollAge=age(poll),stale=h.state==='WATCHING'&&pollAge!==null&&pollAge>40;
    const stateClass=stale?'fhr-health-bad':h.health==='WARNING'||h.sync_status==='ERROR'?'fhr-health-bad':h.health==='VERIFYING'?'fhr-health-warn':'fhr-health-ok';
    const verified=h.verified===true?'VERIFIED':h.health==='VERIFYING'?'FINALIZING':h.archived_at?'ARCHIVED':h.health||'OK';
    const reason=h.verification_reasons?.length?h.verification_reasons.join('; '):(h.reason||h.sync_error||'');
    return`<div class="fhr-health-grid">
      <span>ФХР: <b class="${stateClass}">${stale?'STALE':h.sync_status||'READY'}</b></span>
      <span>Последний опрос: <b>${pollAge===null?'—':pollAge+' сек. назад'}</b></span>
      <span>Счёт: <b>${esc(h.score||'—')}</b></span>
      <span>Протокол: <b class="${stateClass}">${esc(verified)}</b></span>
      <span>События: <b>${h.events?.total??0}</b> · голы ${h.events?.goals??0}</span>
      <span>Pending: <b class="${Number(h.candidates?.pending||0)>0?'fhr-health-warn':'fhr-health-ok'}">${h.candidates?.pending??0}</b></span>
      <span>Snapshots: <b>${h.snapshots?.count??0}</b></span>
      <span>Опрос LIVE: <b>10 сек.</b></span>
      ${reason?`<span class="fhr-health-note">${esc(reason)}</span>`:''}
    </div>`;
  }
  function decorate(){
    document.querySelectorAll('#matches .match-card[data-id]').forEach(card=>{
      const m=getMatch(card.dataset.id),h=health(card.dataset.id),box=card.querySelector('.fhr-sync-box'),head=box?.querySelector('.fhr-sync-head');if(!m||!box||!head)return;
      const [text,cls]=label(m,h);let chip=head.querySelector('.fhr-live-auto');if(!chip){chip=document.createElement('span');const status=head.querySelector('.fhr-sync-badge');if(status)head.insertBefore(chip,status);else head.appendChild(chip)}chip.className='fhr-live-auto'+(cls?' '+cls:'');chip.textContent=text;
      let meta=box.querySelector('.fhr-live-meta');if(!meta){meta=document.createElement('div');meta.className='fhr-live-meta';const st=box.querySelector('.fhr-sync-status');st?.insertAdjacentElement('afterend',meta)}if(meta)meta.innerHTML=metaHtml(m,h);
    });
  }
  async function refreshHealth(){if(loading)return;loading=true;try{const r=await fetch(`${HEALTH}?_=${Date.now()}`,{cache:'no-store'}),b=await r.json();if(r.ok&&b?.ok){healthMap=new Map((b.matches||[]).map(x=>[Number(x.id),x]));healthAt=Date.now();decorate()}}catch{}finally{loading=false}}
  let queued=false;const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})};
  new MutationObserver(queue).observe(document.body,{childList:true,subtree:true});
  setInterval(decorate,1500);setInterval(refreshHealth,10000);decorate();refreshHealth();
})();
