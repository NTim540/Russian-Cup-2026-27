(()=>{
  if(document.getElementById('contacts')) return;

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
    html[data-theme='light'] #contacts .contact-card{background:linear-gradient(180deg,#fff,#f7fafc);border-color:rgba(28,62,98,.12);box-shadow:0 16px 40px rgba(32,60,90,.08)}
    html[data-theme='light'] #contacts .contact-card:hover{border-color:rgba(47,111,237,.24);box-shadow:0 20px 48px rgba(32,60,90,.12)}
    html[data-theme='light'] #contacts .contact-icon{background:rgba(47,111,237,.06);border-color:rgba(47,111,237,.14)}
    html[data-theme='light'] #contacts .project-note{background:linear-gradient(135deg,rgba(226,58,71,.08),rgba(255,255,255,.9));border-color:rgba(204,43,56,.38);box-shadow:0 10px 30px rgba(142,34,45,.05)}
    html[data-theme='light'] #contacts .project-note-icon{background:rgba(226,58,71,.08);border-color:rgba(204,43,56,.22);color:#c92836}
    html[data-theme='light'] #contacts .project-note strong{color:#c92836}
    html[data-theme='light'] #contacts .project-note p{color:#5f6e80}
    @media(max-width:700px){#contacts .contacts-grid{grid-template-columns:1fr}#contacts .contact-card{padding:19px 18px;min-height:104px}#contacts .contact-value{font-size:20px}#contacts .project-note{grid-template-columns:36px minmax(0,1fr);gap:12px;padding:16px 15px}#contacts .project-note-icon{width:34px;height:34px;border-radius:10px;font-size:16px}#contacts .project-note p{font-size:12px;line-height:1.58}}
  `;
  document.head.appendChild(style);

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
})();
