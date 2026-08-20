(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .broadcast-link,.broadcast-inline,.mc-broadcast-link{display:inline-flex;align-items:center;justify-content:center;gap:7px;border-radius:11px;border:1px solid rgba(127,198,255,.28);background:rgba(47,111,237,.13);color:#d9ecff;font-weight:850;text-decoration:none;transition:.18s ease}
    .broadcast-link{margin-top:10px;min-height:36px;padding:0 11px;font-size:11px;align-self:flex-start}
    .broadcast-inline{margin-top:7px;padding:6px 9px;font-size:10px}
    .mc-broadcast-wrap{display:flex;justify-content:center;margin-top:13px}
    .mc-broadcast-link{min-height:42px;padding:0 15px;font-size:12px}
    .broadcast-link:hover,.broadcast-inline:hover,.mc-broadcast-link:hover{transform:translateY(-1px);border-color:rgba(127,198,255,.52);background:rgba(47,111,237,.22);color:#fff}
    [data-theme="light"] .broadcast-link,[data-theme="light"] .broadcast-inline,[data-theme="light"] .mc-broadcast-link{color:#173457;background:rgba(47,111,237,.08);border-color:rgba(47,111,237,.22)}
    @media(max-width:760px){.mc-broadcast-wrap{justify-content:stretch}.mc-broadcast-link{width:100%}.broadcast-link{width:100%}}
  `;
  document.head.appendChild(style);

  function validUrl(v){if(!v)return null;try{const u=new URL(String(v));return ['http:','https:'].includes(u.protocol)?u.toString():null}catch{return null}}
  function getMatch(id){return typeof D!=='undefined'&&Array.isArray(D?.matches)?D.matches.find(m=>Number(m.id)===Number(id)):null}
  function makeLink(url,cls,label){const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.className=cls;a.textContent='▶ '+label;a.addEventListener('click',e=>e.stopPropagation());a.addEventListener('keydown',e=>e.stopPropagation());return a}
  function decorateCards(){
    if(typeof D==='undefined'||!Array.isArray(D?.matches))return;
    document.querySelectorAll('#upcomingGrid .upcoming-card[data-match-id]').forEach(card=>{
      const m=getMatch(card.dataset.matchId),url=validUrl(m?.stream_url),old=card.querySelector('.broadcast-link');
      if(!url){old?.remove();return}if(old){if(old.href!==url)old.href=url;return}
      card.appendChild(makeLink(url,'broadcast-link','Смотреть трансляцию'));
    });
    document.querySelectorAll('#matchList .match-row[data-match-id]').forEach(row=>{
      const m=getMatch(row.dataset.matchId),url=validUrl(m?.stream_url),venue=row.querySelector('.venue'),old=row.querySelector('.broadcast-inline');
      if(!url){old?.remove();return}if(!venue||old)return;
      venue.appendChild(document.createElement('br'));venue.appendChild(makeLink(url,'broadcast-inline','Трансляция'));
    });
  }
  function decorateMatchCenter(){
    const overlay=document.querySelector('#matchCenterOverlay');if(!overlay?.classList.contains('open'))return;
    const marker=overlay.querySelector('#mcH2H[data-match-id]');if(!marker)return;
    const m=getMatch(marker.dataset.matchId),url=validUrl(m?.stream_url),body=overlay.querySelector('#mcBody'),old=body?.querySelector('.mc-broadcast-wrap');
    if(!url){old?.remove();return}if(old)return;
    const meta=body?.querySelector('.mc-meta');if(!meta)return;
    const wrap=document.createElement('div');wrap.className='mc-broadcast-wrap';wrap.appendChild(makeLink(url,'mc-broadcast-link','Смотреть трансляцию'));meta.insertAdjacentElement('afterend',wrap);
  }
  function apply(){decorateCards();decorateMatchCenter()}
  let queued=false;const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})};
  new MutationObserver(queue).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-match-id']});
  setInterval(queue,1000);apply();
})();