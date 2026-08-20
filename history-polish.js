(()=>{
  const CUP_LOGO='https://drive.google.com/thumbnail?id=1hwFp1ukBAQ_Qd-nI5okdiejSRlUrfLeB&sz=w512';
  const style=document.createElement('style');
  style.id='history-polish';
  style.textContent=`
    .header-in{position:relative}.history-brand-mark{width:34px;height:34px;object-fit:contain;flex:0 0 auto;filter:drop-shadow(0 7px 13px rgba(0,0,0,.3))}
    .header:after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;background:linear-gradient(90deg,var(--red) 0 18%,var(--blue) 18% 52%,transparent 52%)}
    .back{border:1px solid transparent;padding:8px 9px;border-radius:3px}.back:hover{border-color:var(--line);background:rgba(35,135,217,.05)}
    .brand strong{text-transform:uppercase;letter-spacing:.01em}.theme{border-radius:3px!important}
    .hero{min-height:560px;display:flex;flex-direction:column;justify-content:center}.hero:before{content:"";position:absolute;right:4%;bottom:8%;width:min(28vw,340px);aspect-ratio:2.2/1;border-radius:50%;background:linear-gradient(165deg,#48525c,#10161d 44%,#020507 82%);transform:rotate(-8deg);box-shadow:inset 0 8px 14px rgba(255,255,255,.08),0 28px 46px rgba(0,0,0,.35);opacity:.88;pointer-events:none}.hero>*{position:relative;z-index:2}
    .hero h1{max-width:760px}.hero .lead{max-width:680px}.hero-actions .btn{border-radius:3px!important}
    .archive-nav{display:flex;gap:0;overflow:auto;margin-top:18px;border-bottom:1px solid var(--line);scrollbar-width:none}.archive-nav::-webkit-scrollbar{display:none}.archive-nav a{padding:11px 14px;border-bottom:2px solid transparent;color:#7f93a8;font-size:9px;text-transform:uppercase;letter-spacing:.08em;font-weight:950;white-space:nowrap}.archive-nav a:hover{color:#fff;border-bottom-color:var(--red)}
    .section{scroll-margin-top:78px}.head h2 b{font-size:.62em;vertical-align:.18em;margin-right:3px}.head{position:relative}.head:after{content:"";position:absolute;left:0;bottom:-1px;width:68px;height:2px;background:var(--blue)}
    .card{position:relative;overflow:hidden}.podium-card{border-radius:5px!important}.podium-card .medal{font-size:9px;letter-spacing:.1em}.podium-card h3{text-transform:uppercase;letter-spacing:-.02em}.podium-card:before{content:"";position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--blue);opacity:.38}.podium-card.gold:before{background:var(--gold);opacity:.7}.podium-card.silver:before{background:var(--silver);opacity:.55}.podium-card.bronze:before{background:var(--bronze);opacity:.6}
    .timeline{padding:8px;border:1px solid var(--line);border-radius:5px;background:rgba(4,15,25,.34)}.stage-btn{border-radius:3px!important}.stage-btn.active{box-shadow:inset 0 -2px 0 var(--blue)}
    .table-card{border-radius:5px!important}.table-title{position:relative}.table-title:before{content:"// ";color:var(--blue)}
    .table-wrap{-webkit-overflow-scrolling:touch}.table-wrap table{border-collapse:separate;border-spacing:0}.table-wrap tbody tr:hover td{background:rgba(35,135,217,.045)}
    .team-chip{border-radius:4px!important;transition:.16s ease}.team-chip:hover{border-color:rgba(35,135,217,.30);transform:translateY(-1px)}
    .rank-row{position:relative}.rank-row:nth-child(-n+3):before{content:"";position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--blue);opacity:.4}.rank-row:first-child:before{background:var(--gold);opacity:.75}.rank-row:nth-child(2):before{background:var(--silver);opacity:.55}.rank-row:nth-child(3):before{background:var(--bronze);opacity:.6}
    .leaders h3:before,.results h3:before{content:"// ";color:var(--blue)}
    .official{border-radius:4px!important}.official:hover{background:linear-gradient(180deg,rgba(15,40,63,.98),rgba(8,24,40,.98))}.official strong{text-transform:uppercase;letter-spacing:-.01em}.official span{color:var(--red)!important}
    .footer{position:relative;margin-top:48px!important;padding-top:34px!important;background:linear-gradient(180deg,rgba(3,10,17,.3),rgba(3,10,17,.78));border-top-color:rgba(126,190,255,.10)!important}.footer:before{content:"";position:absolute;left:0;top:-1px;width:38%;height:2px;background:linear-gradient(90deg,var(--red) 0 38%,var(--blue) 38% 100%)}
    html[data-theme="light"] .archive-nav a:hover{color:#102139}.archive-nav a:focus-visible{outline:2px solid var(--blue);outline-offset:-2px}
    html[data-theme="light"] .timeline{background:rgba(255,255,255,.55)}html[data-theme="light"] .official:hover{background:linear-gradient(180deg,#fff,#f5f9fd)}html[data-theme="light"] .footer{background:linear-gradient(180deg,rgba(234,241,247,.25),rgba(226,235,244,.76))}
    @media(max-width:680px){
      .history-brand-mark{width:29px;height:29px}.header-in{gap:8px}.back{font-size:0;padding:8px}.back:before{content:"←";font-size:17px}.brand small{font-size:8px}.brand strong{font-size:11px;max-width:175px}.hero{min-height:auto;padding-top:58px}.hero:before{width:190px;right:-55px;bottom:12%;opacity:.32}.hero:after{opacity:.78}.archive-nav{margin-left:-10px;margin-right:-10px;padding:0 10px}.summary strong{font-size:20px}.podium-card{min-height:118px;padding:17px}.podium-card:after{font-size:82px}.table-wrap{margin:0 -1px}.table-wrap table{min-width:560px}.table-wrap th.team,.table-wrap td.team{min-width:205px}.final-grid .ranking{overflow:hidden}.rank-row{grid-template-columns:30px minmax(0,1fr) 46px 42px;padding:10px}.footer{margin-top:32px!important}}
  `;
  document.head.appendChild(style);

  function mountLogo(){
    const h=document.querySelector('.header-in');if(!h||h.querySelector('.history-brand-mark'))return;
    const img=document.createElement('img');img.src=CUP_LOGO;img.alt='Кубок России U16';img.className='history-brand-mark';
    const back=h.querySelector('.back');if(back)back.insertAdjacentElement('afterend',img);else h.prepend(img);
  }
  function cleanPodium(){
    const items=[...document.querySelectorAll('.podium-card .medal')];
    const labels=['01 / Чемпион','02 / Серебро','03 / Бронза'];items.forEach((el,i)=>{if(labels[i])el.textContent=labels[i]});
  }
  function mountNav(){
    const hero=document.querySelector('.hero');if(!hero||hero.querySelector('.archive-nav'))return;
    const candidates=[['#finals','Итоги'],['#stages','Этапы'],['#participants','Участники'],['#stats','Статистика'],['#official','ФХР']];
    const available=candidates.filter(([sel])=>document.querySelector(sel));if(!available.length)return;
    const nav=document.createElement('nav');nav.className='archive-nav';nav.setAttribute('aria-label','Навигация по архиву');
    nav.innerHTML=available.map(([sel,label])=>`<a href="${sel}">${label}</a>`).join('');hero.appendChild(nav);
  }
  mountLogo();cleanPodium();mountNav();
})();