(()=>{
'use strict';
if(!location.pathname.endsWith('/')&&!location.pathname.endsWith('/index.html'))return;
if(document.getElementById('home-ice-motion-style'))return;

const style=document.createElement('style');
style.id='home-ice-motion-style';
style.textContent=`
:root{--him-red:#f01f2d;--him-blue:#2387d9;--him-ice:#9dd8ff;--him-deep:#03101c}
html body{background:#04111d!important}
html body:before{background:radial-gradient(circle at 72% 0,rgba(27,116,184,.22),transparent 28%),radial-gradient(circle at 88% 12%,rgba(240,31,45,.07),transparent 20%),linear-gradient(180deg,#04111d 0%,#061522 53%,#040d17 100%)!important}
html body:after{opacity:.12!important;background-size:72px 72px!important}
html .site-header{background:rgba(2,11,20,.91)!important;border-bottom:1px solid rgba(116,184,231,.14)!important;box-shadow:0 12px 35px rgba(0,0,0,.24)!important}
html .header-inner{min-height:70px!important}
html .nav{font-size:10px!important;letter-spacing:.075em!important;font-weight:900!important}
html .nav a{border-radius:0!important;padding:11px 10px!important;color:#91a3b6!important}
html .nav a:hover{color:#fff!important;background:transparent!important}
html .nav a.concept-home{color:#fff!important}
html .nav a.concept-home:after{height:3px!important;background:var(--him-red)!important;bottom:0!important}

html .hero.wrap{width:100%!important;max-width:none!important;min-height:720px!important;margin:0!important;padding:70px max(18px,calc((100vw - 1280px)/2)) 48px!important;overflow:hidden!important;isolation:isolate!important;background:linear-gradient(90deg,rgba(2,13,23,.99) 0%,rgba(3,16,28,.94) 34%,rgba(4,18,31,.63) 55%,rgba(4,17,29,.16) 100%)!important;border-bottom:1px solid rgba(112,180,226,.10)}
html .hero.wrap:before{content:""!important;position:absolute!important;inset:0!important;width:auto!important;height:auto!important;aspect-ratio:auto!important;border:0!important;border-radius:0!important;box-shadow:none!important;z-index:-5!important;background:
radial-gradient(circle at 52% 10%,rgba(255,255,255,.90) 0 2px,rgba(139,208,255,.46) 3px,transparent 18px),
radial-gradient(circle at 57% 9%,rgba(255,255,255,.78) 0 2px,rgba(139,208,255,.35) 3px,transparent 17px),
radial-gradient(circle at 62% 11%,rgba(255,255,255,.70) 0 2px,rgba(139,208,255,.30) 3px,transparent 16px),
linear-gradient(164deg,transparent 0 28%,rgba(43,137,207,.10) 28.2% 28.5%,transparent 28.8% 100%),
linear-gradient(174deg,transparent 0 37%,rgba(240,31,45,.22) 37.2% 37.5%,transparent 37.8% 100%),
radial-gradient(ellipse at 72% 55%,rgba(19,72,108,.46),transparent 48%),
linear-gradient(180deg,#061727 0%,#061727 49%,#082138 51%,#071828 70%,#04111d 100%)!important}
html .hero.wrap:after{content:""!important;position:absolute!important;inset:auto -4% -18% 42%!important;width:74%!important;height:72%!important;z-index:-3!important;pointer-events:none!important;background:
repeating-linear-gradient(168deg,rgba(255,255,255,.045) 0 1px,transparent 1px 22px),
radial-gradient(ellipse at 52% 34%,rgba(173,226,255,.24),transparent 1.5%,transparent 24%),
linear-gradient(175deg,rgba(148,211,244,.12),rgba(25,75,102,.05) 18%,rgba(4,18,31,.02) 54%,rgba(130,200,235,.15) 100%)!important;border-radius:48% 0 0 0!important;transform:perspective(900px) rotateX(55deg) rotateZ(-4deg)!important;transform-origin:50% 100%!important;filter:drop-shadow(0 -24px 45px rgba(70,155,210,.08))!important}
html .hero>div:first-child{position:relative!important;z-index:8!important;max-width:660px!important}
html .eyebrow{border-radius:3px!important;border-color:rgba(126,190,255,.22)!important;background:rgba(5,23,38,.72)!important;color:#cbe5f7!important;padding:8px 11px!important;font-size:10px!important;letter-spacing:.125em!important;box-shadow:0 8px 22px rgba(0,0,0,.12)}
html .eyebrow:before{background:var(--him-red)!important;box-shadow:0 0 16px rgba(240,31,45,.72)!important}
html #heroTitle{margin:22px 0 16px!important;max-width:680px!important;font-size:clamp(66px,7.5vw,108px)!important;line-height:.84!important;letter-spacing:-.072em!important;font-weight:1000!important;text-transform:uppercase!important;text-shadow:0 13px 35px rgba(0,0,0,.24)}
html #heroTitle .ice-u16{display:inline-block;color:var(--him-red)!important;text-shadow:0 10px 26px rgba(240,31,45,.14)}
html .hero-subtitle{max-width:610px!important;font-size:14px!important;line-height:1.7!important;color:#b6c5d4!important}
html .hero-actions{margin-top:26px!important;gap:10px!important}
html .hero-actions .btn{min-height:52px!important;padding:0 19px!important;border-radius:4px!important;font-size:10px!important;letter-spacing:.045em!important;position:relative!important;overflow:hidden!important}
html .hero-actions .btn:after{content:"→";font-size:16px;line-height:1;margin-left:5px;transition:transform .18s ease}
html .hero-actions .btn:hover:after{transform:translateX(3px)}
html .hero-actions .btn.primary{background:linear-gradient(135deg,#f21d2d,#d91625)!important;border-color:#f21d2d!important;box-shadow:0 14px 34px rgba(239,30,44,.24)!important}
html .hero-actions .btn.primary:before{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 0 38%,rgba(255,255,255,.18) 49%,transparent 60%);transform:translateX(-140%);transition:.45s ease}
html .hero-actions .btn.primary:hover:before{transform:translateX(140%)}
html .hero-actions .btn.secondary{background:rgba(2,13,23,.55)!important;border-color:rgba(173,212,240,.34)!important;color:#f0f5fa!important}
html .hero-controls{margin-top:15px!important}
html .hero-controls .filter{min-height:48px!important;background-color:rgba(2,17,29,.78)!important;border-color:rgba(122,186,229,.17)!important;color:#eaf4fb!important}
html .hero-stats{display:flex!important;gap:0!important;max-width:710px!important;margin-top:28px!important;border-top:1px solid rgba(134,195,236,.17)!important;border-bottom:1px solid rgba(134,195,236,.17)!important;background:rgba(3,15,25,.20)!important;backdrop-filter:blur(4px)}
html .hero-stats .stat{flex:1!important;padding:15px 18px!important;border:0!important;border-right:1px solid rgba(134,195,236,.13)!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;backdrop-filter:none!important}
html .hero-stats .stat:last-child{border-right:0!important}
html .hero-stats .stat strong{font-size:25px!important;color:#fff!important}
html .hero-stats .stat span{font-size:8px!important;letter-spacing:.12em!important;color:#8da1b5!important}
html #status{margin-top:14px!important;color:#8296aa!important;font-size:8px!important;letter-spacing:.10em!important}

.ice-motion-scene{position:absolute;inset:0;z-index:1;pointer-events:none;overflow:hidden}
.ice-arena-lights{position:absolute;left:44%;right:5%;top:0;height:31%;opacity:.85;background:radial-gradient(circle at 14% 10%,#fff 0 2px,rgba(126,199,242,.46) 3px,transparent 18px),radial-gradient(circle at 21% 9%,#fff 0 2px,rgba(126,199,242,.38) 3px,transparent 17px),radial-gradient(circle at 28% 11%,#fff 0 2px,rgba(126,199,242,.34) 3px,transparent 18px),radial-gradient(circle at 35% 10%,#fff 0 2px,rgba(126,199,242,.28) 3px,transparent 17px);filter:blur(.2px)}
.ice-boards{position:absolute;left:39%;right:-2%;top:49%;height:70px;border-top:1px solid rgba(168,218,247,.24);border-bottom:1px solid rgba(168,218,247,.12);background:linear-gradient(180deg,rgba(8,28,45,.72),rgba(7,23,38,.88));transform:skewY(-1.3deg);box-shadow:0 12px 35px rgba(0,0,0,.22)}
.ice-boards:before{content:"ХОККЕЙ  ОБЪЕДИНЯЕТ";position:absolute;left:23%;top:20px;font-size:15px;letter-spacing:.34em;font-weight:900;color:rgba(205,230,246,.30)}
.ice-boards:after{content:"";position:absolute;left:0;right:0;bottom:5px;height:3px;background:linear-gradient(90deg,rgba(240,31,45,.34),rgba(240,31,45,.72) 30%,rgba(35,135,217,.55) 30% 70%,transparent 70%)}
.ice-rink-circle{position:absolute;right:7%;top:13%;width:min(43vw,610px);aspect-ratio:1;border-radius:50%;border:1px solid rgba(64,151,217,.27);box-shadow:inset 0 0 0 94px rgba(35,135,217,.022),inset 0 0 0 190px rgba(35,135,217,.012),0 0 0 1px rgba(35,135,217,.025)}
.ice-rink-circle:before,.ice-rink-circle:after{content:"";position:absolute;left:50%;top:0;bottom:0;width:1px;background:rgba(115,179,224,.16);transform-origin:center}
.ice-rink-circle:before{transform:rotate(42deg)}.ice-rink-circle:after{transform:rotate(-33deg)}
.ice-hero-number{position:absolute;right:11%;top:4%;font-size:clamp(210px,24vw,360px);line-height:.82;font-weight:1000;letter-spacing:-.085em;color:rgba(177,207,229,.15);text-shadow:0 0 80px rgba(55,139,202,.10)}
.ice-slogan{position:absolute;right:5.2%;top:18%;width:110px;color:#8da4b8;font-size:10px;line-height:1.8;letter-spacing:.32em;text-transform:uppercase;font-weight:700}
.ice-slogan:after{content:"";display:block;width:38px;height:2px;margin-top:10px;background:var(--him-red)}
.ice-red-track,.ice-blue-track{position:absolute;left:35%;width:78%;height:2px;transform-origin:left center;filter:drop-shadow(0 0 7px currentColor)}
.ice-red-track{top:32%;color:rgba(240,31,45,.40);background:linear-gradient(90deg,transparent,rgba(240,31,45,.54),transparent);transform:rotate(9deg)}
.ice-blue-track{top:22%;color:rgba(35,135,217,.30);background:linear-gradient(90deg,transparent,rgba(35,135,217,.42),transparent);transform:rotate(-8deg)}
.ice-stick{position:absolute;right:-86px;bottom:80px;width:520px;height:440px;transform:rotate(-9deg);transform-origin:100% 100%;filter:drop-shadow(0 28px 24px rgba(0,0,0,.50))}
.ice-stick-shaft{position:absolute;right:44px;top:-70px;width:38px;height:425px;border-radius:14px;background:repeating-linear-gradient(90deg,#10171d 0 7px,#273039 7px 10px,#0a0e13 10px 17px);box-shadow:inset 8px 0 12px rgba(255,255,255,.04),inset -9px 0 14px rgba(0,0,0,.7);transform:rotate(12deg)}
.ice-stick-blade{position:absolute;right:39px;bottom:22px;width:286px;height:88px;border-radius:68% 24% 22% 48%;background:repeating-linear-gradient(86deg,#11181e 0 11px,#2b343b 11px 14px,#0b1015 14px 25px);box-shadow:inset 0 12px 18px rgba(255,255,255,.05),inset 0 -17px 22px rgba(0,0,0,.63);transform:rotate(7deg);transform-origin:right center}
.ice-stick-blade:after{content:"";position:absolute;inset:4px;border-radius:inherit;border:1px solid rgba(183,220,242,.10)}
.ice-puck{position:absolute;right:20%;bottom:95px;width:214px;height:70px;border-radius:50%;background:linear-gradient(176deg,#3e4952 0%,#141a20 38%,#020406 83%);transform:rotate(-6deg);box-shadow:inset 0 11px 15px rgba(255,255,255,.09),inset 0 -14px 22px rgba(0,0,0,.72),0 30px 35px rgba(0,0,0,.46);animation:icePuckFloat 4.6s ease-in-out infinite}
.ice-puck:before{content:"";position:absolute;left:7%;right:7%;top:4%;height:54%;border-radius:50%;background:radial-gradient(ellipse at 33% 22%,rgba(255,255,255,.22),rgba(255,255,255,.035) 34%,rgba(0,0,0,.38) 76%);border:1px solid rgba(255,255,255,.08)}
.ice-puck:after{content:"";position:absolute;left:-135px;top:25px;width:160px;height:24px;background:linear-gradient(90deg,transparent,rgba(170,225,255,.20),rgba(255,255,255,.05));filter:blur(6px);transform:rotate(4deg)}
@keyframes icePuckFloat{0%,100%{transform:rotate(-6deg) translateY(0)}50%{transform:rotate(-5deg) translateY(-7px)}}
.ice-spray{position:absolute;right:3%;bottom:54px;width:44%;height:300px;overflow:visible;filter:drop-shadow(0 0 10px rgba(173,225,255,.16))}
.ice-spray:before{content:"";position:absolute;inset:20% 0 0 14%;background:radial-gradient(ellipse at 62% 78%,rgba(205,239,255,.42),rgba(113,192,233,.12) 32%,transparent 64%);transform:rotate(-8deg);filter:blur(1px)}
.ice-spray i{position:absolute;width:var(--s);height:var(--s);border-radius:50%;left:var(--x);top:var(--y);background:rgba(224,246,255,var(--a));box-shadow:0 0 9px rgba(142,210,246,.35);transform:rotate(var(--r)) translateX(var(--d));animation:iceParticle var(--t) ease-in-out infinite alternate}
@keyframes iceParticle{to{transform:rotate(calc(var(--r) + 14deg)) translateX(calc(var(--d) + 10px)) translateY(-7px);opacity:.35}}
.ice-motion-glow{position:absolute;right:12%;bottom:4%;width:52%;height:30%;background:radial-gradient(ellipse at 60% 70%,rgba(140,213,249,.18),transparent 58%);filter:blur(15px)}

html[data-theme="light"] .hero.wrap{background:linear-gradient(90deg,rgba(238,246,251,.99),rgba(235,244,250,.91) 43%,rgba(218,236,247,.56) 69%,rgba(224,240,249,.30))!important;color:#102139!important}
html[data-theme="light"] #heroTitle{color:#102139!important;text-shadow:none!important}
html[data-theme="light"] .hero-subtitle{color:#5d6f82!important}
html[data-theme="light"] .ice-boards{background:rgba(224,238,247,.78)}
html[data-theme="light"] .ice-boards:before{color:rgba(42,85,118,.25)}
html[data-theme="light"] .ice-hero-number{color:rgba(47,93,127,.11)}
html[data-theme="light"] .hero-stats{background:rgba(255,255,255,.18)!important}
html[data-theme="light"] .hero-stats .stat strong{color:#102139!important}

@media(max-width:1050px){
  html .hero.wrap{min-height:680px!important;padding-top:58px!important}
  html .hero>div:first-child{max-width:590px!important}
  .ice-slogan{display:none}.ice-stick{right:-150px;opacity:.82}.ice-puck{right:9%;bottom:92px;width:178px;height:59px}.ice-hero-number{right:3%;opacity:.8}.ice-rink-circle{right:-8%}
}
@media(max-width:760px){
  html .hero.wrap{min-height:670px!important;padding:42px 12px 36px!important;background:linear-gradient(180deg,rgba(3,16,27,.98),rgba(4,18,31,.86) 62%,rgba(4,18,31,.58))!important}
  html .hero>div:first-child{max-width:100%!important}
  html #heroTitle{font-size:clamp(52px,17vw,78px)!important;max-width:94%!important}
  html .hero-subtitle{max-width:88%!important;font-size:13px!important}
  html .hero-actions .btn{min-height:48px!important;padding:0 14px!important}
  html .hero-stats{width:100%!important;display:grid!important;grid-template-columns:1fr 1fr!important}
  html .hero-stats .stat:nth-child(2){border-right:0!important}
  html .hero-stats .stat:nth-child(-n+2){border-bottom:1px solid rgba(134,195,236,.12)!important}
  .ice-boards{left:0;right:-20%;top:57%;opacity:.55}.ice-boards:before{display:none}.ice-rink-circle{right:-52%;top:32%;width:540px;opacity:.7}.ice-hero-number{right:-13%;top:30%;font-size:210px;color:rgba(177,207,229,.10)}.ice-stick{right:-235px;bottom:-30px;opacity:.55;transform:scale(.76) rotate(-9deg)}.ice-puck{right:1%;bottom:40px;width:138px;height:45px;opacity:.72}.ice-spray{right:-20%;bottom:5px;width:78%;opacity:.60}.ice-red-track,.ice-blue-track{left:15%;width:100%}.ice-arena-lights{left:20%;right:0;opacity:.45}
}
@media(max-width:480px){
  html .hero.wrap{min-height:640px!important}
  html #heroTitle{font-size:50px!important}
  html .hero-subtitle{max-width:100%!important}
  html .hero-actions{display:grid!important;grid-template-columns:1fr!important;width:min(100%,330px)!important}
  html .hero-actions .btn{width:100%!important}
  html .hero-controls{display:grid!important;grid-template-columns:minmax(0,1fr) 110px!important;width:100%!important}
  html .hero-controls .filter{width:100%!important;min-width:0!important}
}
@media(prefers-reduced-motion:reduce){.ice-puck,.ice-spray i{animation:none!important}}
`;
document.head.appendChild(style);

const hero=document.querySelector('.hero');
if(!hero)return;
hero.querySelectorAll('.concept-hero-art').forEach(el=>el.remove());

if(!hero.querySelector('.ice-motion-scene')){
  const scene=document.createElement('div');
  scene.className='ice-motion-scene';
  scene.setAttribute('aria-hidden','true');
  scene.innerHTML=`
    <div class="ice-arena-lights"></div>
    <div class="ice-blue-track"></div><div class="ice-red-track"></div>
    <div class="ice-boards"></div>
    <div class="ice-rink-circle"></div>
    <div class="ice-hero-number">01</div>
    <div class="ice-slogan">Большие<br>игроки<br>начинаются<br>здесь</div>
    <div class="ice-motion-glow"></div>
    <div class="ice-stick"><div class="ice-stick-shaft"></div><div class="ice-stick-blade"></div></div>
    <div class="ice-puck"></div>
    <div class="ice-spray"></div>`;
  hero.appendChild(scene);
  const spray=scene.querySelector('.ice-spray');
  const rnd=n=>{const x=Math.sin(n*999.17)*43758.5453;return x-Math.floor(x)};
  for(let i=0;i<44;i++){
    const p=document.createElement('i');
    p.style.setProperty('--x',(14+rnd(i+1)*84).toFixed(1)+'%');
    p.style.setProperty('--y',(7+rnd(i+11)*83).toFixed(1)+'%');
    p.style.setProperty('--s',(1.2+rnd(i+21)*4.2).toFixed(1)+'px');
    p.style.setProperty('--a',(0.28+rnd(i+31)*0.62).toFixed(2));
    p.style.setProperty('--r',Math.round(-35+rnd(i+41)*70)+'deg');
    p.style.setProperty('--d',Math.round(-18+rnd(i+51)*56)+'px');
    p.style.setProperty('--t',(1.8+rnd(i+61)*2.8).toFixed(2)+'s');
    spray.appendChild(p);
  }
}

function styleTitle(){
  const h=document.getElementById('heroTitle');if(!h)return;
  const raw=h.textContent.replace(/\s+/g,' ').trim();
  if(!/U16/i.test(raw))return;
  if(h.querySelector('.ice-u16'))return;
  h.innerHTML='КУБОК<br>РОССИИ<br><span class="ice-u16">U16</span>';
}
styleTitle();
new MutationObserver(()=>styleTitle()).observe(document.getElementById('heroTitle'),{childList:true,subtree:true,characterData:true});

const nav=document.querySelector('.nav');
if(nav&&!nav.querySelector('a[href="#top"]')){
  const home=document.createElement('a');home.href='#top';home.textContent='Главная';home.className='concept-home';nav.prepend(home);
}
if(nav&&!nav.querySelector('a[href="/news.html"]')){
  const news=document.createElement('a');news.href='/news.html';news.textContent='Новости';nav.appendChild(news);
}
const reg=nav?.querySelector('a[href="#rules"]');if(reg)reg.href='/regulation.html';

})();
