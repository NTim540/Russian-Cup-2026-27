const KEY='fhr-cal-20260907-x7p4';
const SRC='https://junior.fhr.ru/tournaments/kubokrossii-25008909/calendar/';
function decode(s=''){return s.replace(/&nbsp;/gi,' ').replace(/&laquo;/gi,'«').replace(/&raquo;/gi,'»').replace(/&ndash;/gi,'–').replace(/&mdash;/gi,'—').replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&amp;/gi,'&').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16)))}
function txt(s=''){return decode(s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,'\n')).split(/\r?\n/).map(x=>x.replace(/\s+/g,' ').trim()).filter(Boolean).join(' | ')}
export default async function handler(req,res){
  if(String(req.query?.key||'')!==KEY)return res.status(404).json({error:'Not found'});
  try{
    const r=await fetch(SRC,{redirect:'follow',headers:{'User-Agent':'Mozilla/5.0 (compatible; RussianCupU16/1.0; +https://russian-cup-2627.vercel.app/)','Accept':'text/html,application/xhtml+xml'}});
    const html=await r.text();
    const contexts=[]; const seen=new Set();
    const re=/\/games\/(\d+)(?:\/|["'?])/gi; let m;
    while((m=re.exec(html))){const id=m[1];if(seen.has(id))continue;seen.add(id);const a=Math.max(0,m.index-1800),b=Math.min(html.length,m.index+2600);contexts.push({id,context:txt(html.slice(a,b)).slice(0,3500)});}
    const plain=txt(html);
    res.setHeader('Cache-Control','no-store');
    return res.status(200).json({status:r.status,finalUrl:r.url,bytes:html.length,gameCount:contexts.length,contexts,plain:plain.slice(0,180000)});
  }catch(e){return res.status(500).json({error:String(e?.message||e)})}
}
