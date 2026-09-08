(()=>{
  const OPEN=new Set();
  const ACTIVE=new Map();
  const STYLE_ID='admin-match-cards-v2-style';

  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const matchById=id=>{try{return D?.matches?.find(m=>Number(m.id)===Number(id))||null}catch{return null}};
  const groupById=id=>{try{return D?.groups?.find(g=>Number(g.id)===Number(id))||null}catch{return null}};
  const team=id=>{try{return typeof teamName==='function'?teamName(Number(id)):(D?.teams?.find(t=>Number(t.id)===Number(id))?.name||'—')}catch{return'—'}};
  const dateText=s=>{try{return new Date(String(s)+'T12:00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'short'}).replace('.','')}catch{return String(s||'')}};
  const timeText=s=>String(s||'').slice(0,5)||'—:—';

  function scoreText(m){
    try{
      if(window.CupStandings?.isTechnical?.(m))return window.CupStandings.matchScore(m);
    }catch{}
    const h=m?.home_score,a=m?.away_score;
    return h!==null&&h!==undefined&&a!==null&&a!==undefined?`${h} : ${a}`:'— : —';
  }
  function state(m){
    if(m?.technical_result_type&&m.technical_result_type!=='NONE')return['ТЕХ. РЕЗУЛЬТАТ','technical'];
    if(m?.fhr_live_state==='WATCHING')return['● LIVE','live'];
    if(m?.fhr_live_state==='ERROR')return['AUTO · ПОВТОР','error'];
    if(m?.fhr_live_state==='FINAL'||(m?.home_score!==null&&m?.home_score!==undefined&&m?.away_score!==null&&m?.away_score!==undefined))return['ЗАВЕРШЁН','final'];
    return['ПРЕДСТОИТ','upcoming'];
  }

  if(!document.getElementById(STYLE_ID)){
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      #tab-matches .panel-title{margin-bottom:14px}
      #matches{display:grid;gap:8px}
      #matches>.match-date{position:sticky;top:78px;z-index:7;margin:18px 0 2px;padding:8px 2px 7px;background:linear-gradient(180deg,rgba(7,17,31,.98),rgba(7,17,31,.91));backdrop-filter:blur(12px);font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#91a6bd}
      .match-card.match-card-v2{padding:0!important;margin:0!important;overflow:hidden;border-radius:15px;box-shadow:none;background:linear-gradient(180deg,rgba(16,32,52,.94),rgba(9,22,38,.96));transition:border-color .16s ease,background .16s ease,box-shadow .16s ease}
      .match-card.match-card-v2:hover{border-color:rgba(127,198,255,.20)}
      .match-card.match-card-v2.is-open{border-color:rgba(127,198,255,.28);box-shadow:0 14px 36px rgba(0,0,0,.18)}
      .am2-summary{display:grid;grid-template-columns:145px minmax(0,1fr) 112px minmax(0,1fr) 128px 132px;gap:12px;align-items:center;min-height:76px;padding:11px 13px;cursor:pointer;user-select:none}
      .am2-summary:hover{background:rgba(127,198,255,.025)}
      .am2-meta{min-width:0;display:grid;gap:4px}.am2-meta-top{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.am2-no,.am2-group{display:inline-flex;align-items:center;min-height:21px;padding:0 7px;border-radius:7px;font-size:9px;font-weight:900;letter-spacing:.06em;text-transform:uppercase}.am2-no{background:rgba(255,255,255,.05);border:1px solid var(--line);color:#a7b6c7}.am2-group{background:rgba(47,111,237,.12);border:1px solid rgba(47,111,237,.24);color:#b8d4ff}.am2-when{font-size:10px;color:#8295aa;white-space:nowrap}
      .am2-team{min-width:0;font-size:13px;font-weight:900;line-height:1.25;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.am2-team.away{text-align:right}
      .am2-score{text-align:center;font-size:19px;font-weight:950;letter-spacing:-.025em;white-space:nowrap}
      .am2-status-wrap{min-width:0;display:grid;justify-items:end;gap:5px}.am2-status{display:inline-flex;align-items:center;justify-content:center;min-height:24px;padding:0 8px;border-radius:999px;border:1px solid var(--line);font-size:8px;font-weight:950;letter-spacing:.07em;text-transform:uppercase;color:#8fa3b8;background:rgba(255,255,255,.035);white-space:nowrap}.am2-status.live{color:#8ee0b9;border-color:rgba(72,195,139,.30);background:rgba(72,195,139,.08)}.am2-status.final{color:#c9d5e2}.am2-status.error,.am2-status.technical{color:#ff9ca4;border-color:rgba(226,58,71,.28);background:rgba(226,58,71,.07)}.am2-place{max-width:128px;color:#71859b;font-size:9px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .am2-actions{display:flex;justify-content:flex-end;align-items:center;gap:7px}.am2-fhr-link{width:32px;height:32px;display:grid;place-items:center;border:1px solid var(--line);border-radius:9px;color:#95c9f1;background:rgba(127,198,255,.04);font-size:11px}.am2-toggle{min-height:34px;padding:0 10px;border:1px solid rgba(127,198,255,.17);border-radius:9px;background:rgba(127,198,255,.055);color:#c9e7fb;font-size:10px;font-weight:850;cursor:pointer;white-space:nowrap}.am2-toggle:after{content:' ↓';color:#6f8aa3}.is-open .am2-toggle:after{content:' ↑'}
      .am2-editor{display:none;border-top:1px solid rgba(255,255,255,.075);background:rgba(4,14,25,.24)}.is-open>.am2-editor{display:block}.am2-nav{display:flex;gap:5px;overflow:auto;padding:9px 12px 0;scrollbar-width:thin}.am2-nav-btn{flex:0 0 auto;border:1px solid transparent;border-radius:8px;background:transparent;color:#788ea5;padding:7px 9px;font-size:9px;font-weight:900;letter-spacing:.04em;text-transform:uppercase;cursor:pointer}.am2-nav-btn:hover{color:#d5e5f2;background:rgba(255,255,255,.03)}.am2-nav-btn.active{color:#d9efff;border-color:rgba(127,198,255,.18);background:rgba(127,198,255,.07)}.am2-nav-btn[hidden]{display:none!important}
      .am2-pane{display:none;padding:12px}.am2-pane.active{display:block}
      .am2-pane-basic>.match-main{grid-template-columns:70px minmax(0,1fr) 62px 16px 62px minmax(0,1fr) 100px auto}.am2-pane-basic>.match-extra{margin-top:10px}
      .am2-pane .reg-tech-panel,.am2-pane .fhr-sync-box{margin-top:0}
      .am2-pane-fhr>.fhr-sync-box{border-top:0;border-radius:11px;background:rgba(127,198,255,.025)}
      .am2-tools{display:flex;justify-content:flex-end;gap:6px;margin:-3px 0 12px}.am2-tools button{border:1px solid var(--line);background:rgba(255,255,255,.035);color:#8fa4ba;border-radius:8px;padding:6px 8px;font-size:9px;font-weight:800;cursor:pointer}.am2-tools button:hover{color:#fff}
      @media(max-width:1180px){.am2-summary{grid-template-columns:126px minmax(0,1fr) 92px minmax(0,1fr) 112px}.am2-actions{grid-column:1/-1;justify-content:flex-end;margin-top:-4px}.am2-status-wrap{justify-items:end}}
      @media(max-width:820px){#matches>.match-date{top:70px}.am2-summary{grid-template-columns:1fr auto 1fr;gap:9px}.am2-meta{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between}.am2-team{font-size:12px}.am2-score{font-size:17px}.am2-status-wrap{grid-column:1/3;justify-items:start;display:flex;align-items:center;gap:7px}.am2-actions{grid-column:3;grid-row:3;justify-content:flex-end;margin:0}.am2-pane-basic>.match-main{grid-template-columns:55px 1fr 52px 14px 52px 1fr}.am2-pane-basic>.match-main .ft{grid-column:2/4}.am2-pane-basic>.match-main .match-actions{grid-column:4/7;justify-content:flex-end}}
      @media(max-width:560px){.am2-summary{padding:10px}.am2-team{font-size:11px}.am2-place{display:none}.am2-toggle{font-size:0;width:34px;padding:0}.am2-toggle:after{font-size:12px;content:'↓'}.is-open .am2-toggle:after{content:'↑'}.am2-pane{padding:10px}.am2-pane-basic>.match-extra{grid-template-columns:1fr}.am2-nav{padding-left:10px;padding-right:10px}}
    `;document.head.appendChild(s);
  }

  function pane(editor,key,label){
    let p=editor.querySelector(`.am2-pane-${key}`);
    if(!p){p=document.createElement('section');p.className=`am2-pane am2-pane-${key}`;p.dataset.pane=key;editor.appendChild(p)}
    let btn=editor.querySelector(`.am2-nav-btn[data-pane="${key}"]`);
    if(!btn){btn=document.createElement('button');btn.type='button';btn.className='am2-nav-btn';btn.dataset.pane=key;btn.textContent=label;editor.querySelector('.am2-nav').appendChild(btn)}
    return{p,btn};
  }

  function classify(el){
    if(el.matches('.match-main,.match-extra'))return'basic';
    if(el.matches('.reg-tech-panel'))return'reg';
    if(el.matches('.fhr-sync-box'))return'fhr';
    return'other';
  }

  function buildSummary(card,m){
    const g=groupById(m.group_id),[label,cls]=state(m),place=[m.city,m.arena].filter(Boolean).join(' · '),url=String(m.fhr_match_url||'');
    const summary=document.createElement('div');summary.className='am2-summary';summary.innerHTML=`
      <div class="am2-meta"><div class="am2-meta-top"><span class="am2-no">№ ${esc(m.game_no??'—')}</span><span class="am2-group">${esc(g?.code||'—')}</span></div><span class="am2-when">${esc(dateText(m.game_date))} · ${esc(timeText(m.start_time))}</span></div>
      <div class="am2-team">${esc(team(m.home_team_id))}</div>
      <div class="am2-score">${esc(scoreText(m))}</div>
      <div class="am2-team away">${esc(team(m.away_team_id))}</div>
      <div class="am2-status-wrap"><span class="am2-status ${cls}">${esc(label)}</span><span class="am2-place" title="${esc(place)}">${esc(place||'Место уточняется')}</span></div>
      <div class="am2-actions">${url?`<a class="am2-fhr-link" href="${esc(url)}" target="_blank" rel="noopener" title="Открыть матч на ФХР" aria-label="Открыть матч на ФХР">ФХР</a>`:''}<button type="button" class="am2-toggle">Редактировать</button></div>`;
    summary.addEventListener('click',e=>{
      if(e.target.closest('a,button'))return;
      toggle(card);
    });
    summary.querySelector('.am2-toggle').onclick=e=>{e.stopPropagation();toggle(card)};
    return summary;
  }

  function organize(card){
    const editor=card.querySelector(':scope > .am2-editor');if(!editor)return;
    const basic=pane(editor,'basic','Основное'),reg=pane(editor,'reg','Регламент'),fhr=pane(editor,'fhr','ФХР LIVE'),other=pane(editor,'other','Дополнительно');
    const map={basic:basic.p,reg:reg.p,fhr:fhr.p,other:other.p};
    [...card.children].forEach(el=>{
      if(el.classList.contains('am2-summary')||el.classList.contains('am2-editor'))return;
      map[classify(el)].appendChild(el);
    });
    [basic,reg,fhr,other].forEach(({p,btn})=>btn.hidden=!p.children.length);
    basic.btn.hidden=false;
    const id=String(card.dataset.id),wanted=ACTIVE.get(id)||'basic';
    const valid=editor.querySelector(`.am2-nav-btn[data-pane="${wanted}"]:not([hidden])`)?wanted:'basic';
    activate(card,valid,false);
  }

  function activate(card,key,remember=true){
    const editor=card.querySelector(':scope > .am2-editor');if(!editor)return;
    editor.querySelectorAll('.am2-nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.pane===key));
    editor.querySelectorAll('.am2-pane').forEach(p=>p.classList.toggle('active',p.dataset.pane===key));
    if(remember)ACTIVE.set(String(card.dataset.id),key);
  }

  function toggle(card,force){
    const id=String(card.dataset.id),open=force===undefined?!card.classList.contains('is-open'):Boolean(force);
    card.classList.toggle('is-open',open);if(open)OPEN.add(id);else OPEN.delete(id);
  }

  function decorate(card){
    if(!card?.dataset?.id)return;
    const m=matchById(card.dataset.id);if(!m)return;
    if(!card.classList.contains('match-card-v2')){
      card.classList.add('match-card-v2');
      const summary=buildSummary(card,m),editor=document.createElement('div');editor.className='am2-editor';editor.innerHTML='<nav class="am2-nav" aria-label="Редактор матча"></nav>';
      card.insertBefore(summary,card.firstChild);card.appendChild(editor);
      editor.addEventListener('click',e=>{const b=e.target.closest('.am2-nav-btn');if(b)activate(card,b.dataset.pane)});
      if(OPEN.has(String(card.dataset.id)))card.classList.add('is-open');
    }
    organize(card);
  }

  function addTools(){
    const filters=document.querySelector('#matchGroupFilters');if(!filters||document.querySelector('.am2-tools'))return;
    const tools=document.createElement('div');tools.className='am2-tools';tools.innerHTML='<button type="button" data-am2-open>Раскрыть все</button><button type="button" data-am2-close>Свернуть все</button>';
    filters.insertAdjacentElement('afterend',tools);
    tools.querySelector('[data-am2-open]').onclick=()=>document.querySelectorAll('#matches .match-card').forEach(c=>toggle(c,true));
    tools.querySelector('[data-am2-close]').onclick=()=>document.querySelectorAll('#matches .match-card').forEach(c=>toggle(c,false));
  }

  function run(){addTools();document.querySelectorAll('#matches .match-card[data-id]').forEach(decorate)}
  let queued=false;const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;run()})};
  new MutationObserver(queue).observe(document.body,{childList:true,subtree:true});
  document.addEventListener('change',e=>{const card=e.target.closest?.('.match-card-v2');if(card)setTimeout(()=>{const m=matchById(card.dataset.id);if(!m)return;const sum=card.querySelector(':scope>.am2-summary');if(sum){const oldOpen=card.classList.contains('is-open');sum.replaceWith(buildSummary(card,m));card.classList.toggle('is-open',oldOpen)}},0)},true);
  run();
})();
