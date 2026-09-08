(()=>{
  const R=window.CupStandings;
  if(!R)return;
  const path=location.pathname.replace(/\/+$/,'')||'/';
  const API='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup';
  const h=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function injectStyle(){
    if(document.getElementById('technical-results-ui-style'))return;
    const s=document.createElement('style');s.id='technical-results-ui-style';s.textContent=`
      .dq-table-badge,.team-dq-badge{display:inline-flex;align-items:center;min-height:20px;padding:0 6px;margin-left:7px;border-radius:999px;border:1px solid rgba(226,58,71,.30);background:rgba(226,58,71,.08);color:#ff9da6;font-size:8px;font-weight:950;letter-spacing:.06em;text-transform:uppercase;vertical-align:middle}
      tr.is-disqualified td{opacity:.72}.score-box.is-technical strong,.match-score.is-technical strong{letter-spacing:.01em}.score-box.is-technical span,.match-score.is-technical span{color:#ff9da6!important}
      .technical-match-note{margin-top:9px;padding:8px 10px;border:1px solid rgba(226,58,71,.18);border-radius:4px;background:rgba(226,58,71,.055);color:#ffb5bb;font-size:9px;text-transform:uppercase;letter-spacing:.055em}
    `;document.head.appendChild(s);
  }

  function installHome(){
    if(typeof render!=='function'||typeof table!=='function')return;
    const techDone=m=>R.done(m);

    table=function(rows,compact=false){return'<thead><tr><th>№</th><th class="team">Команда</th>'+(compact?'':'<th>Гр.</th>')+'<th>И</th><th title="Победы в основное время">В</th><th title="Поражения в основное время">П</th><th title="Победы в овертайме или по буллитам">ВО/Б</th><th title="Поражения в овертайме или по буллитам">ПО/Б</th><th>Шайбы</th><th>±</th><th>О</th></tr></thead><tbody>'+rows.map(r=>'<tr class="'+(r.disqualified?'is-disqualified':'')+'"><td class="place">'+(r.place??'ДСК')+'</td><td class="team">'+esc(r.team)+(r.disqualified?'<span class="dq-table-badge" title="Дисквалификация по статье 38 Регламента">ДСК</span>':'')+'</td>'+(compact?'':'<td><span class="group-chip">'+esc(r.group_code)+'</span></td>')+'<td>'+r.gp+'</td><td>'+r.rw+'</td><td>'+r.rl+'</td><td>'+r.ow+'</td><td>'+r.ol+'</td><td>'+r.gf+':'+r.ga+'</td><td class="'+(r.gd>0?'gd-pos':r.gd<0?'gd-neg':'')+'">'+(r.gd>0?'+':'')+r.gd+'</td><td class="points">'+r.pts+'</td></tr>').join('')+'</tbody>'};

    renderUpcoming=function(){const ms=[...D.matches].filter(m=>!techDone(m)).sort((a,b)=>a.game_date.localeCompare(b.game_date)||(a.game_no||0)-(b.game_no||0)).slice(0,4);$('#upcomingGrid').innerHTML=ms.length?ms.map(m=>{const g=groupById(m.group_id),place=matchPlace(m),time=matchTime(m);return'<article class="card hover-card upcoming-card"><div class="match-top"><span>'+fmtShort(m.game_date)+(time?' · '+esc(time):'')+'</span><span class="group-tag">'+esc(g?.code||'')+'</span></div><div class="upcoming-teams"><div class="upcoming-team"><span>'+esc(teamName(m.home_team_id))+'</span><span>ХОЗ</span></div><div class="upcoming-team"><span>'+esc(teamName(m.away_team_id))+'</span><span>ГОСТ</span></div></div><div class="match-location">'+(place?esc(place):'Место проведения будет добавлено')+'<br>Матч №'+(m.game_no??'—')+'</div></article>'}).join(''):'<div class="card empty">Предстоящих матчей нет.</div>'};

    renderMatches=function(){const gf=$('#gf').value,sf=$('#sf').value,today=new Date().toISOString().slice(0,10);let ms=[...D.matches].filter(m=>gf==='ALL'||String(m.group_id)===gf).filter(m=>sf==='ALL'||(sf==='TODAY'?m.game_date===today:sf==='DONE'?techDone(m):!techDone(m))).sort((a,b)=>a.game_date.localeCompare(b.game_date)||(a.game_no||0)-(b.game_no||0));if(!ms.length){$('#matchList').innerHTML='<div class="card empty">Матчей по выбранному фильтру нет.</div>';return}const byDate=new Map;for(const m of ms){if(!byDate.has(m.game_date))byDate.set(m.game_date,[]);byDate.get(m.game_date).push(m)}$('#matchList').innerHTML=[...byDate.entries()].map(([date,list])=>'<section><h3 class="date-heading">'+fmtLong(date)+'</h3><div class="match-list">'+list.map(m=>{const g=groupById(m.group_id),finished=techDone(m),time=matchTime(m),place=matchPlace(m),technical=R.isTechnical(m);return'<div class="match-row" data-match-id="'+m.id+'"><div class="match-meta"><strong>'+esc(g?.code||'')+'</strong><br>Матч №'+(m.game_no??'—')+(time?'<br>'+esc(time):'')+'</div><div class="match-team">'+esc(teamName(m.home_team_id))+'</div><div class="score-box '+(technical?'is-technical':'')+'"><strong>'+(finished?esc(R.matchScore(m)):'—')+'</strong><span>'+(finished?esc(R.matchFinishLabel(m)):'предстоит')+'</span></div><div class="match-team away">'+esc(teamName(m.away_team_id))+'</div><div class="venue">'+(place?esc(place):'Место уточняется')+'</div></div>'}).join('')+'</div></section>').join('')};

    renderWinner=function(rows){const section=$('#winnerSection'),card=$('#winnerCard');section.style.display='none';const fifth=Number(D.stage.sort_order)===5;const golden=D.groups.find(g=>/золот/i.test(g.name||''));if(!fifth||!golden)return;const matches=D.matches.filter(m=>String(m.group_id)===String(golden.id));if(!matches.length||!matches.every(techDone))return;const w=groupRows(golden,D.settings)[0];if(!w||w.unresolved||w.disqualified)return;section.style.display='block';card.classList.add('show');$('#winnerLabel').textContent='Победитель Кубка России U16';$('#winnerName').textContent=w.team;$('#winnerStats').textContent=w.gp+' матчей · '+w.w+' побед · '+w.pts+' очков · шайбы '+w.gf+':'+w.ga};

    render=function(){const s=D.settings;document.title=D.tournament.name;$('#name').textContent=D.tournament.name;$('#season').textContent=D.tournament.season||'Турнир';$('#heroTitle').innerHTML=esc(D.tournament.name).replace(' U16','<br>U16');$('#stageLabel').textContent=D.stage.name+(D.stage.start_date&&D.stage.end_date?' · '+fmtShort(D.stage.start_date)+' — '+fmtShort(D.stage.end_date):'');const o=overall(s);const finished=D.matches.filter(techDone).length;$('#heroStats').innerHTML='<div class="stat"><strong>'+D.teams.length+'</strong><span>команд</span></div><div class="stat"><strong>'+D.groups.length+'</strong><span>группы</span></div><div class="stat"><strong>'+D.matches.length+'</strong><span>матчей</span></div><div class="stat"><strong>'+finished+'</strong><span>сыграно</span></div>';$('#tourName').textContent=D.stage.name;$('#tourDates').textContent=D.stage.start_date&&D.stage.end_date?fmtLong(D.stage.start_date)+' — '+fmtLong(D.stage.end_date):'Даты этапа уточняются';$('#tourFacts').innerHTML='<div class="fact"><strong>'+D.teams.length+'</strong><span>команд</span></div><div class="fact"><strong>'+D.groups.length+'</strong><span>группы</span></div><div class="fact"><strong>'+D.matches.length+'</strong><span>матчей</span></div><div class="fact"><strong>'+finished+'</strong><span>завершено</span></div>';$('#overallTable').innerHTML=table(o,true);const groups=[...D.groups].sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));$('#groupTables').innerHTML=groups.map(g=>{const rows=groupRows(g,s),doneCount=D.matches.filter(m=>m.group_id===g.id&&techDone(m)).length,total=D.matches.filter(m=>m.group_id===g.id).length;return'<article class="card group-card hover-card" data-code="'+esc(g.code)+'"><div class="group-card-head"><strong>'+esc(g.name||'Группа '+g.code)+'</strong><span>'+doneCount+' / '+total+' матчей</span></div><div class="table-wrap"><table>'+table(rows,true)+'</table></div></article>'}).join('');const previousGf=$('#gf').value;$('#gf').innerHTML='<option value="ALL">Все группы</option>'+groups.map(g=>'<option value="'+g.id+'">'+esc(g.name||g.code)+'</option>').join('');if([...$('#gf').options].some(o=>o.value===previousGf))$('#gf').value=previousGf;$('#pointsRule').textContent='Победа — '+s.win_points+' очк., поражение в ОТ/по буллитам — '+s.ot_loss_points+' очк., поражение в основное время — '+s.regulation_loss_points+' очк.';renderUpcoming();renderMatches();renderWinner(o);$('#status').textContent='Данные обновляются автоматически.';activateReveal();patchMatchCenter()};

    $('#gf').onchange=renderMatches;$('#sf').onchange=renderMatches;
    const kick=()=>{try{if(typeof D!=='undefined'&&D)render()}catch(e){console.warn('Regulation UI rerender:',e)}};
    kick();setTimeout(kick,700);setTimeout(kick,1800);
  }

  function patchMatchCenter(){
    if(path!=='/'||typeof D==='undefined'||!D)return;
    const id=Number(new URL(location.href).searchParams.get('match'));if(!id)return;
    const m=D.matches.find(x=>Number(x.id)===id);if(!m||!R.isTechnical(m))return;
    const score=document.querySelector('.mc-score strong');if(score)score.textContent=R.matchScore(m);
    const small=document.querySelector('.mc-score small');if(small)small.textContent=R.matchFinishLabel(m);
    const board=document.querySelector('.mc-scoreboard');if(board&&!board.querySelector('.technical-match-note')){const n=document.createElement('div');n.className='technical-match-note';n.textContent=(m.technical_note||R.matchFinishLabel(m));board.insertAdjacentElement('afterend',n)}
  }

  async function loadTeamData(){
    try{
      const id=Number(new URL(location.href).searchParams.get('team'));if(!id)return;
      const c=await fetch(API+'/api/catalog',{cache:'no-store'}).then(r=>r.json()),t=c.tournaments?.[0];if(!t)return;
      const stages=(c.stages||[]).filter(s=>Number(s.tournament_id)===Number(t.id)).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0)),stage=stages[0];if(!stage)return;
      const data=await fetch(API+'/api/data?tournament_slug='+encodeURIComponent(t.slug)+'&stage_id='+stage.id,{cache:'no-store'}).then(r=>r.json());
      patchTeamPage(id,data);
      let last=0;new MutationObserver(()=>{const now=Date.now();if(now-last<120)return;last=now;patchTeamPage(id,data)}).observe(document.body,{childList:true,subtree:true});
      setInterval(()=>patchTeamPage(id,data),2500);
    }catch(e){console.warn('Technical team UI:',e)}
  }

  function patchTeamPage(teamId,data){
    const team=data.teams.find(t=>Number(t.id)===Number(teamId));if(!team)return;
    const ms=data.matches.filter(m=>[Number(m.home_team_id),Number(m.away_team_id)].includes(Number(teamId)));
    document.querySelectorAll('#matches .match-row[href*="match="]').forEach(row=>{
      const id=Number(new URL(row.href,location.href).searchParams.get('match')),m=ms.find(x=>Number(x.id)===id);if(!m)return;
      const box=row.querySelector('.match-score');if(!box)return;const strong=box.querySelector('strong'),span=box.querySelector('span');
      if(strong)strong.textContent=R.done(m)?R.matchScore(m):'—';if(span)span.textContent=R.done(m)?R.matchFinishLabel(m):'предстоит';box.classList.toggle('is-technical',R.isTechnical(m));
    });
    const finished=ms.filter(R.done).sort((a,b)=>b.game_date.localeCompare(a.game_date)||((b.game_no||0)-(a.game_no||0))).slice(0,5).reverse();
    const form=document.querySelector('#form'),sig=finished.map(m=>m.id+':'+R.winnerId(m)).join('|');if(form&&form.dataset.regSig!==sig){form.dataset.regSig=sig;form.innerHTML=finished.map(m=>{const w=String(R.winnerId(m))===String(teamId);return '<span class="form-pill '+(w?'win':'loss')+'" title="'+h(R.matchScore(m))+'">'+(w?'В':'П')+'</span>'}).join('')}
    const upcoming=ms.filter(m=>!R.done(m)).sort((a,b)=>a.game_date.localeCompare(b.game_date)||String(a.start_time||'').localeCompare(String(b.start_time||''))||(a.game_no||0)-(b.game_no||0))[0];
    const next=document.querySelector('#nextMatch');if(next){const sigNext=upcoming?String(upcoming.id):'none';if(next.dataset.regNext!==sigNext){next.dataset.regNext=sigNext;if(!upcoming)next.innerHTML='<div class="empty">Следующих матчей в текущем туре нет.</div>';else{const home=data.teams.find(t=>Number(t.id)===Number(upcoming.home_team_id)),away=data.teams.find(t=>Number(t.id)===Number(upcoming.away_team_id)),place=[upcoming.city,upcoming.arena].filter(Boolean).join(' · '),date=new Date(upcoming.game_date+'T12:00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long'}),time=String(upcoming.start_time||'').slice(0,5),img=t=>t?.logo_url?'<img src="'+h(t.logo_url)+'" alt="">':'';next.innerHTML='<a class="next-match" href="/?match='+upcoming.id+'"><div class="next-team">'+img(home)+'<span>'+h(home?.name||'—')+'</span></div><div class="next-vs">—</div><div class="next-team away"><span>'+h(away?.name||'—')+'</span>'+img(away)+'</div><div class="next-meta"><strong>'+h(date)+' · '+h(time||'—')+'</strong><span>'+h(place||'Место уточняется')+'<br>Матч №'+(upcoming.game_no??'—')+'</span></div></a>'}}}
    if(team.is_disqualified&&!document.querySelector('.team-dq-badge')){const kicker=document.querySelector('#teamKicker');if(kicker)kicker.insertAdjacentHTML('beforeend','<span class="team-dq-badge" title="'+h(team.disqualification_note||'Дисквалификация по статье 38 Регламента')+'">ДСК · ст. 38</span>')}
  }

  injectStyle();
  if(path==='/')installHome();
  if(path==='/team'||path==='/team.html')loadTeamData();
  new MutationObserver(patchMatchCenter).observe(document.body,{childList:true,subtree:true});
  setInterval(patchMatchCenter,1200);
})();
