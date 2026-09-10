export const config={runtime:'edge'};

export default async function handler(request){
  if(request.method!=='GET'){
    return new Response(null,{status:405,headers:{Allow:'GET'}});
  }

  const requestUrl=new URL(request.url);
  const raw=String(requestUrl.searchParams.get('src')||'').trim();
  let u;
  try{u=new URL(raw)}catch{return new Response(null,{status:400})}

  if(u.protocol!=='https:'||u.hostname!=='img.fhr.ru'||!u.pathname.startsWith('/players/')){
    return new Response(null,{status:403});
  }

  try{
    const r=await fetch(u.toString(),{
      redirect:'follow',
      headers:{
        'User-Agent':'Mozilla/5.0 (compatible; RussianCupU16/1.0; +https://russian-cup-2627.vercel.app/)',
        'Accept':'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer':'https://junior.fhr.ru/'
      }
    });

    if(!r.ok)return new Response(null,{status:r.status===404?404:502});

    const type=r.headers.get('content-type')||'image/webp';
    if(!type.toLowerCase().startsWith('image/'))return new Response(null,{status:502});

    return new Response(r.body,{
      status:200,
      headers:{
        'Content-Type':type,
        'Cache-Control':'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000'
      }
    });
  }catch{
    return new Response(null,{status:502});
  }
}
