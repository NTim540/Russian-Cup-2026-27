(()=>{
  if(!document.getElementById('contacts-style')){
    const style=document.createElement('style');
    style.id='contacts-style';
    style.textContent=`
      #contacts{position:relative}
      #contacts .contacts-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
      #contacts .contact-card{position:relative;display:flex;align-items:center;justify-content:space-between;gap:18px;padding:22px 24px;min-height:116px;border:1px solid var(--line);border-radius:var(--radius,22px);background:linear-gradient(180deg,rgba(18,36,59,.92),rgba(10,23,40,.96));box-shadow:var(--shadow);overflow:hidden;transition:.2s ease}
      #contacts .contact-card:hover{transform:translateY(-3px);border-color:rgba(127,198,255,.28);box-shadow:0 28px 78px rgba(0,0,0,.34)}
      #contacts .contact-card:after{content:'↗';position:absolute;right:20px;top:16px;font-size:48px;font-weight:950;line-height:1;color:rgba(127,198,255,.06);pointer-events:none}
      #contacts .contact-copy{position:relative;z-index:1;min-width:0}
      #contacts .contact-label{display:block;margin-bottom:8px;color:var(--muted);font-size:10px;font-weight:900;letter-spacing:.14em;text-transform:uppercase}
      #contacts .contact-value{display:block;color:var(--text);font-size:clamp(18px,2.2vw,26px);font-weight:950;letter-spacing:-.025em;word-break:break-word}
      #contacts .contact-hint{display:block;margin-top:7px;color:var(--muted);font-size:11px}
      #contacts .contact-icon{position:relative;z-index:1;flex:0 0 auto;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;border:1px solid rgba(127,198,255,.18);background:rgba(127,198,255,.06);font-size:20px}
      #contacts .project-note{position:relative;display:grid;grid-template-columns:46px minmax(0,1fr);gap:15px;align-items:start;margin-top:14px;padding:19px 21px;border:1px solid rgba(226,58,71,.58);border-left-width:4px;border-radius:14px;background:linear-gradient(135deg,rgba(226,58,71,.13),rgba(226,58,71,.045));box-shadow:inset 0 0 0 1px rgba(226,58,71,.035)}
      #contacts .project-note-icon{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:rgba(226,58,71,.14);border:1px solid rgba(226,58,71,.34);color:#ff9ba4;font-size:20px;font-weight:950}
      #contacts .project-note strong{display:block;margin:1px 0 7px;color:#ff9ba4;font-size:11px;font-weight:950;letter-spacing:.14em;text-transform:uppercase}
      #contacts .project-note p{margin:0;max-width:960px;color:var(--soft,#c7d1de);font-size:13px;line-height:1.62}
      #contacts .project-note b{color:var(--text);font-weight:850}

      #tournament-countdown{padding-top:18px;padding-bottom:34px}
      #tournament-countdown .countdown-card{position:relative;overflow:hidden;border:1px solid rgba(127,198,255,.22);border-radius:28px;background:radial-gradient(circle at 88% 12%,rgba(226,58,71,.18),transparent 25%),radial-gradient(circle at 8% 0%,rgba(47,111,237,.22),transparent 32%),linear-gradient(145deg,rgba(14,33,54,.98),rgba(7,20,35,.98));box-shadow:0 28px 80px rgba(0,0,0,.30);padding:32px}
      #tournament-countdown .countdown-card:after{content:'START';position:absolute;right:-12px;top:-24px;font-size:112px;font-weight:950;letter-spacing:-.08em;color:rgba(127,198,255,.035);pointer-events:none}
      #tournament-countdown .countdown-kicker{position:relative;z-index:1;color:#9db0c6;font-size:11px;font-weight:900;letter-spacing:.16em;text-transform:uppercase}
      #tournament-countdown .countdown-title{position:relative;z-index:1;margin:8px 0 22px;font-size:clamp(24px,3.2vw,42px);line-height:1.02;letter-spacing:-.035em;text-transform:uppercase}
      #tournament-countdown .countdown-grid{position:relative;z-index:1;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
      #tournament-countdown .countdown-unit{padding:18px 12px;border:1px solid rgba(127,198,255,.12);border-radius:18px;background:rgba(255,255,255,.035);text-align:center}
      #tournament-countdown .countdown-value{display:block;font-size:clamp(34px,5vw,62px);line-height:.95;font-weight:950;letter-spacing:-.045em;font-variant-numeric:tabular-nums}
      #tournament-countdown .countdown-label{display:block;margin-top:8px;color:#8193a8;font-size:9px;font-weight:900;letter-spacing:.14em;text-transform:uppercase}
      #tournament-countdown .first-match{position:relative;z-index:1;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:24px;align-items:center;margin-top:22px;padding-top:22px;border-top:1px solid rgba(255,255,255,.09)}
      #tournament-countdown .first-match-label{color:#e85a65;font-size:9px;font-weight:950;letter-spacing:.14em;text-transform:uppercase;margin-bottom:12px}
      #tournament-countdown .first-match-teams{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:16px}
      #tournament-countdown .first-team{display:flex;align-items:center;gap:12px;min-width:0;font-size:clamp(18px,2.2vw,28px);font-weight:950;letter-spacing:-.025em}
      #tournament-countdown .first-team.away{justify-content:flex-end;text-align:right}
      #tournament-countdown .first-team-logo{width:58px;height:58px;object-fit:contain;flex:0 0 auto;filter:drop-shadow(0 8px 18px rgba(0,0,0,.28))}
      #tournament-countdown .first-team-name{min-width:0}
      #tournament-countdown .first-match-vs{color:#6f8197;font-size:11px;font-weight:950;letter-spacing:.12em}
      #tournament-countdown .first-match-meta{margin-top:12px;color:#8fa0b5;font-size:11px;line-height:1.5}
      #tournament-countdown .first-match-date{min-width:190px;padding:16px 18px;border-radius:16px;border:1px solid rgba(226,58,71,.30);background:rgba(226,58,71,.08);color:#ffd7da;text-align:center;white-space:nowrap}
      #tournament-countdown .first-match-date strong{display:block;font-size:clamp(22px,2.6vw,34px);line-height:1;font-weight:950;letter-spacing:-.035em;text-transform:uppercase}
      #tournament-countdown .first-match-date span{display:block;margin-top:8px;font-size:clamp(24px,3.2vw,40px);line-height:1;font-weight:950;font-variant-numeric:tabular-nums}
      #tournament-countdown.started .countdown-title{color:#8ae1b6}

      html[data-theme='light'] #contacts .contact-card{background:linear-gradient(180deg,#fff,#f7fafc);border-color:rgba(28,62,98,.12);box-shadow:0 16px 40px rgba(32,60,90,.08)}
      html[data-theme='light'] #contacts .contact-card:hover{border-color:rgba(47,111,237,.24);box-shadow:0 20px 48px rgba(32,60,90,.12)}
      html[data-theme='light'] #contacts .contact-icon{background:rgba(47,111,237,.06);border-color:rgba(47,111,237,.14)}
      html[data-theme='light'] #contacts .project-note{background:linear-gradient(135deg,rgba(226,58,71,.08),rgba(255,255,255,.9));border-color:rgba(204,43,56,.38);box-shadow:0 10px 30px rgba(142,34,45,.05)}
      html[data-theme='light'] #contacts .project-note-icon{background:rgba(226,58,71,.08);border-color:rgba(204,43,56,.22);color:#c92836}
      html[data-theme='light'] #contacts .project-note strong{color:#c92836}
      html[data-theme='light'] #contacts .project-note p{color:#5f6e80}
      html[data-theme='light'] #tournament-countdown .countdown-card{background:radial-gradient(circle at 88% 12%,rgba(226,58,71,.08),transparent 25%),radial-gradient(circle at 8% 0%,rgba(47,111,237,.09),transparent 32%),linear-gradient(145deg,#fff,#f5f9fc);border-color:rgba(30,74,116,.14);box-shadow:0 18px 55px rgba(32,60,90,.10)}
      html[data-theme='light'] #tournament-countdown .countdown-unit{background:rgba(25,64,102,.025);border-color:rgba(25,64,102,.10)}
      html[data-theme='light'] #tournament-countdown .countdown-kicker,html[data-theme='light'] #tournament-countdown .countdown-label,html[data-theme='light'] #tournament-countdown .first-match-meta{color:#687a8e}
      html[data-theme='light'] #tournament-countdown .first-match{border-top-color:rgba(25,64,102,.10)}
      html[data-theme='light'] #tournament-countdown .first-match-date{color:#ad2230;background:rgba(226,58,71,.05);border-color:rgba(196,37,51,.20)}

      @media(max-width:700px){
        #contacts .contacts-grid{grid-template-columns:1fr}#contacts .contact-card{padding:19px 18px;min-height:104px}#contacts .contact-value{font-size:20px}#contacts .project-note{grid-template-columns:36px minmax(0,1fr);gap:12px;padding:16px 15px}#contacts .project-note-icon{width:34px;height:34px;border-radius:10px;font-size:16px}#contacts .project-note p{font-size:12px;line-height:1.58}
        #tournament-countdown{padding-top:8px;padding-bottom:26px}#tournament-countdown .countdown-card{padding:20px 15px;border-radius:22px}#tournament-countdown .countdown-grid{gap:6px}#tournament-countdown .countdown-unit{padding:14px 5px;border-radius:14px}#tournament-countdown .countdown-value{font-size:32px}#tournament-countdown .countdown-label{font-size:7px;letter-spacing:.08em}#tournament-countdown .first-match{grid-template-columns:1fr;gap:14px}#tournament-countdown .first-match-teams{gap:8px}#tournament-countdown .first-team{display:grid;justify-items:center;text-align:center;gap:7px;font-size:13px}#tournament-countdown .first-team.away{justify-content:stretch;text-align:center}#tournament-countdown .first-team-logo{width:48px;height:48px}#tournament-countdown .first-match-date{width:100%;min-width:0}#tournament-countdown .first-match-date strong{font-size:20px}#tournament-countdown .first-match-date span{font-size:30px}
      }
    `;
    document.head.appendChild(style);
  }

  if(!document.getElementById('contacts')){
    const section=document.createElement('section');
    section.id='contacts';
    section.className='section wrap reveal';
    section.innerHTML=`
      <div class="section-head">
        <div>
          <div class="section-kicker">Связаться с проектом</div>
          <h2>Контакты</h2>
          <div class="section-sub">По вопросам турнира, сайта, сотрудничества и обратной связи.</div>
        </div>
      </div>
      <div class="contacts-grid">
        <a class="contact-card" href="https://t.me/Nik4480402" target="_blank" rel="noopener noreferrer" aria-label="Написать в Telegram @Nik4480402">
          <div class="contact-copy"><span class="contact-label">Telegram</span><strong class="contact-value">@Nik4480402</strong><span class="contact-hint">Открыть чат в Telegram</span></div>
          <span class="contact-icon" aria-hidden="true">✈</span>
        </a>
        <a class="contact-card" href="mailto:arussiancup@bk.ru" aria-label="Написать на почту arussiancup@bk.ru">
          <div class="contact-copy"><span class="contact-label">Электронная почта</span><strong class="contact-value">arussiancup@bk.ru</strong><span class="contact-hint">Написать письмо</span></div>
          <span class="contact-icon" aria-hidden="true">✉</span>
        </a>
      </div>
      <div class="project-note" role="note" aria-label="Важная информация о проекте">
        <div class="project-note-icon" aria-hidden="true">!</div>
        <div>
          <strong>Важно</strong>
          <p>Данный сайт <b>не является официальным сайтом организатора турнира</b> и не представляет Федерацию хоккея России. Здесь публикуется информация из <b>официальных источников ФХР</b> в более удобном и наглядном формате: расписание, результаты, турнирные таблицы, матч-центр и история турнира.</p>
        </div>
      </div>`;

    const history=document.getElementById('history');
    const organizer=document.querySelector('.fhr-organizer-link')?.closest('section');
    if(history) history.insertAdjacentElement('afterend',section);
    else if(organizer) organizer.insertAdjacentElement('beforebegin',section);
    else document.querySelector('main')?.appendChild(section);
  }

  const nav=document.querySelector('.nav');
  if(nav && !nav.querySelector('a[href="#contacts"]')){
    const a=document.createElement('a');a.href='#contacts';a.textContent='Контакты';nav.appendChild(a);
  }
  const footerNav=document.querySelector('.footer-nav');
  if(footerNav && !footerNav.querySelector('a[href="#contacts"]')){
    const admin=footerNav.querySelector('.admin-link');
    const a=document.createElement('a');a.href='#contacts';a.textContent='Контакты';
    footerNav.insertBefore(a,admin||null);
  }

  const COUNTDOWN_TEAM_LOGOS={
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

  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const logoHtml=name=>COUNTDOWN_TEAM_LOGOS[name]?`<img class="first-team-logo" src="${COUNTDOWN_TEAM_LOGOS[name]}" alt="Логотип ${esc(name)}">`:'';

  function addCountdown(){
    if(document.getElementById('tournament-countdown')) return true;
    if(typeof D==='undefined'||!D?.matches?.length||!D?.teams?.length) return false;
    const matches=[...D.matches].sort((a,b)=>String(a.game_date||'').localeCompare(String(b.game_date||''))||String(a.start_time||'99:99').localeCompare(String(b.start_time||'99:99'))||((a.game_no||0)-(b.game_no||0)));
    const first=matches[0];
    if(!first?.game_date) return false;
    const hhmm=String(first.start_time||'00:00').slice(0,5);
    const target=new Date(`${first.game_date}T${hhmm}:00+03:00`);
    if(Number.isNaN(target.getTime())) return false;
    const teamName=id=>D.teams.find(t=>Number(t.id)===Number(id))?.name||'—';
    const home=teamName(first.home_team_id),away=teamName(first.away_team_id);
    const prettyDate=new Date(first.game_date+'T12:00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long'});
    const venue=[first.city,first.arena].filter(Boolean).join(' · ');

    const section=document.createElement('section');
    section.id='tournament-countdown';
    section.className='wrap reveal';
    section.innerHTML=`<div class="countdown-card"><div class="countdown-kicker">Кубок России U16 · 2026/27</div><div class="countdown-title">До старта турнира осталось:</div><div class="countdown-grid"><div class="countdown-unit"><span class="countdown-value" data-cd="days">00</span><span class="countdown-label">Дней</span></div><div class="countdown-unit"><span class="countdown-value" data-cd="hours">00</span><span class="countdown-label">Часов</span></div><div class="countdown-unit"><span class="countdown-value" data-cd="minutes">00</span><span class="countdown-label">Минут</span></div><div class="countdown-unit"><span class="countdown-value" data-cd="seconds">00</span><span class="countdown-label">Секунд</span></div></div><div class="first-match"><div><div class="first-match-label">Первый матч турнира · матч №${first.game_no??'—'}</div><div class="first-match-teams"><div class="first-team">${logoHtml(home)}<span class="first-team-name">${esc(home)}</span></div><div class="first-match-vs">VS</div><div class="first-team away"><span class="first-team-name">${esc(away)}</span>${logoHtml(away)}</div></div><div class="first-match-meta">${venue||'Место проведения уточняется'}</div></div><div class="first-match-date"><strong>${prettyDate}</strong><span>${hhmm}</span></div></div></div>`;
    const hero=document.querySelector('.hero');
    if(hero) hero.insertAdjacentElement('afterend',section);
    else document.querySelector('main')?.prepend(section);

    const title=section.querySelector('.countdown-title');
    const set=(key,value)=>{const el=section.querySelector(`[data-cd="${key}"]`);if(el)el.textContent=String(value).padStart(2,'0')};
    function tick(){
      const diff=target.getTime()-Date.now();
      if(diff<=0){section.classList.add('started');title.textContent='Турнир стартовал!';set('days',0);set('hours',0);set('minutes',0);set('seconds',0);return}
      const total=Math.floor(diff/1000);
      set('days',Math.floor(total/86400));
      set('hours',Math.floor(total%86400/3600));
      set('minutes',Math.floor(total%3600/60));
      set('seconds',total%60);
    }
    tick();setInterval(tick,1000);
    return true;
  }

  if(!addCountdown()){
    let tries=0;
    const wait=setInterval(()=>{tries++;if(addCountdown()||tries>80)clearInterval(wait)},250);
  }
})();
