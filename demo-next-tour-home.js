(()=>{
  if(window.__nextTourHomepageDemo)return;window.__nextTourHomepageDemo=true;
  const css=`
    #nextTourFinalDemo{display:block!important;padding:30px 0 38px!important}
    #nextTourFinalDemo .nt-shell{position:relative;overflow:hidden;border:1px solid rgba(35,135,217,.22);background:linear-gradient(145deg,rgba(8,27,45,.98),rgba(5,20,34,.98) 62%,rgba(35,135,217,.10));padding:22px 16px 18px;box-shadow:0 22px 70px rgba(0,0,0,.34)}
    #nextTourFinalDemo .nt-shell:after{content:"02";position:absolute;right:-8px;top:-38px;font-size:148px;line-height:1;font-weight:950;color:rgba(35,135,217,.055);pointer-events:none}
    #nextTourFinalDemo .nt-top{position:relative;z-index:1;display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:16px}
    #nextTourFinalDemo .nt-kicker{color:#5caee6;font-size:9px;font-weight:950;letter-spacing:.16em;text-transform:uppercase}
    #nextTourFinalDemo h2{margin:6px 0 0!important;font-size:clamp(28px,6vw,48px)!important;line-height:.95!important;letter-spacing:-.04em!important;text-transform:uppercase}
    #nextTourFinalDemo .nt-sub{margin:9px 0 0;color:#8fa3b7;font-size:10px;line-height:1.5;max-width:600px}
    #nextTourFinalDemo .nt-demo{flex:0 0 auto;border:1px solid rgba(240,201,107,.25);background:rgba(240,201,107,.07);color:#e3cb85;padding:7px 9px;font-size:7px;font-weight:950;letter-spacing:.10em;text-transform:uppercase}
    #nextTourFinalDemo .nt-grid{position:relative;z-index:1;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
    #nextTourFinalDemo .nt-group{border:1px solid rgba(126,190,255,.10);background:rgba(5,20,34,.70);overflow:hidden}
    #nextTourFinalDemo .nt-head{padding:11px 11px 10px;border-bottom:1px solid rgba(126,190,255,.08)}
    #nextTourFinalDemo .nt-head small{display:block;color:#607f9a;font-size:7px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
    #nextTourFinalDemo .nt-head strong{display:block;margin-top:3px;font-size:15px;text-transform:uppercase}
    #nextTourFinalDemo .nt-team{display:grid;grid-template-columns:25px minmax(0,1fr);gap:8px;align-items:center;padding:8px 10px;border-bottom:1px solid rgba(126,190,255,.055)}
    #nextTourFinalDemo .nt-team:last-child{border-bottom:0}
    #nextTourFinalDemo .nt-logo{width:25px!important;height:25px!important;max-width:25px!important;max-height:25px!important;object-fit:contain!important}
    #nextTourFinalDemo .nt-fallback{width:25px;height:25px;display:grid;place-items:center;background:rgba(35,135,217,.08);color:#6d879f;font-size:7px;font-weight:950}
    #nextTourFinalDemo .nt-team strong{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:9px;text-transform:uppercase}
    #nextTourFinalDemo .nt-team span{display:block;margin-top:2px;color:#60778d;font-size:7px;text-transform:uppercase}
    #nextTourFinalDemo .nt-actions{position:relative;z-index:1;margin-top:13px;display:flex;justify-content:flex-end}
    #nextTourFinalDemo .nt-actions a{display:inline-flex;align-items:center;justify-content:center;min-height:38px;padding:0 13px;border:1px solid rgba(35,135,217,.24);background:rgba(35,135,217,.08);color:#bfe2fa;font-size:9px;font-weight:950;text-transform:uppercase;letter-spacing:.06em}
    @media(max-width:950px){#nextTourFinalDemo .nt-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:600px){#nextTourFinalDemo{padding-top:22px!important}#nextTourFinalDemo .nt-shell{padding:18px 10px 14px}#nextTourFinalDemo .nt-top{display:block}#nextTourFinalDemo .nt-demo{display:inline-block;margin-top:10px}#nextTourFinalDemo .nt-grid{grid-template-columns:1fr}#nextTourFinalDemo .nt-actions a{width:100%}}
  `;
  const style=document.createElement('style');style.id='next-tour-home-demo-style';style.textContent=css;document.head.appendChild(style);
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function mount(){
    try{
      if(document.querySelector('#nextTourFinalDemo'))return true;
      if(typeof D==='undefined'||!D||!Array.isArray(D.groups)||!Array.isArray(D.teams)||typeof CupStandings==='undefined')return false;
      const hero=document.querySelector('.hero');if(!hero)return false;
      const groups=[...D.groups].sort((a,b)=>(a.sort_order||0)-(b.sort_order||0)).slice(0,4),assign=[];
      groups.forEach((g,gi)=>{const rows=CupStandings.groupRows(D,g,D.settings).slice(0,5),sourceIndex=gi+1;rows.forEach((r,ri)=>{const place=Number(r.place)||ri+1,target=place<5?place:5-sourceIndex,team=D.teams.find(t=>String(t.id)===String(r.team_id))||D.teams.find(t=>t.name===r.team);assign.push({target,place,source:g,team,name:team?.name||r.team||'—'})})});
      const section=document.createElement('section');section.id='nextTourFinalDemo';section.className='section wrap';
      section.innerHTML='<article class="nt-shell"><div class="nt-top"><div><div class="nt-kicker">1-й тур завершён</div><h2>Распределение на 2-й тур</h2><p class="nt-sub">По итогам первого тура сформированы четыре группы следующего этапа.</p></div><span class="nt-demo">Демо · как после завершения тура</span></div><div class="nt-grid">'+[1,2,3,4].map(n=>{const xs=assign.filter(a=>a.target===n).sort((a,b)=>a.place-b.place||(a.source.sort_order||0)-(b.source.sort_order||0));return '<article class="nt-group"><div class="nt-head"><small>2-й тур</small><strong>Группа '+n+'</strong></div>'+xs.map(a=>{const logo=a.team?.logo_url||'';return '<div class="nt-team">'+(logo?'<img class="nt-logo" src="'+esc(logo)+'" alt="">':'<span class="nt-fallback">'+esc(a.name.slice(0,2).toUpperCase())+'</span>')+'<div><strong>'+esc(a.name)+'</strong><span>'+esc(a.source.code||a.source.name)+' · '+a.place+' место</span></div></div>'}).join('')+'</article>'}).join('')+'</div><div class="nt-actions"><a href="/tour-path.html">Подробнее о втором туре →</a></div></article>';
      hero.insertAdjacentElement('afterend',section);
      const upcoming=document.querySelector('#upcoming');if(upcoming)upcoming.style.display='none';
      return true;
    }catch(e){console.error('next-tour-home-demo',e);return false}
  }
  if(!mount()){let tries=0;const timer=setInterval(()=>{tries++;if(mount()||tries>60)clearInterval(timer)},250)}
})();