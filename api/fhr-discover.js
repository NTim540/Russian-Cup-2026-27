export default async function handler(req,res){
  const team=String(req.query?.team||'').trim();
  if(!/^\d{1,2}$/.test(team))return res.status(400).json({error:'bad team'});
  const u='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-fhr-discover?team='+encodeURIComponent(team);
  try{
    const r=await fetch(u,{headers:{accept:'application/json'},signal:AbortSignal.timeout(25000)});
    const text=await r.text();
    res.status(r.status).setHeader('content-type','application/json; charset=utf-8').send(text);
  }catch(e){res.status(502).json({error:String(e?.message||e)})}
}
