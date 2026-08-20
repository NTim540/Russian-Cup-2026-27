(() => {
  const drive = id => `https://drive.google.com/thumbnail?id=${id}&sz=w512`;
  const logos = {
    'ДИНАМО МОСКВА': drive('1I3KuJZEajmksDKtoBsdj4h_75fU0e_KY'),
    'МАХ': drive('1Veii4NYgKc06nRtxKmCRQv1YCE164YZP'),
    'ТОРПЕДО': drive('17NYLCFaSrX6q4g0T7jhBnmidrI1JzKl9'),
    'ЛОКОМОТИВ': drive('1D6wJnaawN4kMt-1ZWTSvf-trYkslzyKi'),
    'АВАНГАРД': drive('1y6CZfZSXYDVqCAjOvv6xB_7Fwu1AQwvn'),
    'ЛОКОМОТИВ 2004': drive('1sq7UHtBq_xiexekxmzWawF3yVTaEl-J-'),
    'КРЫЛЬЯ СОВЕТОВ': drive('1n6ViHZhkRvq_R_Ul1PEHnFnX7HVNk6-p'),
    'СИБИРЬ': drive('1Xul8VXC7juk2NHQfb28Cl9Jt_Kj0Obw-'),
    'ЛАДА': drive('15mcwMoXT7OaH46jj8w90PCeTtJY54UAF'),
    'ТРАКТОР': drive('1qWTRWy-p36RDSMlAy4AqA60PrrUTaczd'),
    'АК БАРС': drive('1I09r6XwD-9L4r5ojPGKCHsJ5WGUyOFy1'),
    'СПАРТАК': drive('19kJ3uz-yyb1Z2y8qvRbFwuw_2kjUUD2f'),
    'ДИНАМО СПБ': drive('1x4KaAFMJ_qfmi26oVjnsc-huKpWtqBbh'),
    'СКА-СТРЕЛЬНА': drive('1DH_sKpyVZsh6vnt8Q1_ovBpDuVkPHrNh'),
    'АКМ': drive('1NmPj1OwI3C1yuNmgt2XX57HbEiiDauB7'),
    'ЦСКА': drive('1bT6o4afTqonyA05keLbe_nfQ78sAmNda'),
    'АРМИЯ СКА': drive('14XZX2FRyR5x_aVkU2SMLhW-Emk0RUkTo'),
    'НЕФТЕХИМИК': drive('1csEdtjesEvgAFSsfnfhmWUnUE23Tnqeg'),
    'СЕВЕРСТАЛЬ': drive('10xBTOFy_ps1G3LNaHV3WpbQkuZ74pjRn'),
    'КРАСНАЯ МАШИНА ЮНИОР': drive('1qATM0WxWDCgYfemDQvhdy30Ub0sWSWWV')
  };
  const cupLogo = drive('1hwFp1ukBAQ_Qd-nI5okdiejSRlUrfLeB');
  const fhrLogo = drive('1nFMK_7IvAoiHPbC7z9k_eLlwsrw3Bcmx');

  const normalize = value => String(value || '').trim().replace(/ё/g, 'е').replace(/Ё/g, 'Е').replace(/\s+/g, ' ').toUpperCase();
  const logoFor = name => logos[normalize(name)] || '';
  const makeLogo = (name, size = 'team') => {
    const src = logoFor(name);
    if (!src) return null;
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Логотип ${name}`;
    img.className = size === 'big' ? 'team-logo team-logo-big' : 'team-logo';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.referrerPolicy = 'no-referrer';
    img.onerror = () => img.remove();
    return img;
  };

  const style = document.createElement('style');
  style.textContent = `
    .brand-mark.logo-ready,.organizer-mark.logo-ready{overflow:hidden}
    .brand-mark.logo-ready img{width:30px;height:30px;object-fit:contain;display:block}
    .organizer-mark.logo-ready img{width:56px;height:56px;object-fit:contain;display:block}
    .team-logo{width:28px;height:28px;object-fit:contain;display:inline-block;vertical-align:middle;flex:0 0 auto;filter:drop-shadow(0 3px 8px rgba(0,0,0,.22))}
    .team-logo-big{width:84px;height:84px}
    td.team.logo-ready{display:table-cell}
    td.team.logo-ready .team-logo{margin-right:10px}
    .upcoming-team .team-name-logo,.match-team .team-name-logo{display:flex;align-items:center;gap:10px;min-width:0}
    .upcoming-team .team-logo,.match-team .team-logo{width:34px;height:34px}
    .match-team.away .team-name-logo{justify-content:flex-end}
    .winner-mark.logo-ready{overflow:hidden}
    @media(max-width:760px){
      .brand-mark.logo-ready img{width:26px;height:26px}
      .team-logo{width:24px;height:24px}
      .upcoming-team .team-logo,.match-team .team-logo{width:28px;height:28px}
      .upcoming-team .team-name-logo,.match-team .team-name-logo{gap:7px}
    }
  `;
  document.head.appendChild(style);

  function staticLogos() {
    const brand = document.querySelector('.brand-mark');
    if (brand && !brand.classList.contains('logo-ready')) {
      const img = document.createElement('img');
      img.src = cupLogo; img.alt = 'Кубок России U16'; img.referrerPolicy = 'no-referrer';
      img.onerror = () => { brand.classList.remove('logo-ready'); };
      brand.textContent = ''; brand.appendChild(img); brand.classList.add('logo-ready');
    }
    const organizer = document.querySelector('.organizer-mark');
    if (organizer && !organizer.classList.contains('logo-ready')) {
      const img = document.createElement('img');
      img.src = fhrLogo; img.alt = 'Федерация хоккея России'; img.referrerPolicy = 'no-referrer';
      img.onerror = () => { organizer.classList.remove('logo-ready'); };
      organizer.textContent = ''; organizer.appendChild(img); organizer.classList.add('logo-ready');
    }
  }

  function tableLogos() {
    document.querySelectorAll('td.team:not(.logo-ready)').forEach(td => {
      const name = td.textContent.trim();
      const img = makeLogo(name);
      if (!img) return;
      td.prepend(img);
      td.classList.add('logo-ready');
    });
  }

  function cardLogos() {
    document.querySelectorAll('.upcoming-team').forEach(row => {
      if (row.dataset.logoReady) return;
      const nameNode = row.firstElementChild;
      if (!nameNode) return;
      const name = nameNode.textContent.trim();
      const img = makeLogo(name);
      if (!img) return;
      const wrap = document.createElement('span');
      wrap.className = 'team-name-logo';
      wrap.append(img, document.createTextNode(name));
      nameNode.replaceWith(wrap);
      row.dataset.logoReady = '1';
    });

    document.querySelectorAll('.match-team').forEach(team => {
      if (team.dataset.logoReady) return;
      const name = team.textContent.trim();
      const img = makeLogo(name);
      if (!img) return;
      const wrap = document.createElement('span');
      wrap.className = 'team-name-logo';
      if (team.classList.contains('away')) wrap.append(document.createTextNode(name), img);
      else wrap.append(img, document.createTextNode(name));
      team.textContent = '';
      team.appendChild(wrap);
      team.dataset.logoReady = '1';
    });
  }

  function winnerLogo() {
    const name = document.querySelector('#winnerName')?.textContent?.trim();
    const mark = document.querySelector('.winner-mark');
    if (!mark || !name || name === '—') return;
    if (mark.dataset.team === normalize(name)) return;
    const img = makeLogo(name, 'big');
    if (!img) return;
    mark.textContent = '';
    mark.appendChild(img);
    mark.classList.add('logo-ready');
    mark.dataset.team = normalize(name);
  }

  let queued = false;
  const apply = () => {
    queued = false;
    staticLogos();
    tableLogos();
    cardLogos();
    winnerLogo();
  };
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(apply);
  };

  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  apply();
})();
