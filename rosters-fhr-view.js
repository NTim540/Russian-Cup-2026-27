(()=>{
  const STYLE_ID='rosters-fhr-view-style';
  const labels={g:'Вратари',d:'Защитники',f:'Нападающие',u:'Игроки'};
  const order=['g','d','f','u'];

  function initials(name){
    const parts=String(name||'').trim().split(/\s+/).filter(Boolean);
    return parts.slice(0,2).map(x=>Array.from(x)[0]?.toLocaleUpperCase('ru-RU')||'').join('');
  }

  function teamLogo(){
    const img=document.querySelector('.team-logo-large,.team-logo-side img');
    return img?.currentSrc||img?.src||'';
  }

  function renderFallback(avatar,name){
    avatar.className='roster-avatar roster-avatar-fallback';
    avatar.replaceChildren();
    const ini=initials(name);
    if(ini){
      const span=document.createElement('span');
      span.className='roster-avatar-initials';
      span.textContent=ini;
      span.setAttribute('aria-label',`Фото ${name} отсутствует`);
      avatar.appendChild(span);
      return;
    }
    const logo=teamLogo();
    if(logo){
      const img=document.createElement('img');
      img.className='roster-avatar-logo';
      img.src=logo;
      img.alt='Логотип команды';
      avatar.appendChild(img);
      return;
    }
    const mark=document.createElement('span');
    mark.className='roster-avatar-initials';
    mark.textContent='—';
    avatar.appendChild(mark);
  }

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
      #rosterSection .roster-avatar-fallback{display:grid!important;place-items:center;background:linear-gradient(145deg,rgba(35,135,217,.19),rgba(127,198,255,.07))!important;border-color:rgba(127,198,255,.18)!important;color:#dff3ff}
      #rosterSection .roster-avatar-initials{display:grid;place-items:center;width:100%;height:100%;font-size:15px;line-height:1;font-weight:950;letter-spacing:.035em;text-transform:uppercase}
      #rosterSection .roster-avatar-logo{width:74%!important;height:74%!important;object-fit:contain!important;object-position:center!important;opacity:.9}
      #rosterSection .roster-name{font-size:14px!important;line-height:1.25!important;font-weight:800!important;white-space:normal!important}
      #rosterSection .roster-player:hover{background:rgba(127,198,255,.035)!important}
      html[data-theme='light'] #rosterSection .roster-player{border-bottom-color:rgba(20,45,80,.08)!important}
      html[data-theme='light'] #rosterSection .roster-num{color:#102139!important}
      html[data-theme='light'] #rosterSection .roster-avatar{border-color:rgba(20,45,80,.10);background:#eef4f9}
      html[data-theme='light'] #rosterSection .roster-avatar-fallback{background:linear-gradient(145deg,#edf4fb,#dfeaf6)!important;border-color:rgba(20,45,80,.10)!important;color:#16314f}
      @media(max-width:620px){
        #rosterSection .roster-player{grid-template-columns:38px 48px minmax(0,1fr)!important;gap:10px!important;min-height:62px!important;padding:7px 4px!important}
        #rosterSection .roster-avatar{width:46px;height:46px;border-radius:6px}
        #rosterSection .roster-avatar-initials{font-size:13px}
        #rosterSection .roster-num{font-size:16px!important}
        #rosterSection .roster-name{font-size:12px!important}
        #rosterSection .roster-card{margin-bottom:20px!important}
        #rosterSection .roster-card-head strong{font-size:14px!important}
      }
    `;
    document.head.appendChild(s);
  }

  function codeFor(card){return order.find(x=>card.classList.contains(x))||'u'}

  function wireImage(img,avatar,name){
    if(img.dataset.fallbackWired==='1')return;
    img.dataset.fallbackWired='1';
    img.addEventListener('error',()=>{
      const direct=String(img.dataset.directPhoto||'').trim();
      if(direct&&img.dataset.directRetried!=='1'){
        img.dataset.directRetried='1';
        img.src=direct;
        return;
      }
      renderFallback(avatar,name);
    });
  }

  function ensureAvatar(row){
    const name=row.querySelector('.roster-name')?.textContent?.replace(/\s+/g,' ').trim()||'';
    let avatar=row.querySelector('.roster-avatar');
    if(!avatar){
      avatar=document.createElement('span');
      avatar.className='roster-avatar';
      row.querySelector('.roster-num')?.insertAdjacentElement('afterend',avatar);
    }

    const img=avatar.querySelector('img:not(.roster-avatar-logo)');
    if(img){
      avatar.classList.remove('roster-avatar-fallback');
      wireImage(img,avatar,name);
      return;
    }

    const photo=String(row.dataset.photo||'').trim();
    if(photo){
      avatar.className='roster-avatar';
      avatar.replaceChildren();
      const photoImg=document.createElement('img');
      photoImg.alt=name?`Фото игрока ${name}`:'Фото игрока';
      photoImg.loading='lazy';
      photoImg.decoding='async';
      photoImg.src=photo;
      avatar.appendChild(photoImg);
      wireImage(photoImg,avatar,name);
      return;
    }

    if(!avatar.classList.contains('roster-avatar-fallback'))renderFallback(avatar,name);
  }

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
      card.querySelectorAll('.roster-player').forEach(ensureAvatar);
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