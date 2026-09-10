export const config={runtime:'edge'};

const FHM='https://www.fhmoscow.com/game/17355';
const VK='https://vksport.vkvideo.ru/video-48703984_456257600';
const UA='Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1';

function uniq(xs){return[...new Set(xs.filter(Boolean))]}
function abs(base,href){try{return new URL(href,base).toString()}catch{return''}}
function attr(src,name){const m=src.match(new RegExp(`${name}=["']([^"']*)["']`,'i'));return m?m[1].replace(/&amp;/g,'&'):''}
function extract(html,base){
  const title=(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[])[1]?.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()||'';
  const urls=[];
  for(const m of html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)) urls.push(abs(base,m[1]));
  for(const m of html.matchAll(/https?:\\?\/\\?\/[^"'<>\s]+/gi)) urls.push(m[0].replace(/\\\//g,'/').replace(/\\u0026/g,'&'));
  const media=uniq(urls.filter(u=>/\.m3u8(?:\?|$)|\.mp4(?:\?|$)|video_ext\.php/i.test(u))).slice(0,30);
  const scripts=uniq(urls.filter(u=>/\.js(?:\?|$)/i.test(u))).slice(0,30);
  const actions=[];
  for(const m of html.matchAll(/data-action-name=["']([^"']+)["']/gi)){
    const i=m.index||0;
    const chunk=html.slice(Math.max(0,i-900),Math.min(html.length,i+1800));
    actions.push({name:m[1],player:attr(chunk,'data-action-player-name'),number:attr(chunk,'data-action-player-number'),assist1:attr(chunk,'data-action-player-assist1-name'),assist2:attr(chunk,'data-action-player-assist2-name'),violation:attr(chunk,'data-action-player-violation'),teamClass:(chunk.match(/class=["']action\s+([^"']+)["']/i)||[])[1]||'',snippet:chunk.replace(/\s+/g,' ').slice(0,2600)});
  }
  const interesting=[];
  const needles=['События','Гол','Наруш','Удал','Трансляц','game-events','event','score','video_ext','m3u8','mp4','js_api'];
  for(const needle of needles){
    const i=html.toLowerCase().indexOf(needle.toLowerCase());
    if(i>=0) interesting.push({needle,snippet:html.slice(Math.max(0,i-350),Math.min(html.length,i+1100)).replace(/\s+/g,' ')});
  }
  return{title,length:html.length,media,scripts,actions:actions.slice(0,40),interesting:interesting.slice(0,12)};
}

async function get(url,referer){
  try{
    const r=await fetch(url,{redirect:'follow',headers:{'User-Agent':UA,'Accept':'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',...(referer?{'Referer':referer}:{})},cache:'no-store'});
    const text=await r.text();
    return{ok:r.ok,status:r.status,finalUrl:r.url,headers:{type:r.headers.get('content-type'),server:r.headers.get('server')},data:extract(text,r.url),head:text.slice(0,1200)};
  }catch(e){return{ok:false,error:String(e)}}
}

export default async function handler(request){
  if(request.method!=='GET')return new Response(null,{status:405,headers:{Allow:'GET'}});
  const [fhm,vk]=await Promise.all([get(FHM),get(VK,'https://vkvideo.ru/')]);
  return Response.json({time:new Date().toISOString(),fhm,vk},{headers:{'Cache-Control':'no-store'}});
}
