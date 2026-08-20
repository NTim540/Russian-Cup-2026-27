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
    html[data-theme='light'] #contacts .contact-card{background:linear-gradient(180deg,#fff,#f7fafc);border-color:rgba(28,62,98,.12);box-shadow:0 16px 40px rgba(32,60,90,.08)}
    html[data-theme='light'] #contacts .contact-card:hover{border-color:rgba(47,111,237,.24);box-shadow:0 20px 48px rgba(32,60,90,.12)}
    html[data-theme='light'] #contacts .contact-icon{background:rgba(47,111,237,.06);border-color:rgba(47,111,237,.14)}
    @media(max-width:700px){#contacts .contacts-grid{grid-template-columns:1fr}#contacts .contact-card{padding:19px 18px;min-height:104px}#contacts .contact-value{font-size:20px}}
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
