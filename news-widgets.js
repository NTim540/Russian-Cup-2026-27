(()=>{
  const CORE='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup';
  const STYLE='news-live-widgets-style';
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const done=m=>Number.isInteger(m?.home_score)&&Number.isInteger(m?.away_score)&&m.home_score!==m.away_score;
  const dateObj=x=>new Date(x+'T12:00:00');
  const fmtDate=x=>x?dateObj(x).toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'}):'';
  const fmtTime=m=>m.start_time||m.game_time||m.time||'—';
  const finish=m=>m.finish_type==='OT'?'ОТ':m.finish_type==='SO'?'Б':'осн.';

  if(!document.getElementById(STYLE)){
    const s=document.createElement('style');s.id=STYLE;s.textContent=`
      .news-widgets{display:grid;gap:22px;margin-top:32px}.nw{border:1px solid var(--line);border-radius:20px;overflow:hidden;background:rgba(255,255,255,.025)}
      .nw-head{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;padding:17px 18px;border-bottom:1px solid var(--line);background:linear-gradient(90deg,rgba(47,111,237,.10),rgba(127,198,255,.025))}.nw-kicker{color:var(--ice);font-size:9px;text-transform:uppercase;letter-spacing:.14em;font-weight:900;margin-bottom:4px}.nw-head h3{font-size:21px;line-height:1.05;margin:0;letter-spacing:-.025em}.nw-sub{color:var(--muted);font-size:10px;text-align:right}
      .nw-matches{display:grid}.nw-match{display:grid;grid-template-columns:90px minmax(0,1fr) 94px minmax(0,1fr) 145px;gap:11px;align-items:center;padding:14px 17px;border-top:1px solid rgba(255,255,255,.065)}.nw-match:first-child{border-top:0}.nw-meta{color:var(--muted);font-size:10px;line-height:1.5}.nw-team{font-size:13px;font-weight:850;line-height:1.3}.nw-team.away{text-align:right}.nw-score{text-align:center}.nw-score strong{display:block;font-size:21px;line-height:1}.nw-score span{display:block;color:var(--muted);font-size:9px;text-transform:uppercase;margin-top:4px}.nw-venue{text-align:right;color:var(--muted);font-size:10px;line-height:1.4}
      .nw-table-wrap{overflow:auto}.nw table{width:100%;min-width:760px;border-collapse:collapse}.nw th,.nw td{padding:11px 9px;border-bottom:1px solid rgba(255,255,255,.065);text-align:center;font-size:11px}.nw th{color:#8090a4;font-size:9px;text-transform:uppercase;letter-spacing:.06em;background:rgba(255,255,255,.018)}.nw th.team,.nw td.team{text-align:left;min-width:170px}.nw tbody tr:last-child td{border-bottom:0}.nw .pts{font-weight:950;color:#fff}.nw .pos{font-weight:950}.nw .gdplus{color:#72d7a6}.nw .gdminus{color:#ff8f98}
      .nw-group-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:13px}.nw-group-card{border:1px solid rgba(255,255,255,.075);border-radius:14px;overflow:hidden;background:rgba(255,255,255,.018)}.nw-group-name{padding:11px 12px;border-bottom:1px solid rgba(255,255,255,.065);font-size:12px;font-weight:900}.nw-member{display:flex;justify-content:space-between;gap:10px;padding:9px 12px;border-top:1px solid rgba(255,255,255,.05);font-size:11px}.nw-member:first-of-type{border-top:0}.nw-member span:last-child{color:var(--muted);font-size:9px}
      .nw-empty{padding:24px;text-align:center;color:var(--muted);font-size:12px}
      @media(max-width:760px){.nw-match{grid-template-columns:56px 1fr 64px 1fr;padding:12px 10px;gap:7px}.nw-venue{display:none}.nw-team{font-size:11px}.nw-score strong{font-size:17px}.nw-group-grid{grid-template-columns:1fr}.nw-head{align-items:flex-start;flex-direction:column}.nw-sub{text-align:left}}
    `;document.head.appendChild(s);
  }

  async function j(url){const r=await fetch(url,{cache:'no-store'}),b=await r.json().catch(()=>({}));if(!r.ok)throw Error(b.error||'Ошибка загрузки');return b}
  function pts(m,id,s){if(!done(m))return 0;const winner=(m.home_score>m.away_score?m.home_team_id:m.away_team_id);return winner===id?s.win_points:(m.finish_type==='REG'?s.regulation_loss_points:s.ot_loss_points)}
  function raw(t,g,ms,s){let o={team_id:t.id,team:t.name,group_id:g.id,group_code:g.code,gp:0,w:0,rw:0,ow:0,l:0,rl:0,ol:0,gf:0,ga:0,gd:0,pts:0,unresolved:false};for(const m of ms){if(!done(m)||![m.home_team_id,m.away_team_id].includes(t.id))continue;o.gp++;const h=m.home_team_id===t.id,f=h?m.home_score:m.away_score,a=h?m.away_score:m.home_score;o.gf+=f;o.ga+=a;o.pts+=pts(m,t.id,s);if(f>a){o.w++;if(m.finish_type==='REG')o.rw++;else o.ow++}else{o.l++;if(m.finish_type==='REG')o.rl++;else o.ol++}}o.gd=o.gf-o.ga;return o}
  function split(a,get){const m=new Map;for(const x of a){const k=get(x);if(!m.has(k))m.set(k,[]);m.get(k).push(x)}return[...m.entries()].sort((a,b)=>Number(b[0])-Number(a[0])).map(x=>x[1])}
  function head(rows,ms,s){const ids=new Set(rows.map(x=>x.team_id)),o=new Map(rows.map(x=>[x.team_id,{p:0,d:0}]));for(const m of ms){if(!done(m)||!ids.has(m.home_team_id)||!ids.has(m.away_team_id))continue;for(const id of [m.home_team_id,m.away_team_id]){const h=m.home_team_id===id,f=h?m.home_score:m.away_score,a=h?m.away_score:m.home_score,x=o.get(id);x.p+=pts(m,id,s);x.d+=f-a}}return o}
  function inside(rows,ms,s){if(rows.length<2)return rows;const h=head(rows,ms,s),gets=[r=>h.get(r.team_id).p,r=>h.get(r.team_id).d,r=>r.gd,r=>r.w,r=>r.rw,r=>r.gf];let groups=[rows];for(const get of gets){const next=[];for(const g of groups){if(g.length<2){next.push(g);continue}const p=split(g,get);if(p.length>1)for(const q of p)next.push(q.length>1?inside(q,ms,s):q);else next.push(g)}groups=next;if(groups.every(g=>g.length===1))break}return groups.flat()}
  function groupRows(D,g,s){const ms=D.matches.filter(m=>Number(m.group_id)===Number(g.id)),mem=D.memberships.filter(x=>Number(x.group_id)===Number(g.id)).sort((a,b)=>(a.seed||999)-(b.seed||999)),rows=mem.map(x=>raw(D.teams.find(t=>Number(t.id)===Number(x.team_id)),g,ms,s)),by=new Map;for(const r of rows){if(!by.has(r.pts))by.set(r.pts,[]);by.get(r.pts).push(r)}let out=[];for(const p of [...by.keys()].sort((a,b)=>b-a)){const g2=by.get(p);out.push(...(g2.length>1?inside(g2,ms,s):g2))}out.forEach((r,i)=>r.place=i+1);return out}
  function cross(D,rows,s){if(rows.length<2)return rows;if(rows.every(r=>r.group_id===rows[0].group_id))return inside(rows,D.matches.filter(m=>m.group_id===rows[0].group_id),s);let groups=[rows];const gets=[r=>r.rw,r=>r.gd,r=>r.gf];for(const get of gets){const next=[];for(const g of groups){if(g.length<2){next.push(g);continue}const p=split(g,get);if(p.length>1)for(const q of p)next.push(q.length>1?cross(D,q,s):q);else next.push(g)}groups=next;if(groups.every(g=>g.length===1))break}return groups.flat()}
  function overall(D,s){const rows=D.groups.flatMap(g=>groupRows(D,g,s)),by=new Map;for(const r of rows){if(!by.has(r.pts))by.set(r.pts,[]);by.get(r.pts).push(r)}let out=[];for(const p of [...by.keys()].sort((a,b)=>b-a)){const q=by.get(p);out.push(...(q.length>1?cross(D,q,s):q))}out.forEach((r,i)=>r.place=i+1);return out}
  function table(rows){return`<div class="nw-table-wrap"><table><thead><tr><th>№</th><th class="team">Команда</th><th>И</th><th>В</th><th>В ОТ/Б</th><th>П</th><th>П ОТ/Б</th><th>Шайбы</th><th>+/-</th><th>О</th></tr></thead><tbody>${rows.map(r=>`<tr><td class="pos">${r.place}</td><td class="team">${esc(r.team)}</td><td>${r.gp}</td><td>${r.rw}</td><td>${r.ow}</td><td>${r.rl}</td><td>${r.ol}</td><td>${r.gf}:${r.ga}</td><td class="${r.gd>0?'gdplus':r.gd<0?'gdminus':''}">${r.gd>0?'+':''}${r.gd}</td><td class="pts">${r.pts}</td></tr>`).join('')}</tbody></table></div>`}
  function teamName(D,id){return D.teams.find(t=>Number(t.id)===Number(id))?.name||'—'}
  function groupName(D,id){const g=D.groups.find(g=>Number(g.id)===Number(id));return g?.name||g?.code||''}
  function headHtml(title,sub){return`<div class="nw-head"><div><div class="nw-kicker">Данные турнира</div><h3>${esc(title)}</h3></div>${sub?`<div class="nw-sub">${esc(sub)}</div>`:''}</div>`}
  function matchList(D,ms,results){if(!ms.length)return'<div class="nw-empty">Матчей на эту дату нет.</div>';return`<div class="nw-matches">${ms.map(m=>{const score=results?(done(m)?`${m.home_score}:${m.away_score}`:'—'):fmtTime(m),label=results?(done(m)?finish(m):'не сыгран'):'начало',place=[m.city,m.arena].filter(Boolean).join(' · ');return`<div class="nw-match"><div class="nw-meta"><strong>${esc(groupName(D,m.group_id))}</strong><br>Матч №${m.game_no??'—'}</div><div class="nw-team">${esc(teamName(D,m.home_team_id))}</div><div class="nw-score"><strong>${esc(score)}</strong><span>${esc(label)}</span></div><div class="nw-team away">${esc(teamName(D,m.away_team_id))}</div><div class="nw-venue">${esc(place||'Место уточняется')}</div></div>`}).join('')}</div>`}
  function groupsHtml(D){const gs=[...D.groups].sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));return`<div class="nw-group-grid">${gs.map(g=>{const mem=D.memberships.filter(m=>Number(m.group_id)===Number(g.id)).sort((a,b)=>(a.seed||999)-(b.seed||999));return`<div class="nw-group-card"><div class="nw-group-name">${esc(g.name||('Группа '+g.code))}</div>${mem.map(m=>{const t=D.teams.find(t=>Number(t.id)===Number(m.team_id));return`<div class="nw-member"><span>${esc(t?.name||'—')}</span><span>${esc(t?.city||'')}</span></div>`}).join('')}</div>`}).join('')}</div>`}

  window.renderNewsWidgets=async function(news,container){
    if(!container)return;
    const widgets=Array.isArray(news?.widgets)?news.widgets:[];
    if(!widgets.length){container.innerHTML='';return}
    container.innerHTML='<div class="nw-empty">Загружаем данные турнира…</div>';
    try{
      const cat=await j(CORE+'/api/catalog'),t=cat.tournaments.find(x=>Number(x.id)===Number(news.tournament_id));if(!t)throw Error('Турнир для виджетов не найден');
      const cache=new Map();
      async function data(stageId){const sid=Number(stageId)||cat.stages.find(s=>Number(s.tournament_id)===Number(t.id))?.id;if(!sid)throw Error('Этап не найден');if(!cache.has(sid))cache.set(sid,j(CORE+'/api/data?tournament_slug='+encodeURIComponent(t.slug)+'&stage_id='+sid));return cache.get(sid)}
      const chunks=[];
      for(const w of widgets){const D=await data(w.stage_id),title=w.title||({schedule:'Расписание игр',results:'Результаты дня',overall_table:'Общая таблица',group_table:'Таблица группы',all_group_tables:'Таблицы групп',groups:'Состав групп'}[w.type]||'Данные турнира');
        if(w.type==='schedule'||w.type==='results'){const ms=[...D.matches].filter(m=>m.game_date===w.date).sort((a,b)=>(a.start_time||'').localeCompare(b.start_time||'')||(a.game_no||0)-(b.game_no||0));chunks.push(`<section class="nw">${headHtml(title,fmtDate(w.date))}${matchList(D,ms,w.type==='results')}</section>`)}
        else if(w.type==='overall_table'){chunks.push(`<section class="nw">${headHtml(title,D.stage?.name||'')}${table(overall(D,D.settings))}</section>`)}
        else if(w.type==='group_table'){const g=D.groups.find(g=>Number(g.id)===Number(w.group_id));chunks.push(`<section class="nw">${headHtml(title,g?.name||g?.code||'')}${g?table(groupRows(D,g,D.settings)):'<div class="nw-empty">Группа не найдена.</div>'}</section>`)}
        else if(w.type==='all_group_tables'){const gs=[...D.groups].sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));chunks.push(`<section class="nw">${headHtml(title,D.stage?.name||'')}${gs.map(g=>`<div class="nw-head" style="border-top:1px solid var(--line)"><div><div class="nw-kicker">Группа</div><h3>${esc(g.name||g.code)}</h3></div></div>${table(groupRows(D,g,D.settings))}`).join('')}</section>`)}
        else if(w.type==='groups'){chunks.push(`<section class="nw">${headHtml(title,D.stage?.name||'')}${groupsHtml(D)}</section>`)}
      }
      container.innerHTML=chunks.join('');
    }catch(e){console.error('News widgets:',e);container.innerHTML='<div class="nw-empty">Не удалось загрузить виджеты: '+esc(e.message||String(e))+'</div>'}
  };
})();
