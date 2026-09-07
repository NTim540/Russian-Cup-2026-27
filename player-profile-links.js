(()=>{
  const teamId=Number(new URL(location.href).searchParams.get('team'));
  if(!Number.isInteger(teamId)||teamId<1)return;
  const posMap={g:'G',d:'D',f:'F',u:'U'};
  const style=document.createElement('style');
  style.textContent=`
    #rosterSection .roster-player[data-player-profile-link="1"]{cursor:pointer;position:relative;transition:background .16s ease,border-color .16s ease,transform .16s ease}
    #rosterSection .roster-player[data-player-profile-link="1"]:hover{background:rgba(127,198,255,.055)!important}
    #rosterSection .roster-player[data-player-profile-link="1"]:focus-visible{outline:2px solid rgba(127,198,255,.65);outline-offset:2px;border-radius:7px}
  `;
  document.head.appendChild(style);

  function urlFor(row){
    const name=row.querySelector('.roster-name')?.textContent?.replace(/\s+/g,' ').trim()||'';
    if(!name)return'';
    const number=row.querySelector('.roster-num')?.textContent?.trim()||'';
    const card=row.closest('.roster-card');let pos='U';
    if(card)for(const [cls,code] of Object.entries(posMap))if(card.classList.contains(cls)){pos=code;break}
    const q=new URLSearchParams({team:String(teamId),name});
    if(number&&number!=='—')q.set('number',number);
    if(pos)q.set('pos',pos);
    return '/player.html?'+q.toString();
  }
  function wire(row){
    if(row.dataset.playerProfileLink==='1')return;
    const href=urlFor(row);if(!href)return;
    row.dataset.playerProfileLink='1';row.tabIndex=0;row.setAttribute('role','link');row.setAttribute('aria-label','Открыть профиль: '+(row.querySelector('.roster-name')?.textContent?.trim()||'игрок'));
    row.addEventListener('click',e=>{if(e.target.closest('a,button,input,select,textarea'))return;location.href=href});
    row.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!e.target.matches('input,button,select,textarea')){e.preventDefault();location.href=href}});
  }
  function apply(){document.querySelectorAll('#rosterSection .roster-player').forEach(wire)}
  let queued=false;const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})};
  new MutationObserver(queue).observe(document.body,{childList:true,subtree:true});
  setInterval(apply,1200);apply();
})();
