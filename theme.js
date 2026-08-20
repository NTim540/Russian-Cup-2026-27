(()=>{
  const STORAGE_KEY='russian-cup-theme';
  const root=document.documentElement;
  const metaTheme=document.querySelector('meta[name="theme-color"]');

  const style=document.createElement('style');
  style.textContent=`
    :root{color-scheme:dark}
    html[data-theme="light"]{color-scheme:light}
    body,.site-header,.card,.hover-card,.match-row,.filter,.btn,.stat,.fact,.tip,footer,.mc-dialog,.mc-head,.mc-scoreboard,.mc-period-block,.mc-event,.mc-h2h-summary,.mc-h2h-row,.mc-empty{transition:background-color .22s ease,border-color .22s ease,color .22s ease,box-shadow .22s ease}

    .theme-toggle{width:42px;height:42px;display:inline-grid;place-items:center;flex:0 0 auto;border-radius:12px;border:1px solid var(--line);background:rgba(255,255,255,.045);color:var(--text);cursor:pointer;transition:transform .18s ease,background .18s ease,border-color .18s ease,color .18s ease;position:relative}
    .theme-toggle:hover{transform:translateY(-1px);border-color:rgba(127,198,255,.34);background:rgba(127,198,255,.08)}
    .theme-toggle:focus-visible{outline:2px solid var(--ice);outline-offset:3px}
    .theme-toggle svg{width:20px;height:20px;display:block}
    .theme-toggle .theme-sun,.theme-toggle .theme-moon{position:absolute;transition:opacity .18s ease,transform .22s ease}
    html[data-theme="dark"] .theme-sun{opacity:1;transform:scale(1) rotate(0)}
    html[data-theme="dark"] .theme-moon{opacity:0;transform:scale(.65) rotate(-25deg)}
    html[data-theme="light"] .theme-sun{opacity:0;transform:scale(.65) rotate(25deg)}
    html[data-theme="light"] .theme-moon{opacity:1;transform:scale(1) rotate(0)}

    html[data-theme="light"]{
      --bg:#f4f7fb;
      --bg2:#eef3f9;
      --panel:#ffffff;
      --panel2:#f6f9fd;
      --line:rgba(20,45,80,.11);
      --line-strong:rgba(47,111,237,.24);
      --text:#102139;
      --muted:#6f7f93;
      --soft:#40526a;
      --ice:#246fd6;
      --shadow:0 18px 55px rgba(27,53,87,.11);
    }
    html[data-theme="light"] body{background:#f4f7fb;color:var(--text)}
    html[data-theme="light"] body:before{background:radial-gradient(circle at 12% -5%,rgba(47,111,237,.14),transparent 33%),radial-gradient(circle at 88% 3%,rgba(226,58,71,.07),transparent 28%),linear-gradient(180deg,#f7faff 0%,#f2f6fb 52%,#edf3f9 100%)}
    html[data-theme="light"] body:after{opacity:.5;background-image:linear-gradient(rgba(18,49,86,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(18,49,86,.035) 1px,transparent 1px)}
    html[data-theme="light"] .site-header{background:rgba(248,251,255,.84);box-shadow:0 1px 0 rgba(20,45,80,.04)}
    html[data-theme="light"] .brand-mark{background:linear-gradient(145deg,rgba(47,111,237,.10),rgba(127,198,255,.15));border-color:rgba(47,111,237,.15);color:#1b4f9d}
    html[data-theme="light"] .nav{color:#65758a}
    html[data-theme="light"] .nav a:hover{color:#102139;background:rgba(47,111,237,.07)}
    html[data-theme="light"] .hero-subtitle{color:#506179}
    html[data-theme="light"] .eyebrow{background:rgba(47,111,237,.06);border-color:rgba(47,111,237,.15);color:#265c9d}
    html[data-theme="light"] .btn.secondary{background:rgba(255,255,255,.62);color:#263c57}
    html[data-theme="light"] .btn.secondary:hover{background:#fff;border-color:rgba(47,111,237,.20)}
    html[data-theme="light"] .filter{background-color:#fff;color:#21364f;border-color:rgba(20,45,80,.13)}
    html[data-theme="light"] .stat{background:linear-gradient(180deg,rgba(255,255,255,.95),rgba(247,250,254,.92));border-color:rgba(20,45,80,.10);box-shadow:0 12px 36px rgba(27,53,87,.07)}
    html[data-theme="light"] .card{background:linear-gradient(180deg,rgba(255,255,255,.98),rgba(247,250,254,.98));border-color:rgba(20,45,80,.10);box-shadow:var(--shadow)}
    html[data-theme="light"] .hover-card:hover{border-color:rgba(47,111,237,.20);background:linear-gradient(180deg,#fff,#f7faff);box-shadow:0 22px 60px rgba(27,53,87,.14)}
    html[data-theme="light"] .fact{background:rgba(47,111,237,.035);border-color:rgba(20,45,80,.08)}
    html[data-theme="light"] .group-tag,html[data-theme="light"] .group-chip{background:rgba(47,111,237,.08);border-color:rgba(47,111,237,.16);color:#2c5fa9}
    html[data-theme="light"] .help{background:rgba(47,111,237,.06);border-color:rgba(47,111,237,.18);color:#2c5fa9}
    html[data-theme="light"] .help:hover,html[data-theme="light"] .help:focus{background:rgba(47,111,237,.11);color:#174b91}
    html[data-theme="light"] .tip{background:#fff;color:#364b64;border-color:rgba(47,111,237,.16);box-shadow:0 18px 48px rgba(27,53,87,.16)}
    html[data-theme="light"] th{background:rgba(47,111,237,.035);color:#6b7b90}
    html[data-theme="light"] th,html[data-theme="light"] td{border-bottom-color:rgba(20,45,80,.075)}
    html[data-theme="light"] tbody tr:hover td{background:rgba(47,111,237,.045)}
    html[data-theme="light"] .group-card:after{color:rgba(47,111,237,.045)}
    html[data-theme="light"] .match-row{background:rgba(255,255,255,.86);border-color:rgba(20,45,80,.10);box-shadow:0 8px 24px rgba(27,53,87,.05)}
    html[data-theme="light"] .match-row:hover{background:#fff;border-color:rgba(47,111,237,.20)}
    html[data-theme="light"] .date-heading{color:#55677e}
    html[data-theme="light"] .link-arrow{color:#2f6fed}
    html[data-theme="light"] .link-arrow:hover{color:#174fae}
    html[data-theme="light"] .winner-card.show{background:linear-gradient(135deg,rgba(47,111,237,.08),rgba(255,255,255,.98) 48%,rgba(226,58,71,.05))}
    html[data-theme="light"] .organizer-mark{background:rgba(226,58,71,.05);border-color:rgba(226,58,71,.16)}
    html[data-theme="light"] .fhr-organizer-link:hover{background:linear-gradient(180deg,#fff,#f7faff)}
    html[data-theme="light"] footer{background:rgba(239,245,251,.84);border-top-color:rgba(20,45,80,.09)}
    html[data-theme="light"] .footer-nav a:hover{background:rgba(47,111,237,.06);color:#183856}
    html[data-theme="light"] .disclaimer{border-top-color:rgba(20,45,80,.07);color:#78889b}

    html[data-theme="light"] .mc-overlay{background:rgba(25,44,69,.34)}
    html[data-theme="light"] .mc-dialog{background:linear-gradient(180deg,#ffffff,#f4f8fc 88%);border-color:rgba(20,45,80,.14);box-shadow:0 30px 90px rgba(32,55,84,.22);color:#102139}
    html[data-theme="light"] .mc-head{background:rgba(255,255,255,.91);border-bottom-color:rgba(20,45,80,.09)}
    html[data-theme="light"] .mc-close{background:rgba(47,111,237,.05);border-color:rgba(20,45,80,.10);color:#183856}
    html[data-theme="light"] .mc-scoreboard{background:linear-gradient(145deg,rgba(47,111,237,.07),rgba(255,255,255,.86));border-color:rgba(20,45,80,.09)}
    html[data-theme="light"] .mc-chip{background:rgba(47,111,237,.035);border-color:rgba(20,45,80,.09);color:#63748a}
    html[data-theme="light"] .mc-periods{border-color:rgba(20,45,80,.09);background:#fff}
    html[data-theme="light"] .mc-periods th,html[data-theme="light"] .mc-periods td{border-bottom-color:rgba(20,45,80,.07)}
    html[data-theme="light"] .mc-final{color:#102139}
    html[data-theme="light"] .mc-period-block{border-color:rgba(20,45,80,.09);background:#fff}
    html[data-theme="light"] .mc-period-title{background:rgba(47,111,237,.045);color:#607289}
    html[data-theme="light"] .mc-event{border-top-color:rgba(20,45,80,.07)}
    html[data-theme="light"] .mc-event-time{color:#1e3857}
    html[data-theme="light"] .mc-event-main span{color:#718298}
    html[data-theme="light"] .mc-h2h-summary{background:rgba(47,111,237,.03);border-color:rgba(20,45,80,.09)}
    html[data-theme="light"] .mc-h2h-row{background:#fff;border-color:rgba(20,45,80,.08)}
    html[data-theme="light"] .mc-h2h-row-main small,html[data-theme="light"] .mc-h2h-finish,html[data-theme="light"] .mc-h2h-name span,html[data-theme="light"] .mc-h2h-total span{color:#738398}
    html[data-theme="light"] .mc-empty{border-color:rgba(20,45,80,.12);color:#718298;background:rgba(255,255,255,.55)}

    @media(max-width:820px){
      .theme-toggle{width:38px;height:38px;border-radius:11px}
      .theme-toggle svg{width:18px;height:18px}
    }
  `;
  document.head.appendChild(style);

  const sun=`<svg class="theme-sun" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
  const moon=`<svg class="theme-moon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.2 15.6A8.2 8.2 0 0 1 8.4 3.8 8.8 8.8 0 1 0 20.2 15.6Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`;

  function savedTheme(){
    try{return localStorage.getItem(STORAGE_KEY)==='light'?'light':'dark'}catch{return 'dark'}
  }
  function applyTheme(theme,save=false){
    const value=theme==='light'?'light':'dark';
    root.dataset.theme=value;
    if(metaTheme)metaTheme.setAttribute('content',value==='light'?'#f4f7fb':'#07111f');
    if(save){try{localStorage.setItem(STORAGE_KEY,value)}catch{}}
    const btn=document.querySelector('#themeToggle');
    if(btn){
      const next=value==='dark'?'светлую':'тёмную';
      btn.setAttribute('aria-label',`Включить ${next} тему`);
      btn.setAttribute('title',`Включить ${next} тему`);
      btn.setAttribute('aria-pressed',String(value==='light'));
    }
  }

  function mountToggle(){
    if(document.querySelector('#themeToggle'))return;
    const header=document.querySelector('.header-inner');
    if(!header)return;
    const btn=document.createElement('button');
    btn.type='button';
    btn.id='themeToggle';
    btn.className='theme-toggle';
    btn.innerHTML=sun+moon;
    btn.addEventListener('click',()=>applyTheme(root.dataset.theme==='light'?'dark':'light',true));
    const nav=header.querySelector('.nav');
    if(nav)header.insertBefore(btn,nav);else header.appendChild(btn);
    applyTheme(root.dataset.theme||savedTheme(),false);
  }

  applyTheme(savedTheme(),false);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountToggle,{once:true});else mountToggle();
})();