// Called only after the existing team-admin password check succeeds.
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const HERO_BUCKET = 'team-city-images';

export function imageFormat(bytes) {
  if (bytes.length < 12) return null;
  if ([137,80,78,71,13,10,26,10].every((v,i)=>bytes[i]===v)) return {type:'image/png',ext:'png'};
  if (bytes[0]===255 && bytes[1]===216 && bytes[2]===255) return {type:'image/jpeg',ext:'jpg'};
  if (String.fromCharCode(...bytes.slice(0,4))==='RIFF' && String.fromCharCode(...bytes.slice(8,12))==='WEBP') return {type:'image/webp',ext:'webp'};
  return null;
}

export async function uploadTeamHero(req, {supa, json, baseUrl, serviceKey, fetchImpl=fetch}) {
  const id=Number(new URL(req.url).searchParams.get('id'));
  if (!Number.isSafeInteger(id) || id<1) return json({error:'Некорректная команда'},400);
  const mime=(req.headers.get('content-type')||'').split(';')[0].trim();
  if (!['image/jpeg','image/png','image/webp'].includes(mime)) return json({error:'Выберите JPG, PNG или WebP'},415);
  if (Number(req.headers.get('content-length'))>MAX_IMAGE_BYTES) return json({error:'Файл должен быть не больше 5 МБ'},413);
  const rows=await supa(`cup_teams?id=eq.${id}&select=id`);
  if (!rows?.length) return json({error:'Команда не найдена'},404);
  if (!req.body) return json({error:'Пустой файл'},400);
  const reader=req.body.getReader(), chunks=[];
  let size=0;
  try {
    while (true) {
      const {value,done}=await reader.read();
      if (done) break;
      size+=value.byteLength;
      if (size>MAX_IMAGE_BYTES) {
        await reader.cancel();
        return json({error:'Файл должен быть не больше 5 МБ'},413);
      }
      chunks.push(value);
    }
  } finally {reader.releaseLock();}
  const bytes=new Uint8Array(size);
  let offset=0;
  for (const chunk of chunks) {bytes.set(chunk,offset);offset+=chunk.length;}
  const format=imageFormat(bytes);
  if (!format || format.type!==mime) return json({error:'Файл не является изображением JPG, PNG или WebP'},415);
  const path=`teams/${id}/${crypto.randomUUID()}.${format.ext}`;
  const response=await fetchImpl(`${baseUrl}/storage/v1/object/${HERO_BUCKET}/${path}`,{
    method:'POST',
    headers:{apikey:serviceKey,Authorization:`Bearer ${serviceKey}`,'Content-Type':format.type,'Cache-Control':'max-age=31536000','x-upsert':'false'},
    body:bytes,
    signal:AbortSignal.timeout(45000)
  });
  if (!response.ok) return json({error:'Не удалось загрузить фото в хранилище. Попробуйте ещё раз.'},502);
  return json({ok:true,url:`${baseUrl}/storage/v1/object/public/${HERO_BUCKET}/${path}`});
}
