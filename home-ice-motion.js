(()=>{
'use strict';
if(location.pathname!=='/'&&!location.pathname.endsWith('/index.html'))return;

const old=document.getElementById('home-ice-motion-style');
if(old)old.remove();
document.querySelectorAll('.ice-motion-scene,.concept-hero-art,.him-scene').forEach(el=>el.remove());

const PHOTO='https://images.pexels.com/photos/6847470/pexels-photo-6847470.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop';
const style=document.createElement('style');
style.id='home-ice-motion-style';
style.textContent=`
:root{--him-red:#ef1f2d;--him-blue:#2585d2;--him-deep:#03101c}
html body{background:#04111d!important}
html body:before{background:radial-gradient(circle at 76% 0,rgba(32,126,191,.15),transparent 28%),linear-gradient(180deg,#04111d 0%,#061522 55%,#040d17 100%)!important}
html body:after{opacity:.10!important}
html .site-header{background:rgba(2,10,18,.93)!important;border-bottom:1px solid rgba(122,187,231,.13)!important;box-shadow:0 10px 32px rgba(0,0,0,.24)!important}
html .header-inner{min-height:70px!important}
html .nav{font-size:10px!important;letter-spacing:.075em!important;font-weight:900!important}
html .nav a{border-radius:0!important;padding:11px 10px!important;color:#91a3b6!important}
html .nav a:hover{color:#fff!important;background:transparent!important}
html .nav a.concept-home{color:#fff!important}
html .nav a.concept-home:after{height:3px!important;background:var(--him-red)!important;bottom:0!important}

html .hero.wrap{position:relative!important;width:100%!important;max-width:none!important;min-height:720px!important;margin:0!important;padding:68px max(22px,calc((100vw - 1280px)/2)) 46px!important;display:flex!important;align-items:center!important;overflow:hidden!important;isolation:isolate!important;background:#04111d!important;border-bottom:1px solid rgba(122,187,231,.10)!important}
html .hero.wrap:before,html .hero.wrap:after{content:none!important}
html .hero>div:first-child{position:relative!important;z-index:7!important;width:min(660px,52vw)!important;max-width:660px!important}

.him-scene{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;background:#04111d}
.him-scene:before{content:"";position:absolute;top:0;right:0;bottom:0;width:66%;background-image:url('${PHOTO}');background-size:cover;background-position:center right;filter:saturate(.82) contrast(1.08) brightness(.78);transform:scale(1.018);transform-origin:right center}
.him-scene:after{content:"";position:absolute;inset:0;background:
linear-gradient(90deg,#04111d 0%,rgba(4,17,29,.99) 30%,rgba(4,17,29,.90) 42%,rgba(4,17,29,.48) 56%,rgba(4,17,29,.10) 76%,rgba(4,17,29,.04) 100%),
linear-gradient(180deg,rgba(2,10,18,.08) 0%,transparent 50%,rgba(2,10,18,.54) 100%)}
.him-number{position:absolute;z-index:2;right:12%;top:4%;font-size:clamp(210px,23vw,350px);line-height:.82;font-weight:1000;letter-spacing:-.085em;color:rgba(190,215,232,.12);mix-blend-mode:screen;text-shadow:0 0 70px rgba(68,151,207,.09)}
.him-circle{position:absolute;z-index:2;right:8.4%;top:15%;width:min(40vw,590px);aspect-ratio:1;border:1px solid rgba(66,151,211,.18);border-radius:50%;box-shadow:inset 0 0 0 92px rgba(35,135,217,.018),inset 0 0 0 186px rgba(35,135,217,.010)}
.him-circle:before,.him-circle:after{content:"";position:absolute;left:50%;top:-8%;height:116%;width:1px;background:rgba(113,177,220,.11);transform-origin:center}
.him-circle:before{transform:rotate(38deg)}.him-circle:after{transform:rotate(-36deg)}
.him-slogan{position:absolute;z-index:3;right:5%;top:20%;width:112px;color:#a0b2c2;font-size:9px;line-height:1.9;letter-spacing:.30em;text-transform:uppercase;font-weight:800;text-shadow:0 2px 12px rgba(0,0,0,.4)}
.him-slogan:after{content:"";display:block;width:36px;height:2px;margin-top:9px;background:var(--him-red)}
.him-line-red,.him-line-blue{position:absolute;z-index:2;height:2px;width:54%;right:-2%;transform-origin:right center;opacity:.62;filter:drop-shadow(0 0 8px currentColor)}
.him-line-red{top:36%;color:#ef1f2d;background:linear-gradient(90deg,transparent,rgba(239,31,45,.42),rgba(239,31,45,.70));transform:rotate(-5deg)}
.him-line-blue{top:18%;color:#2585d2;background:linear-gradient(90deg,transparent,rgba(37,133,210,.30),rgba(37,133,210,.55));transform:rotate(8deg)}

html .eyebrow{border-radius:3px!important;border:1px solid rgba(126,190,255,.21)!important;background:rgba(3,20,34,.78)!important;color:#d1e6f5!important;padding:8px 11px!important;font-size:10px!important;letter-spacing:.125em!important;box-shadow:0 10px 24px rgba(0,0,0,.16)!important}
html .eyebrow:before{background:var(--him-red)!important;box-shadow:0 0 15px rgba(239,31,45,.75)!important}
html #heroTitle{margin:22px 0 17px!important;max-width:640px!important;font-size:clamp(64px,7.2vw,104px)!important;line-height:.84!important;letter-spacing:-.070em!important;font-weight:1000!important;text-transform:uppercase!important;text-shadow:0 14px 34px rgba(0,0,0,.28)!important}
html #heroTitle .him-u16{display:inline-block;color:var(--him-red)!important;text-shadow:0 12px 30px rgba(239,31,45,.15)!important}
html .hero-subtitle{max-width:600px!important;font-size:14px!important;line-height:1.67!important;color:#b8c5d2!important;text-shadow:0 2px 15px rgba(0,0,0,.28)!important}
html .hero-actions{margin-top:26px!important;gap:10px!important}
html .hero-actions .btn{min-height:52px!important;padding:0 19px!important;border-radius:4px!important;font-size:10px!important;letter-spacing:.045em!important;position:relative!important;overflow:hidden!important}
html .hero-actions .btn:after{content:"→";font-size:16px;line-height:1;margin-left:5px;transition:transform .18s ease}
html .hero-actions .btn:hover:after{transform:translateX(3px)}
html .hero-actions .btn.primary{background:linear-gradient(135deg,#f21d2d,#d91625)!important;border-color:#f21d2d!important;box-shadow:0 14px 34px rgba(239,30,44,.25)!important}
html .hero-actions .btn.primary:before{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 0 38%,rgba(255,255,255,.17) 49%,transparent 60%);transform:translateX(-140%);transition:.45s ease}
html .hero-actions .btn.primary:hover:before{transform:translateX(140%)}
html .hero-actions .btn.secondary{background:rgba(2,13,23,.54)!important;border-color:rgba(180,216,240,.32)!important;color:#f1f5f8!important;backdrop-filter:blur(5px)!important}
html .hero-controls{margin-top:15px!important}
html .hero-controls .filter{min-height:48px!important;background-color:rgba(2,17,29,.78)!important;border-color:rgba(122,186,229,.18)!important;color:#eaf4fb!important;backdrop-filter:blur(6px)!important}
html .hero-stats{display:flex!important;gap:0!important;max-width:710px!important;margin-top:28px!important;border-top:1px solid rgba(134,195,236,.17)!important;border-bottom:1px solid rgba(134,195,236,.17)!important;background:rgba(2,14,24,.30)!important;backdrop-filter:blur(7px)!important}
html .hero-stats .stat{flex:1!important;padding:15px 18px!important;border:0!important;border-right:1px solid rgba(134,195,236,.13)!important;border-radius:0!important;background:transparent!important;box-shadow:none!important}
html .hero-stats .stat:last-child{border-right:0!important}
html .hero-stats .stat strong{font-size:25px!important;color:#fff!important}
html .hero-stats .stat span{font-size:8px!important;letter-spacing:.12em!important;color:#8da1b5!important}
html #status{margin-top:14px!important;color:#8296aa!important;font-size:8px!important;letter-spacing:.10em!important}

html[data-theme="light"] .hero.wrap{background:#04111d!important;color:#fff!important}
html[data-theme="light"] #heroTitle{color:#fff!important}
html[data-theme="light"] .hero-subtitle{color:#c3d0dc!important}
html[data-theme="light"] .hero-stats .stat strong{color:#fff!important}
html[data-theme="light"] .hero-controls .filter{background-color:rgba(2,17,29,.80)!important;color:#fff!important}

@media(max-width:1100px){
  html .hero.wrap{min-height:690px!important;padding-top:58px!important}
  html .hero>div:first-child{width:min(610px,58vw)!important}
  .him-scene:before{width:70%;background-position:58% center}.him-number{right:5%;opacity:.65}.him-circle{right:-3%}.him-slogan{display:none}
}
@media(max-width:760px){
  html .hero.wrap{min-height:670px!important;padding:42px 12px 34px!important;align-items:flex-start!important}
  html .hero>div:first-child{width:100%!important;max-width:100%!important}
  .him-scene:before{width:100%;opacity:.52;background-position:67% center;filter:saturate(.75) contrast(1.05) brightness(.62)}
  .him-scene:after{background:linear-gradient(180deg,rgba(4,17,29,.96) 0%,rgba(4,17,29,.88) 42%,rgba(4,17,29,.55) 72%,rgba(4,17,29,.86) 100%)}
  .him-number,.him-circle,.him-line-red,.him-line-blue{display:none}
  html #heroTitle{font-size:clamp(52px,16vw,74px)!important;max-width:96%!important}
  html .hero-subtitle{max-width:92%!important;font-size:13px!important}
  html .hero-stats{width:100%!important;display:grid!important;grid-template-columns:1fr 1fr!important}
  html .hero-stats .stat:nth-child(2){border-right:0!important}
  html .hero-stats .stat:nth-child(-n+2){border-bottom:1px solid rgba(134,195,236,.12)!important}
}
@media(max-width:480px){
  html .hero.wrap{min-height:650px!important}
  html #heroTitle{font-size:50px!important}
  html .hero-subtitle{max-width:100%!important}
  html .hero-actions{display:grid!important;grid-template-columns:1fr!important;width:min(100%,330px)!important}
  html .hero-actions .btn{width:100%!important}
  html .hero-controls{display:grid!important;grid-template-columns:minmax(0,1fr) 110px!important;width:100%!important}
  html .hero-controls .filter{width:100%!important;min-width:0!important}
}
`;
document.head.appendChild(style);

const hero=document.querySelector('.hero');
if(!hero)return;
const scene=document.createElement('div');
scene.className='him-scene';
scene.setAttribute('aria-hidden','true');
scene.innerHTML='<div class="him-number">01</div><div class="him-circle"></div><div class="him-slogan">Большие<br>игроки<br>начинаются<br>здесь</div><div class="him-line-blue"></div><div class="him-line-red"></div>';
hero.appendChild(scene);

function styleTitle(){
  const h=document.getElementById('heroTitle');if(!h)return;
  const raw=h.textContent.replace(/\s+/g,' ').trim();
  if(!/U16/i.test(raw)||h.querySelector('.him-u16'))return;
  h.innerHTML='КУБОК<br>РОССИИ<br><span class="him-u16">U16</span>';
}
styleTitle();
const title=document.getElementById('heroTitle');
if(title)new MutationObserver(styleTitle).observe(title,{childList:true,subtree:true,characterData:true});

const nav=document.querySelector('.nav');
if(nav&&!nav.querySelector('a[href="#top"]')){
  const home=document.createElement('a');home.href='#top';home.textContent='Главная';home.className='concept-home';nav.prepend(home);
}
if(nav&&!nav.querySelector('a[href="/news.html"]')){
  const news=document.createElement('a');news.href='/news.html';news.textContent='Новости';nav.appendChild(news);
}
const reg=nav?.querySelector('a[href="#rules"]');if(reg)reg.href='/regulation.html';
})();