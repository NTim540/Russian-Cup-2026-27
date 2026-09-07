(()=>{
  function mount(){
    try{
      if(typeof D==='undefined'||!D?.matches?.length)return;
      const sections=[...document.querySelectorAll('#matchList > section')];
      for(const sec of sections){
        const h=sec.querySelector('.date-heading');if(!h||h.querySelector('.day-summary-link'))continue;
        const text=(h.textContent||'').trim();
        const date=[...new Set(D.matches.map(m=>m.game_date).filter(Boolean))].find(d=>{
          try{return new Date(d+'T12:00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'})===text}catch{return false}
        });
        if(!date)continue;
        const ms=D.matches.filter(m=>m.game_date===date),hasDone=ms.some(m=>Number.isInteger(m.home_score)&&Number.isInteger(m.away_score)&&m.home_score!==m.away_score);
        if(!hasDone)continue;
        const a=document.createElement('a');a.className='day-summary-link';a.href='/day.html?t='+encodeURIComponent(D.tournament.slug)+'&stage='+encodeURIComponent(D.stage.id)+'&date='+encodeURIComponent(date);a.textContent='Итоги дня →';
        h.appendChild(a);
      }
    }catch{}
  }
  if(!document.getElementById('day-summary-link-style')){const s=document.createElement('style');s.id='day-summary-link-style';s.textContent='.date-heading{display:flex;align-items:center;justify-content:space-between;gap:12px}.day-summary-link{margin-left:auto;padding:7px 10px;border-radius:999px;border:1px solid rgba(127,198,255,.16);background:rgba(127,198,255,.055);color:#bfe2ff;font-size:9px;letter-spacing:.04em;text-transform:none;font-weight:900;white-space:nowrap;transition:.15s}.day-summary-link:hover{border-color:rgba(127,198,255,.38);background:rgba(127,198,255,.11);color:#fff}@media(max-width:560px){.date-heading{align-items:flex-start}.day-summary-link{font-size:8px;padding:6px 8px}}';document.head.appendChild(s)}
  let q=false;const schedule=()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;mount()})};new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true});setInterval(mount,1500);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();