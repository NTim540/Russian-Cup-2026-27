export const config={runtime:'edge'};

const SOURCE='https://www.fhmoscow.com/game/17349';
const VIDEO={oid:'-48703984',id:'456257601'};
const UA='Mozilla/5.0 (compatible; RussianCupU16/1.0; +https://russian-cup-2627.vercel.app/)';

function decode(s=''){
  return String(s)
    .replace(/&#x([0-9a-f]+);/gi,(_,h)=>String.fromCodePoint(parseInt(h,16)))
    .replace(/&#(\d+);/g,(_,d)=>String.fromCodePoint(Number(d)))
    .replace(/&quot;/g,'"').replace(/&#039;/g,"'").replace(/&amp;/g,'&')
    .replace(/&nbsp;/g,' ');
}
function strip(s=''){return decode(s).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim()}
function attr(src,name){const m=src.match(new RegExp(`${name}=["']([^"']*)["']`,'i'));return m?decode(m[1]):''}
function toSeconds(t='00:00'){const m=String(t).match(/^(\d{1,2}):(\d{2})$/);return m?Number(m[1])*60+Number(m[2]):0}
function eventType(name=''){
  const n=String(name).toLocaleUpperCase('ru-RU').trim();
  if(n==='ГОЛ'||n.includes(' ГОЛ'))return'GOAL';
  if(n.includes('НАРУШ'))return'PENALTY';
  if(n.includes('НАЧАЛО ИГРЫ'))return'MATCH_START';
  if(n.includes('КОНЕЦ ИГРЫ')||n.includes('ОКОНЧАНИЕ ИГРЫ'))return'MATCH_END';
  if(n.includes('ТАЙМ-АУТ')||n.includes('ТАЙМАУТ'))return'TIMEOUT';
  if(n==='ВР'||n.includes('ВРАТАР'))return'GOALIE';
  return'OTHER';
}
function eventKey(e){return[e.type,e.time,e.number,e.player,e.rawName].join('|')}
function parseTeams(title,html){
  let clean=title.replace(/\s+\d{2}\.\d{2}\.\d{4}$/,'').trim();
  const parts=clean.split(' - ');
  const home={name:(parts[0]||'Команда 1').trim(),logo:''};
  const away={name:(parts.slice(1).join(' - ')||'Команда 2').trim(),logo:''};
  for(const m of html.matchAll(/<img\b([^>]+)>/gi)){
    const a=m[1],alt=attr(a,'alt').trim(),src=attr(a,'data-src')||attr(a,'src');
    if(!src||src.startsWith('data:'))continue;
    if(!home.logo&&alt===home.name)home.logo=src;
    if(!away.logo&&alt===away.name)away.logo=src;
  }
  return{home,away};
}

function parse(html){
  const title=strip((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[])[1]||'').replace(/ \| Федерация хоккея Москвы$/,'');
  const start=(html.match(/"startDate"\s*:\s*"([^"]+)"/)||[])[1]||'';
  const schemaStatus=(html.match(/"eventStatus"\s*:\s*"https:\/\/schema\.org\/([^"]+)"/)||[])[1]||'';
  const teams=parseTeams(title,html);

  let oid=VIDEO.oid,id=VIDEO.id;
  let embed=`https://vkvideo.ru/video_ext.php?oid=${encodeURIComponent(oid)}&id=${encodeURIComponent(id)}&hd=2&autoplay=0&js_api=1`;
  let embedRaw=decode((html.match(/data-src=["']((?:https?:)?\/\/(?:vkvideo\.ru|vk\.com)\/video_ext\.php\?[^"']+)/i)||[])[1]||'');
  if(embedRaw){
    if(embedRaw.startsWith('//'))embedRaw='https:'+embedRaw;
    try{
      const u=new URL(embedRaw);
      oid=u.searchParams.get('oid')||oid;
      id=u.searchParams.get('id')||id;
      u.searchParams.set('js_api','1');
      u.searchParams.set('autoplay','0');
      embed=u.toString();
    }catch{}
  }

  const rawActions=[];
  const actionRe=/<div class=["']action\s+([^"']+)["']>\s*<div([^>]*)data-action-name=["']([^"']+)["']([^>]*)><\/div>\s*<div[^>]*data-action-time=["']([^"']*)["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi;
  for(const m of html.matchAll(actionRe)){
    const attrs=`${m[2]} ${m[4]}`,type=eventType(m[3]);
    rawActions.push({
      side:m[1].includes('s-team')?'away':m[1].includes('f-team')?'home':null,
      type,rawName:decode(m[3]).trim(),minute:Number(m[5]||0),timeLabel:strip(m[6]),
      player:attr(attrs,'data-action-player-name'),number:attr(attrs,'data-action-player-number'),
      assist1:attr(attrs,'data-action-player-assist1-name'),assist2:attr(attrs,'data-action-player-assist2-name'),
      violation:attr(attrs,'data-action-player-violation'),role:attr(attrs,'data-action-player-role')
    });
  }

  const precise=[];
  const timeRe=/\b([0-5]?\d:[0-5]\d)\b/g;
  for(const m of html.matchAll(timeRe)){
    const i=m.index||0;
    const chunk=strip(html.slice(Math.max(0,i-220),Math.min(html.length,i+640)));
    if(!/(?:Гол|Нарушение)/i.test(chunk))continue;
    let type='';
    if(new RegExp(`${m[1].replace(':','\\:')}\\s+Гол`,'i').test(chunk))type='GOAL';
    else if(new RegExp(`${m[1].replace(':','\\:')}\\s+Нарушение`,'i').test(chunk))type='PENALTY';
    else continue;
    const score=type==='GOAL'?(chunk.match(new RegExp(`(\\d+)\\s+(\\d+)\\s+${m[1].replace(':','\\:')}\\s+Гол`,'i'))||[]).slice(1,3):[];
    const mins=type==='PENALTY'?Number((chunk.match(new RegExp(`(\\d+)\\s+мин\\s+${m[1].replace(':','\\:')}\\s+Нарушение`,'i'))||[])[1]||0):0;
    precise.push({type,time:m[1].padStart(5,'0'),score:score.length===2?`${score[0]}:${score[1]}`:'',penaltyMinutes:mins});
  }
  const typed={GOAL:precise.filter(x=>x.type==='GOAL'),PENALTY:precise.filter(x=>x.type==='PENALTY')};
  const pi={GOAL:0,PENALTY:0};

  let homeScore=0,awayScore=0;
  const events=rawActions.map(a=>{
    const p=(a.type==='GOAL'||a.type==='PENALTY')?(typed[a.type][pi[a.type]++]||null):null;
    let time=p?.time||((a.timeLabel.match(/\d{1,2}:\d{2}/)||[])[0])||`${String(a.minute||0).padStart(2,'0')}:00`;
    if(a.type==='MATCH_START')time='00:00';
    const gameSeconds=toSeconds(time),period=Math.min(3,Math.floor(gameSeconds/1200)+1);
    if(a.type==='GOAL'){
      if(a.side==='away')awayScore++; else homeScore++;
    }
    const score=`${homeScore}:${awayScore}`;
    const e={...a,time,gameSeconds,period,score,penaltyMinutes:p?.penaltyMinutes||0};
    return{...e,key:eventKey(e)};
  });

  if(!events.some(e=>e.type==='MATCH_START')){
    const e={side:null,type:'MATCH_START',rawName:'НАЧАЛО ИГРЫ',minute:0,timeLabel:'',player:'',number:'',assist1:'',assist2:'',violation:'',role:'',time:'00:00',gameSeconds:0,period:1,score:'0:0',penaltyMinutes:0};
    events.unshift({...e,key:eventKey(e)});
  }

  const goals=events.filter(e=>e.type==='GOAL');
  homeScore=goals.filter(e=>e.side==='home').length; awayScore=goals.filter(e=>e.side==='away').length;
  const periodScores=[1,2,3].map(period=>({
    period,
    home:goals.filter(e=>e.period===period&&e.side==='home').length,
    away:goals.filter(e=>e.period===period&&e.side==='away').length
  }));
  const latestSeconds=Math.max(0,...events.map(e=>e.gameSeconds||0));
  const currentPeriod=Math.min(3,Math.max(1,Math.floor(latestSeconds/1200)+1));
  const complete=events.some(e=>e.type==='MATCH_END');

  return{
    title,start,sourceUrl:SOURCE,teams,score:{home:homeScore,away:awayScore},periodScores,currentPeriod,
    status:complete?'FINAL':'LIVE',schemaStatus,
    video:{oid,id,embed,sourceEmbed:embedRaw||null},
    events
  };
}

export default async function handler(request){
  if(request.method!=='GET')return new Response(null,{status:405,headers:{Allow:'GET'}});
  try{
    const r=await fetch(SOURCE,{cache:'no-store',headers:{'User-Agent':UA,'Accept':'text/html,application/xhtml+xml'}});
    if(!r.ok)throw new Error(`FHM ${r.status}`);
    const data=parse(await r.text());
    return Response.json({...data,fetchedAt:new Date().toISOString()},{headers:{'Cache-Control':'no-store','Access-Control-Allow-Origin':'*'}});
  }catch(e){
    return Response.json({error:String(e)},{status:502,headers:{'Cache-Control':'no-store','Access-Control-Allow-Origin':'*'}});
  }
}
