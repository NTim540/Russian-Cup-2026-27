(()=>{
  const LOGOS={
    'Динамо Москва':'https://drive.google.com/thumbnail?id=1I3KuJZEajmksDKtoBsdj4h_75fU0e_KY&sz=w512','МАХ':'https://drive.google.com/thumbnail?id=1Veii4NYgKc06nRtxKmCRQv1YCE164YZP&sz=w512','Торпедо':'https://drive.google.com/thumbnail?id=17NYLCFaSrX6q4g0T7jhBnmidrI1JzKl9&sz=w512','Локомотив':'https://drive.google.com/thumbnail?id=1D6wJnaawN4kMt-1ZWTSvf-trYkslzyKi&sz=w512','Авангард':'https://drive.google.com/thumbnail?id=1y6CZfZSXYDVqCAjOvv6xB_7Fwu1AQwvn&sz=w512','Локомотив 2004':'https://drive.google.com/thumbnail?id=1sq7UHtBq_xiexekxmzWawF3yVTaEl-J-&sz=w512','Крылья Советов':'https://drive.google.com/thumbnail?id=1n6ViHZhkRvq_R_Ul1PEHnFnX7HVNk6-p&sz=w512','Сибирь':'https://drive.google.com/thumbnail?id=1Xul8VXC7juk2NHQfb28Cl9Jt_Kj0Obw-&sz=w512','Лада':'https://drive.google.com/thumbnail?id=15mcwMoXT7OaH46jj8w90PCeTtJY54UAF&sz=w512','Трактор':'https://drive.google.com/thumbnail?id=1qWTRWy-p36RDSMlAy4AqA60PrrUTaczd&sz=w512','Ак Барс':'https://drive.google.com/thumbnail?id=1I09r6XwD-9L4r5ojPGKCHsJ5WGUyOFy1&sz=w512','Спартак':'https://drive.google.com/thumbnail?id=19kJ3uz-yyb1Z2y8qvRbFwuw_2kjUUD2f&sz=w512','Динамо СПБ':'https://drive.google.com/thumbnail?id=1x4KaAFMJ_qfmi26oVjnsc-huKpWtqBbh&sz=w512','АКМ':'https://drive.google.com/thumbnail?id=1NmPj1OwI3C1yuNmgt2XX57HbEiiDauB7&sz=w512','ЦСКА':'https://drive.google.com/thumbnail?id=1bT6o4afTqonyA05keLbe_nfQ78sAmNda&sz=w512','Армия СКА':'https://drive.google.com/thumbnail?id=14XZX2FRyR5x_aVkU2SMLhW-Emk0RUkTo&sz=w512','Нефтехимик':'https://drive.google.com/thumbnail?id=1csEdtjesEvgAFSsfnfhmWUnUE23Tnqeg&sz=w512','Северсталь':'https://drive.google.com/thumbnail?id=10xBTOFy_ps1G3LNaHV3WpbQkuZ74pjRn&sz=w512','Красная Машина Юниор':'https://drive.google.com/thumbnail?id=1qATM0WxWDCgYfemDQvhdy30Ub0sWSWWV&sz=w512'
  };
  const style=document.createElement('style');
  style.textContent=`
    #tab-teams .team-admin-list{align-self:start;position:sticky;top:88px}
    #tab-teams .team-admin-preview{display:block;min-height:0;margin-top:14px;padding:0;border:0;border-radius:8px;background:transparent;overflow:visible;text-align:left}
    .tap-label{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 8px;color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.08em;font-weight:850}.tap-label span:last-child{font-size:9px;letter-spacing:0;text-transform:none;color:#65778c}
    .tap-card{position:relative;min-height:340px;overflow:hidden;border:1px solid rgba(127,198,255,.14);border-radius:8px;background:linear-gradient(145deg,#091a2b,#0b2035 60%,#101b2c);box-shadow:0 20px 55px rgba(0,0,0,.28);isolation:isolate}
    .tap-bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:0;transform:scale(1.025);transition:opacity .18s ease}.tap-bg.has-image{opacity:1}.tap-bg:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,16,28,.70),rgba(5,16,28,.94)),linear-gradient(90deg,rgba(5,16,28,.94),rgba(5,16,28,.58))}
    .tap-content{position:relative;z-index:2;display:grid;grid-template-rows:auto 1fr auto;min-height:340px;padding:18px}.tap-kicker{color:#7fc6ff;font-size:9px;text-transform:uppercase;letter-spacing:.13em;font-weight:950}.tap-kicker:before{content:"// ";color:#e31f2b}.tap-main{display:grid;place-items:center;align-content:center;gap:14px;text-align:center;padding:12px 0}.tap-logo-ring{width:150px;height:150px;border-radius:50%;display:grid;place-items:center;border:1px solid rgba(127,198,255,.20);background:radial-gradient(circle at 50% 42%,rgba(127,198,255,.10),rgba(4,17,29,.48) 68%,rgba(4,17,29,.18));box-shadow:0 0 0 28px rgba(127,198,255,.018)}.tap-logo{max-width:105px;max-height:105px;object-fit:contain;filter:drop-shadow(0 12px 22px rgba(0,0,0,.42))}.tap-logo-fallback{font-size:52px;font-weight:950;color:#7fc6ff}.tap-name{font-size:clamp(22px,2.2vw,32px);line-height:.94;letter-spacing:-.045em;text-transform:uppercase;font-weight:950;word-break:break-word}.tap-arena{padding-top:13px;border-top:1px solid rgba(255,255,255,.08)}.tap-arena small{display:block;color:#7890a7;font-size:8px;text-transform:uppercase;letter-spacing:.09em;font-weight:850}.tap-arena strong{display:block;margin-top:5px;color:#d9e5f1;font-size:10px;line-height:1.45;font-weight:700}.tap-help{margin-top:9px;color:#718397;font-size:10px;line-height:1.45}
    @media(max-width:850px){#tab-teams .team-admin-list{position:static}.tap-card,.tap-content{min-height:310px}.tap-logo-ring{width:132px;height:132px}.tap-logo{max-width:92px;max-height:92px}}
  `;
  document.head.appendChild(style);

  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const getData=()=>{try{return typeof D!=='undefined'?D:null}catch{return null}};
  const value=id=>document.querySelector(id)?.value?.trim()||'';
  function current(){
    const d=getData(),sel=document.querySelector('#teamAdminSelect');
    if(!d||!sel)return null;
    const id=Number(sel.value),team=d.teams?.find(t=>Number(t.id)===id);
    if(!team)return null;
    const mem=d.memberships?.find(m=>Number(m.team_id)===id),group=d.groups?.find(g=>Number(g.id)===Number(mem?.group_id));
    const stageName=String(d.stage?.name||'1 тур').replace(/^1-й\s+тур$/i,'1 тур');
    return {d,team,group,stageName};
  }
  function firstArena(team){
    const row=document.querySelector('#arenaList .arena-row');
    if(row){const n=row.querySelector('.arena-name')?.value?.trim()||'',a=row.querySelector('.arena-address')?.value?.trim()||'';if(n||a)return [n,a].filter(Boolean).join(' — ')}
    const a=Array.isArray(team?.arenas)?team.arenas[0]:null;
    if(a)return [a.name,a.address].filter(Boolean).join(' — ');
    return '';
  }
  function render(){
    const box=document.querySelector('#teamAdminPreview'),c=current();
    if(!box||!c)return;
    const {team,group,stageName}=c,unknown=team.name==='Участник не определен';
    const logoInput=document.querySelector('#teamLogoUrl');
    const heroInput=document.querySelector('#teamHeroImageUrl');
    const cityInput=document.querySelector('#teamCity');
    const logo=unknown?'':(logoInput?logoInput.value.trim():(team.logo_url||LOGOS[team.name]||''));
    const hero=heroInput?heroInput.value.trim():(team.hero_image_url||'');
    const city=cityInput?cityInput.value.trim():(team.city||'');
    const arena=firstArena(team)||([city,'арена будет добавлена'].filter(Boolean).join(' · '));
    const groupLabel=group?.code||group?.name||'—';
    box.innerHTML=`<div class="tap-label"><span>Предпросмотр страницы</span><span>обновляется сразу</span></div><div class="tap-card"><div class="tap-bg"></div><div class="tap-content"><div class="tap-kicker">${esc(stageName)} • группа ${esc(groupLabel)}</div><div class="tap-main"><div class="tap-logo-ring">${logo?`<img class="tap-logo" src="${esc(logo)}" alt="">`:`<div class="tap-logo-fallback">${unknown?'?':'—'}</div>`}</div><div class="tap-name">${esc(team.name)}</div></div><div class="tap-arena"><small>Домашняя арена</small><strong>${esc(arena||'Информация будет добавлена')}</strong></div></div></div><div class="tap-help">Меняй фото, логотип, город или арену — здесь сразу видно, как будет выглядеть верхний блок. На сайт изменения попадут только после «Сохранить команду».</div>`;
    const bg=box.querySelector('.tap-bg');
    if(hero&&bg){bg.style.backgroundImage=`url("${hero.replace(/["\\]/g,'')}")`;bg.classList.add('has-image')}
    const img=box.querySelector('.tap-logo');
    if(img)img.onerror=()=>{const ring=img.parentElement;img.remove();if(ring)ring.innerHTML=`<div class="tap-logo-fallback">${unknown?'?':'—'}</div>`};
  }
  function queue(){requestAnimationFrame(render)}
  document.addEventListener('input',e=>{if(e.target.closest?.('#teamAdminForm'))queue()});
  document.addEventListener('change',e=>{if(e.target.matches?.('#teamAdminSelect')||e.target.closest?.('#teamAdminForm'))setTimeout(render,0)});
  document.addEventListener('click',e=>{if(e.target.closest?.('#addArenaBtn,.arena-remove,#teamAdminReload,[data-tab="teams"]'))setTimeout(render,40)});
  const start=()=>{const form=document.querySelector('#teamAdminForm');if(!form)return false;new MutationObserver(()=>setTimeout(render,0)).observe(form,{childList:true,subtree:true});render();return true};
  if(!start()){let n=0;const t=setInterval(()=>{n++;if(start()||n>80)clearInterval(t)},250)}
})();