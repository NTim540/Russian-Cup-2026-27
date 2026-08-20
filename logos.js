(()=>{
  const TEAM_LOGOS={
    'Динамо Москва':'https://drive.google.com/thumbnail?id=1I3KuJZEajmksDKtoBsdj4h_75fU0e_KY&sz=w512',
    'МАХ':'https://drive.google.com/thumbnail?id=1Veii4NYgKc06nRtxKmCRQv1YCE164YZP&sz=w512',
    'Торпедо':'https://drive.google.com/thumbnail?id=17NYLCFaSrX6q4g0T7jhBnmidrI1JzKl9&sz=w512',
    'Локомотив':'https://drive.google.com/thumbnail?id=1D6wJnaawN4kMt-1ZWTSvf-trYkslzyKi&sz=w512',
    'Авангард':'https://drive.google.com/thumbnail?id=1y6CZfZSXYDVqCAjOvv6xB_7Fwu1AQwvn&sz=w512',
    'Локомотив 2004':'https://drive.google.com/thumbnail?id=1sq7UHtBq_xiexekxmzWawF3yVTaEl-J-&sz=w512',
    'Крылья Советов':'https://drive.google.com/thumbnail?id=1n6ViHZhkRvq_R_Ul1PEHnFnX7HVNk6-p&sz=w512',
    'Сибирь':'https://drive.google.com/thumbnail?id=1Xul8VXC7juk2NHQfb28Cl9Jt_Kj0Obw-&sz=w512',
    'Лада':'https://drive.google.com/thumbnail?id=15mcwMoXT7OaH46jj8w90PCeTtJY54UAF&sz=w512',
    'Трактор':'https://drive.google.com/thumbnail?id=1qWTRWy-p36RDSMlAy4AqA60PrrUTaczd&sz=w512',
    'Ак Барс':'https://drive.google.com/thumbnail?id=1I09r6XwD-9L4r5ojPGKCHsJ5WGUyOFy1&sz=w512',
    'Спартак':'https://drive.google.com/thumbnail?id=19kJ3uz-yyb1Z2y8qvRbFwuw_2kjUUD2f&sz=w512',
    'Динамо СПБ':'https://drive.google.com/thumbnail?id=1x4KaAFMJ_qfmi26oVjnsc-huKpWtqBbh&sz=w512',
    'СКА-Стрельна':'https://drive.google.com/thumbnail?id=1DH_sKpyVZsh6vnt8Q1_ovBpDuVkPHrNh&sz=w512',
    'АКМ':'https://drive.google.com/thumbnail?id=1NmPj1OwI3C1yuNmgt2XX57HbEiiDauB7&sz=w512',
    'ЦСКА':'https://drive.google.com/thumbnail?id=1bT6o4afTqonyA05keLbe_nfQ78sAmNda&sz=w512',
    'Армия СКА':'https://drive.google.com/thumbnail?id=14XZX2FRyR5x_aVkU2SMLhW-Emk0RUkTo&sz=w512',
    'Нефтехимик':'https://drive.google.com/thumbnail?id=1csEdtjesEvgAFSsfnfhmWUnUE23Tnqeg&sz=w512',
    'Северсталь':'https://drive.google.com/thumbnail?id=10xBTOFy_ps1G3LNaHV3WpbQkuZ74pjRn&sz=w512',
    'Красная Машина Юниор':'https://drive.google.com/thumbnail?id=1qATM0WxWDCgYfemDQvhdy30Ub0sWSWWV&sz=w512'
  };
  const CUP_LOGO='https://drive.google.com/thumbnail?id=1hwFp1ukBAQ_Qd-nI5okdiejSRlUrfLeB&sz=w512';
  const FHR_LOGO='https://drive.google.com/thumbnail?id=1nFMK_7IvAoiHPbC7z9k_eLlwsrw3Bcmx&sz=w512';

  const style=document.createElement('style');
  style.textContent=`
    .site-logo-img{width:30px;height:30px;object-fit:contain;display:block}
    .brand-mark{overflow:hidden}
    .team-logo-img{width:28px;height:28px;object-fit:contain;display:inline-block;vertical-align:middle;flex:0 0 auto;filter:drop-shadow(0 3px 7px rgba(0,0,0,.22))}
    td.team.logo-ready,.upcoming-team>span:first-child.logo-ready,.match-team.logo-ready{display:flex;align-items:center;gap:9px}
    .match-team.away.logo-ready{justify-content:flex-end}
    .organizer-logo-img{width:56px;height:56px;object-fit:contain;display:block}
    .winner-logo-img{width:84px;height:84px;object-fit:contain;display:block}
    @media(max-width:760px){.team-logo-img{width:24px;height:24px}td.team.logo-ready,.upcoming-team>span:first-child.logo-ready,.match-team.logo-ready{gap:7px}.site-logo-img{width:26px;height:26px}}
  `;
  document.head.appendChild(style);

  function img(src,cls,alt){const i=document.createElement('img');i.src=src;i.className=cls;i.alt=alt;i.loading='lazy';i.decoding='async';return i}
  function cleanName(el){return (el.dataset.teamName||el.textContent||'').trim()}
  function decorate(el,away=false){
    if(!el||el.dataset.logoApplied==='1')return;
    const name=cleanName(el),src=TEAM_LOGOS[name];
    if(!src)return;
    el.dataset.teamName=name;
    const logo=img(src,'team-logo-img','Логотип '+name);
    if(away)el.appendChild(logo);else el.insertBefore(logo,el.firstChild);
    el.classList.add('logo-ready');el.dataset.logoApplied='1';
  }
  function apply(){
    const mark=document.querySelector('.brand-mark');
    if(mark&&!mark.dataset.logoApplied){mark.textContent='';mark.appendChild(img(CUP_LOGO,'site-logo-img','Кубок России U16'));mark.dataset.logoApplied='1'}
    const org=document.querySelector('.organizer-mark');
    if(org&&!org.dataset.logoApplied){org.textContent='';org.appendChild(img(FHR_LOGO,'organizer-logo-img','Федерация хоккея России'));org.dataset.logoApplied='1'}
    document.querySelectorAll('td.team').forEach(el=>decorate(el,false));
    document.querySelectorAll('.upcoming-team>span:first-child').forEach(el=>decorate(el,false));
    document.querySelectorAll('.match-team').forEach(el=>decorate(el,el.classList.contains('away')));
    const winner=document.querySelector('#winnerName'),wm=document.querySelector('.winner-mark');
    if(winner&&wm){const name=(winner.textContent||'').trim(),src=TEAM_LOGOS[name];if(src&&wm.dataset.teamName!==name){wm.textContent='';wm.appendChild(img(src,'winner-logo-img','Логотип '+name));wm.dataset.teamName=name}}
  }
  let queued=false;
  const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})};
  new MutationObserver(queue).observe(document.body,{childList:true,subtree:true,characterData:true});
  apply();
})();
