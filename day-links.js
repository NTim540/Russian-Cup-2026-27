(()=>{
  const done=m=>Number.isInteger(m?.home_score)&&Number.isInteger(m?.away_score)&&m.home_score!==m.away_score;
  const label=d=>{try{return new Date(d+'T12:00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'})}catch{return''}};
  function mount(){
    try{
      if(typeof D==='undefined'||!D?.matches?.length)return false;
      for(const sec of document.querySelectorAll('#matchList > section')){
        const h=sec.querySelector('.date-heading');if(!h)continue;
        const existing=h.querySelector('.day-summary-link');
        const raw=[...h.childNodes].filter(n=>!(n.nodeType===1&&n.classList?.contains('day-summary-link'))).map(n=>n.textContent||'').join('').trim();
        const date=[...new Set(D.matches.map(m=>m.game_date).filter(Boolean))].find(d=>label(d)===raw);
        if(!date){existing?.remove();continue}
        const ms=D.matches.filter(m=>m.game_date===date),ready=ms.length>0&&ms.every(done);
        if(!ready){existing?.remove();continue}
        if(existing)continue;
        const a=document.createElement('a');a.className='day-summary-link';a.href='/day.html?t='+encodeURIComponent(D.tournament.slug)+'&stage='+encodeURIComponent(D.stage.id)+'&date='+encodeURIComponent(date);a.textContent='Итоги дня →';h.appendChild(a);
      }
      return true;
    }catch(e){console.warn('Day summary links:',e);return false}
  }
  if(!document.getElementById('day-summary-link-style')){const s=document.createElement('style');s.id='day-summary-link-style';s.textContent='.date-heading{display:flex;align-items:center;justify-content:space-between;gap:12px}.day-summary-link{margin-left:auto;padding:7px 10px;border-radius:999px;border:1px solid rgba(127,198,255,.16);background:rgba(127,198,255,.055);color:#bfe2ff;font-size:9px;letter-spacing:.04em;text-transform:none;font-weight:900;white-space:nowrap;transition:.15s}.day-summary-link:hover{border-color:rgba(127,198,255,.38);background:rgba(127,198,255,.11);color:#fff}@media(max-width:560px){.date-heading{align-items:flex-start}.day-summary-link{font-size:8px;padding:6px 8px}}';document.head.appendChild(s)}
  document.querySelector('#gf')?.addEventListener('change',()=>setTimeout(mount,60));
  document.querySelector('#sf')?.addEventListener('change',()=>setTimeout(mount,60));
  let tries=0;
  const initial=()=>{tries++;if(mount()||tries>=16)return;setTimeout(initial,250)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initial,{once:true});else initial();
  setInterval(()=>{if(!document.querySelector('.mc-dialog'))mount()},15000);
})();
