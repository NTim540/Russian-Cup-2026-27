(()=>{
  const DATA={
    'АКМ':{
      source:'https://cfo.fhr.ru/tournaments/pervenstvo-tsfo-18171615-let-16756891/akademiya-mikhaylova_982485/',
      note:'Для АКМ использована актуальная карточка команды 2011 г.р. на ресурсе ФХР: турнирная карточка Кубка России пока не отдаёт состав через открытый поиск.',
      players:[
        [10,'Андреевский Даниил Сергеевич','F'],[23,'Бедретдинов Петр Романович','F'],[29,'Бекболов Мухаммад','F'],[11,'Волков Семен Александрович','F'],[97,'Гайдук Михаил Юрьевич','F'],[7,'Еловиков Кирилл Владимирович','F'],[8,'Кисилев Герман Андреевич','F'],[19,'Королёв Матвей Иванович','F'],[18,'Лебеденко Яромир Игоревич','D'],[27,'Малышев Семен Владимирович','D'],[17,'Мурат Мади','D'],[77,'Мятчин Кирилл Константинович','F'],[55,'Новиков Степан Андреевич','D'],[87,'Осипов Александр Алексеевич','F'],[90,'Полосухин Семён Сергеевич','F'],[1,'Поляков Денис Алексеевич','G'],[13,'Родионов Кирилл Михайлович','F'],[30,'Симонов Роман Вячеславович','G'],[24,'Тараканов Владислав Евгеньевич','D'],[22,'Титаев Потап Александрович','F'],[25,'Шейко Максим Юрьевич','D'],[31,'Юхименко Максим Кириллович','D']
      ]
    },
    'СКА-Стрельна':{
      source:'https://junior.fhr.ru/tournaments/kubokrossii-25008909/ska-strelna_4356683/',
      note:'Актуальная заявка СКА-Стрельны на Кубок России U16 2026/27 по данным ФХР.',
      players:[
        [10,'Бабоша Роман Юрьевич','D'],[11,'Комаров Владимир Андреевич','D'],[13,'Кадочников Лев Александрович','D'],[16,'Смирнов Даниил Романович','F'],[17,'Кузнецов Иван Романович','F'],[18,'Конищев Матвей Павлович','F'],[19,'Козлов Андрей Андреевич','D'],[20,'Ваулин Данила Максимович','G'],[21,'Лагуткин Матвей Алексеевич','D'],[26,'Александров Егор Михайлович','F'],[27,'Голубев Владимир Олегович','F'],[29,'Голованов Кирилл Дмитриевич','F'],[31,'Баранов Дмитрий Константинович','F'],[34,'Щедрин Михаил Евгеньевич','D'],[52,'Долгий Фёдор Андреевич','G'],[71,'Пискунов Данил Дмитриевич','D'],[72,'Судницын Евгений Андреевич','G'],[78,'Полянин Серафим Игоревич','D'],[87,'Сахаров Георгий Михайлович','F'],[91,'Козлов Алексей Андреевич','F'],[94,'Казаков Владислав Витальевич','F'],[98,'Железняков Савелий Артемович','F'],[99,'Иванов Демьян Дмитриевич','F']
      ]
    }
  };
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function card(players,code,title){const a=players.filter(x=>x[2]===code);return `<article class="roster-card ${code.toLowerCase()}"><div class="roster-card-head"><strong>${title}</strong><span>${a.length}</span></div><div class="roster-list">${a.sort((x,y)=>x[0]-y[0]||x[1].localeCompare(y[1],'ru')).map(x=>`<div class="roster-player"><span class="roster-num">${x[0]}</span><span class="roster-name">${esc(x[1])}</span></div>`).join('')}</div></article>`}
  function patch(){
    const name=document.getElementById('teamName')?.textContent?.trim();
    const data=DATA[name];
    if(!data)return name&&name!=='Загрузка…';
    const sec=document.getElementById('rosterSection');if(!sec)return false;
    if(name==='СКА-Стрельна'&&sec.dataset.source==='fhr-edge')return true;
    const players=[...data.players];
    sec.dataset.rosterTeam=name;
    sec.innerHTML=`<div class="roster-head"><div><div class="section-kicker">Заявка команды</div><h2 class="section-title">Состав</h2><div class="section-sub">Актуальный состав команды 2011 г.р. по карточке ФХР.</div></div><div class="roster-meta"><span class="roster-count">${players.length} игроков</span><a class="roster-source" href="${data.source}" target="_blank" rel="noopener noreferrer">Источник · ФХР ↗</a></div></div><div class="roster-grid">${card(players,'G','Вратари')}${card(players,'D','Защитники')}${card(players,'F','Нападающие')}</div><div class="roster-footnote">${esc(data.note)}</div>`;
    return true;
  }
  let n=0;const t=setInterval(()=>{n++;if(patch()||n>40)clearInterval(t)},200);patch();
})();
