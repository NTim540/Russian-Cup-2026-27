(()=>{
  const style=document.createElement('style');
  style.id='concept-final';
  style.textContent=`
    /* FINAL SYSTEM: shared UI */
    html .filter{min-height:42px;border-radius:3px!important;border-color:rgba(126,190,255,.16)!important;background-color:rgba(6,21,35,.94)!important;color:#d9e8f5!important;text-transform:uppercase;letter-spacing:.055em;font-size:10px!important;font-weight:850;box-shadow:none!important}
    html .filter:hover,html .filter:focus{border-color:rgba(35,135,217,.48)!important;background-color:rgba(8,28,46,.98)!important}
    html .matches-toolbar{padding:10px;border:1px solid rgba(126,190,255,.09);background:rgba(4,16,27,.38);border-radius:5px;width:max-content;max-width:100%}
    html .empty{border-radius:4px!important;border-style:dashed!important;background:rgba(7,22,36,.55)!important;text-transform:uppercase;letter-spacing:.05em;font-size:10px!important}
    html .history-card{position:relative;overflow:hidden;border-radius:5px!important;min-height:108px}
    html .history-card:before{content:"ARCHIVE";position:absolute;right:70px;top:50%;transform:translateY(-50%);font-size:52px;line-height:1;font-weight:950;letter-spacing:-.06em;color:rgba(35,135,217,.055);pointer-events:none}
    html .history-card:hover .history-arrow{transform:translateX(4px)}
    html .history-arrow{transition:.18s ease;color:var(--concept-red,#e31f2b)!important;font-size:24px!important}
    html .organizer{position:relative;overflow:hidden}
    html .organizer:after{content:"OFFICIAL ORGANIZER";position:absolute;right:74px;font-size:24px;font-weight:950;letter-spacing:.03em;color:rgba(126,190,255,.035);pointer-events:none}

    /* Footer */
    html footer{position:relative;margin-top:50px!important;background:linear-gradient(180deg,#050e18,#030a11)!important;border-top:1px solid rgba(126,190,255,.11)!important}
    html footer:before{content:"";position:absolute;left:0;right:0;top:-1px;height:2px;background:linear-gradient(90deg,var(--concept-red,#e31f2b) 0 18%,var(--concept-blue,#2387d9) 18% 56%,transparent 56%)}
    html .footer-main{padding-top:38px!important}
    html .footer-brand strong{font-size:20px!important;text-transform:uppercase;letter-spacing:-.025em}
    html .footer-brand strong:before{content:"// ";color:var(--concept-red,#e31f2b)}
    html .footer-nav a{border:1px solid transparent;border-radius:3px!important;text-transform:uppercase;letter-spacing:.055em;font-size:9px!important;font-weight:850}
    html .footer-nav a:hover{border-color:rgba(126,190,255,.13)!important;background:rgba(35,135,217,.06)!important}
    html .disclaimer{font-size:9px!important;text-transform:none}

    /* MATCH CENTER — full broadcast concept */
    html .mc-overlay{background:rgba(1,7,13,.88)!important;backdrop-filter:blur(16px)!important}
    html .mc-dialog{width:min(980px,100%)!important;border-radius:7px!important;border:1px solid rgba(126,190,255,.16)!important;background:linear-gradient(180deg,#081827 0%,#06111d 100%)!important;box-shadow:0 38px 110px rgba(0,0,0,.7)!important;overflow:auto!important}
    html .mc-head{padding:14px 18px!important;background:rgba(4,14,24,.94)!important;border-bottom:1px solid rgba(126,190,255,.11)!important}
    html .mc-kicker{font-size:9px!important;letter-spacing:.17em!important;color:#73bde9!important}
    html .mc-kicker:before{content:"// ";color:var(--concept-red,#e31f2b)}
    html .mc-title{font-size:15px!important;text-transform:uppercase;letter-spacing:-.01em!important}
    html .mc-close{border-radius:3px!important;width:36px!important;height:36px!important;border-color:rgba(126,190,255,.14)!important;background:rgba(255,255,255,.025)!important}
    html .mc-close:hover{background:rgba(227,31,43,.10)!important;border-color:rgba(227,31,43,.34)!important}
    html .mc-body{padding:18px!important}
    html .mc-scoreboard{position:relative;overflow:hidden;grid-template-columns:1fr 190px 1fr!important;gap:18px!important;padding:28px 22px!important;border-radius:5px!important;border:1px solid rgba(126,190,255,.12)!important;background:linear-gradient(115deg,rgba(35,135,217,.10),rgba(7,22,36,.70) 42%,rgba(227,31,43,.07))!important}
    html .mc-scoreboard:before{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,transparent 0 49.8%,rgba(126,190,255,.12) 49.9% 50.1%,transparent 50.2% 100%)}
    html .mc-scoreboard:after{content:"MATCH";position:absolute;right:12px;top:-14px;font-size:82px;font-weight:950;letter-spacing:-.06em;color:rgba(126,190,255,.035);pointer-events:none}
    html .mc-team{position:relative;z-index:1;text-transform:uppercase;font-size:15px!important;letter-spacing:-.01em}
    html .mc-team img{width:88px!important;height:88px!important;margin-bottom:14px!important;filter:drop-shadow(0 14px 22px rgba(0,0,0,.4))!important}
    html .mc-score{position:relative;z-index:1}
    html .mc-score strong{font-size:58px!important;letter-spacing:-.06em!important;color:#fff}
    html .mc-score strong:after{content:"";display:block;width:46px;height:3px;margin:10px auto 0;background:var(--concept-red,#e31f2b)}
    html .mc-score small{font-size:9px!important;letter-spacing:.13em!important;color:#7890a8!important}
    html .mc-meta{margin-top:10px!important;gap:6px!important}
    html .mc-chip{border-radius:3px!important;padding:7px 9px!important;background:rgba(255,255,255,.018)!important;border-color:rgba(126,190,255,.09)!important;text-transform:uppercase;letter-spacing:.055em;font-size:9px!important}
    html .mc-broadcast-wrap{margin-top:10px!important}
    html .mc-broadcast-link{min-height:40px!important;border-radius:3px!important;background:var(--concept-red,#e31f2b)!important;border-color:var(--concept-red,#e31f2b)!important;color:#fff!important;text-transform:uppercase;letter-spacing:.06em;font-size:10px!important;font-weight:950!important;box-shadow:0 12px 26px rgba(227,31,43,.18)}
    html .mc-broadcast-link:hover{background:#f12b37!important;border-color:#f12b37!important}

    html .mc-tabs{display:flex;gap:0;margin-top:18px;border-bottom:1px solid rgba(126,190,255,.12);overflow:auto;scrollbar-width:none}
    html .mc-tabs::-webkit-scrollbar{display:none}
    html .mc-tab{appearance:none;border:0;border-bottom:2px solid transparent;background:transparent;color:#768ba1;padding:12px 16px 11px;white-space:nowrap;cursor:pointer;font:inherit;font-size:9px;text-transform:uppercase;letter-spacing:.09em;font-weight:950;transition:.16s ease}
    html .mc-tab:hover{color:#dcebf7}
    html .mc-tab.active{color:#fff;border-bottom-color:var(--concept-red,#e31f2b);background:linear-gradient(180deg,transparent,rgba(227,31,43,.035))}
    html .mc-section.mc-tab-panel{display:none;margin-top:16px!important}
    html .mc-section.mc-tab-panel.active{display:block}
    html .mc-section.mc-tab-panel>h3{display:flex;align-items:center;gap:8px;margin:0 0 10px!important;font-size:17px!important;text-transform:uppercase;letter-spacing:-.02em}
    html .mc-section.mc-tab-panel>h3:before{content:"//";color:var(--concept-blue,#2387d9);font-size:12px}

    html .mc-periods{border-radius:4px!important;border-color:rgba(126,190,255,.10)!important;background:rgba(5,18,30,.58)!important}
    html .mc-periods table{min-width:620px!important}
    html .mc-periods th{background:#0a1c2d!important;color:#70869c!important;font-size:8px!important;letter-spacing:.085em!important;text-transform:uppercase}
    html .mc-periods td{font-size:11px!important;border-bottom-color:rgba(126,190,255,.06)!important}
    html .mc-period-team{font-size:11px;text-transform:uppercase}
    html .mc-final{color:#fff!important;font-size:14px!important}

    html .mc-protocol{gap:8px!important}
    html .mc-period-block{border-radius:4px!important;border-color:rgba(126,190,255,.10)!important;background:rgba(5,18,30,.50)!important;overflow:hidden}
    html .mc-period-title{padding:10px 12px!important;background:#0a1c2d!important;font-size:9px!important;color:#7991a8!important}
    html .mc-period-title:before{content:"PERIOD / ";color:var(--concept-blue,#2387d9)}
    html .mc-event{position:relative;grid-template-columns:58px 34px minmax(0,1fr) auto!important;padding:12px!important;border-top-color:rgba(126,190,255,.06)!important}
    html .mc-event:before{content:"";position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--concept-blue,#2387d9);opacity:.45}
    html .mc-event.penalty:before{background:var(--concept-red,#e31f2b);opacity:.62}
    html .mc-event-time{font-size:11px!important}
    html .mc-event-main strong{font-size:11px!important;text-transform:uppercase}
    html .mc-event-main span{font-size:9px!important}
    html .mc-event-type{font-size:9px!important;letter-spacing:.06em}
    html .mc-event-score{font-size:16px!important}

    html .mc-h2h-summary{border-radius:4px!important;background:linear-gradient(90deg,rgba(35,135,217,.06),rgba(255,255,255,.012),rgba(227,31,43,.04))!important;border-color:rgba(126,190,255,.10)!important;padding:16px!important}
    html .mc-h2h-total strong{font-size:34px!important}
    html .mc-h2h-total span{font-size:8px!important;letter-spacing:.08em!important}
    html .mc-h2h-name span{font-size:8px!important}
    html .mc-h2h-name strong{font-size:12px!important;text-transform:uppercase}
    html .mc-h2h-row{border-radius:3px!important;background:rgba(5,18,30,.48)!important;border-color:rgba(126,190,255,.08)!important}
    html .mc-h2h-row-main{font-size:10px!important;text-transform:uppercase}
    html .mc-h2h-row-main small{font-size:8px!important;text-transform:none}
    html .mc-empty{border-radius:4px!important;background:rgba(5,18,30,.42)!important;border-color:rgba(126,190,255,.10)!important;text-transform:uppercase;letter-spacing:.055em;font-size:9px!important}

    html[data-theme="light"] .filter{background-color:#fff!important;color:#21364f!important;border-color:rgba(25,64,102,.14)!important}
    html[data-theme="light"] .matches-toolbar{background:rgba(255,255,255,.48);border-color:rgba(25,64,102,.08)}
    html[data-theme="light"] footer{background:linear-gradient(180deg,#edf3f8,#e7eef5)!important;border-top-color:rgba(25,64,102,.10)!important}
    html[data-theme="light"] .mc-dialog{background:linear-gradient(180deg,#ffffff,#edf3f8 100%)!important;color:#102139!important;border-color:rgba(25,64,102,.14)!important}
    html[data-theme="light"] .mc-head{background:rgba(249,252,255,.95)!important;border-bottom-color:rgba(25,64,102,.09)!important}
    html[data-theme="light"] .mc-scoreboard{background:linear-gradient(115deg,rgba(35,135,217,.08),rgba(255,255,255,.95) 48%,rgba(227,31,43,.045))!important;border-color:rgba(25,64,102,.09)!important}
    html[data-theme="light"] .mc-score strong{color:#102139!important}
    html[data-theme="light"] .mc-tab{color:#708196}
    html[data-theme="light"] .mc-tab.active{color:#102139}
    html[data-theme="light"] .mc-periods,html[data-theme="light"] .mc-period-block,html[data-theme="light"] .mc-h2h-row,html[data-theme="light"] .mc-empty{background:#fff!important;border-color:rgba(25,64,102,.09)!important}
    html[data-theme="light"] .mc-periods th,html[data-theme="light"] .mc-period-title{background:#edf4fa!important;color:#63778d!important}
    html[data-theme="light"] .mc-final{color:#102139!important}
    html[data-theme="light"] .mc-h2h-summary{background:linear-gradient(90deg,rgba(35,135,217,.05),rgba(255,255,255,.9),rgba(227,31,43,.03))!important;border-color:rgba(25,64,102,.09)!important}

    @media(max-width:760px){
      html .matches-toolbar{width:100%;display:grid;grid-template-columns:1fr 1fr}
      html .matches-toolbar .filter{width:100%}
      html .history-card:before,html .organizer:after{display:none}
      html footer{margin-top:34px!important}
      html .footer-main{padding-top:28px!important}
      html .mc-overlay{align-items:flex-end!important;padding:0!important}
      html .mc-dialog{border-radius:7px 7px 0 0!important;max-height:94vh!important}
      html .mc-head{padding:12px 14px!important}
      html .mc-body{padding:12px!important}
      html .mc-scoreboard{grid-template-columns:1fr 86px 1fr!important;padding:19px 8px!important;gap:5px!important}
      html .mc-scoreboard:after{font-size:48px;top:-8px}
      html .mc-team{font-size:10px!important;line-height:1.15}
      html .mc-team img{width:54px!important;height:54px!important;margin-bottom:8px!important}
      html .mc-score strong{font-size:34px!important}
      html .mc-score strong:after{width:28px;height:2px;margin-top:7px}
      html .mc-score small{font-size:7px!important}
      html .mc-meta{justify-content:flex-start!important}
      html .mc-chip{font-size:8px!important;padding:6px 7px!important}
      html .mc-broadcast-link{width:100%}
      html .mc-tabs{margin-left:-12px;margin-right:-12px;padding:0 12px}
      html .mc-tab{padding:11px 12px 10px;font-size:8px}
      html .mc-section.mc-tab-panel>h3{font-size:14px!important}
      html .mc-event{grid-template-columns:44px 27px minmax(0,1fr) auto!important;padding:10px 8px!important;gap:7px!important}
      html .mc-event-time{font-size:9px!important}
      html .mc-event-score{font-size:13px!important}
      html .mc-h2h-summary{padding:11px 7px!important}
      html .mc-h2h-side img{width:30px!important;height:30px!important}
      html .mc-h2h-name strong{font-size:9px!important}
      html .mc-h2h-total strong{font-size:25px!important}
    }
  `;
  document.head.appendChild(style);

  function setupTabs(){
    const body=document.querySelector('#mcBody');
    if(!body)return;
    const sections=[...body.querySelectorAll(':scope > .mc-section')];
    if(sections.length<2)return;
    const signature=sections.map(s=>s.querySelector('h3')?.textContent?.trim()||'').join('|');
    if(body.dataset.tabsSignature===signature&&body.querySelector('.mc-tabs'))return;
    body.dataset.tabsSignature=signature;
    body.querySelector('.mc-tabs')?.remove();
    const wanted=[
      {key:'overview',match:/сч[её]т по периодам/i,label:'Обзор'},
      {key:'protocol',match:/протокол/i,label:'Протокол'},
      {key:'h2h',match:/очные встречи/i,label:'Очные встречи'}
    ];
    const tabs=document.createElement('div');tabs.className='mc-tabs';tabs.setAttribute('role','tablist');
    let first=null;
    wanted.forEach((w)=>{
      const sec=sections.find(s=>w.match.test(s.querySelector('h3')?.textContent||''));
      if(!sec)return;
      sec.classList.add('mc-tab-panel');sec.dataset.mcPanel=w.key;
      const btn=document.createElement('button');btn.type='button';btn.className='mc-tab';btn.dataset.mcTab=w.key;btn.textContent=w.label;btn.setAttribute('role','tab');
      btn.onclick=()=>activate(w.key);
      tabs.appendChild(btn);if(!first)first=w.key;
    });
    const anchor=body.querySelector('.mc-broadcast-wrap')||body.querySelector('.mc-meta')||body.querySelector('.mc-scoreboard');
    if(anchor)anchor.insertAdjacentElement('afterend',tabs);else body.prepend(tabs);
    const activate=(key)=>{
      body.querySelectorAll('.mc-tab').forEach(b=>{const on=b.dataset.mcTab===key;b.classList.toggle('active',on);b.setAttribute('aria-selected',String(on))});
      body.querySelectorAll('.mc-tab-panel').forEach(p=>p.classList.toggle('active',p.dataset.mcPanel===key));
    };
    if(first)activate(first);
  }

  function polishMatchCenter(){
    const overlay=document.querySelector('#matchCenterOverlay');
    if(!overlay?.classList.contains('open'))return;
    setupTabs();
  }

  let queued=false;
  const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;polishMatchCenter()})};
  new MutationObserver(queue).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  document.addEventListener('click',e=>{if(e.target.closest?.('.match-center-clickable'))setTimeout(polishMatchCenter,0)},true);
  setInterval(polishMatchCenter,700);
  polishMatchCenter();
})();