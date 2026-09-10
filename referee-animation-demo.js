(()=>{
'use strict';
const hero=document.querySelector('.hero.wrap');
const gridWrap=document.querySelector('#goalGrid')?.closest('section.wrap');
if(!hero||!gridWrap)return;

const mainRefs=['Недопекин Александр','Тюрин Михаил'];
const lineRefs=['Винокуров Кирилл','Набоков Роман'];

const style=document.createElement('style');
style.id='referee-animation-demo-style';
style.textContent=`
.ref-demo-section{width:min(980px,100%);margin:4px auto 26px}.ref-demo-head{display:flex;align-items:end;justify-content:space-between;gap:14px;margin:0 0 10px}.ref-demo-head h2{margin:0;font-size:22px;letter-spacing:-.03em}.ref-demo-head p{margin:0;color:#7f93a8;font-size:10px}.ref-demo-card{position:relative;display:grid;grid-template-columns:92px minmax(0,1fr);gap:14px;align-items:stretch;min-height:138px;padding:0;border:1px solid rgba(139,190,226,.18);border-radius:14px;overflow:hidden;background:repeating-linear-gradient(90deg,#f2f2ef 0 14px,#111 14px 28px);cursor:pointer;box-shadow:0 18px 38px rgba(0,0,0,.18);touch-action:manipulation}.ref-demo-time{display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(5,10,16,.93);border-right:1px solid rgba(255,255,255,.08)}.ref-demo-time strong{font-size:22px;font-weight:950;letter-spacing:-.035em}.ref-demo-time span{margin-top:7px;color:#8296aa;font-size:8px;text-transform:uppercase;letter-spacing:.09em}.ref-demo-body{margin:8px 8px 8px 0;padding:14px 16px;border-radius:9px;background:rgba(7,17,31,.97);display:grid;gap:12px;align-content:center;position:relative;z-index:1}.ref-demo-row{display:flex;align-items:center;gap:12px;min-width:0;flex-wrap:wrap}.ref-demo-tag{flex:0 0 auto;padding:6px 9px;border-radius:4px;font-size:9px;font-weight:1000;letter-spacing:.09em;text-transform:uppercase;white-space:nowrap}.ref-demo-tag.main{background:#e87525;color:#fff}.ref-demo-tag.lines{border:1.5px solid rgba(255,255,255,.9);color:#fff;background:transparent}.ref-demo-names{font-size:13px;font-weight:850;line-height:1.35;color:#eef3f8}.ref-demo-note{position:absolute;right:13px;bottom:10px;color:#6f8399;font-size:8px;letter-spacing:.05em;text-transform:uppercase}

.ref-anim-layer{position:absolute;inset:0;z-index:30;overflow:hidden;background:#091522;color:#fff;pointer-events:none;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-rows:42px 1fr;opacity:0}.ref-anim-layer:before,.ref-anim-layer:after{content:"";position:absolute;top:0;bottom:0;width:62px;z-index:1;background:repeating-linear-gradient(90deg,#f1f1ee 0 11px,#101010 11px 22px);opacity:.96}.ref-anim-layer:before{left:0;transform:translateX(-105%)}.ref-anim-layer:after{right:0;transform:translateX(105%)}.ref-anim-title{grid-column:1/3;align-self:stretch;display:grid;place-items:center;margin:0 62px;background:linear-gradient(90deg,#dfe4e8,#f7f8f9 48%,#d9dfe4);color:#07111f;font-size:20px;font-weight:1000;letter-spacing:.025em;text-transform:uppercase;clip-path:inset(0 50% 0 50%);position:relative;z-index:3}.ref-anim-col{position:relative;z-index:3;display:grid;grid-template-rows:30px 1fr 1fr;align-content:center;gap:6px;padding:10px 10px 10px 70px;min-width:0}.ref-anim-col.right{padding-left:10px;padding-right:70px}.ref-anim-label{display:flex;align-items:center;padding:0 10px;font-size:9px;font-weight:1000;letter-spacing:.06em;text-transform:uppercase;overflow:hidden;white-space:nowrap}.ref-anim-col.left .ref-anim-label{background:#e87525;color:#fff;transform:translateX(-120%)}.ref-anim-col.right .ref-anim-label{justify-content:flex-end;border:1px solid rgba(255,255,255,.75);background:#0b1827;color:#fff;transform:translateX(120%)}.ref-anim-person{display:flex;align-items:center;min-width:0;height:32px;background:#f1f3f4;color:#08111c;font-size:12px;font-weight:950;white-space:nowrap;overflow:hidden}.ref-anim-col.left .ref-anim-person{padding:0 12px;border-left:5px solid #e87525;transform:translateX(-125%)}.ref-anim-col.right .ref-anim-person{justify-content:flex-end;padding:0 12px;border-right:5px solid #4a5969;transform:translateX(125%)}

.ref-anim-playing .ref-anim-layer{animation:refLayerLife 5.7s linear both}.ref-anim-playing .ref-anim-layer:before{animation:refStripeL 5.7s cubic-bezier(.2,.8,.2,1) both}.ref-anim-playing .ref-anim-layer:after{animation:refStripeR 5.7s cubic-bezier(.2,.8,.2,1) both}.ref-anim-playing .ref-anim-title{animation:refTitle 5.7s cubic-bezier(.2,.8,.2,1) both}.ref-anim-playing .ref-anim-col.left .ref-anim-label{animation:refInL 5.7s cubic-bezier(.2,.8,.2,1) both}.ref-anim-playing .ref-anim-col.right .ref-anim-label{animation:refInR 5.7s cubic-bezier(.2,.8,.2,1) both}.ref-anim-playing .ref-anim-col.left .ref-anim-person:nth-child(2){animation:refRowL1 5.7s cubic-bezier(.2,.8,.2,1) both}.ref-anim-playing .ref-anim-col.left .ref-anim-person:nth-child(3){animation:refRowL2 5.7s cubic-bezier(.2,.8,.2,1) both}.ref-anim-playing .ref-anim-col.right .ref-anim-person:nth-child(2){animation:refRowR1 5.7s cubic-bezier(.2,.8,.2,1) both}.ref-anim-playing .ref-anim-col.right .ref-anim-person:nth-child(3){animation:refRowR2 5.7s cubic-bezier(.2,.8,.2,1) both}.ref-anim-playing>.ref-demo-time,.ref-anim-playing>.ref-demo-body{animation:refUnder 5.7s linear both}
@keyframes refLayerLife{0%,2%{opacity:0}5%,84%{opacity:1}100%{opacity:0}}
@keyframes refStripeL{0%,5%{transform:translateX(-105%)}18%,84%{transform:translateX(0)}100%{transform:translateX(-105%)}}
@keyframes refStripeR{0%,5%{transform:translateX(105%)}18%,84%{transform:translateX(0)}100%{transform:translateX(105%)}}
@keyframes refTitle{0%,8%{clip-path:inset(0 50% 0 50%)}22%,84%{clip-path:inset(0 0 0 0)}100%{clip-path:inset(0 50% 0 50%)}}
@keyframes refInL{0%,18%{transform:translateX(-120%)}31%,84%{transform:translateX(0)}100%{transform:translateX(-120%)}}
@keyframes refInR{0%,18%{transform:translateX(120%)}31%,84%{transform:translateX(0)}100%{transform:translateX(120%)}}
@keyframes refRowL1{0%,24%{transform:translateX(-125%)}37%,84%{transform:translateX(0)}100%{transform:translateX(-125%)}}
@keyframes refRowL2{0%,31%{transform:translateX(-125%)}44%,84%{transform:translateX(0)}100%{transform:translateX(-125%)}}
@keyframes refRowR1{0%,24%{transform:translateX(125%)}37%,84%{transform:translateX(0)}100%{transform:translateX(125%)}}
@keyframes refRowR2{0%,31%{transform:translateX(125%)}44%,84%{transform:translateX(0)}100%{transform:translateX(125%)}}
@keyframes refUnder{0%,84%{opacity:0}91%,100%{opacity:1}}

@media(max-width:700px){.ref-demo-head{align-items:flex-start;flex-direction:column}.ref-demo-card{grid-template-columns:62px minmax(0,1fr);min-height:142px}.ref-demo-time strong{font-size:17px}.ref-demo-body{padding:11px 10px;gap:9px}.ref-demo-row{gap:7px}.ref-demo-tag{font-size:7px;padding:5px 7px}.ref-demo-names{font-size:10px}.ref-demo-note{display:none}.ref-anim-layer{grid-template-rows:36px 1fr}.ref-anim-layer:before,.ref-anim-layer:after{width:32px}.ref-anim-title{margin:0 32px;font-size:13px}.ref-anim-col{grid-template-rows:26px 1fr 1fr;gap:5px;padding:8px 4px 8px 36px}.ref-anim-col.right{padding-left:4px;padding-right:36px}.ref-anim-label{padding:0 5px;font-size:6.5px;letter-spacing:.025em}.ref-anim-person{height:28px;font-size:8.5px}.ref-anim-col.left .ref-anim-person,.ref-anim-col.right .ref-anim-person{padding:0 6px}}
@media(prefers-reduced-motion:reduce){.ref-anim-playing *{animation-duration:.01ms!important}}
`;
document.head.appendChild(style);

const section=document.createElement('section');
section.className='ref-demo-section';
section.innerHTML=`
  <div class="ref-demo-head"><div><div class="eyebrow">Тест судейской графики</div><h2>Анимация судейской бригады</h2></div><p>Нажми на плашку, чтобы проиграть ещё раз</p></div>
  <article class="ref-demo-card" id="refDemoCard" tabindex="0" role="button" aria-label="Проиграть анимацию судейской бригады">
    <div class="ref-demo-time"><strong>00:00</strong><span>Начало матча</span></div>
    <div class="ref-demo-body">
      <div class="ref-demo-row"><span class="ref-demo-tag main">Главные судьи</span><span class="ref-demo-names">${mainRefs.join(' · ')}</span></div>
      <div class="ref-demo-row"><span class="ref-demo-tag lines">Линейные судьи</span><span class="ref-demo-names">${lineRefs.join(' · ')}</span></div>
      <span class="ref-demo-note">Нажми для повтора</span>
    </div>
    <div class="ref-anim-layer" aria-hidden="true">
      <div class="ref-anim-title">Судейская бригада</div>
      <div class="ref-anim-col left"><div class="ref-anim-label">Главные судьи</div><div class="ref-anim-person">${mainRefs[0]}</div><div class="ref-anim-person">${mainRefs[1]}</div></div>
      <div class="ref-anim-col right"><div class="ref-anim-label">Линейные судьи</div><div class="ref-anim-person">${lineRefs[0]}</div><div class="ref-anim-person">${lineRefs[1]}</div></div>
    </div>
  </article>`;
gridWrap.parentNode.insertBefore(section,gridWrap);

const card=section.querySelector('#refDemoCard');
let timer=0;
function play(){clearTimeout(timer);card.classList.remove('ref-anim-playing');void card.offsetWidth;card.classList.add('ref-anim-playing');timer=setTimeout(()=>card.classList.remove('ref-anim-playing'),5850)}
card.addEventListener('click',play);
card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();play()}});
setTimeout(play,450);
})();
