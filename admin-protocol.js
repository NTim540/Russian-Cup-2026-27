(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .protocol-btn{background:rgba(127,198,255,.09)!important;border:1px solid rgba(127,198,255,.25)!important;color:#d8efff!important}
    .ap-overlay{position:fixed;inset:0;z-index:999;background:rgba(2,8,16,.86);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:16px;opacity:0;visibility:hidden;transition:.18s ease}
    .ap-overlay.open{opacity:1;visibility:visible}.ap-dialog{width:min(900px,100%);max-height:94vh;overflow:auto;border-radius:20px;border:1px solid rgba(127,198,255,.2);background:#0a1829;box-shadow:0 30px 90px rgba(0,0,0,.6)}
    .ap-head{position:sticky;top:0;z-index:3;display:flex;justify-content:space-between;align-items:center;gap:12px;padding:15px 17px;background:rgba(10,24,41,.94);backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,255,255,.08)}.ap-head h3{margin:0}.ap-close{width:38px;height:38px;border-radius:11px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#fff;font-size:22px;cursor:pointer}
    .ap-body{padding:17px}.ap-section{margin-bottom:22px}.ap-section h4{margin:0 0 10px;font-size:16px}.ap-period-grid{display:grid;grid-template-columns:120px repeat(2,1fr);gap:8px;align-items:center}.ap-period-grid .head{color:#93a2b6;font-size:10px;text-transform:uppercase;letter-spacing:.08em}.ap-period-name{font-weight:800}.ap-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:12px}
    .ap-event-form{display:grid;grid-template-columns:120px 130px 150px 1fr;gap:9px}.ap-event-form .wide{grid-column:span 2}.ap-event-list{display:grid;gap:8px;margin-top:12px}.ap-event{display:grid;grid-template-columns:70px 70px 110px minmax(0,1fr) auto;gap:8px;align-items:center;padding:10px;border:1px solid rgba(255,255,255,.08);border-radius:12px;background:rgba(255,255,255,.025)}.ap-event small{color:#93a2b6;display:block;margin-top:2px}.ap-empty{padding:14px;border:1px dashed rgba(255,255,255,.1);border-radius:12px;color:#93a2b6;text-align:center}
    @media(max-width:700px){.ap-overlay{padding:0;align-items:flex-end}.ap-dialog{border-radius:20px 20px 0 0;max-height:95vh}.ap-body{padding:12px}.ap-period-grid{grid-template-columns:80px 1fr 1fr}.ap-event-form{grid-template-columns:1fr 1fr}.ap-event-form .wide{grid-column:1/-1}.ap-event{grid-template-columns:52px 62px 1fr auto}.ap-event .ap-team{display:none}.ap-event .ap-desc{grid-column:3/4}.ap-event .danger{grid-column:4}}
  `;
  document.head.appendChild(style);

  const overlay=document.createElement('div');
  overlay.className='ap-overlay';
  overlay.innerHTML='<div class="ap-dialog"><div class="ap-head"><div><div class="muted">Матч-центр</div><h3 id="apTitle">Протокол матча</h3></div><button class="ap-close" type="button">×</button></div><div class="ap-body" id="apBody"></div></div>';
  document.body.appendChild(overlay);
  let currentMatchId=null;

  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const team=id=>typeof D!=='undefined'&&D?.teams?D.teams.find(t=>Number(t.id)===Number(id))?.name||'—':'—';
  const events=id=>(typeof D!=='undefined'&&Array.isArray(D?.match_events)?D.match_events:[]).filter(e=>Number(e.match_id)===Number(id)).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0)||(a.id-b.id));
  const labelPeriod=p=>({'1':'1 период','2':'2 период','3':'3 период','OT':'ОТ','SO':'Буллиты'}[p]||p);
  const labelType=t=>({'GOAL':'Гол','PENALTY':'Штраф','NOTE':'Событие'}[t]||t);

  function inputVal(v){return v==null?'':v}
  function openProtocol(id){
    if(typeof D==='undefined'||!D?.matches)return;
    const m=D.matches.find(x=>Number(x.id)===Number(id));if(!m)return;
    currentMatchId=m.id;
    const home=team(m.home_team_id),away=team(m.away_team_id),list=events(m.id);
    overlay.querySelector('#apTitle').textContent=`${home} — ${away}`;
    overlay.querySelector('#apBody').innerHTML=`
      <section class="ap-section">
        <h4>Счёт по периодам</h4>
        <div class="ap-period-grid">
          <div></div><div class="head">${esc(home)}</div><div class="head">${esc(away)}</div>
          ${[['p1','1 период'],['p2','2 период'],['p3','3 период'],['ot','Овертайм'],['so','Буллиты']].map(([k,l])=>`<div class="ap-period-name">${l}</div><input class="input ap-score" data-key="${k}_home" type="number" min="0" max="99" value="${inputVal(m[k+'_home'])}"><input class="input ap-score" data-key="${k}_away" type="number" min="0" max="99" value="${inputVal(m[k+'_away'])}">`).join('')}
        </div>
        <div class="ap-actions"><button class="btn" id="apSavePeriods">Сохранить периоды</button></div>
      </section>
      <section class="ap-section">
        <h4>Добавить событие</h4>
        <div class="ap-event-form">
          <div class="field"><label>Период</label><select class="select" id="apPeriod"><option>1</option><option>2</option><option>3</option><option value="OT">ОТ</option><option value="SO">Буллиты</option></select></div>
          <div class="field"><label>Время ММ:СС</label><input class="input" id="apClock" placeholder="12:34"></div>
          <div class="field"><label>Тип</label><select class="select" id="apType"><option value="GOAL">Гол</option><option value="PENALTY">Штраф</option><option value="NOTE">Событие</option></select></div>
          <div class="field"><label>Команда</label><select class="select" id="apTeam"><option value="${m.home_team_id}">${esc(home)}</option><option value="${m.away_team_id}">${esc(away)}</option><option value="">Без команды</option></select></div>
          <div class="field wide"><label>Игрок</label><input class="input" id="apPlayer" placeholder="Фамилия Имя"></div>
          <div class="field wide"><label>Ассистенты</label><input class="input" id="apAssists" placeholder="Например: Иванов, Петров"></div>
          <div class="field"><label>Штраф, мин</label><input class="input" id="apPenalty" type="number" min="0" max="60" placeholder="2"></div>
          <div class="field wide"><label>Комментарий</label><input class="input" id="apDescription" placeholder="Причина удаления / примечание"></div>
        </div>
        <div class="ap-actions"><button class="btn" id="apAddEvent">+ Добавить событие</button></div>
      </section>
      <section class="ap-section"><h4>События протокола</h4><div class="ap-event-list">${list.length?list.map(e=>`<div class="ap-event"><b>${esc(e.clock||'—')}</b><span>${esc(labelPeriod(e.period))}</span><span class="ap-team">${esc(team(e.team_id))}</span><div class="ap-desc"><b>${esc(labelType(e.event_type))}${e.player?' · '+esc(e.player):''}</b><small>${[e.assistants?`Передачи: ${esc(e.assistants)}`:'',e.penalty_minutes!=null?`${e.penalty_minutes} мин.`:'',e.description?esc(e.description):''].filter(Boolean).join(' · ')}</small></div><button class="btn small danger ap-del-event" data-event="${e.id}">×</button></div>`).join(''):'<div class="ap-empty">Событий пока нет</div>'}</div></section>`;
    overlay.classList.add('open');document.body.style.overflow='hidden';
    overlay.querySelector('#apSavePeriods').onclick=savePeriods;
    overlay.querySelector('#apAddEvent').onclick=addEvent;
    overlay.querySelectorAll('.ap-del-event').forEach(b=>b.onclick=()=>deleteEvent(Number(b.dataset.event)));
  }
  function closeProtocol(){overlay.classList.remove('open');document.body.style.overflow='';currentMatchId=null}
  overlay.querySelector('.ap-close').onclick=closeProtocol;
  overlay.addEventListener('click',e=>{if(e.target===overlay)closeProtocol()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('open'))closeProtocol()});

  async function refreshAndReopen(){const id=currentMatchId;await loadData(D.tournament.slug,D.stage.id);if(id)openProtocol(id)}
  async function savePeriods(){
    const payload={id:Number(currentMatchId)};
    overlay.querySelectorAll('.ap-score').forEach(i=>payload[i.dataset.key]=i.value===''?null:Number(i.value));
    await safe(async()=>{await action('update_match_protocol',payload);await refreshAndReopen()});
  }
  async function addEvent(){
    const payload={match_id:Number(currentMatchId),period:overlay.querySelector('#apPeriod').value,clock:overlay.querySelector('#apClock').value,event_type:overlay.querySelector('#apType').value,team_id:overlay.querySelector('#apTeam').value?Number(overlay.querySelector('#apTeam').value):null,player:overlay.querySelector('#apPlayer').value,assistants:overlay.querySelector('#apAssists').value,penalty_minutes:overlay.querySelector('#apPenalty').value===''?null:Number(overlay.querySelector('#apPenalty').value),description:overlay.querySelector('#apDescription').value};
    await safe(async()=>{await action('add_match_event',payload);await refreshAndReopen()});
  }
  async function deleteEvent(id){if(!confirm('Удалить событие из протокола?'))return;await safe(async()=>{await action('delete_match_event',{id});await refreshAndReopen()})}

  function attachButtons(){document.querySelectorAll('.match-card').forEach(card=>{const actions=card.querySelector('.match-actions');if(!actions||actions.querySelector('.protocol-btn'))return;const b=document.createElement('button');b.type='button';b.className='btn small protocol-btn';b.textContent='Протокол';b.onclick=e=>{e.preventDefault();e.stopPropagation();openProtocol(Number(card.dataset.id))};actions.insertBefore(b,actions.firstChild)})}
  let queued=false;const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;attachButtons()})};
  new MutationObserver(queue).observe(document.body,{childList:true,subtree:true});
  setInterval(queue,1200);attachButtons();
})();
