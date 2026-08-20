(()=>{
  const style=document.createElement('style');
  style.id='visual-concept-v1';
  style.textContent=`
    :root{--concept-red:#e31f2b;--concept-blue:#2387d9;--concept-deep:#06101b;--concept-panel:#0b1828;--concept-line:rgba(122,187,239,.16)}
    html body{background:#06101b}
    html body:before{background:radial-gradient(circle at 78% 4%,rgba(35,135,217,.18),transparent 25%),radial-gradient(circle at 86% 12%,rgba(227,31,43,.08),transparent 18%),linear-gradient(180deg,#06101b 0%,#071423 55%,#050d17 100%)}
    html body:after{opacity:.18;background-image:linear-gradient(rgba(117,177,226,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(117,177,226,.035) 1px,transparent 1px);background-size:64px 64px}
    html .wrap{width:min(1280px,calc(100% - 34px))}

    html .site-header{background:rgba(4,13,24,.88);border-bottom-color:rgba(126,190,255,.13);box-shadow:0 8px 34px rgba(0,0,0,.18)}
    html .header-inner{min-height:68px}
    html .brand-mark{border-radius:10px;background:linear-gradient(145deg,rgba(35,135,217,.16),rgba(227,31,43,.08));border-color:rgba(126,190,255,.20)}
    html .brand-copy strong{font-weight:950;letter-spacing:.01em}
    html .nav{gap:2px;font-size:11px;text-transform:uppercase;letter-spacing:.07em;font-weight:800}
    html .nav a{position:relative;padding:10px 10px;color:#91a5bb}
    html .nav a:hover{background:transparent;color:#fff}
    html .nav a.concept-home{color:#fff}
    html .nav a.concept-home:after{content:"";position:absolute;left:10px;right:10px;bottom:2px;height:2px;background:var(--concept-red);border-radius:2px}
    html .theme-toggle{border-radius:10px;background:rgba(255,255,255,.025)}

    html .hero{min-height:610px;padding:72px 0 52px;align-items:center;overflow:hidden}
    html .hero>div:first-child{position:relative;z-index:3;max-width:760px}
    html .hero:before{content:"";position:absolute;right:-40px;top:28px;width:min(48vw,610px);aspect-ratio:1;border-radius:50%;border:1px solid rgba(40,149,225,.22);box-shadow:0 0 0 58px rgba(40,149,225,.035),0 0 0 118px rgba(40,149,225,.024);z-index:0;background:radial-gradient(circle at center,transparent 0 23%,rgba(40,149,225,.12) 23.2% 23.7%,transparent 24% 43%,rgba(40,149,225,.11) 43.2% 43.6%,transparent 44% 100%)}
    html .hero:after{content:"01";position:absolute;right:2%;top:5%;font-size:clamp(150px,21vw,300px);line-height:.8;font-weight:950;letter-spacing:-.08em;color:rgba(154,190,221,.14);z-index:0;pointer-events:none}
    html .concept-hero-art{position:absolute;right:5%;bottom:9%;width:min(34vw,430px);height:min(24vw,300px);z-index:1;pointer-events:none;filter:drop-shadow(0 28px 38px rgba(0,0,0,.42))}
    html .concept-puck{position:absolute;width:64%;aspect-ratio:2.25/1;right:3%;bottom:5%;border-radius:50%;background:linear-gradient(170deg,#44505c 0%,#151c24 38%,#020508 76%);transform:rotate(-9deg);box-shadow:inset 0 8px 15px rgba(255,255,255,.09),inset 0 -12px 22px rgba(0,0,0,.7),0 28px 40px rgba(0,0,0,.38)}
    html .concept-puck:before{content:"";position:absolute;inset:3% 4% auto;height:48%;border-radius:50%;background:radial-gradient(ellipse at 36% 25%,rgba(255,255,255,.24),rgba(255,255,255,.03) 30%,rgba(0,0,0,.35) 74%);border:1px solid rgba(255,255,255,.08)}
    html .concept-ice-spray{position:absolute;right:0;bottom:0;width:98%;height:52%;background:radial-gradient(ellipse at 65% 80%,rgba(123,196,255,.18),transparent 55%),linear-gradient(165deg,transparent 0 43%,rgba(147,210,255,.12) 44% 45%,transparent 46% 100%);filter:blur(.2px)}
    html .eyebrow{border-radius:3px;padding:7px 10px;border-color:rgba(126,190,255,.15);background:rgba(12,35,57,.55);font-size:10px;letter-spacing:.14em;color:#b9d9f3}
    html .eyebrow:before{background:var(--concept-red);box-shadow:0 0 14px rgba(227,31,43,.65)}
    html #heroTitle{margin:22px 0 16px;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Arial,sans-serif;font-size:clamp(62px,8.7vw,112px);line-height:.82;letter-spacing:-.072em;font-weight:950;max-width:800px}
    html #heroTitle .concept-u16{display:inline-block;color:var(--concept-red);letter-spacing:-.06em}
    html .hero-subtitle{font-size:15px;max-width:660px;color:#aab8c9;line-height:1.65}
    html .hero-actions{margin-top:25px}
    html .btn{border-radius:4px;min-height:46px;padding:0 18px;text-transform:uppercase;letter-spacing:.045em;font-size:11px;font-weight:900}
    html .btn.primary{background:var(--concept-red);box-shadow:0 12px 28px rgba(227,31,43,.22)}
    html .btn.primary:hover{box-shadow:0 16px 36px rgba(227,31,43,.3)}
    html .btn.secondary{background:transparent;border-color:rgba(180,211,235,.30)}
    html .hero-controls{margin-top:16px}
    html .filter{border-radius:5px;background-color:rgba(8,24,40,.88);font-size:11px}
    html .hero-stats{max-width:730px;display:flex;gap:0;margin-top:24px;border-top:1px solid rgba(126,190,255,.12);border-bottom:1px solid rgba(126,190,255,.12)}
    html .stat{flex:1;border:0;border-right:1px solid rgba(126,190,255,.12);border-radius:0;background:transparent;padding:14px 18px;box-shadow:none}
    html .stat:last-child{border-right:0}
    html .stat strong{font-size:22px}
    html .stat span{font-size:9px;letter-spacing:.11em}
    html #status{display:inline-flex;align-items:center;gap:8px;margin-top:14px;text-transform:uppercase;letter-spacing:.08em;font-size:9px;color:#9eafc1}
    html #status:before{content:"";width:7px;height:7px;border-radius:50%;background:var(--concept-red);box-shadow:0 0 12px rgba(227,31,43,.6)}

    html .section{padding:42px 0}
    html .section.compact{padding:25px 0}
    html .section-head{margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid rgba(126,190,255,.10)}
    html .section-kicker{display:none}
    html .section h2{font-size:clamp(24px,3vw,34px);text-transform:uppercase;letter-spacing:-.03em;font-weight:950}
    html #upcoming .section-head h2:before{content:"01 / ";color:var(--concept-blue)}
    html #overall .section-head h2:before{content:"02 / ";color:var(--concept-blue)}
    html #groups .section-head h2:before{content:"03 / ";color:var(--concept-blue)}
    html #matches .section-head h2:before{content:"04 / ";color:var(--concept-blue)}
    html #rules .section-head h2:before{content:"05 / ";color:var(--concept-blue)}
    html #history .section-head h2:before{content:"06 / ";color:var(--concept-blue)}
    html .section-sub{font-size:11px;margin-top:7px;color:#75879b}
    html .link-arrow{font-size:10px;text-transform:uppercase;letter-spacing:.07em;color:#72bce9}

    html .card{border-radius:6px;border-color:rgba(126,190,255,.11);background:linear-gradient(180deg,rgba(12,31,49,.96),rgba(7,21,35,.98));box-shadow:0 14px 42px rgba(0,0,0,.17)}
    html .hover-card:hover{transform:translateY(-2px);background:linear-gradient(180deg,rgba(16,39,61,.98),rgba(8,25,42,.98));border-color:rgba(54,145,207,.32);box-shadow:0 20px 46px rgba(0,0,0,.25)}

    html .upcoming-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
    html .upcoming-card{min-height:205px;padding:14px 15px}
    html .match-top{font-size:9px;text-transform:uppercase;letter-spacing:.04em}
    html .group-tag{border-radius:3px;min-width:28px;height:21px;font-size:9px;background:rgba(35,135,217,.13);border-color:rgba(35,135,217,.26)}
    html .upcoming-teams{display:grid;grid-template-columns:minmax(0,1fr) 32px minmax(0,1fr);align-items:center;gap:5px;margin:auto 0;padding:14px 0}
    html .upcoming-teams:before{content:"VS";grid-column:2;grid-row:1;justify-self:center;color:#b7c4d3;font-size:10px;font-weight:950}
    html .upcoming-team{display:block;text-align:center;font-size:11px;min-width:0}
    html .upcoming-team:first-child{grid-column:1;grid-row:1}
    html .upcoming-team:last-child{grid-column:3;grid-row:1}
    html .upcoming-team>span:first-child{display:flex!important;flex-direction:column;align-items:center!important;justify-content:center;gap:8px!important;line-height:1.15}
    html .upcoming-team .team-logo-img{width:46px;height:46px}
    html .upcoming-team>span:last-child{display:none}
    html .match-location{font-size:9px;text-align:center;text-transform:uppercase;letter-spacing:.04em;color:#708197}

    html .tour-panel{grid-template-columns:1.1fr 1fr;gap:8px}
    html .tour-main{padding:19px 21px;position:relative;overflow:hidden}
    html .tour-main:after{content:"01";position:absolute;right:14px;top:-10px;font-size:82px;font-weight:950;color:rgba(35,135,217,.08);letter-spacing:-.08em}
    html .tour-main .tour-label{font-size:9px;color:#7bbbe4}
    html .tour-main h3{font-size:34px;margin:6px 0 5px;text-transform:uppercase}
    html .tour-main p{font-size:11px}
    html .tour-facts{gap:7px;padding:8px}
    html .fact{border-radius:4px;padding:13px 15px;background:rgba(255,255,255,.018);border-color:rgba(126,190,255,.08)}
    html .fact strong{font-size:22px}
    html .fact span{font-size:9px}

    html .table-wrap{border-radius:5px}
    html table{min-width:940px}
    html th{background:#0b1d2e;color:#65788d;font-size:9px;padding:11px 10px}
    html td{font-size:11px;padding:11px 10px;border-bottom-color:rgba(126,190,255,.07)}
    html tbody tr:nth-child(odd) td{background:rgba(255,255,255,.008)}
    html tbody tr:hover td{background:rgba(35,135,217,.055)}
    html td.team{font-weight:800}
    html .place{font-size:12px}
    html #overallTable tbody tr:nth-child(1) .place,html #overallTable tbody tr:nth-child(2) .place,html #overallTable tbody tr:nth-child(3) .place{display:inline-grid;place-items:center;min-width:24px;height:24px;border-radius:50%;margin:4px 0;font-weight:950}
    html #overallTable tbody tr:nth-child(1) .place{background:rgba(215,176,54,.18);color:#f2ce67}
    html #overallTable tbody tr:nth-child(2) .place{background:rgba(166,181,197,.16);color:#d7e0e9}
    html #overallTable tbody tr:nth-child(3) .place{background:rgba(180,116,72,.17);color:#dca477}
    html .points{font-size:13px;color:#fff}

    html .groups-grid{gap:9px}
    html .group-card:after{font-size:92px;top:-12px;color:rgba(35,135,217,.04)}
    html .group-card-head{padding:14px 16px}
    html .group-card-head strong{font-size:14px;text-transform:uppercase}

    html .matches-toolbar{margin-bottom:12px}
    html .match-list{gap:6px}
    html .date-heading{font-size:10px;color:#8ea1b6;margin-bottom:7px}
    html .match-row{border-radius:5px;background:rgba(8,23,38,.88);padding:12px 13px;border-color:rgba(126,190,255,.10)}
    html .match-row:hover{background:rgba(12,32,51,.96)}
    html .match-meta,html .venue{font-size:9px}
    html .match-team{font-size:12px;text-transform:uppercase}
    html .score-box strong{font-size:20px}
    html .score-box span{font-size:8px}

    html .info-grid{gap:8px}
    html .info-card{padding:18px}
    html .info-card .num{font-size:40px;color:rgba(35,135,217,.22)}
    html .info-card h3{font-size:14px;text-transform:uppercase}
    html .info-card p{font-size:11px}
    html .history-card{border-radius:5px}
    html .organizer{border-radius:5px}
    html footer{background:#040c15;border-top-color:rgba(126,190,255,.10)}

    html[data-theme="light"] body{background:#eef3f8}
    html[data-theme="light"] body:before{background:radial-gradient(circle at 78% 4%,rgba(35,135,217,.10),transparent 26%),radial-gradient(circle at 86% 12%,rgba(227,31,43,.045),transparent 18%),linear-gradient(180deg,#f5f8fb 0%,#edf3f8 58%,#e9f0f6 100%)}
    html[data-theme="light"] .site-header{background:rgba(248,251,254,.91);border-bottom-color:rgba(25,64,102,.10)}
    html[data-theme="light"] .nav a{color:#63758a}
    html[data-theme="light"] .nav a.concept-home{color:#152a43}
    html[data-theme="light"] .hero:before{border-color:rgba(35,135,217,.15);box-shadow:0 0 0 58px rgba(35,135,217,.025),0 0 0 118px rgba(35,135,217,.016);background:radial-gradient(circle at center,transparent 0 23%,rgba(35,135,217,.09) 23.2% 23.7%,transparent 24% 43%,rgba(35,135,217,.08) 43.2% 43.6%,transparent 44% 100%)}
    html[data-theme="light"] .hero:after{color:rgba(54,92,126,.10)}
    html[data-theme="light"] .concept-puck{background:linear-gradient(170deg,#7d8790 0%,#333b43 39%,#10151a 78%)}
    html[data-theme="light"] .hero-subtitle{color:#52657b}
    html[data-theme="light"] .eyebrow{background:rgba(255,255,255,.66);color:#37658c;border-color:rgba(35,135,217,.14)}
    html[data-theme="light"] .hero-stats{border-color:rgba(35,78,116,.11)}
    html[data-theme="light"] .stat{border-color:rgba(35,78,116,.11);background:transparent;box-shadow:none}
    html[data-theme="light"] .card{background:linear-gradient(180deg,#ffffff,#f7fafc);border-color:rgba(27,64,99,.09);box-shadow:0 12px 34px rgba(32,58,83,.08)}
    html[data-theme="light"] .hover-card:hover{background:#fff;border-color:rgba(35,135,217,.18);box-shadow:0 18px 42px rgba(32,58,83,.12)}
    html[data-theme="light"] .section-head{border-bottom-color:rgba(27,64,99,.09)}
    html[data-theme="light"] th{background:#edf3f8;color:#687a8d}
    html[data-theme="light"] td{border-bottom-color:rgba(27,64,99,.065)}
    html[data-theme="light"] tbody tr:nth-child(odd) td{background:rgba(35,135,217,.012)}
    html[data-theme="light"] .points{color:#102139}
    html[data-theme="light"] .match-row{background:#fff;border-color:rgba(27,64,99,.08)}
    html[data-theme="light"] .match-row:hover{background:#f8fbfe}
    html[data-theme="light"] footer{background:#e8eff5}

    @media(max-width:1050px){html .upcoming-grid{grid-template-columns:repeat(2,1fr)}html .concept-hero-art{opacity:.55;right:-4%}}
    @media(max-width:760px){html .wrap{width:min(100% - 18px,1280px)}html .header-inner{min-height:62px}html .nav{max-width:48vw}html .nav a{font-size:9px;padding:8px}html .nav a.concept-home{display:none}html .hero{padding:46px 0 30px;min-height:520px}html .hero>div:first-child{max-width:100%}html #heroTitle{font-size:58px;max-width:92%}html .hero-subtitle{font-size:13px;max-width:86%}html .hero:after{right:-3%;top:12%;font-size:150px}html .hero:before{right:-235px;top:70px;width:440px}html .concept-hero-art{width:280px;height:190px;right:-80px;bottom:10%;opacity:.35}html .hero-stats{display:grid;grid-template-columns:1fr 1fr;border:0;gap:1px;background:rgba(126,190,255,.09)}html .stat{background:#071522;border:0;padding:11px 12px}html[data-theme="light"] .stat{background:#f9fbfd}html .upcoming-grid{grid-template-columns:1fr}html .section{padding:32px 0}html .section-head{align-items:flex-start}html .section h2{font-size:26px}html .tour-panel{grid-template-columns:1fr}html .match-row{border-radius:4px}html .upcoming-card{min-height:190px}}
    @media(max-width:480px){html #heroTitle{font-size:50px}html .hero{min-height:485px}html .hero-actions{display:grid;grid-template-columns:1fr}html .btn{width:100%}html .hero-controls{display:grid;grid-template-columns:1fr 1fr}html .filter{min-width:0;width:100%}html .upcoming-team .team-logo-img{width:42px;height:42px}html .section-sub{display:none}}
  `;
  document.head.appendChild(style);

  function mountHome(){
    const nav=document.querySelector('.nav');
    if(nav&&!nav.querySelector('.concept-home')){
      const a=document.createElement('a');a.href='#top';a.textContent='Главная';a.className='concept-home';nav.insertBefore(a,nav.firstChild);
    }
  }
  function mountHeroArt(){
    const hero=document.querySelector('.hero');
    if(hero&&!hero.querySelector('.concept-hero-art')){
      const art=document.createElement('div');art.className='concept-hero-art';art.setAttribute('aria-hidden','true');art.innerHTML='<div class="concept-ice-spray"></div><div class="concept-puck"></div>';hero.appendChild(art);
    }
  }
  function styleHeroTitle(){
    const el=document.querySelector('#heroTitle');if(!el||el.querySelector('.concept-u16'))return;
    const html=el.innerHTML;if(/U16\s*$/.test(html))el.innerHTML=html.replace(/U16\s*$/,'<span class="concept-u16">U16</span>');
  }
  function apply(){mountHome();mountHeroArt();styleHeroTitle()}
  let queued=false;const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})};
  new MutationObserver(queue).observe(document.body,{childList:true,subtree:true,characterData:true});
  apply();
})();