(()=>{
  const API='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-news';
  const STYLE_ID='admin-news-style';
  let editingId=null,items=[],widgets=[];
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const q=s=>document.querySelector(s);

  if(!document.getElementById(STYLE_ID)){
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      #tab-news .news-admin-grid{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(360px,.95fr);gap:14px}
      #tab-news textarea.input{min-height:250px;resize:vertical;line-height:1.55}
      #tab-news .news-list{display:grid;gap:9px;max-height:760px;overflow:auto;padding-right:3px}
      #tab-news .news-item{padding:13px;border:1px solid var(--line);border-radius:14px;background:rgba(255,255,255,.025);cursor:pointer;transition:.16s ease}
      #tab-news .news-item:hover,#tab-news .news-item.active{border-color:rgba(127,198,255,.32);background:rgba(127,198,255,.055)}
      #tab-news .news-item strong{display:block;font-size:13px;line-height:1.3}.news-item-meta{display:flex;gap:7px;align-items:center;flex-wrap:wrap;margin-top:7px;color:var(--muted);font-size:10px}
      #tab-news .news-badge{padding:4px 7px;border-radius:999px;border:1px solid rgba(255,255,255,.09)}
      #tab-news .news-badge.live{color:#8ee0b6;border-color:rgba(72,195,139,.28);background:rgba(72,195,139,.07)}
      #tab-news .cover-preview{height:170px;margin-top:10px;border-radius:14px;border:1px solid var(--line);overflow:hidden;background:radial-gradient(circle at 20% 15%,rgba(127,198,255,.22),transparent 38%),rgba(255,255,255,.025);display:grid;place-items:center;color:var(--muted);font-size:11px}
      #tab-news .cover-preview img{width:100%;height:100%;object-fit:cover;display:block}
      #tab-news .news-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:13px}
      #tab-news .news-help{padding:11px 12px;border:1px dashed var(--line);border-radius:12px;color:var(--muted);font-size:11px;line-height:1.5;margin-top:10px}
      #tab-news .news-time-help{margin-top:6px;color:#9fb4cd;font-size:10px;line-height:1.4}
      #tab-news .widget-builder{margin-top:14px;padding:14px;border:1px solid rgba(127,198,255,.16);border-radius:16px;background:rgba(127,198,255,.035)}
      #tab-news .widget-builder-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}
      #tab-news .widget-builder-head h3{margin:0 0 3px;font-size:16px}
      #tab-news .widget-fields{display:grid;grid-template-columns:1fr 1fr;gap:9px}
      #tab-news .widget-list{display:grid;gap:8px;margin-top:12px}
      #tab-news .widget-item{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;padding:11px 12px;border:1px solid var(--line);border-radius:12px;background:rgba(255,255,255,.025)}
      #tab-news .widget-item strong{display:block;font-size:12px}.widget-item small{display:block;color:var(--muted);font-size:10px;margin-top:3px;line-height:1.4}
      #tab-news .widget-actions{display:flex;gap:5px}.widget-mini{border:1px solid var(--line);border-radius:8px;background:rgba(255,255,255,.04);color:#dce8f6;padding:6px 8px;cursor:pointer;font-size:11px}.widget-mini:hover{border-color:rgba(127,198,255,.3)}
      #tab-news .widget-empty{padding:13px;border:1px dashed var(--line);border-radius:11px;color:var(--muted);font-size:11px;text-align:center}
      @media(max-width:900px){#tab-news .news-admin-grid{grid-template-columns:1fr}}
      @media(max-width:600px){#tab-news .widget-fields{grid-template-columns:1fr}}
    `;document.head.appendChild(s);
  }

  const tabs=q('.tabs'),settings=q('#tab-settings');if(!tabs||!settings)return;
  const btn=document.createElement('button');btn.className='tab';btn.dataset.tab='news';btn.textContent='Новости';tabs.appendChild(btn);
  const info=document.createElement('a');info.className='tab';info.href='/admin-infographics.html';info.textContent='Инфографика ↗';tabs.appendChild(info);

  const section=document.createElement('section');section.id='tab-news';section.className='hidden';section.innerHTML=`
    <div class="panel-title"><div><h2 style="margin:0">Новости</h2><div class="muted">Публикации для главной страницы и пресс-центра.</div></div><button id="newsNew" class="btn">+ Новость</button></div>
    <div class="news-admin-grid">
      <section class="card panel">
        <div class="field"><label>Заголовок</label><input id="newsTitle" class="input" maxlength="180"></div>
        <div class="field" style="margin-top:10px"><label>Короткое описание</label><textarea id="newsExcerpt" class="input" style="min-height:92px" maxlength="420"></textarea></div>
        <div class="field" style="margin-top:10px"><label>Текст новости</label><textarea id="newsBody" class="input" placeholder="Пишите текст обычными абзацами. Пустая строка создаёт новый абзац."></textarea></div>

        <div class="widget-builder">
          <div class="widget-builder-head"><div><h3>Виджеты внутри новости</h3><div class="muted">Динамические блоки берут актуальные данные турнира. Они идут после текста в указанном ниже порядке.</div></div><span class="news-badge">LIVE DATA</span></div>
          <div class="widget-fields">
            <div class="field"><label>Тип виджета</label><select id="widgetType" class="select">
              <option value="schedule">Расписание игр на день</option>
              <option value="results">Результаты игр на день</option>
              <option value="overall_table">Общая таблица</option>
              <option value="group_table">Таблица одной группы</option>
              <option value="all_group_tables">Все таблицы групп</option>
              <option value="groups">Состав групп</option>
            </select></div>
            <div class="field"><label>Заголовок виджета</label><input id="widgetTitle" class="input" placeholder="Можно оставить пустым"></div>
            <div class="field" id="widgetDateField"><label>Дата</label><input id="widgetDate" class="input" type="date"></div>
            <div class="field hidden" id="widgetGroupField"><label>Группа</label><select id="widgetGroup" class="select"></select></div>
          </div>
          <div class="news-actions"><button id="widgetAdd" class="btn sec small" type="button">+ Добавить виджет</button></div>
          <div id="widgetList" class="widget-list"></div>
        </div>

        <div class="field" style="margin-top:10px"><label>Обложка · URL</label><input id="newsCover" class="input" placeholder="https://..."></div>
        <div id="newsCoverPreview" class="cover-preview">Обложка не выбрана</div>
        <div class="grid2" style="margin-top:10px">
          <div class="field"><label>Статус</label><select id="newsPublished" class="select"><option value="false">Черновик</option><option value="true">Опубликовано</option></select></div>
          <div class="field"><label>Дата и время публикации</label><input id="newsDate" class="input" type="datetime-local" step="60"><div class="news-time-help">Можно поставить любую дату и любое время — в том числе уже прошедшие сегодня или в прошлые дни.</div></div>
        </div>
        <div class="news-help">Расписание, таблицы и группы не копируются в текст статически: читатель всегда увидит актуальные данные из базы. Для расписания стартового дня выберите дату начала текущего этапа — она подставляется автоматически при смене типа/этапа.</div>
        <div class="news-actions"><button id="newsSave" class="btn">Сохранить</button><button id="newsOpen" class="btn sec hidden" type="button">Открыть на сайте</button><button id="newsDelete" class="btn danger hidden" type="button">Удалить</button></div>
        <div id="newsMsg" class="muted" style="margin-top:10px"></div>
      </section>
      <section class="card panel"><div class="panel-title"><div><h3>Публикации</h3><div id="newsCount" class="muted"></div></div><button id="newsReload" class="btn sec small">Обновить</button></div><div id="newsList" class="news-list"><div class="empty">Откройте раздел, чтобы загрузить новости.</div></div></section>
    </div>`;
  settings.insertAdjacentElement('afterend',section);

  const hideNews=()=>section.classList.add('hidden');
  document.addEventListener('click',e=>{const t=e.target.closest?.('.tab');if(t&&t!==btn&&!t.matches('a[href="/admin-infographics.html"]'))hideNews()},true);
  btn.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===btn));['groups','matches','settings'].forEach(x=>q('#tab-'+x)?.classList.add('hidden'));section.classList.remove('hidden');syncWidgetControls();loadNews()};

  function pw(){try{if(typeof PW!=='undefined'&&PW){sessionStorage.setItem('rcAdminPw',PW);return PW}}catch{}return sessionStorage.getItem('rcAdminPw')||''}
  async function api(url,opt={}){opt.headers={...(opt.headers||{}),'x-admin-password':pw()};const r=await fetch(API+url,opt),b=await r.json().catch(()=>({}));if(!r.ok)throw Error(b.error||'Ошибка');return b}
  const currentTournamentId=()=>{try{return Number(D?.tournament?.id)||0}catch{return 0}};
  const currentStageId=()=>{try{return Number(D?.stage?.id)||0}catch{return 0}};
  const localInput=iso=>{if(!iso)return'';const d=new Date(iso);if(Number.isNaN(d.getTime()))return'';const z=n=>String(n).padStart(2,'0');return`${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())}T${z(d.getHours())}:${z(d.getMinutes())}`};
  const fmt=iso=>{try{return new Date(iso).toLocaleString('ru-RU',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}catch{return''}};
  const widgetNames={schedule:'Расписание игр',results:'Результаты дня',overall_table:'Общая таблица',group_table:'Таблица группы',all_group_tables:'Все таблицы групп',groups:'Состав групп'};

  function unlockDateTime(){const el=q('#newsDate');if(!el)return;el.removeAttribute('min');el.removeAttribute('max');el.removeAttribute('readonly');el.disabled=false}
  function preview(){const url=q('#newsCover').value.trim(),box=q('#newsCoverPreview');box.innerHTML=url?`<img src="${esc(url)}" alt="Предпросмотр" onerror="this.parentNode.textContent='Не удалось загрузить обложку'">`:'Обложка не выбрана'}
  function currentGroupName(id){try{return D?.groups?.find(g=>Number(g.id)===Number(id))?.name||D?.groups?.find(g=>Number(g.id)===Number(id))?.code||'группа'}catch{return'группа'}}
  function stageName(id){try{return C?.stages?.find(s=>Number(s.id)===Number(id))?.name||('этап #'+id)}catch{return'этап'}}
  function widgetDescription(w){const parts=[stageName(w.stage_id)];if(w.date)parts.push(new Date(w.date+'T12:00:00').toLocaleDateString('ru-RU'));if(w.group_id)parts.push(currentGroupName(w.group_id));return parts.join(' · ')}
  function renderWidgets(){const box=q('#widgetList');if(!widgets.length){box.innerHTML='<div class="widget-empty">Виджетов пока нет. Новость будет состоять только из текста.</div>';return}box.innerHTML=widgets.map((w,i)=>`<div class="widget-item" data-wi="${i}"><div><strong>${esc(w.title||widgetNames[w.type]||w.type)}</strong><small>${esc(widgetDescription(w))}</small></div><div class="widget-actions"><button class="widget-mini" data-up="${i}" ${i===0?'disabled':''}>↑</button><button class="widget-mini" data-down="${i}" ${i===widgets.length-1?'disabled':''}>↓</button><button class="widget-mini" data-remove="${i}">✕</button></div></div>`).join('');box.querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>moveWidget(Number(b.dataset.up),-1));box.querySelectorAll('[data-down]').forEach(b=>b.onclick=()=>moveWidget(Number(b.dataset.down),1));box.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{widgets.splice(Number(b.dataset.remove),1);renderWidgets()})}
  function moveWidget(i,d){const j=i+d;if(j<0||j>=widgets.length)return;[widgets[i],widgets[j]]=[widgets[j],widgets[i]];renderWidgets()}
  function syncWidgetControls(){const type=q('#widgetType')?.value||'schedule',needsDate=['schedule','results'].includes(type),needsGroup=type==='group_table';q('#widgetDateField')?.classList.toggle('hidden',!needsDate);q('#widgetGroupField')?.classList.toggle('hidden',!needsGroup);const groups=[...(D?.groups||[])].sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));if(q('#widgetGroup'))q('#widgetGroup').innerHTML=groups.map(g=>`<option value="${g.id}">${esc(g.name||g.code)}</option>`).join('');if(needsDate&&q('#widgetDate')&&!q('#widgetDate').value){const stage=D?.stage;q('#widgetDate').value=stage?.start_date||D?.matches?.[0]?.game_date||''}}
  function addWidget(){const type=q('#widgetType').value,stage_id=currentStageId();if(!stage_id)return alert('Сначала выберите этап турнира');const w={type,stage_id,title:q('#widgetTitle').value.trim()||null};if(['schedule','results'].includes(type)){w.date=q('#widgetDate').value;if(!w.date)return alert('Укажите дату')}if(type==='group_table'){w.group_id=Number(q('#widgetGroup').value);if(!w.group_id)return alert('Выберите группу')}widgets.push(w);q('#widgetTitle').value='';renderWidgets()}

  function clearForm(){editingId=null;widgets=[];q('#newsTitle').value='';q('#newsExcerpt').value='';q('#newsBody').value='';q('#newsCover').value='';q('#newsPublished').value='false';q('#newsDate').value='';unlockDateTime();q('#newsDelete').classList.add('hidden');q('#newsOpen').classList.add('hidden');q('#newsMsg').textContent='Новая публикация';preview();syncWidgetControls();renderWidgets();renderList()}
  function edit(n){editingId=n.id;widgets=Array.isArray(n.widgets)?n.widgets.map(w=>({...w})):[];q('#newsTitle').value=n.title||'';q('#newsExcerpt').value=n.excerpt||'';q('#newsBody').value=n.body||'';q('#newsCover').value=n.cover_url||'';q('#newsPublished').value=String(Boolean(n.is_published));unlockDateTime();q('#newsDate').value=localInput(n.published_at);q('#newsDelete').classList.remove('hidden');q('#newsOpen').classList.toggle('hidden',!n.is_published);q('#newsMsg').textContent='Редактирование публикации №'+n.id;preview();syncWidgetControls();renderWidgets();renderList();section.scrollIntoView({behavior:'smooth',block:'start'})}
  function renderList(){const box=q('#newsList');q('#newsCount').textContent=items.length+' публикаций';box.innerHTML=items.length?items.map(n=>`<div class="news-item ${Number(n.id)===Number(editingId)?'active':''}" data-id="${n.id}"><strong>${esc(n.title)}</strong><div class="news-item-meta"><span class="news-badge ${n.is_published?'live':''}">${n.is_published?'Опубликовано':'Черновик'}</span><span>${esc(fmt(n.published_at||n.created_at))}</span>${Array.isArray(n.widgets)&&n.widgets.length?`<span>${n.widgets.length} видж.</span>`:''}</div></div>`).join(''):'<div class="empty">Новостей пока нет.</div>';box.querySelectorAll('.news-item').forEach(el=>el.onclick=()=>edit(items.find(n=>Number(n.id)===Number(el.dataset.id))))}
  async function loadNews(){const tid=currentTournamentId();if(!tid){q('#newsList').innerHTML='<div class="empty">Сначала выберите турнир.</div>';return}try{q('#newsList').innerHTML='<div class="empty">Загрузка…</div>';const b=await api('?admin=1&tournament_id='+tid);items=b.items||[];renderList()}catch(e){q('#newsList').innerHTML='<div class="empty">'+esc(e.message)+'</div>'}}
  async function save(){const tid=currentTournamentId();if(!tid)return alert('Сначала выберите турнир');unlockDateTime();const body={action:editingId?'update':'create',id:editingId||undefined,tournament_id:tid,title:q('#newsTitle').value,excerpt:q('#newsExcerpt').value,body:q('#newsBody').value,cover_url:q('#newsCover').value,is_published:q('#newsPublished').value==='true',published_at:q('#newsDate').value||null,widgets};q('#newsMsg').textContent='Сохраняю…';try{const b=await api('',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});editingId=b.item.id;q('#newsMsg').textContent='Сохранено';await loadNews();edit(items.find(n=>Number(n.id)===Number(editingId))||b.item)}catch(e){q('#newsMsg').textContent=e.message}}
  async function remove(){if(!editingId||!confirm('Удалить эту новость?'))return;try{await api('',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'delete',id:editingId})});clearForm();await loadNews()}catch(e){alert(e.message)}}

  q('#newsNew').onclick=clearForm;q('#newsReload').onclick=loadNews;q('#newsSave').onclick=save;q('#newsDelete').onclick=remove;q('#newsOpen').onclick=()=>{if(editingId)window.open('/news.html?id='+editingId,'_blank')};q('#newsCover').addEventListener('input',preview);q('#widgetType').onchange=()=>{q('#widgetDate').value='';syncWidgetControls()};q('#widgetAdd').onclick=addWidget;
  q('#tournament')?.addEventListener('change',()=>{editingId=null;setTimeout(()=>{syncWidgetControls();if(!section.classList.contains('hidden'))loadNews()},700)});q('#stage')?.addEventListener('change',()=>setTimeout(syncWidgetControls,700));
  setInterval(()=>{try{if(typeof PW!=='undefined'&&PW)sessionStorage.setItem('rcAdminPw',PW)}catch{}},1200);
  clearForm();
})();
