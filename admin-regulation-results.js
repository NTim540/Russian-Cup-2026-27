(()=>{
  const TECH_API='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-regulation-admin';
  const TYPES=[
    ['NONE','Обычный результат'],
    ['INELIGIBLE_PLAYER','Тех. поражение: недопущенный/дисквалифицированный игрок · ст. 34'],
    ['NO_SHOW','Тех. поражение: неявка · ст. 37'],
    ['DISCIPLINARY','Тех. результат: матч прекращён · ст. 35'],
    ['OTHER','Другой технический результат по решению ФХР']
  ];
  const escReg=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  async function techAction(path,payload){
    const r=await fetch(TECH_API+path,{method:'POST',headers:{'Content-Type':'application/json','x-admin-password':PW},body:JSON.stringify(payload)});
    const b=await r.json().catch(()=>({}));
    if(!r.ok)throw Error(b.error||'Ошибка сохранения регламентного результата');
    return b;
  }

  function injectStyle(){
    if(document.getElementById('regulation-admin-style'))return;
    const s=document.createElement('style');s.id='regulation-admin-style';s.textContent=`
      .reg-tech-panel{margin-top:10px;padding:12px;border:1px solid rgba(127,198,255,.14);border-radius:11px;background:rgba(4,17,29,.48);display:grid;grid-template-columns:minmax(220px,1.6fr) minmax(170px,1fr) minmax(180px,1fr) minmax(220px,1.4fr);gap:9px;align-items:end}
      .reg-tech-panel .reg-check{min-height:42px;display:flex;align-items:center;gap:8px;padding:0 10px;border:1px solid var(--line);border-radius:11px;background:#091727;color:#dbe8f5;font-size:11px}
      .reg-tech-panel .reg-check input{width:16px;height:16px}
      .reg-tech-note{grid-column:1/-1;color:#8fa3b8;font-size:10px;line-height:1.45}
      .reg-tech-panel.is-technical{border-color:rgba(226,58,71,.30);background:rgba(226,58,71,.045)}
      .reg-dq-badge{display:inline-flex;align-items:center;min-height:24px;padding:0 8px;border-radius:999px;border:1px solid rgba(226,58,71,.32);background:rgba(226,58,71,.09);color:#ffb2b9;font-size:9px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;margin-left:7px}
      .reg-dq-btn{white-space:nowrap}
      .regulation-admin-note{margin:0 0 13px;padding:11px 12px;border:1px solid rgba(127,198,255,.15);border-radius:11px;background:rgba(127,198,255,.045);color:#a9bed2;font-size:11px;line-height:1.5}
      @media(max-width:1000px){.reg-tech-panel{grid-template-columns:1fr 1fr}}
      @media(max-width:620px){.reg-tech-panel{grid-template-columns:1fr}.reg-tech-note{grid-column:1}.team-line{grid-template-columns:42px 1fr auto!important}.reg-dq-btn{grid-column:2/4}}
    `;document.head.appendChild(s);
  }

  function techHelp(type){
    if(type==='INELIGIBLE_PLAYER')return 'Статья 34: техническое поражение (–:+) не учитывается при подсчёте разницы забитых и пропущенных шайб. Учет сыгранного счёта отключён автоматически.';
    if(type==='NO_SHOW')return 'Статья 37: неявившейся команде присуждается техническое поражение (–:+), сопернику — техническая победа (+:–). Числовой счёт не придумывается.';
    if(type==='DISCIPLINARY')return 'Статья 35: при прекращении матча из-за недисциплинированного поведения виновной команде засчитывается техническое поражение, сопернику — техническая победа. Если официальным решением сохранён сыгранный счёт для разницы шайб, включите это отдельно.';
    if(type==='OTHER')return 'Используйте только при наличии официального решения. Сыгранный счёт входит в разницу шайб только если вы явно включите соответствующий переключатель.';
    return 'Обычный спортивный результат: расчёт идёт по статье 14 и критериям статей 17–18.';
  }

  function syncPanel(panel,m,card){
    const type=panel.querySelector('.reg-tech-type').value;
    const winner=panel.querySelector('.reg-tech-winner');
    const count=panel.querySelector('.reg-tech-goals');
    const note=panel.querySelector('.reg-tech-comment');
    const ft=card.querySelector('.ft');
    const technical=type!=='NONE';
    panel.classList.toggle('is-technical',technical);
    winner.disabled=!technical;note.disabled=!technical;
    if(!technical){count.checked=false;count.disabled=true;if(ft)ft.disabled=false;}
    else{
      if(ft){ft.value='REG';ft.disabled=true;}
      const forced=type==='INELIGIBLE_PLAYER'||type==='NO_SHOW';
      if(forced)count.checked=false;
      count.disabled=forced;
    }
    panel.querySelector('.reg-tech-note').textContent=techHelp(type);
  }

  function decorateMatches(){
    if(typeof D==='undefined'||!D)return;
    document.querySelectorAll('.match-card').forEach(card=>{
      if(card.querySelector('.reg-tech-panel'))return;
      const m=D.matches.find(x=>String(x.id)===String(card.dataset.id));if(!m)return;
      const panel=document.createElement('div');panel.className='reg-tech-panel';
      panel.innerHTML=`
        <div class="field"><label>Тип результата</label><select class="select reg-tech-type">${TYPES.map(([v,l])=>`<option value="${v}" ${String(m.technical_result_type||'NONE')===v?'selected':''}>${escReg(l)}</option>`).join('')}</select></div>
        <div class="field"><label>Технический победитель</label><select class="select reg-tech-winner"><option value="">— выбрать —</option><option value="${m.home_team_id}" ${String(m.technical_winner_team_id)===String(m.home_team_id)?'selected':''}>${escReg(teamName(m.home_team_id))}</option><option value="${m.away_team_id}" ${String(m.technical_winner_team_id)===String(m.away_team_id)?'selected':''}>${escReg(teamName(m.away_team_id))}</option></select></div>
        <label class="reg-check"><input type="checkbox" class="reg-tech-goals" ${m.technical_goals_count?'checked':''}>Учитывать сыгранный счёт в разнице шайб</label>
        <div class="field"><label>Комментарий / основание</label><input class="input reg-tech-comment" maxlength="500" value="${escReg(m.technical_note||'')}" placeholder="Например: решение ФХР, статья Регламента"></div>
        <div class="reg-tech-note"></div>`;
      card.appendChild(panel);
      panel.querySelector('.reg-tech-type').onchange=()=>syncPanel(panel,m,card);
      syncPanel(panel,m,card);
    });
    const tab=document.querySelector('#tab-matches');
    if(tab&&!tab.querySelector('.regulation-admin-note')){
      const n=document.createElement('div');n.className='regulation-admin-note';n.textContent='Технические результаты сохраняются отдельно от обычного счёта. Для ст. 34 разница шайб исключается автоматически; для неявки отображается символический результат +:– / –:+ без выдуманного числового счёта. Дисквалификация команды по ст. 38 задаётся в разделе «Группы и команды».';
      const filters=tab.querySelector('#matchGroupFilters');(filters||tab.firstElementChild)?.insertAdjacentElement('afterend',n);
    }
  }

  function collectTechnical(card){
    const panel=card.querySelector('.reg-tech-panel');
    if(!panel)return {technical_result_type:'NONE',technical_winner_team_id:null,technical_goals_count:false,technical_note:null};
    const type=panel.querySelector('.reg-tech-type').value;
    const winner=panel.querySelector('.reg-tech-winner').value;
    const goals=panel.querySelector('.reg-tech-goals').checked;
    const note=panel.querySelector('.reg-tech-comment').value.trim();
    if(type!=='NONE'&&!winner)throw Error('Для технического результата выберите команду-победителя.');
    if(goals){const hs=card.querySelector('.hs').value,as=card.querySelector('.as').value;if(hs===''||as==='')throw Error('Чтобы учитывать сыгранный счёт в разнице шайб, сначала укажите оба значения счёта.');}
    return {technical_result_type:type,technical_winner_team_id:type==='NONE'?null:Number(winner),technical_goals_count:type==='NONE'?false:goals,technical_note:type==='NONE'?null:note};
  }

  function decorateGroups(){
    if(typeof D==='undefined'||!D)return;
    document.querySelectorAll('.team-line').forEach(line=>{
      if(line.querySelector('.reg-dq-btn'))return;
      const del=line.querySelector('[data-delmem]');if(!del)return;
      const mem=D.memberships.find(x=>String(x.id)===String(del.dataset.delmem));if(!mem)return;
      const team=D.teams.find(x=>String(x.id)===String(mem.team_id));if(!team)return;
      const name=line.querySelector('b');
      if(team.is_disqualified&&name&&!name.querySelector('.reg-dq-badge'))name.insertAdjacentHTML('beforeend','<span class="reg-dq-badge">ДСК · ст. 38</span>');
      const b=document.createElement('button');b.type='button';b.className='btn small sec reg-dq-btn';b.textContent=team.is_disqualified?'Снять ДСК':'Дисквалификация';
      if(team.is_disqualified)b.classList.add('danger');
      b.onclick=()=>toggleDisqualification(team);
      line.appendChild(b);
    });
  }

  async function toggleDisqualification(team){
    if(team.is_disqualified){
      if(!confirm('Снять отметку о дисквалификации с команды «'+team.name+'»?'))return;
      await safe(async()=>{await techAction('/api/team',{team_id:team.id,is_disqualified:false});await loadData(D.tournament.slug,D.stage.id)});return;
    }
    if(!confirm('Отметить команду «'+team.name+'» как дисквалифицированную по статье 38 Регламента (отказ/пропуск Тура)?'))return;
    const stages=(D.stages||[]).filter(s=>Number(s.tournament_id)===Number(D.tournament.id)).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
    const list=stages.map((s,i)=>(i+1)+'. '+s.name).join('\n');
    const def=Math.max(1,stages.findIndex(s=>String(s.id)===String(D.stage.id))+1);
    const n=Number(prompt('В каком Туре произошла дисквалификация?\n'+list,String(def)));const stage=stages[n-1];if(!stage)return;
    const note=prompt('Комментарий / основание (можно оставить пустым)','Отказ от участия в Туре · статья 38')||'';
    await safe(async()=>{await techAction('/api/team',{team_id:team.id,is_disqualified:true,disqualified_stage_id:stage.id,disqualification_note:note});await loadData(D.tournament.slug,D.stage.id)});
  }

  if(typeof renderMatches==='function'){
    const base=renderMatches;
    renderMatches=function(){const out=base.apply(this,arguments);decorateMatches();return out};
  }
  if(typeof renderGroups==='function'){
    const base=renderGroups;
    renderGroups=function(){const out=base.apply(this,arguments);decorateGroups();return out};
  }
  if(typeof saveMatch==='function'){
    saveMatch=async function(card){
      const hs=card.querySelector('.hs').value,as=card.querySelector('.as').value,clear=hs===''&&as==='';
      if(!clear&&(hs===''||as===''))return alert('Введите оба значения счёта или очистите оба');
      const home_score=clear?null:Number(hs),away_score=clear?null:Number(as);
      if(!clear&&home_score===away_score)return alert('Итоговый счёт не может быть ничейным');
      let technical;try{technical=collectTechnical(card)}catch(e){return alert(e.message||String(e))}
      await safe(async()=>{
        await action('update_match',{id:Number(card.dataset.id),game_no:Number(card.querySelector('.mno').value),game_date:card.querySelector('.mdate').value,start_time:card.querySelector('.mtime').value||null,city:card.querySelector('.mcity').value,arena:card.querySelector('.marena').value,home_score,away_score,finish_type:technical.technical_result_type==='NONE'?card.querySelector('.ft').value:'REG'});
        await techAction('/api/match',{match_id:Number(card.dataset.id),...technical});
        await loadData(D.tournament.slug,D.stage.id);
      });
    };
  }

  injectStyle();
  decorateMatches();decorateGroups();
  new MutationObserver(()=>{decorateMatches();decorateGroups()}).observe(document.body,{childList:true,subtree:true});
})();
