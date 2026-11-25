// Shared, anonymous read cache. Never forwards cookies, credentials or write requests.
export const config={runtime:'edge'};
const ORIGIN='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/';
const RULES={
 'russian-cup':{routes:['api/catalog','api/data'],params:['stage_id','tournament_slug']},
 'russian-cup-stats':{params:['stage_id']},
 'russian-cup-match-center-v3':{params:['match_id']},
 'russian-cup-match-center-v2':{params:['match_id']},
 'russian-cup-match-center':{params:['match_id']},
 'russian-cup-match-lineups':{params:['match_id']},
 'russian-cup-officials':{params:['match_id']},
 'russian-cup-fhr-roster':{params:['team','photo']},
 'russian-cup-news':{params:['id','tournament_id','limit']},
 'russian-cup-home-admin':{params:[]}
};
const fail=(status,error)=>new Response(JSON.stringify({ok:false,error}),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
export default async function handler(request){
 if(request.method!=='GET')return fail(405,'Only public GET requests are supported');
 const input=new URL(request.url),resource=input.searchParams.get('resource')||'',route=(input.searchParams.get('route')||'').replace(/^\/+|\/+$/g,'');
 const rule=RULES[resource];if(!rule||!(rule.routes?rule.routes.includes(route):route===''))return fail(404,'Unknown public resource');
 const target=new URL(ORIGIN+resource+(route?'/'+route:''));
 for(const [key,value] of input.searchParams){
  if(['resource','route','v'].includes(key))continue;
  if(!rule.params.includes(key))return fail(400,'Unsupported query parameter');
  if(input.searchParams.getAll(key).length!==1)return fail(400,'Duplicate query parameter');
  if(['match_id','team','id','tournament_id','limit'].includes(key)&&!/^\d{1,6}$/.test(value))return fail(400,'Invalid id');
  if(key==='stage_id'&&!/^(all|[1-9]\d{0,3})$/.test(value))return fail(400,'Invalid stage');
  if(key==='tournament_slug'&&!/^[a-z0-9-]{1,100}$/i.test(value))return fail(400,'Invalid tournament');
  if(key==='photo'){
   let p;try{p=new URL(value)}catch{return fail(400,'Invalid image')}
   if(p.protocol!=='https:'||!(p.hostname==='fhr.ru'||p.hostname.endsWith('.fhr.ru')))return fail(400,'Invalid image host');
  }
  target.searchParams.set(key,value);
 }
 if((resource.includes('match-center')||resource.endsWith('match-lineups')||resource.endsWith('officials'))&&!target.searchParams.has('match_id'))return fail(400,'Match is required');
 try{
  const upstream=await fetch(target,{signal:AbortSignal.timeout(20000),headers:{Accept:'application/json,image/*'}});
  if(!upstream.ok)return fail(upstream.status>=500?502:upstream.status,'Public data temporarily unavailable');
  const type=upstream.headers.get('content-type')||'application/json';
  let ttl=300;
  if(type.startsWith('image/')){
   return new Response(await upstream.arrayBuffer(),{headers:{'Content-Type':type,'Cache-Control':'public, max-age=86400','Vercel-CDN-Cache-Control':'public, s-maxage=604800','X-Content-Type-Options':'nosniff'}});
  }
  const body=await upstream.text();let data;try{data=JSON.parse(body)}catch{return fail(502,'Invalid upstream response')}
  if(data.ok===false||data.error)return fail(502,'Public data temporarily unavailable');
  if(resource.includes('match-center'))ttl=data.live?.status==='FINAL'?3600:30;
  if(resource==='russian-cup-fhr-roster')ttl=3600;
  if(resource==='russian-cup-match-lineups')ttl=3600;
  if(resource==='russian-cup-home-admin'||route==='api/catalog')ttl=3600;
  return new Response(body,{headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':`public, max-age=${Math.min(ttl,60)}`,'Vercel-CDN-Cache-Control':`public, s-maxage=${ttl}, stale-while-revalidate=60, stale-if-error=86400`,'X-Content-Type-Options':'nosniff','X-Cup-Cache-TTL':String(ttl)}});
 }catch{return fail(502,'Public data temporarily unavailable')}
}
