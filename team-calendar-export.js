(()=>{
  const API='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup';
  const params=new URL(location.href).searchParams;
  const teamId=Number(params.get('team'));
  if(!Number.isInteger(teamId)||teamId<1)return;

  const escHtml=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pad=n=>String(n).padStart(2,'0');
  const icsText=x=>String(x??'').replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
  const date8=s=>String(s||'').replace(/-/g,'');
  const nextDate8=s=>{const d=new Date(String(s)+'T12:00:00');d.setDate(d.getDate()+1);return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`};
  const time6=s=>{const m=String(s||'').match(/^(\d{1,2}):(\d{2})/);return m?`${pad(Number(m[1]))}${m[2]}00`:''};
  const endTime=(date,time,minutes=120)=>{
    const [y,m,d]=String(date).split('-').map(Number),[hh,mm]=String(time).split(':').map(Number);
    const x=new Date(y,m-1,d,hh||0,mm||0,0);x.setMinutes(x.getMinutes()+minutes);
    return `${x.getFullYear()}${pad(x.getMonth()+1)}${pad(x.getDate())}T${pad(x.getHours())}${pad(x.getMinutes())}00`;
  };
  const stamp=()=>{const d=new Date();return `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`};
  const fold=line=>{
    const out=[];let cur='';
    for(const ch of String(line)){
      if((new TextEncoder().encode(cur+ch)).length>72){out.push(cur);cur=' '+ch}else cur+=ch;
    }
    if(cur)out.push(cur);return out.join('\r\n');
  };
  const slug=s=>String(s||'team').toLowerCase().replace(/ё/g,'е').replace(/[^a-zа-я0-9]+/gi,'-').replace(/^-+|-+$/g,'').slice(0,70)||'team';

  async function get(path){const r=await fetch(API+path,{cache:'no-store'});if(!r.ok)throw Error(await r.text());return r.json()}

  const style=document.createElement('style');
  style.textContent=`
    .team-calendar-wrap{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-top:13px}.team-calendar-btn{min-height:42px;display:inline-flex;align-items:center;gap:9px;padding:0 14px;border:1px solid rgba(127,198,255,.20);border-radius:5px;background:rgba(35,135,217,.075);color:#dcefff;font-size:11px;font-weight:900;letter-spacing:.02em;cursor:pointer;transition:.16s ease}.team-calendar-btn:hover{transform:translateY(-1px);border-color:rgba(35,135,217,.48);background:rgba(35,135,217,.13)}.team-calendar-btn:disabled{opacity:.55;cursor:wait;transform:none}.team-calendar-btn svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.team-calendar-note{color:#7790a6;font-size:9px;line-height:1.35}.team-calendar-status{width:100%;min-height:14px;color:#80c9ff;font-size:9px;line-height:1.35}.team-calendar-status.error{color:#ff9ca4}
    html[data-theme='light'] .team-calendar-btn{background:#f5f9fd;border-color:rgba(35,80,125,.16);color:#1f5d96}html[data-theme='light'] .team-calendar-note{color:#74869b}
    @media(max-width:760px){.team-calendar-wrap{justify-content:center;margin-top:15px}.team-calendar-btn{width:min(100%,360px);justify-content:center;min-height:46px;font-size:12px}.team-calendar-note,.team-calendar-status{width:100%;text-align:center}}
  `;
  document.head.appendChild(style);

  const mounted=()=>Boolean(document.querySelector('.team-calendar-wrap[data-team-calendar-export]'));

  function mount(){
    if(mounted())return;
    const socials=document.querySelector('#socials,.socials');
    const copy=document.querySelector('.team-copy');
    if(!copy)return;
    const wrap=document.createElement('div');wrap.className='team-calendar-wrap';wrap.dataset.teamCalendarExport='1';
    wrap.innerHTML=`<button type="button" class="team-calendar-btn" aria-label="Добавить матчи команды в календарь"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M8 3v4M16 3v4M3 10h18M12 14v4M10 16h4"></path></svg><span>Добавить матчи в календарь</span></button><span class="team-calendar-note">Apple · Google · Outlook</span><div class="team-calendar-status" aria-live="polite"></div>`;
    if(socials)socials.insertAdjacentElement('afterend',wrap);else copy.appendChild(wrap);
    wrap.querySelector('button').addEventListener('click',()=>exportCalendar(wrap));
  }

  async function collect(){
    const catalog=await get('/api/catalog');
    const tournament=(catalog.tournaments||[]).find(t=>String(t.slug)===params.get('t'))||catalog.tournaments?.[0];
    if(!tournament)throw Error('Турнир не найден');
    const stages=(catalog.stages||[]).filter(s=>Number(s.tournament_id)===Number(tournament.id)).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
    if(!stages.length)throw Error('Туры не найдены');
    const data=[];
    for(const stage of stages){
      try{data.push(await get('/api/data?tournament_slug='+encodeURIComponent(tournament.slug)+'&stage_id='+encodeURIComponent(stage.id)))}catch(e){console.warn('Calendar export stage:',stage.id,e)}
    }
    if(!data.length)throw Error('Не удалось загрузить календарь');
    const team=data.flatMap(x=>x.teams||[]).find(t=>Number(t.id)===teamId);
    if(!team)throw Error('Команда не найдена');
    const seen=new Set(),matches=[];
    for(const d of data){
      for(const m of d.matches||[]){
        if(![Number(m.home_team_id),Number(m.away_team_id)].includes(teamId)||seen.has(Number(m.id)))continue;
        seen.add(Number(m.id));
        matches.push({match:m,data:d,stage:d.stage});
      }
    }
    matches.sort((a,b)=>String(a.match.game_date||'').localeCompare(String(b.match.game_date||''))||String(a.match.start_time||'99:99').localeCompare(String(b.match.start_time||'99:99'))||(a.match.game_no||0)-(b.match.game_no||0));
    return{tournament,team,matches};
  }

  function build({tournament,team,matches}){
    const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Russian Cup U16//Team Schedule//RU','CALSCALE:GREGORIAN','METHOD:PUBLISH',`X-WR-CALNAME:${icsText(team.name)} · ${icsText(tournament.name)}`,'X-WR-CALDESC:Матчи команды в Кубке России U16'];
    const now=stamp();
    for(const item of matches){
      const m=item.match,d=item.data,home=d.teams.find(t=>Number(t.id)===Number(m.home_team_id)),away=d.teams.find(t=>Number(t.id)===Number(m.away_team_id));
      if(!m.game_date||!home||!away)continue;
      const summary=`${home.name} — ${away.name} · ${tournament.name}`;
      const loc=[m.city,m.arena].filter(Boolean).join(', ');
      const group=d.groups?.find(g=>Number(g.id)===Number(m.group_id));
      const matchUrl=`${location.origin}/?match=${encodeURIComponent(m.id)}`;
      const desc=[item.stage?.name||'',group?.name||group?.code||'',m.game_no!=null?`Матч №${m.game_no}`:'',`Страница матча: ${matchUrl}`,'Время указано так же, как в календаре турнира на сайте.'].filter(Boolean).join('\n');
      lines.push('BEGIN:VEVENT',`UID:russian-cup-u16-match-${m.id}@russian-cup-2627.vercel.app`,`DTSTAMP:${now}`);
      if(m.start_time){const start=`${date8(m.game_date)}T${time6(m.start_time)}`;lines.push(`DTSTART:${start}`,`DTEND:${endTime(m.game_date,m.start_time,120)}`)}
      else lines.push(`DTSTART;VALUE=DATE:${date8(m.game_date)}`,`DTEND;VALUE=DATE:${nextDate8(m.game_date)}`);
      lines.push(`SUMMARY:${icsText(summary)}`);
      if(loc)lines.push(`LOCATION:${icsText(loc)}`);
      lines.push(`DESCRIPTION:${icsText(desc)}`,`URL:${matchUrl}`,'STATUS:CONFIRMED','TRANSP:OPAQUE','END:VEVENT');
    }
    lines.push('END:VCALENDAR');
    return lines.map(fold).join('\r\n')+'\r\n';
  }

  async function exportCalendar(wrap){
    const btn=wrap.querySelector('button'),status=wrap.querySelector('.team-calendar-status');
    btn.disabled=true;status.classList.remove('error');status.textContent='Собираю матчи всех туров…';
    try{
      const payload=await collect();
      if(!payload.matches.length)throw Error('У команды пока нет матчей в календаре');
      const text=build(payload),blob=new Blob([text],{type:'text/calendar;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
      a.href=url;a.download=`kubok-rossii-u16-${slug(payload.team.name)}-${slug(payload.tournament.season||'2026-27')}.ics`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
      status.textContent=`Готово: ${payload.matches.length} матч${payload.matches.length%10===1&&payload.matches.length%100!==11?'':([2,3,4].includes(payload.matches.length%10)&&![12,13,14].includes(payload.matches.length%100)?'а':'ей')} в файле .ics`;
    }catch(e){status.classList.add('error');status.textContent='Не удалось создать календарь: '+(e.message||String(e));}
    finally{btn.disabled=false}
  }

  let tries=0;const timer=setInterval(()=>{tries++;mount();if(mounted()||tries>80)clearInterval(timer)},150);mount();
})();
