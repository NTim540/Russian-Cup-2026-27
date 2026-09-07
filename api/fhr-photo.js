export default async function handler(req,res){
  const raw=String(req.query?.src||'').trim();
  let u;
  try{u=new URL(raw)}catch{return res.status(400).end()}
  if(u.protocol!=='https:'||u.hostname!=='img.fhr.ru'||!u.pathname.startsWith('/players/'))return res.status(403).end();
  try{
    const r=await fetch(u.toString(),{
      redirect:'follow',
      headers:{
        'User-Agent':'Mozilla/5.0 (compatible; RussianCupU16/1.0; +https://russian-cup-2627.vercel.app/)',
        'Accept':'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer':'https://junior.fhr.ru/'
      }
    });
    if(!r.ok)return res.status(r.status===404?404:502).end();
    const type=r.headers.get('content-type')||'image/webp';
    if(!type.toLowerCase().startsWith('image/'))return res.status(502).end();
    const body=Buffer.from(await r.arrayBuffer());
    res.setHeader('Content-Type',type);
    res.setHeader('Cache-Control','public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000');
    return res.status(200).send(body);
  }catch{return res.status(502).end()}
}
