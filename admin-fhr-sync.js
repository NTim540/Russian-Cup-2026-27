(()=>{
  const API='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-fhr-sync';
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const style=document.createElement('style');
  style.textContent=`
    .fhr-sync-box{margin-top:12px;padding:12px;border-top:1px solid var(--line);background:rgba(127,198,255,.025);border-radius:0 0 12px 12px}
    .fhr-sync-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}.fhr-sync-title{font-size:11px;font-weight:950;letter-spacing:.08em;text-transform:uppercase}.fhr-sync-title:before{content:'● ';color:#e31f2b}.fhr-sync-badge{padding:5px 8px;border-radius:999px;border:1px solid var(--line);font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);background:rgba(255,255,255,.035)}.fhr-sync-badge.ready{color:#8ee0b9;border-color:rgba(72,195,139,.28);background:rgba(72,195,139,.08)}.fhr-sync-badge.error{color:#ff9ca4;border-color:rgba(226,58,71,.30);background:rgba(226,58,71,.08)}
    .fhr-sync-grid{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:end}.fhr-sync-toggle{min-height:42px;display:flex;align-items:center;gap:8px;padding:9px 11px;border:1px solid var(--line);border-radius:11px;background:#091727;color:#c9d6e5;font-size:11px;white-space:nowrap}.fhr-sync-toggle input{accent-color:#2f6fed}.fhr-sync-actions{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-top:9px}.fhr-sync-open{font-size:10px;color:#9fc8ff;padding:8px 4px}.fhr-sync-status{margin-top:8px;color:var(--muted);font-size:10px;line-height:1.45}.fhr-sync-status.ok{color:#86d9b0}.fhr-sync-status.bad{color:#ff9ca4}.fhr-sync-note{margin-top:8px;padding:8px 10px;border:1px dashed rgba(127,198,255,.16);border-radius:9px;color:#7f91a6;font-size:9px;line-height:1.5}
    @media(max-width:760px){.fhr-sync-grid{grid-template-columns:1fr}.fhr-sync-toggle{white-space:normal}.fhr-sync-actions .btn{flex:1 1 auto}}
  `;
  document.head.appendChild(style);

  const fmt=x=>{if(!x)return '';try{return new Date(x).toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}catch{return String(x)}};
  const getMatch=id=>{try{return D?.matches?.find(m=>Number(m.id)===Number(id))||null}catch{return null}};
  const mergeMatch=(id,patch)=>{const m=getMatch(id);if(m&&patch)Object.assign(m,patch)};
  const badge=(m)=>m?.fhr_sync_status==='ERROR'?['Ошибка','error']:m?.fhr_match_url?['Источник готов','ready']:['Не привязан',''];

  async function call(body){
    const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json','x-admin-password':PW},body:JSON.stringify(body)});
    const b=await r.json().catch(()=>({}));
    if(!r.ok)throw Error(b.error||'Ошибка ФХР-синхронизации');
    return b;
  }

  function panelHtml(m){
    const [label,cls]=badge(m),url=m?.fhr_match_url||'',enabled=Boolean(m?.fhr_sync_enabled),last=m?.fhr_last_checked_at?`Последняя проверка: ${fmt(m.fhr_last_checked_at)}`:'Источник ещё не проверялся';
    return `<div class="fhr-sync-head"><div class="fhr-sync-title">ФХР LIVE · источник протокола</div><span class="fhr-sync-badge ${cls}">${esc(label)}</span></div>
      <div class="fhr-sync-grid">
        <div class="field"><label>Ссылка на матч ФХР</label><input class="input fhr-url" value="${esc(url)}" placeholder="https://junior.fhr.ru/games/12345678/"></div>
        <label class="fhr-sync-toggle"><input class="fhr-enabled" type="checkbox" ${enabled?'checked':''}> Использовать ФХР как источник</label>
      </div>
      <div class="fhr-sync-actions"><button type="button" class="btn sec small fhr-save">Сохранить привязку</button><button type="button" class="btn small fhr-check">Проверить ФХР</button>${url?`<a class="fhr-sync-open" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Открыть протокол ↗</a>`:''}</div>
      <div class="fhr-sync-status">${esc(last)}${m?.fhr_match_id?` · ID ФХР: ${esc(m.fhr_match_id)}`:''}</div>
      <div class="fhr-sync-note">Фундамент автоимпорта уже включён: у матча хранится источник ФХР, а события протокола получили внешние ключи для безопасного обновления без дублей. Сам автоматический парсер событий включим после проверки на реальном LIVE-протоколе.</div>`;
  }

  function updatePanel(card){
    const id=Number(card.dataset.id),m=getMatch(id);if(!m)return;
    let box=card.querySelector('.fhr-sync-box');
    if(!box){box=document.createElement('div');box.className='fhr-sync-box';card.appendChild(box)}
    if(box.dataset.busy==='1')return;
    const active=document.activeElement&&box.contains(document.activeElement);
    if(!active)box.innerHTML=panelHtml(m);
    wire(card,box,id);
  }

  function setStatus(box,text,kind=''){const el=box.querySelector('.fhr-sync-status');if(!el)return;el.className='fhr-sync-status'+(kind?' '+kind:'');el.textContent=text}
  function setBusy(box,on){box.dataset.busy=on?'1':'0';box.querySelectorAll('button').forEach(b=>b.disabled=on)}

  function wire(card,box,id){
    if(box.dataset.wired==='1')return;box.dataset.wired='1';
    box.querySelector('.fhr-save')?.addEventListener('click',async()=>{
      const url=box.querySelector('.fhr-url').value.trim(),enabled=box.querySelector('.fhr-enabled').checked;
      setBusy(box,true);setStatus(box,'Сохраняю привязку…');
      try{const b=await call({action:'configure',match_id:id,fhr_match_url:url,enabled});mergeMatch(id,b.match);setStatus(box,url?'Привязка к ФХР сохранена.':'Привязка удалена.','ok');box.dataset.wired='0';box.dataset.busy='0';updatePanel(card)}catch(e){setStatus(box,e.message||String(e),'bad');setBusy(box,false)}
    });
    box.querySelector('.fhr-check')?.addEventListener('click',async()=>{
      const url=box.querySelector('.fhr-url').value.trim(),enabled=box.querySelector('.fhr-enabled').checked;
      setBusy(box,true);setStatus(box,'Проверяю доступ к странице ФХР…');
      try{
        const current=getMatch(id);if(url!==String(current?.fhr_match_url||'')||enabled!==Boolean(current?.fhr_sync_enabled)){const saved=await call({action:'configure',match_id:id,fhr_match_url:url,enabled});mergeMatch(id,saved.match)}
        const b=await call({action:'check_source',match_id:id});mergeMatch(id,b.match);setStatus(box,`ФХР доступен · HTTP ${b.http_status}${b.title?' · '+b.title:''}`,'ok');box.dataset.wired='0';box.dataset.busy='0';updatePanel(card)
      }catch(e){const m=getMatch(id);if(m)m.fhr_sync_status='ERROR';setStatus(box,e.message||String(e),'bad');setBusy(box,false)}
    });
  }

  function renderAll(){document.querySelectorAll('#matches .match-card[data-id]').forEach(updatePanel)}
  let queued=false;const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;renderAll()})};
  const matches=document.querySelector('#matches');if(matches)new MutationObserver(queue).observe(matches,{childList:true,subtree:true});
  document.addEventListener('click',e=>{if(e.target.closest?.('[data-tab="matches"],.match-filter-btn,.save,.del'))setTimeout(renderAll,60)},true);
  setInterval(renderAll,2500);
  renderAll();
})();
