(()=>{
  const API='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup';
  const teamId=Number(new URL(location.href).searchParams.get('team'));
  if(!Number.isInteger(teamId)||teamId<1)return;

  const done=m=>Number.isInteger(m?.home_score)&&Number.isInteger(m?.away_score)&&m.home_score!==m.away_score;
  async function get(path){const r=await fetch(API+path,{cache:'no-store'});if(!r.ok)throw Error(await r.text());return r.json()}





function groupRows(group,data,s){return CupStandings.groupRows(data,group,s)}

function overall(data,s){return CupStandings.overall(data,s)}

  function paint(groupPlace,overallPlace){
    const gp=document.querySelector('#groupPlace');if(gp)gp.textContent=groupPlace||'—';
    const first=document.querySelector('#statsGrid .stat-card:first-child strong');if(first)first.textContent=overallPlace||'—';
  }

  function paintNeighbours(rows){
    const box=document.querySelector('#teamNeighbours');
    if(!box)return;
    const index=rows.findIndex(r=>Number(r.team_id)===teamId);
    if(index<0){box.hidden=true;box.parentElement.classList.remove('has-neighbours');return}
    const start=Math.max(0,Math.min(index-1,rows.length-3));
    box.replaceChildren();
    const header=document.createElement('div');header.className='neighbours-heading';
    const title=document.createElement('span');title.textContent='Общая таблица';
    const link=document.createElement('a');link.href='/#overall';link.textContent='Вся таблица →';
    header.append(title,link);box.append(header);
    const table=document.createElement('table');table.setAttribute('aria-label','Ближайшие команды в общей таблице');
    const head=document.createElement('thead');
    head.innerHTML='<tr><th scope="col">Место</th><th scope="col">Команда</th><th scope="col">Очки</th></tr>';
    const body=document.createElement('tbody');
    for(const row of rows.slice(start,start+3)){
      const tr=document.createElement('tr'),place=document.createElement('td'),name=document.createElement('td'),points=document.createElement('td');
      const current=Number(row.team_id)===teamId;
      tr.classList.toggle('is-current',current);
      place.textContent=String(row.place);points.textContent=String(row.pts);
      const teamLink=document.createElement('a');teamLink.href='/team.html?team='+encodeURIComponent(row.team_id);teamLink.textContent=row.team;
      if(current)teamLink.setAttribute('aria-current','page');
      name.append(teamLink);tr.append(place,name,points);body.append(tr);
    }
    table.append(head,body);box.append(table);box.hidden=false;box.parentElement.classList.add('has-neighbours');
  }

  async function sync(){
    try{
      const catalog=await get('/api/catalog'),tournament=catalog.tournaments?.[0];if(!tournament)return;
      const stages=(catalog.stages||[]).filter(s=>Number(s.tournament_id)===Number(tournament.id)).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0)),stage=stages[0];if(!stage)return;
      const data=await get('/api/data?tournament_slug='+encodeURIComponent(tournament.slug)+'&stage_id='+stage.id),membership=data.memberships.find(x=>Number(x.team_id)===teamId),group=data.groups.find(g=>Number(g.id)===Number(membership?.group_id));
      if(!group)return;
      const gr=groupRows(group,data,data.settings),groupPlace=gr.find(r=>Number(r.team_id)===teamId)?.place||'—';
      const or=overall(data,data.settings),overallPlace=or.find(r=>Number(r.team_id)===teamId)?.place||'—';
      paint(groupPlace,overallPlace);
      paintNeighbours(or);
    }catch(e){console.warn('Standings sync:',e)}
  }

  let tries=0;const timer=setInterval(()=>{tries++;sync();if(tries>=4)clearInterval(timer)},800);
  sync();
})();
