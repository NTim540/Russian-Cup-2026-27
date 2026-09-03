/* Games Day visual refresh v3. Loaded after admin-infographics-v2.js. */
(()=>{
  function metricsV3(n){
    if(n===1)return{top:350,rowH:430,gap:0};
    if(n===2)return{top:320,rowH:350,gap:26};
    if(n===3)return{top:305,rowH:250,gap:18};
    if(n===4)return{top:292,rowH:190,gap:16};
    const top=292,bottom=1160,gap=12;
    return{top,rowH:Math.max(82,Math.min(166,Math.floor((bottom-top-gap*(n-1))/n))),gap};
  }

  async function dayLogoV3(id,t,x,y,size){
    const key=fullId(id),e=EDITS[key]||{dx:0,dy:0,scale:1},sc=e.scale||1;
    const xx=x+(e.dx||0),yy=y+(e.dy||0),sz=size*sc;
    fillRounded(xx,yy,sz,sz,sz/2,'rgba(255,255,255,.025)','rgba(127,198,255,.13)');
    const im=await image(logoUrl(t));
    if(im){
      const pad=Math.max(5,sz*.10);
      drawContain(im,xx+pad,yy+pad,sz-pad*2,sz-pad*2);
    }else{
      rawText(initials(t.name),xx+sz/2,yy+sz*.62,Math.round(sz*.27),'900','center','#d8efff');
    }
    registerHit({id:key,type:'image',editable:false,x:xx,y:yy,w:sz,h:sz});
  }

  function sideBlockV3(id,name,city,x,centerY,maxWidth,rowH,align,compact=false){
    const base=compact?30:rowH>=320?34:rowH>=235?29:rowH>=180?25:21;
    const min=compact?17:rowH>=235?20:16;
    const f=fitLines(name,maxWidth,2,base,min,'900');
    const lineH=Math.max(f.size*(compact?1.06:1.12),22);
    const blockH=(f.lines.length-1)*lineH;
    const startY=centerY-blockH/2;
    sceneWrap(id+':name',name,x,startY,maxWidth,lineH,2,f.size,'900',align,'#f7fbff',true,true);
    const citySize=Math.max(12,Math.min(compact?15:16,f.size*.55));
    sceneText(id+':city',city||'',x,startY+blockH+lineH+(compact?12:8),citySize,'700',align,'#8fa6bd');
  }

  function vkMarkV3(id,cx,cy,scale=1){
    const key=fullId(id),e=EDITS[key]||{dx:0,dy:0,scale:1},sc=scale*(e.scale||1);
    const icon=23*sc,labelW=57*sc,total=icon+7*sc+labelW;
    const x=cx-total/2+(e.dx||0),y=cy-icon/2+(e.dy||0);
    fillRounded(x,y,icon,icon,7*sc,'rgba(35,135,217,.20)','rgba(127,198,255,.22)');
    ctx.fillStyle='#7fc6ff';
    ctx.beginPath();
    ctx.moveTo(x+8*sc,y+6*sc);ctx.lineTo(x+8*sc,y+17*sc);ctx.lineTo(x+17*sc,y+11.5*sc);ctx.closePath();ctx.fill();
    rawText('VK Видео',x+icon+7*sc,y+16.5*sc,10.5*sc,'850','left','#8fbddd');
    registerHit({id:key,type:'image',editable:false,x,y,w:total,h:icon});
  }

  function centerGuideV3(y,rowH,twoMatches=false){
    const left=twoMatches?448:438,right=twoMatches?632:642;
    ctx.save();
    ctx.strokeStyle='rgba(127,198,255,.075)';
    ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(left,y+28);ctx.lineTo(left,y+rowH-28);ctx.stroke();
    ctx.beginPath();ctx.moveTo(right,y+28);ctx.lineTo(right,y+rowH-28);ctx.stroke();
    ctx.restore();
  }

  drawDay=async function(kind){
    const ms=dayMatches(),date=$('#gameDate').value,isResults=kind==='results';
    await header(isResults?'РЕЗУЛЬТАТЫ ДНЯ':'ИГРЫ ДНЯ');
    sceneText('day3:date',fmtDate(date),70,230,36,'950','left','#fff');
    sceneText('day3:count',`${ms.length} ${pluralMatches(ms.length)}`,1010,230,18,'900','right','#7fc6ff');
    if(!ms.length){sceneText('day3:empty','МАТЧЕЙ НА ЭТУ ДАТУ НЕТ',540,650,34,'900','center','#91a0b4');footer();return}

    const {top,rowH,gap}=metricsV3(ms.length);
    const twoMatches=ms.length===2;
    let y=top;
    for(const m of ms){
      const h=team(m.home_team_id),a=team(m.away_team_id),g=group(m.group_id);
      const large=ms.length<=2;

      fillRounded(70,y,940,rowH,26,'rgba(7,21,37,.46)','rgba(127,198,255,.13)');
      centerGuideV3(y,rowH,twoMatches);

      const logoSize=rowH>=320?118:rowH>=235?98:rowH>=180?78:Math.max(52,rowH*.42);
      const ly=y+(rowH-logoSize)/2;
      await dayLogoV3(`day3:${m.id}:homeLogo`,h,96,ly,logoSize);
      await dayLogoV3(`day3:${m.id}:awayLogo`,a,984-logoSize,ly,logoSize);

      const textY=y+rowH*.40;
      if(twoMatches){
        /* Keep both team blocks completely outside the central time column. */
        sideBlockV3(`day3:${m.id}:home`,h.name,teamCity(h),410,textY,190,rowH,'right',true);
        sideBlockV3(`day3:${m.id}:away`,a.name,teamCity(a),670,textY,190,rowH,'left',true);
      }else{
        const textWidth=large?270:250;
        sideBlockV3(`day3:${m.id}:home`,h.name,teamCity(h),218,textY,textWidth,rowH,'left');
        sideBlockV3(`day3:${m.id}:away`,a.name,teamCity(a),862,textY,textWidth,rowH,'right');
      }

      const mainSize=twoMatches?54:rowH>=320?56:rowH>=235?48:rowH>=180?40:Math.max(27,rowH*.22);
      if(isResults){
        const played=Number.isInteger(m.home_score)&&Number.isInteger(m.away_score);
        sceneText(`day3:${m.id}:score`,played?`${m.home_score}:${m.away_score}`:'—',540,y+rowH*.43,mainSize+6,'950','center','#fff');
        if(played&&m.finish_type==='OT')sceneText(`day3:${m.id}:finish`,'ОТ',540,y+rowH*.62,12,'950','center','#78c7ff');
        if(played&&m.finish_type==='SO')sceneText(`day3:${m.id}:finish`,'Б',540,y+rowH*.62,12,'950','center','#78c7ff');
      }else{
        sceneText(`day3:${m.id}:time`,m.start_time||'—',540,y+rowH*.42,mainSize,'950','center','#fff');
        vkMarkV3(`day3:${m.id}:vk`,540,y+rowH*.61,twoMatches?1:.92);
      }

      sceneText(`day3:${m.id}:meta`,`${g?.code||''} · №${m.game_no||'—'}`,540,y+rowH-18,11.5,'800','center','#738ba3');
      y+=rowH+gap;
    }
    footer();
  };

  // Repaint once the patch is loaded if data is already present.
  setTimeout(()=>{try{if(D&&['gamesday','resultsday'].includes($('#type')?.value))render()}catch{}},0);
})();
