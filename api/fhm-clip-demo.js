export const config={runtime:'edge'};

const SOURCE='https://www.fhmoscow.com/game/17355';
const VIDEO={oid:'-48703984',id:'456257600'};
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
function eventKey(e){return[e.type,e.time,e.number,e.player].join('|')}

function parse(html){
  const title=strip((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[])[1]||'').replace(/ \| Федерация хоккея Москвы$/,'');
  const start=(html.match(/"startDate"\s*:\s*"([^"]+)"/)||[])[1]||'';
  const matchEmbed=(html.match(/data-src=["']https:\/\/(?:vkvideo\.ru|vk\.com)\/video_ext\.php\?([^"']+)/i)||[])[1]||'';
  let oid=VIDEO.oid,id=VIDEO.id;
  if(matchEmbed){try{const p=new URLSearchParams(decode(matchEmbed));oid=p.get('oid')||oid;id=p.get('id')||id}catch{}}

  const actions=[];
  const actionRe=/<div class=["']action\s+([^"']+)["']>\s*<div([^>]*)data-action-name=["']([^"']+)["']([^>]*)><\/div>\s*<div[^>]*data-action-time=["']([^"']*)["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi;
  for(const m of html.matchAll(actionRe)){
    if(!/^(ГОЛ|НАРУШЕНИЕ)$/i.test(m[3]))continue;
    const attrs=`${m[2]} ${m[4]}`;
    actions.push({
      side:m[1].includes('s-team')?'away':'home',
      type:/ГОЛ/i.test(m[3])?'GOAL':'PENALTY',
      minute:Number(m[5]),
      player:attr(attrs,'data-action-player-name'),
      number:attr(attrs,'data-action-player-number'),
      assist1:attr(attrs,'data-action-player-assist1-name'),
      assist2:attr(attrs,'data-action-player-assist2-name'),
      violation:attr(attrs,'data-action-player-violation')
    });
  }

  const precise=[];
  const timeRe=/\b([0-5]?\d:[0-5]\d)\b/g;
  for(const m of html.matchAll(timeRe)){
    const i=m.index||0;
    const chunk=strip(html.slice(Math.max(0,i-180),Math.min(html.length,i+520)));
    if(!/(?:Гол|Нарушение)/i.test(chunk))continue;
    let type='';
    if(new RegExp(`${m[1].replace(':','\\:')}\\s+Гол`,'i').test(chunk))type='GOAL';
    else if(new RegExp(`${m[1].replace(':','\\:')}\\s+Нарушение`,'i').test(chunk))type='PENALTY';
    else continue;
    const score=type==='GOAL'?(chunk.match(new RegExp(`(\\d+)\\s+(\\d+)\\s+${m[1].replace(':','\\:')}\\s+Гол`,'i'))||[]).slice(1,3):[];
    const mins=type==='PENALTY'?Number((chunk.match(new RegExp(`(\\d+)\\s+мин\\s+${m[1].replace(':','\\:')}\\s+Нарушение`,'i'))||[])[1]||0):0;
    precise.push({type,time:m[1].padStart(5,'0'),score:score.length===2?`${score[0]}:${score[1]}`:'',penaltyMinutes:mins});
  }

  const typedPrecise={GOAL:precise.filter(x=>x.type==='GOAL'),PENALTY:precise.filter(x=>x.type==='PENALTY')};
  const idx={GOAL:0,PENALTY:0};
  const events=actions.map(a=>{
    const p=typedPrecise[a.type][idx[a.type]++]||null;
    const e={...a,time:p?.time||`${String(a.minute).padStart(2,'0')}:00`,score:p?.score||'',penaltyMinutes:p?.penaltyMinutes||0};
    return{...e,key:eventKey(e)};
  });

  return{title,start,sourceUrl:SOURCE,video:{oid,id,embed:`https://vk.com/video_ext.php?oid=${encodeURIComponent(oid)}&id=${encodeURIComponent(id)}&hd=2&autoplay=0&js_api=1`},events};
}

export default async function handler(request){
  if(request.method!=='GET')return new Response(null,{status:405,headers:{Allow:'GET'}});
  try{
    const r=await fetch(SOURCE,{cache:'no-store',headers:{'User-Agent':UA,'Accept':'text/html,application/xhtml+xml'}});
    if(!r.ok)throw new Error(`FHM ${r.status}`);
    const data=parse(await r.text());
    return Response.json({...data,fetchedAt:new Date().toISOString()},{headers:{'Cache-Control':'no-store','Access-Control-Allow-Origin':'*'}});
  }catch(e){
    return Response.json({error:String(e)},{status:502,headers:{'Cache-Control':'no-store'}});
  }
}
