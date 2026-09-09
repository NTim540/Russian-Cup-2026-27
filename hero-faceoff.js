(()=>{
'use strict';
if(location.pathname!=='/'&&!location.pathname.endsWith('/index.html'))return;
if(document.documentElement.dataset.faceoffHeroLoading==='1')return;
document.documentElement.dataset.faceoffHeroLoading='1';

const VERSION='20260910-1';
const paths=Array.from({length:10},(_,i)=>`/hero-faceoff/${String(i+1).padStart(2,'0')}.txt?v=${VERSION}`);

async function loadPhoto(){
  const chunks=await Promise.all(paths.map(async path=>{
    const r=await fetch(path,{cache:'force-cache'});
    if(!r.ok)throw new Error(`Не удалось загрузить ${path}: ${r.status}`);
    return r.text();
  }));
  const photo=chunks.join('').trim();
  if(!photo.startsWith('data:image/webp;base64,'))throw new Error('Некорректный формат hero-изображения');
  return photo;
}

function installStyle(){
  if(document.getElementById('faceoff-hero-style'))return;
  const style=document.createElement('style');
  style.id='faceoff-hero-style';
  style.textContent=`
    html.faceoff-hero-ready .him-scene:before{
      width:100%!important;
      left:0!important;
      right:0!important;
      background-image:var(--faceoff-photo)!important;
      background-size:cover!important;
      background-position:center center!important;
      background-repeat:no-repeat!important;
      filter:saturate(.92) contrast(1.06) brightness(.86)!important;
      transform:none!important;
      opacity:1!important;
    }
    html.faceoff-hero-ready .him-scene:after{
      background:
        linear-gradient(90deg,rgba(4,17,29,.82) 0%,rgba(4,17,29,.63) 23%,rgba(4,17,29,.29) 42%,rgba(4,17,29,.08) 58%,rgba(4,17,29,0) 76%),
        linear-gradient(180deg,rgba(2,10,18,.08) 0%,rgba(2,10,18,0) 52%,rgba(2,10,18,.32) 100%)!important;
    }
    html.faceoff-hero-ready .him-number,
    html.faceoff-hero-ready .him-circle,
    html.faceoff-hero-ready .him-slogan,
    html.faceoff-hero-ready .him-line-red,
    html.faceoff-hero-ready .him-line-blue,
    html.faceoff-hero-ready .him-board-note{display:none!important}
    html.faceoff-hero-ready .hero>div:first-child{
      text-shadow:0 4px 22px rgba(0,0,0,.24);
    }
    @media(max-width:1100px){
      html.faceoff-hero-ready .him-scene:before{background-position:56% center!important}
      html.faceoff-hero-ready .him-scene:after{
        background:
          linear-gradient(90deg,rgba(4,17,29,.91) 0%,rgba(4,17,29,.70) 32%,rgba(4,17,29,.25) 62%,rgba(4,17,29,.04) 100%),
          linear-gradient(180deg,rgba(2,10,18,.10),transparent 50%,rgba(2,10,18,.38))!important;
      }
    }
    @media(max-width:760px){
      html.faceoff-hero-ready .him-scene:before{
        background-position:58% center!important;
        filter:saturate(.82) contrast(1.04) brightness(.66)!important;
      }
      html.faceoff-hero-ready .him-scene:after{
        background:linear-gradient(180deg,rgba(4,17,29,.96) 0%,rgba(4,17,29,.84) 42%,rgba(4,17,29,.52) 70%,rgba(4,17,29,.88) 100%)!important;
      }
    }
  `;
  document.head.appendChild(style);
}

function waitForScene(photo){
  let done=false;
  const apply=()=>{
    const scene=document.querySelector('.him-scene');
    if(!scene)return false;
    document.documentElement.style.setProperty('--faceoff-photo',`url("${photo}")`);
    installStyle();
    document.documentElement.classList.add('faceoff-hero-ready');
    done=true;
    return true;
  };
  if(apply())return;
  const mo=new MutationObserver(()=>{if(!done&&apply())mo.disconnect()});
  mo.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(()=>mo.disconnect(),12000);
}

loadPhoto().then(waitForScene).catch(err=>{
  console.warn('Faceoff hero fallback:',err);
});
})();
