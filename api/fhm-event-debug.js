export const config={runtime:'edge'};
const URL='https://www.fhmoscow.com/game/17355';
function decode(s=''){return String(s).replace(/&#x([0-9a-f]+);/gi,(_,h)=>String.fromCodePoint(parseInt(h,16))).replace(/&#(\d+);/g,(_,d)=>String.fromCodePoint(Number(d))).replace(/&quot;/g,'"').replace(/&#039;/g,"'").replace(/&amp;/g,'&').replace(/&nbsp;/g,' ')}
function strip(s=''){return decode(s).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim()}
export default async function handler(){const r=await fetch(URL,{cache:'no-store'});const h=await r.text();const out={};for(const t of['42:03','48:24']){const i=h.indexOf(t);out[t]=i<0?'':strip(h.slice(Math.max(0,i-900),Math.min(h.length,i+1600)))}return Response.json(out,{headers:{'Cache-Control':'no-store'}})}
