(()=>{
'use strict';
const RED='#e31f2b';
const VARIANTS={
 '2':{label:'2′',final:'2 мин.',reasons:['Блокировка','Подножка','Задержка соперника','Задержка клюшкой','Удар клюшкой','Высоко поднятая клюшка','Толчок соперника на борт','Атака игрока без шайбы','Задержка игры','Нарушение численного состава']},
 '5+20':{label:'5+20′',final:'5+20 мин.',reasons:['Толчок соперника на борт','Атака в область головы и шеи','Колющий удар','Удар соперника клюшкой','Грубость','Атака сзади']},
 '2+2':{label:'2+2′',final:'2+2 мин.',reasons:['Высоко поднятая клюшка','Грубость','Удар клюшкой','Неспортивное поведение']}
};
let current='2',reasonIndex=0;
const timers=new WeakMap();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const whistle=`<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="22" cy="40" r="11" fill="none" stroke="currentColor" stroke-width="5"/><path d="M31 34h15c5 0 9 4 9 9s-4 9-9 9H31M27 30l9-16 8 4-7 13M43 16l7-7" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
function cfg(){return VARIANTS[current]}
function reason(){const a=cfg().reasons;return a[reasonIndex%a.length]}
function reasonClass(s){return s.length>31?'very-long':s.length>20?'long':''}
function isPenalty(card){
 if(!card)return false;
 if(card.classList.contains('penalty'))return true;
 const label=(card.querySelector('.etype,.event-label')?.textContent||'').toLowerCase();
 const text=(card.textContent||'').toLowerCase();
 return label.includes('удален')||text.includes('удаление')||text.includes(' мин.');
}
function penaltyCards(){return [...document.querySelectorAll('.timeline>.event,.event-card')].filter(isPenalty)}
function logoFor(card){return card.querySelector('.event-team-logo,.event-logo')?.src||''}
function installCss(){
 if(document.getElementById('mhl-penalty-demo-css'))return;
 const s=document.createElement('style');s.id='mhl-penalty-demo-css';s.textContent=`
.mhl-penalty-demo{margin:0 0 12px;padding:11px;border:1px solid rgba(255,88,101,.28);border-radius:12px;background:linear-gradient(180deg,rgba(227,31,43,.11),rgba(5,18,30,.66));display:flex;align-items:center;gap:8px;flex-wrap:wrap}.mhl-penalty-demo b{margin-right:3px;font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:#ff8d96}.mpd-btn,.mpd-next,.mpd-play{appearance:none;border:1px solid rgba(255,255,255,.13);border-radius:8px;background:rgba(255,255,255,.035);color:#c2d0dd;padding:8px 10px;font:inherit;font-size:9px;font-weight:900;cursor:pointer}.mpd-btn.active,.mpd-play{background:${RED};border-color:${RED};color:#fff}.mpd-reason{min-width:210px;max-width:100%;border:1px solid rgba(255,255,255,.13);border-radius:8px;background:#0a1d30;color:#e8f1f8;padding:8px 28px 8px 10px;font:inherit;font-size:9px;font-weight:800}.mpd-hint{margin-left:auto;color:#8da1b5;font-size:9px}.mpd-count{color:#ff9aa2;font-size:9px;font-weight:900}.timeline>.event.penalty,.event-card.penalty{position:relative!important;overflow:hidden!important;cursor:pointer!important;touch-action:manipulation}.timeline>.event.penalty:after,.event-card.penalty:after{content:'ТАП = ТЕСТ';position:absolute;right:9px;bottom:6px;color:rgba(255,120,130,.58);font-size:7px;font-weight:950;letter-spacing:.1em}.mpd-whistle-mark{display:inline-grid;place-items:center;width:24px;height:24px;color:#ff5865;flex:0 0 24px;margin-right:7px;vertical-align:middle}.mpd-whistle-mark svg{width:24px;height:24px;display:block}.etype.mpd-labeled,.event-label.mpd-labeled{display:inline-flex!important;align-items:center!important;color:#ff7f89!important}
.penalty-demo-layer{position:absolute;inset:0;z-index:999;background:${RED};color:#fff;overflow:hidden;clip-path:inset(0 100% 0 0);pointer-events:none;will-change:clip-path,transform}.penalty-demo-inner{position:absolute;inset:0;display:grid;align-items:center;padding:0 30px}.penalty-demo-back{grid-template-columns:auto minmax(0,1fr);gap:22px;justify-content:center;background:${RED}}.penalty-demo-cover{position:absolute;inset:0;z-index:2;background:${RED};overflow:hidden;clip-path:inset(0 0 0 0)}.penalty-demo-front{grid-template-columns:68px minmax(0,1fr) 88px;gap:18px}.penalty-demo-whistle{width:50px;height:50px;display:grid;place-items:center;color:#fff}.penalty-demo-whistle svg{width:50px;height:50px;display:block}.penalty-demo-word{font-size:clamp(28px,4.7vw,55px);font-weight:1000;letter-spacing:-.045em;text-transform:uppercase;white-space:nowrap}.penalty-demo-logo{width:74px;height:74px;object-fit:contain;justify-self:end;filter:drop-shadow(0 10px 20px rgba(0,0,0,.22))}.penalty-demo-mins{font-size:clamp(43px,6vw,74px);line-height:.82;font-weight:1000;letter-spacing:-.06em;white-space:nowrap}.penalty-demo-reason{font-size:clamp(21px,3.5vw,43px);font-weight:1000;letter-spacing:-.04em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.penalty-demo-reason.long{font-size:clamp(18px,2.9vw,35px)}.penalty-demo-reason.very-long{font-size:clamp(15px,2.35vw,28px)}.penalty-demo-playing>:not(.penalty-demo-layer){animation:mpdUnder 5.8s linear both!important}.penalty-demo-playing .penalty-demo-layer{animation:mpdOuter 5.8s cubic-bezier(.65,0,.35,1) both!important}.penalty-demo-playing .penalty-demo-cover{animation:mpdReverse 5.8s cubic-bezier(.65,0,.35,1) both!important}@keyframes mpdUnder{0%,73%{opacity:0}74%,100%{opacity:1}}@keyframes mpdOuter{0%,4%{clip-path:inset(0 100% 0 0);transform:translateY(0)}24%,74%{clip-path:inset(0 0 0 0);transform:translateY(0)}100%{clip-path:inset(0 0 0 0);transform:translateY(-102%)}}@keyframes mpdReverse{0%,38%{clip-path:inset(0 0 0 0)}63%,100%{clip-path:inset(0 100% 0 0)}}
@media(max-width:760px){.mhl-penalty-demo{padding:9px;gap:6px}.mhl-penalty-demo b{width:100%}.mpd-hint{width:100%;margin-left:0}.mpd-reason{min-width:0;flex:1}.penalty-demo-inner{padding:0 13px}.penalty-demo-front{grid-template-columns:40px minmax(0,1fr) 50px;gap:7px}.penalty-demo-whistle,.penalty-demo-whistle svg{width:34px;height:34px}.penalty-demo-logo{width:46px;height:46px}.penalty-demo-word{font-size:clamp(19px,7.2vw,31px)}.penalty-demo-back{gap:9px}.penalty-demo-mins{font-size:32px}.penalty-demo-reason{font-size:clamp(16px,5.2vw,25px)}.penalty-demo-reason.long{font-size:clamp(14px,4.4vw,21px)}.penalty-demo-reason.very-long{font-size:clamp(12px,3.8vw,18px)}}`;
 document.head.appendChild(s);
}
function ensureIcon(card){
 card.classList.add('penalty');
 const label=card.querySelector('.etype,.event-label');if(!label)return;
 label.classList.add('mpd-labeled');
 if(label.querySelector('.mpd-whistle-mark'))return;
 const mark=document.createElement('span');mark.className='mpd-whistle-mark';mark.innerHTML=whistle;label.prepend(mark);
}
function toolbar(){
 const timeline=document.querySelector('.timeline');if(!timeline)return;
 let box=document.getElementById('mhlPenaltyDemo');
 if(!box){box=document.createElement('div');box.id='mhlPenaltyDemo';box.className='mhl-penalty-demo';timeline.parentNode.insertBefore(box,timeline)}
 box.innerHTML=`<b>Тест удаления</b>${Object.entries(VARIANTS).map(([k,v])=>`<button type="button" class="mpd-btn${k===current?' active':''}" data-mpd-variant="${k}">${v.label}</button>`).join('')}<select class="mpd-reason" aria-label="Причина удаления">${cfg().reasons.map((r,i)=>`<option value="${i}"${i===reasonIndex?' selected':''}>${esc(r)}</option>`).join('')}</select><button type="button" class="mpd-next">Следующая причина</button><button type="button" class="mpd-play">Проиграть на первом удалении</button><span class="mpd-count">Найдено удалений: ${penaltyCards().length}</span><span class="mpd-hint">Можно также нажать на любое удаление</span>`;
}
function buildLayer(card){
 card.querySelector('.penalty-demo-layer')?.remove();
 const r=reason(),logo=logoFor(card),c=cfg();
 const layer=document.createElement('div');layer.className='penalty-demo-layer';layer.setAttribute('aria-hidden','true');
 layer.innerHTML=`<div class="penalty-demo-inner penalty-demo-back"><div class="penalty-demo-mins">${c.label}</div><div class="penalty-demo-reason ${reasonClass(r)}">${esc(r)}</div></div><div class="penalty-demo-cover"><div class="penalty-demo-inner penalty-demo-front"><div class="penalty-demo-whistle">${whistle}</div><div class="penalty-demo-word">Удаление</div>${logo?`<img class="penalty-demo-logo" src="${esc(logo)}" alt="">`:'<span></span>'}</div></div>`;
 card.appendChild(layer);
 const p=card.querySelector('.eventperson p,.event-copy p,.event p');if(p){const team=card.querySelector('.event-team-name')?.textContent?.trim()||'';p.textContent=[c.final,r,team].filter(Boolean).join(' · ')}
}
function play(card){
 if(!card||!isPenalty(card))return;
 ensureIcon(card);
 clearTimeout(timers.get(card));
 card.classList.remove('penalty-demo-playing');card.querySelector('.penalty-demo-layer')?.remove();void card.offsetWidth;
 buildLayer(card);card.classList.add('penalty-demo-playing');
 timers.set(card,setTimeout(()=>{card.classList.remove('penalty-demo-playing');card.querySelector('.penalty-demo-layer')?.remove()},5950));
}
function enhance(){
 installCss();
 penaltyCards().forEach(ensureIcon);
 toolbar();
}
installCss();
let lastHtml='';
setInterval(()=>{enhance();const box=document.getElementById('mhlPenaltyDemo');if(box){const now=penaltyCards().length;const key=`${current}|${reasonIndex}|${now}`;if(key!==lastHtml){lastHtml=key;toolbar()}}},350);
const mo=new MutationObserver(()=>enhance());mo.observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('click',e=>{
 const vb=e.target.closest?.('[data-mpd-variant]');if(vb){current=vb.dataset.mpdVariant;reasonIndex=0;toolbar();return}
 if(e.target.closest?.('.mpd-next')){reasonIndex=(reasonIndex+1)%cfg().reasons.length;toolbar();return}
 if(e.target.closest?.('.mpd-play')){const card=penaltyCards()[0];if(card)play(card);return}
 const card=e.target.closest?.('.timeline>.event,.event-card');if(card&&isPenalty(card)){e.preventDefault();play(card)}
});
document.addEventListener('change',e=>{if(e.target.matches?.('.mpd-reason')){reasonIndex=Number(e.target.value)||0;toolbar()}});
document.addEventListener('keydown',e=>{const card=e.target.closest?.('.timeline>.event,.event-card');if(card&&isPenalty(card)&&(e.key==='Enter'||e.key===' ')){e.preventDefault();play(card)}});
enhance();
})();
