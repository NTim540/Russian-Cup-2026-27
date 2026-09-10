export default async function handler(req,res){
  const id=Number(req.query?.id||32);
  const url=`https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-match-lineups?match_id=${encodeURIComponent(id)}&debug=${Date.now()}`;
  try{
    const r=await fetch(url,{cache:'no-store'});
    const text=await r.text();
    res.status(r.status).setHeader('Content-Type',r.headers.get('content-type')||'application/json').send(text);
  }catch(e){res.status(500).json({error:String(e?.message||e)})}
}
