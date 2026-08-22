(()=>{
  const API='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-votes';
  const STORAGE_KEY='cup_match_voter_id';
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let memoryVoter='';

  function makeUuid(){
    if(crypto.randomUUID) return crypto.randomUUID();
    const b=new Uint8Array(16);crypto.getRandomValues(b);b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;
    const h=[...b].map(x=>x.toString(16).padStart(2,'0')).join('');
    return h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20);
  }
  function voterId(){
    try{
      let id=localStorage.getItem(STORAGE_KEY);
      if(!id){id=makeUuid();localStorage.setItem(STORAGE_KEY,id)}
      return id;
    }catch{
      if(!memoryVoter)memoryVoter=makeUuid();
      return memoryVoter;
    }
  }

  function getContext(){
    try{
      if(typeof D==='undefined'||!D?.matches?.length||!D?.teams?.length) return null;
      const dialog=document.querySelector('.mc-dialog');
      if(!dialog) return null;
      let m=null;

      // Самый надежный источник — номер матча, уже показанный в открытом матч-центре.
      const chipText=[...dialog.querySelectorAll('.mc-chip')].map(x=>x.textContent||'').join(' ');
      const no=chipText.match(/матч\s*№\s*(\d+)/i);
      if(no)m=D.matches.find(x=>Number(x.game_no)===Number(no[1]));

      // Запасной вариант — названия команд в заголовке открытого матч-центра.
      if(!m){
        const title=(dialog.querySelector('.mc-title')?.textContent||'').trim().toLowerCase();
        if(title){
          m=D.matches.find(x=>{
            const hn=D.teams.find(t=>Number(t.id)===Number(x.home_team_id))?.name||'';
            const an=D.teams.find(t=>Number(t.id)===Number(x.away_team_id))?.name||'';
            return hn&&an&&title.includes(hn.toLowerCase())&&title.includes(an.toLowerCase());
          });
        }
      }

      // Deep-link: поддерживаем и id матча, и публичный номер матча.
      if(!m){
        const raw=new URL(location.href).searchParams.get('match');
        const n=Number(raw);
        if(Number.isFinite(n))m=D.matches.find(x=>Number(x.game_no)===n)||D.matches.find(x=>Number(x.id)===n);
      }
      if(!m)return null;
      const home=D.teams.find(t=>Number(t.id)===Number(m.home_team_id));
      const away=D.teams.find(t=>Number(t.id)===Number(m.away_team_id));
      return home&&away?{m,home,away}:null;
    }catch{return null}
  }

  async function request(matchId,teamId){
    const voter=voterId();
    const opt=teamId?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({match_id:Number(matchId),team_id:Number(teamId),voter_id:voter})}:{cache:'no-store'};
    const url=teamId?API:API+'?match_id='+encodeURIComponent(matchId)+'&voter_id='+encodeURIComponent(voter);
    const r=await fetch(url,opt);const b=await r.json().catch(()=>({}));
    if(!r.ok)throw Error(b.error||'Ошибка голосования');
    return b;
  }

  function addStyle(){
    if(document.getElementById('fan-vote-style'))return;
    const s=document.createElement('style');s.id='fan-vote-style';s.textContent=`
      .mc-fan-vote{margin-top:12px;padding:16px;border:1px solid rgba(126,190,255,.12);border-radius:5px;background:linear-gradient(90deg,rgba(35,135,217,.07),rgba(255,255,255,.016),rgba(227,31,43,.05));overflow:hidden}
      .mc-fan-vote-head{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;margin-bottom:11px}.mc-fan-vote-kicker{font-size:8px;letter-spacing:.14em;text-transform:uppercase;color:#73bde9;font-weight:950}.mc-fan-vote-kicker:before{content:'// ';color:var(--concept-red,#e31f2b)}
      .mc-fan-vote-title{margin-top:4px;font-size:16px;line-height:1.15;font-weight:950;text-transform:uppercase;letter-spacing:-.02em}.mc-fan-vote-total{font-size:9px;color:#778ba0;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap}
      .mc-fan-vote-buttons{display:grid;grid-template-columns:1fr 1fr;gap:8px}.mc-fan-vote-btn{appearance:none;border:1px solid rgba(126,190,255,.14);background:rgba(5,18,30,.70);color:#dbe9f5;border-radius:4px;min-height:46px;padding:9px 11px;cursor:pointer;font:inherit;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.03em;transition:.16s ease;line-height:1.25}
      .mc-fan-vote-btn:hover{border-color:rgba(35,135,217,.45);background:rgba(35,135,217,.11);transform:translateY(-1px)}.mc-fan-vote-btn.selected{border-color:rgba(227,31,43,.58);background:rgba(227,31,43,.13);color:#fff;box-shadow:inset 3px 0 0 var(--concept-red,#e31f2b)}.mc-fan-vote-btn:disabled{opacity:.58;cursor:wait;transform:none}
      .mc-fan-vote-results{display:grid;gap:9px;margin-top:13px;padding-top:12px;border-top:1px solid rgba(126,190,255,.08)}.mc-fan-vote-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center}.mc-fan-vote-name{font-size:10px;font-weight:850;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mc-fan-vote-pct{font-size:16px;font-weight:950;letter-spacing:-.03em}
      .mc-fan-vote-bar{grid-column:1/-1;height:7px;border-radius:999px;background:rgba(255,255,255,.05);overflow:hidden}.mc-fan-vote-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,var(--concept-blue,#2387d9),#67b9eb);transition:width .35s ease}.mc-fan-vote-row.away .mc-fan-vote-fill{background:linear-gradient(90deg,var(--concept-red,#e31f2b),#ff5964)}
      .mc-fan-vote-note{margin-top:9px;color:#72879b;font-size:8px;letter-spacing:.04em;text-transform:uppercase}.mc-fan-vote-error{padding:8px 0;color:#e8a1a7;font-size:9px;text-transform:uppercase;letter-spacing:.05em}
      html[data-theme='light'] .mc-fan-vote{background:linear-gradient(90deg,rgba(35,135,217,.045),rgba(255,255,255,.92),rgba(227,31,43,.025));border-color:rgba(25,64,102,.10)}html[data-theme='light'] .mc-fan-vote-btn{background:#fff;color:#183049;border-color:rgba(25,64,102,.12)}html[data-theme='light'] .mc-fan-vote-btn.selected{background:rgba(227,31,43,.07);color:#102139}html[data-theme='light'] .mc-fan-vote-bar{background:rgba(16,33,57,.08)}
      @media(max-width:760px){.mc-fan-vote{padding:13px 11px}.mc-fan-vote-head{align-items:flex-start;flex-direction:column;gap:4px}.mc-fan-vote-title{font-size:14px}.mc-fan-vote-total{white-space:normal}.mc-fan-vote-btn{min-height:50px;padding:8px 7px;font-size:8.5px}.mc-fan-vote-name{font-size:8.5px}.mc-fan-vote-pct{font-size:14px}}
    `;document.head.appendChild(s);
  }

  function render(block,ctx,data){
    const {home,away}=ctx,selected=Number(data?.user_vote_team_id||0),total=Number(data?.total||0),hv=Number(data?.home_votes||0),av=Number(data?.away_votes||0);
    const hp=total?Math.round(hv/total*100):0,ap=total?100-hp:0;
    block.innerHTML=`<div class="mc-fan-vote-head"><div><div class="mc-fan-vote-kicker">Голос болельщиков</div><div class="mc-fan-vote-title">За кого болеете?</div></div>${selected?`<div class="mc-fan-vote-total">Всего голосов: ${total}</div>`:''}</div><div class="mc-fan-vote-buttons"><button class="mc-fan-vote-btn ${selected===home.id?'selected':''}" data-vote-team="${home.id}">Болею за «${esc(home.name)}»</button><button class="mc-fan-vote-btn ${selected===away.id?'selected':''}" data-vote-team="${away.id}">Болею за «${esc(away.name)}»</button></div>${selected?`<div class="mc-fan-vote-results"><div class="mc-fan-vote-row"><span class="mc-fan-vote-name">${esc(home.name)}</span><strong class="mc-fan-vote-pct">${hp}%</strong><div class="mc-fan-vote-bar"><div class="mc-fan-vote-fill" style="width:${hp}%"></div></div></div><div class="mc-fan-vote-row away"><span class="mc-fan-vote-name">${esc(away.name)}</span><strong class="mc-fan-vote-pct">${ap}%</strong><div class="mc-fan-vote-bar"><div class="mc-fan-vote-fill" style="width:${ap}%"></div></div></div></div><div class="mc-fan-vote-note">Ваш выбор отмечен. Голос можно изменить.</div>`:''}`;
    block.querySelectorAll('[data-vote-team]').forEach(btn=>btn.addEventListener('click',async()=>{
      const buttons=[...block.querySelectorAll('[data-vote-team]')];buttons.forEach(b=>b.disabled=true);
      try{render(block,ctx,await request(ctx.m.id,Number(btn.dataset.voteTeam)))}catch(e){buttons.forEach(b=>b.disabled=false);const er=document.createElement('div');er.className='mc-fan-vote-error';er.textContent='Голосование временно недоступно';block.appendChild(er)}
    }));
  }

  async function mount(){
    addStyle();
    const dialog=document.querySelector('.mc-dialog');if(!dialog)return;
    const ctx=getContext();if(!ctx)return;
    const matchId=Number(ctx.m.id);
    let block=dialog.querySelector('.mc-fan-vote');
    if(block&&Number(block.dataset.matchId)===matchId)return;
    if(block)block.remove();
    block=document.createElement('section');block.className='mc-fan-vote';block.dataset.matchId=String(matchId);block.innerHTML='<div class="mc-fan-vote-kicker">Голос болельщиков</div><div class="mc-fan-vote-note">Загружаем голосование…</div>';
    const anchor=dialog.querySelector('.mc-broadcast-wrap')||dialog.querySelector('.mc-meta')||dialog.querySelector('.mc-scoreboard');
    if(anchor)anchor.insertAdjacentElement('afterend',block);else dialog.querySelector('.mc-body')?.prepend(block);
    try{render(block,ctx,await request(matchId))}catch(e){block.innerHTML='<div class="mc-fan-vote-kicker">Голос болельщиков</div><div class="mc-fan-vote-error">Голосование временно недоступно</div>'}
  }

  let scheduled=false;
  function schedule(){if(scheduled)return;scheduled=true;setTimeout(()=>{scheduled=false;mount()},40)}
  new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true});
  window.addEventListener('popstate',schedule);
  document.addEventListener('click',e=>{if(e.target.closest?.('.match-row,.upcoming-card,[data-match-id],[data-match]'))setTimeout(schedule,80)},true);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
})();