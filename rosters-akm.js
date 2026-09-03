(()=>{
  const TEAM='АКМ';
  const SOURCE='https://cfo.fhr.ru/tournaments/pervenstvo-tsfo-18171615-let-16756891/akademiya-mikhaylova_982485/';
  const PLAYERS=[
    [10,'Андреевский Даниил Сергеевич','F'],[23,'Бедретдинов Петр Романович','F'],[29,'Бекболов Мухаммад','F'],[11,'Волков Семен Александрович','F'],[97,'Гайдук Михаил Юрьевич','F'],[7,'Еловиков Кирилл Владимирович','F'],[8,'Кисилев Герман Андреевич','F'],[19,'Королёв Матвей Иванович','F'],[18,'Лебеденко Яромир Игоревич','D'],[27,'Малышев Семен Владимирович','D'],[17,'Мурат Мади','D'],[77,'Мятчин Кирилл Константинович','F'],[55,'Новиков Степан Андреевич','D'],[87,'Осипов Александр Алексеевич','F'],[90,'Полосухин Семён Сергеевич','F'],[1,'Поляков Денис Алексеевич','G'],[13,'Родионов Кирилл Михайлович','F'],[30,'Симонов Роман Вячеславович','G'],[24,'Тараканов Владислав Евгеньевич','D'],[22,'Титаев Потап Александрович','F'],[25,'Шейко Максим Юрьевич','D'],[31,'Юхименко Максим Кириллович','D']
  ];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function card(code,title){const a=PLAYERS.filter(x=>x[2]===code);return `<article class="roster-card ${code.toLowerCase()}"><div class="roster-card-head"><strong>${title}</strong><span>${a.length}</span></div><div class="roster-list">${a.map(x=>`<div class="roster-player"><span class="roster-num">${x[0]}</span><span class="roster-name">${esc(x[1])}</span></div>`).join('')}</div></article>`}
  function patch(){
    const name=document.getElementById('teamName')?.textContent?.trim();
    if(name!==TEAM)return name&&name!=='Загрузка…';
    const sec=document.getElementById('rosterSection');if(!sec)return false;
    sec.dataset.rosterTeam='АКМ';
    sec.innerHTML=`<div class="roster-head"><div><div class="section-kicker">Заявка команды</div><h2 class="section-title">Состав</h2><div class="section-sub">Актуальный состав команды 2011 г.р. по карточке ФХР.</div></div><div class="roster-meta"><span class="roster-count">${PLAYERS.length} игроков</span><a class="roster-source" href="${SOURCE}" target="_blank" rel="noopener noreferrer">Источник · ФХР ↗</a></div></div><div class="roster-grid">${card('G','Вратари')}${card('D','Защитники')}${card('F','Нападающие')}</div><div class="roster-footnote">Для АКМ использована актуальная карточка команды 2011 г.р. на ресурсе ФХР: турнирная карточка Кубка России пока не отдаёт состав через открытый поиск.</div>`;
    return true;
  }
  let n=0;const t=setInterval(()=>{n++;if(patch()||n>40)clearInterval(t)},200);patch();
})();
