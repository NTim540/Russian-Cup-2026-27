/* Single match widgets: result + announcement with broadcast priority. */
(()=>{
  const RESULT_TYPE='matchwidgetresult';
  const ANNOUNCE_TYPE='matchwidgetannounce';

  function addOptions(){
    const sel=$('#type');
    if(!sel)return;
    if(!sel.querySelector(`option[value="${RESULT_TYPE}"]`)){
      const o=document.createElement('option');o.value=RESULT_TYPE;o.textContent='Итог матча — виджет';
      const result=sel.querySelector('option[value="result"]');result?.insertAdjacentElement('afterend',o);
    }
    if(!sel.querySelector(`option[value="${ANNOUNCE_TYPE}"]`)){
      const o=document.createElement('option');o.value=ANNOUNCE_TYPE;o.textContent='Анонс матча — виджет / трансляция';
      const announcement=sel.querySelector('option[value="announcement"]');announcement?.insertAdjacentElement('afterend',o);
    }
  }

  function validUrl(v){if(!v)return null;try{const u=new URL(String(v));return ['http:','https:'].includes(u.protocol)?u:null}catch{return null}}
  function matchEvents(id){return (D?.match_events||[]).filter(e=>Number(e.match_id)===Number(id)).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0)||(Number(a.id)||0)-(Number(b.id)||0))}
  function goalsFor(id,teamId){return matchEvents(id).filter(e=>String(e.event_type||'').toUpperCase()==='GOAL'&&Number(e.team_id)===Number(teamId))}
  function periodParts(m){
    const parts=[];
    [['p1_home','p1_away'],['p2_home','p2_away'],['p3_home','p3_away']].forEach(([h,a])=>{
      if(Number.isInteger(m[h])&&Number.isInteger(m[a]))parts.push(`${m[h]}:${m[a]}`);
    });
    if((m.finish_type==='OT'||Number.isInteger(m.ot_home)||Number.isInteger(m.ot_away))&&Number.isInteger(m.ot_home)&&Number.isInteger(m.ot_away))parts.push(`ОТ ${m.ot_home}:${m.ot_away}`);
    if((m.finish_type==='SO'||Number.isInteger(m.so_home)||Number.isInteger(m.so_away))&&Number.isInteger(m.so_home)&&Number.isInteger(m.so_away))parts.push(`Б ${m.so_home}:${m.so_away}`);
    return parts;
  }
  function shortDate(x){return new Date(x+'T12:00:00').toLocaleDateString('ru-RU',{weekday:'short',day:'2-digit',month:'2-digit',year:'numeric'}).replace(/\.$/,'')}
  function streamHost(url){const u=validUrl(url);if(!u)return '';return u.hostname.replace(/^www\./,'').replace(/^m\./,'')}

  function teamNameWidget(id,t,x,y,align){
    sceneWrap(id+':name',t.name||'—',x,y,270,39,2,31,'900',align,'#f8fbff',true,true);
    sceneText(id+':city',teamCity(t)||'',x,y+82,16,'700',align,'#8fa3b9');
  }

  function drawPanel(x,y,w,h){
    const g=ctx.createLinearGradient(x,y,x+w,y+h);
    g.addColorStop(0,'rgba(16,37,63,.94)');g.addColorStop(.55,'rgba(10,27,48,.96)');g.addColorStop(1,'rgba(9,22,39,.98)');
    rounded(x,y,w,h,28);ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='rgba(127,198,255,.16)';ctx.lineWidth=2;ctx.stroke();
  }

  function drawDivider(x1,y1,x2,y2,alpha=.10){ctx.save();ctx.strokeStyle=`rgba(127,198,255,${alpha})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore()}

  function scorerRows(prefix,events,x,y,align){
    if(!events.length){sceneText(prefix+':empty','Авторы шайб не добавлены',x,y,15,'700',align,'#687f96');return}
    const rows=events.slice(0,7),size=events.length>5?14:16,line=events.length>5?34:40;
    rows.forEach((e,i)=>{
      const who=e.player||'Игрок';
      const clock=e.clock?` · ${e.clock}`:'';
      sceneText(`${prefix}:${e.id||i}`,`${who}${clock}`,x,y+i*line,size,'750',align,'#c9d5e2',align==='left'?330:330);
    });
    if(events.length>7)sceneText(prefix+':more',`+ ещё ${events.length-7}`,x,y+7*line,13,'750',align,'#7fc6ff');
  }

  function videoCTA(id,m,x,y,w,h){
    const key=fullId(id),e=EDITS[key]||{dx:0,dy:0,scale:1},sc=e.scale||1;
    const xx=x+(e.dx||0),yy=y+(e.dy||0),ww=w*sc,hh=h*sc,url=validUrl(m.stream_url);
    const g=ctx.createLinearGradient(xx,yy,xx+ww,yy+hh);
    if(url){g.addColorStop(0,'rgba(22,119,255,.96)');g.addColorStop(1,'rgba(16,91,205,.96)')}else{g.addColorStop(0,'rgba(50,72,96,.72)');g.addColorStop(1,'rgba(29,47,68,.78)')}
    rounded(xx,yy,ww,hh,24*sc);ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=url?'rgba(176,225,255,.36)':'rgba(255,255,255,.10)';ctx.lineWidth=2;ctx.stroke();
    const r=34*sc,cx=xx+68*sc,cy=yy+hh/2;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,.16)';ctx.fill();ctx.beginPath();ctx.moveTo(cx-8*sc,cy-13*sc);ctx.lineTo(cx-8*sc,cy+13*sc);ctx.lineTo(cx+15*sc,cy);ctx.closePath();ctx.fillStyle='#fff';ctx.fill();
    rawText('ВИДЕОТРАНСЛЯЦИЯ',xx+122*sc,yy+52*sc,25*sc,'950','left','#fff');
    rawText(url?'СМОТРЕТЬ В VK ВИДЕО':'ССЫЛКА БУДЕТ ДОБАВЛЕНА',xx+122*sc,yy+82*sc,14*sc,'800','left',url?'#dceeff':'#a7b6c6');
    if(url)rawText(streamHost(m.stream_url),xx+ww-30*sc,yy+67*sc,13*sc,'750','right','#c6e6ff');
    registerHit({id:key,type:'image',editable:false,x:xx,y:yy,w:ww,h:hh});
  }

  async function drawResultWidget(){
    const m=matchById($('#match').value);if(!m)return;
    const h=team(m.home_team_id),a=team(m.away_team_id),g=group(m.group_id);
    await header('ИТОГ МАТЧА');
    sceneText('wr:meta',`${g?.code||g?.name||''} · МАТЧ №${m.game_no||'—'}`,540,228,16,'850','center','#7fc6ff');
    drawPanel(60,290,960,780);
    drawDivider(450,340,450,565,.08);drawDivider(630,340,630,565,.08);
    await sceneLogo('wr:homeLogo',h,94,360,142);await sceneLogo('wr:awayLogo',a,844,360,142);
    teamNameWidget('wr:home',h,260,404,'left');teamNameWidget('wr:away',a,820,404,'right');
    const played=Number.isInteger(m.home_score)&&Number.isInteger(m.away_score);
    sceneText('wr:score',played?`${m.home_score}  —  ${m.away_score}`:'—',540,435,82,'950','center','#fff');
    const pp=periodParts(m);sceneText('wr:periods',pp.length?pp.join('   '):'Счёт по периодам не заполнен',540,492,18,'800','center',pp.length?'#b7c8da':'#647a91');
    sceneText('wr:date',shortDate(m.game_date),540,535,16,'700','center','#7f93a8');
    drawDivider(96,605,984,605,.12);
    sceneText('wr:goalsLabel','АВТОРЫ ШАЙБ',540,654,14,'900','center','#7fc6ff');
    scorerRows('wr:hgoal',goalsFor(m.id,m.home_team_id),118,710,'left');
    scorerRows('wr:agoal',goalsFor(m.id,m.away_team_id),962,710,'right');
    if(m.finish_type==='OT')sceneText('wr:finish','ОВЕРТАЙМ',540,955,14,'900','center','#7fc6ff');
    if(m.finish_type==='SO')sceneText('wr:finish','БУЛЛИТЫ',540,955,14,'900','center','#7fc6ff');
    footer();
  }

  async function drawAnnouncementWidget(){
    const m=matchById($('#match').value);if(!m)return;
    const h=team(m.home_team_id),a=team(m.away_team_id),g=group(m.group_id),url=validUrl(m.stream_url);
    await header('АНОНС МАТЧА');
    sceneText('wa:meta',`${g?.code||g?.name||''} · МАТЧ №${m.game_no||'—'}`,540,228,16,'850','center','#7fc6ff');
    drawPanel(60,290,960,790);
    await sceneLogo('wa:homeLogo',h,92,365,150);await sceneLogo('wa:awayLogo',a,838,365,150);
    teamNameWidget('wa:home',h,262,410,'left');teamNameWidget('wa:away',a,818,410,'right');
    sceneText('wa:time',m.start_time||'—',540,432,74,'950','center','#fff');
    sceneText('wa:date',fmtDate(m.game_date),540,488,18,'850','center','#b8c7d7');
    sceneText('wa:venue',[m.city,m.arena].filter(Boolean).join(' · ')||'Место проведения уточняется',540,534,16,'750','center','#8195aa',760);
    drawDivider(96,585,984,585,.12);
    sceneText('wa:videoKicker',url?'ГЛАВНОЕ':'ВИДЕО',540,632,13,'950','center',url?'#78d6ff':'#6e8297');
    videoCTA('wa:video',m,205,665,670,125);
    sceneText('wa:videoNote',url?'Ссылка на прямой эфир уже добавлена к матчу':'Как только ссылка появится в матче, виджет обновится автоматически',540,832,14,'700','center',url?'#8eb5d4':'#71869a',800);
    fillRounded(160,895,760,96,18,'rgba(255,255,255,.025)','rgba(255,255,255,.07)');
    sceneText('wa:prompt','ВКЛЮЧАЙТЕСЬ К ТРАНСЛЯЦИИ И СЛЕДИТЕ ЗА МАТЧЕМ ВМЕСТЕ С НАМИ',540,943,17,'900','center','#dce9f6',690);
    footer();
  }

  addOptions();
  const baseRender=render;
  const baseSwitch=switchType;

  render=async function(forExport=false){
    const t=$('#type')?.value;
    if(t!==RESULT_TYPE&&t!==ANNOUNCE_TYPE)return baseRender(forExport);
    if(!D)return;
    if(rendering&&!forExport){needsRender=true;return}
    rendering=true;exporting=forExport;setStatus(forExport?'Готовлю PNG…':'Обновляю…');HITS=[];bg();
    try{
      if(t===RESULT_TYPE)await drawResultWidget();else await drawAnnouncementWidget();
      await drawCustom();drawSelection();setStatus(forExport?'PNG готов':'Готово · 1080×1350 · элементы можно двигать мышкой');
    }catch(e){console.error(e);setStatus('Ошибка превью: '+e.message)}finally{exporting=false;rendering=false;if(needsRender&&!forExport){needsRender=false;requestAnimationFrame(()=>render(false))}}
  };

  switchType=function(){
    const t=$('#type').value;
    if(t!==RESULT_TYPE&&t!==ANNOUNCE_TYPE)return baseSwitch();
    SELECTED=null;hideInlineEditor();
    $('#matchControls').classList.remove('hidden');
    $('#gamesdayControls').classList.add('hidden');
    $('#newsControls').classList.add('hidden');
    updateSelectedInfo();render();
  };

  $('#type').onchange=switchType;
  $('#match').onchange=render;
  $('#refresh').onclick=render;
  setTimeout(()=>{addOptions();try{if(D&&[RESULT_TYPE,ANNOUNCE_TYPE].includes($('#type')?.value))render()}catch{}},0);
})();
