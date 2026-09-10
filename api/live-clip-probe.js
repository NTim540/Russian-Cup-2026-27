export const config={runtime:'edge'};

const FHM='https://www.fhmoscow.com/game/17355';
const VK='https://vk.com/video_ext.php?oid=-48703984&id=456257600&autoplay=0&js_api=1&t=60';
const UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/139.0.0.0 Safari/537.36';

function uniq(xs){return[...new Set(xs.filter(Boolean))]}
function abs(base,href){try{return new URL(href,base).toString()}catch{return''}}
function attr(src,name){const m=src.match(new RegExp(`${name}=["']([^"']*)["']`,'i'));return m?m[1].replace(/&amp;/g,'&'):''}
function strip(src){return src.replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/&#x([0-9a-f]+);/gi,(_,h)=>String.fromCodePoint(parseInt(h,16))).replace(/&amp;/g,'&').replace(/\s+/g,' ').trim()}
function timingValues(html){
  const out={};
  const keys=['duration','date','start_time','startTime','started_at','startedAt','live_start_time','liveStartTime','current_time','currentTime','is_live','isLive','live_status','liveStatus'];
  for(const key of keys){
    const patterns=[
      new RegExp(`\\\\?"${key}\\\\?"\\s*:\\s*(true|false|-?\\d+(?:\\.\\d+)?|\\\\?"[^"\\\\]{0,120}\\\\?")`,'gi'),
      new RegExp(`${key}\\s*[:=]\\s*(true|false|-?\\d+(?:\\.\\d+)?|["'][^"']{0,120}["'])`,'gi')
    ];
    const vals=[];
    for(const re of patterns)for(const m of html.matchAll(re))vals.push(m[1]);
    if(vals.length)out[key]=uniq(vals).slice(0,12);
  }
  const api=[];
  for(const m of html.matchAll(/\\?"method\\?"\s*:\s*\\?"([^"\\]+)\\?"/gi))api.push(m[1]);
  out.methods=uniq(api).slice(0,30);
  return out;
}
function around(html,needle,before=500,after=7000){const i=html.indexOf(needle);return i<0?'':html.slice(Math.max(0,i-before),Math.min(html.length,i+after)).replace(/\s+/g,' ')}
function extract(html,base){
  const title=strip((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[])[1]||'');
  const urls=[];
  for(const m of html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)) urls.push(abs(base,m[1]));
  for(const m of html.matchAll(/https?:\\?\/\\?\/[^"'<>\s]+/gi)) urls.push(m[0].replace(/\\\//g,'/').replace(/\\u0026/g,'&'));
  const media=uniq(urls.filter(u=>/\.m3u8(?:\?|$)|\.mp4(?:\?|$)|video_ext\.php/i.test(u))).slice(0,50);
  const scripts=uniq(urls.filter(u=>/\.js(?:\?|$)/i.test(u))).slice(0,30);
  const actions=[];
  for(const m of html.matchAll(/<div class=["']action\s+([^"']+)["']>\s*<div([^>]*)data-action-name=["']([^"']+)["']([^>]*)><\/div>\s*<div[^>]*data-action-time=["']([^"']*)["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi)){
    const attrs=`${m[2]} ${m[4]}`;
    actions.push({teamClass:m[1],name:m[3],minute:Number(m[5]),timeLabel:strip(m[6]),player:attr(attrs,'data-action-player-name'),number:attr(attrs,'data-action-player-number'),assist1:attr(attrs,'data-action-player-assist1-name'),assist2:attr(attrs,'data-action-player-assist2-name'),violation:attr(attrs,'data-action-player-violation')});
  }
  const precise=[];
  for(const m of html.matchAll(/\b([0-5]?\d:[0-5]\d)\b/g)){
    const i=m.index||0,chunk=html.slice(Math.max(0,i-500),Math.min(html.length,i+900));
    const text=strip(chunk);
    if(/гол|наруш|штраф|удален|поднож|толчок|задерж|удар|клюшкой/i.test(text)) precise.push({time:m[1],snippet:text.slice(0,1200)});
  }
  return{title,length:html.length,media,scripts,actions:actions.slice(0,60),precise:precise.slice(0,40),timing:timingValues(html),playerConfig:around(html,'video.getPlayerConfig'),hashConfig:around(html,'video.getHashes',300,1800)};
}
async function get(url,referer){
  try{
    const r=await fetch(url,{redirect:'follow',headers:{'User-Agent':UA,'Accept':'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',...(referer?{'Referer':referer}:{})},cache:'no-store'});
    const text=await r.text();
    return{ok:r.ok,status:r.status,finalUrl:r.url,headers:{type:r.headers.get('content-type'),server:r.headers.get('server')},data:extract(text,r.url),head:text.slice(0,500)};
  }catch(e){return{ok:false,error:String(e)}}
}
export default async function handler(request){
  if(request.method!=='GET')return new Response(null,{status:405,headers:{Allow:'GET'}});
  const [fhm,vk]=await Promise.all([get(FHM),get(VK,'https://www.fhmoscow.com/game/17355')]);
  return Response.json({time:new Date().toISOString(),fhm,vk},{headers:{'Cache-Control':'no-store'}});
}
