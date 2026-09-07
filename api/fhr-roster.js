const TEAM_URLS={
  1:'https://junior.fhr.ru/tournaments/kubokrossii-25008909/dinamo_3229852/',
  2:'https://junior.fhr.ru/tournaments/kubokrossii-25008909/moskovskaya-akademiya-khokkeya_25171776/',
  3:'https://junior.fhr.ru/tournaments/kubokrossii-25008909/torpedo_5158681/',
  4:'https://junior.fhr.ru/tournaments/kubokrossii-25008909/lokomotiv_1748397/',
  5:'https://junior.fhr.ru/tournaments/kubokrossii-25008909/avangard_5141797/',
  6:'https://junior.fhr.ru/tournaments/kubokrossii-25008909/lokomotiv-2004_1746417/',
  7:'https://junior.fhr.ru/tournaments/kubokrossii-25008909/krylya-sovetov_3363769/',
  8:'https://junior.fhr.ru/tournaments/kubokrossii-25008909/sibir_5543137/',
  9:'https://junior.fhr.ru/tournaments/kubokrossii-25008909/lada_5153000/',
  10:'https://junior.fhr.ru/tournaments/kubokrossii-25008909/traktor_6627269/',
  11:'https://junior.fhr.ru/tournaments/kubokrossii-25008909/ak-bars_5236523/',
  12:'https://junior.fhr.ru/tournaments/kubokrossii-25008909/spartak_1830615/',
  13:'https://junior.fhr.ru/tournaments/kubokrossii-25008909/dinamo_4344494/',
  14:'https://junior.fhr.ru/tournaments/kubokrossii-25008909/dinamo-dzhunivers_9575055/',
  15:'https://junior.fhr.ru/tournaments/kubokrossii-25008909/akademiya-mikhaylova_982485/',
  16:'https://junior.fhr.ru/tournaments/kubokrossii-25008909/tsska_2759626/',
  17:'https://junior.fhr.ru/tournaments/kubokrossii-25008909/armiya-ska_2182098/',
  18:'https://junior.fhr.ru/tournaments/kubokrossii-25008909/neftekhimik_5157947/',
  19:'https://junior.fhr.ru/tournaments/kubokrossii-25008909/severstal_3648122/',
  20:'https://junior.fhr.ru/tournaments/kubokrossii-25008909/krasnaya-mashina-yunior_7500809/'
};

function decode(s=''){
  return s.replace(/&nbsp;/gi,' ').replace(/&laquo;/gi,'«').replace(/&raquo;/gi,'»').replace(/&ndash;/gi,'–').replace(/&mdash;/gi,'—').replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&amp;/gi,'&').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16)));
}
function clean(s=''){return decode(s.replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim()}
function posCode(s=''){const p=clean(s).toLowerCase();if(p.includes('вратар'))return'G';if(p.includes('защит'))return'D';if(p.includes('напада'))return'F';return'U'}
function parse(html){
  const chunks=html.split(/<a href="\/player\//i).slice(1),players=[];
  for(const chunk of chunks){
    if(!chunk.includes('team-player-card__number'))continue;
    const num=Number(chunk.match(/team-player-card__number[^>]*>\s*([0-9]+)/i)?.[1]);
    const photo=chunk.match(/team-player-card__img[^>]*>[\s\S]*?<img src="([^"]+)"/i)?.[1]||'';
    const name=clean(chunk.match(/team-player-card__name[^>]*>([\s\S]*?)<\/div>/i)?.[1]||'');
    const add=chunk.match(/team-player-card__additional[^>]*>([\s\S]*?)<\/div>/i)?.[1]||'';
    const spans=[...add.matchAll(/<span[^>]*>([\s\S]*?)<\/span>/gi)].map(m=>clean(m[1]));
    const position=spans[1]||'';
    if(!name||!Number.isFinite(num))continue;
    players.push({number:num,name,position,pos:posCode(position),photo});
  }
  return players;
}

export default async function handler(req,res){
  const team=Number(req.query?.team);
  const source=TEAM_URLS[team];
  if(!source)return res.status(404).json({error:'Team roster source not found'});
  try{
    const r=await fetch(source,{headers:{'User-Agent':'Mozilla/5.0 (compatible; RussianCupU16/1.0; +https://russian-cup-2627.vercel.app/)','Accept':'text/html,application/xhtml+xml'},redirect:'follow'});
    if(!r.ok)return res.status(502).json({error:`FHR HTTP ${r.status}`});
    const html=await r.text();
    const players=parse(html);
    if(!players.length)return res.status(502).json({error:'FHR roster was not parsed'});
    res.setHeader('Cache-Control','s-maxage=21600, stale-while-revalidate=86400');
    return res.status(200).json({team,source,players});
  }catch(e){return res.status(500).json({error:String(e?.message||e)})}
}
