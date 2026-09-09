(()=>{
'use strict';
const isTest=/\/mhl-test\.html$/i.test(location.pathname);
const seen=new Set();
let initialized=false,scheduled=false,lastMainScore='',demoGoalShown=false;
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ё/gi,'е').replace(/[^a-zа-я0-9]+/gi,' ').trim().toLowerCase();
const svg=body=>`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${body}</svg>`;
const ICONS={
 goal:svg('<ellipse cx="12" cy="14.5" rx="7.8" ry="3.2" fill="currentColor" opacity=".28"/><path d="M4.2 12.4c.4-2 3.7-3.7 7.8-3.7s7.4 1.7 7.8 3.7v2.2c-.4 2-3.7 3.7-7.8 3.7s-7.4-1.7-7.8-3.7v-2.2Z" fill="none" stroke="currentColor" stroke-width="1.7"/>'),
 penalty:svg('<circle cx="8.2" cy="15.4" r="4.1" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M11.7 13.2h5.8c1.6 0 2.8 1.2 2.8 2.7s-1.2 2.7-2.8 2.7h-5.7M10.3 11.9l3-4.8 2 1.2-2.3 3.8M15.1 7.7l2.2-2.3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'),
 goalkeeper:svg('<path d="M6.2 7.2 12 4l5.8 3.2v5.1c0 3.8-2.4 6.4-5.8 7.7-3.4-1.3-5.8-3.9-5.8-7.7V7.2Z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8.3 9.1h7.4M8 12h8M9.1 14.9h5.8M10 9.1v5.8M14 9.1v5.8" stroke="currentColor" stroke-width="1.35"/>'),
 timeout:svg('<circle cx="12" cy="13" r="7" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 13V8.8M12 13l3.1 1.8M9 3.5h6M17.2 6.5l1.5-1.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'),
 event:svg('<circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="2" fill="currentColor"/>')
};
const TEAM_COLORS={
 'ска 1946':'#2367b1','сахалинские акулы':'#173b63','динамо москва':'#1b62ad','мах':'#2387d9','торпедо':'#1f74b5','локомотив':'#c92f38','авангард':'#df2e36','локомотив 2004':'#c92f38','крылья советов':'#2f6fb5','сибирь':'#2387c9','лада':'#215ea7','трактор':'#20242a','ак барс':'#18855a','спартак':'#c82433','динамо спб':'#2b6fb8','динамо джуниверс':'#315eaa','ска стрельна':'#2367b1','акм':'#b82f3b','цска':'#d32d38','армия ска':'#2367b1','нефтехимик':'#275aa8','северсталь':'#d9a51b','красная машина юниор':'#df2e36'
};
function getType(card){
 if(card.classList.contains('goal'))return'goal';
 if(card.classList.contains('penalty'))return'penalty';
 if(card.classList.contains('goalkeeper'))return'goalkeeper';
 const t=norm(card.querySelector('.event-label,.etype')?.textContent);
 if(t.includes('гол'))return'goal'; if(t.includes('удален'))return'penalty'; if(t.includes('вратар')||t.includes('пустые ворота'))return'goalkeeper'; if(t.includes('тайм'))return'timeout'; return'event';
}
function addIcon(card,type){
 const label=card.querySelector('.event-label,.etype'); if(!label||label.closest('.event-label-row'))return;
 const row=document.createElement('span'); row.className='event-label-row';
 const icon=document.createElement('span'); icon.className='event-type-icon'; icon.innerHTML=ICONS[type]||ICONS.event;
 label.parentNode.insertBefore(row,label); row.append(icon,label);
}
function mainTeams(){return [...document.querySelectorAll('.score-team')].map(x=>({name:x.querySelector('h1')?.textContent?.trim()||'',logo:x.querySelector('.score-logo img')?.src||''})).filter(x=>x.name)}
function mainTeamFor(card){const src=card.querySelector('.event-logo')?.src||'';return mainTeams().find(t=>src&&t.logo===src)||null}
function testTeamFor(card){
 const playerText=norm(card.querySelector('.eventperson strong,.event strong')?.textContent?.replace(/^№?\s*\d+\s*/,'')||''); if(!playerText)return null;
 for(const team of document.querySelectorAll('.rteam')){const players=[...team.querySelectorAll('.prow b')].map(x=>norm(x.textContent));if(players.some(p=>p&&(playerText.includes(p)||p.includes(playerText))))return{name:team.querySelector('.rhead b')?.textContent?.trim()||'',logo:team.querySelector('.rhead img')?.src||''}}
 return null;
}
function addTestLogo(card,team){if(!team?.logo||card.querySelector('.event-team-logo'))return;const img=document.createElement('img');img.className='event-team-logo';img.src=team.logo;img.alt=team.name?`Логотип ${team.name}`:'';card.querySelector('time')?.insertAdjacentElement('afterend',img)}
function addTeamName(card,team){if(!team?.name||card.querySelector('.event-team-name'))return;const host=card.querySelector('.event-copy,.eventperson>div'),title=host?.querySelector('strong');if(!host||!title)return;const el=document.createElement('span');el.className='event-team-name';el.textContent=team.name;title.insertAdjacentElement('afterend',el)}
function signature(card,type,team){return[type,card.querySelector('.event-time strong,time')?.textContent,card.querySelector('.event-copy strong,.eventperson strong')?.textContent,team?.name].map(norm).join('|')}
function teamColor(team){return TEAM_COLORS[norm(team?.name)]||'#2387d9'}
function inkFor(hex){const h=String(hex).replace('#','');if(h.length!==6)return'#fff';const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);return(.299*r+.587*g+.114*b)>175?'#07111f':'#fff'}
function buildGoalLayer(card,team){
 card.querySelector('.goal-celebration-layer')?.remove();
 const color=teamColor(team),ink=inkFor(color),logo=team?.logo||card.querySelector('.event-logo,.event-team-logo')?.src||'';
 card.style.setProperty('--goal-team-color',color); card.style.setProperty('--goal-team-ink',ink);
 const layer=document.createElement('div'); layer.className='goal-celebration-layer';
 layer.innerHTML=`<div class="goal-word goal-word-left">ГООООООООЛ!</div><div class="goal-logo-stage">${logo?`<img src="${logo}" alt="">`:''}</div><div class="goal-word goal-word-right">ГООООООООЛ!</div>`;
 card.appendChild(layer); return layer;
}
function runGoalCelebration(card,team,demo=false){
 if(card.classList.contains('goal-celebrating'))return;
 buildGoalLayer(card,team); card.classList.add('goal-celebrating'); if(demo)card.classList.add('goal-demo');
 setTimeout(()=>{card.classList.remove('goal-celebrating','goal-demo');card.querySelector('.goal-celebration-layer')?.remove()},2900);
}
function animateCard(card,type,sig,team){
 if(seen.has(sig))return; seen.add(sig); if(type!=='goal')return;
 if(initialized){runGoalCelebration(card,team,false)} else if(isTest&&!demoGoalShown){demoGoalShown=true;runGoalCelebration(card,team,true)}
}
function enhanceCards(){
 const cards=[...document.querySelectorAll('.event-card,.timeline>.event')];
 cards.forEach(card=>{const type=getType(card);card.dataset.eventType=type;addIcon(card,type);const team=isTest?testTeamFor(card):mainTeamFor(card);if(isTest)addTestLogo(card,team);addTeamName(card,team);animateCard(card,type,signature(card,type,team),team)});
 if(cards.length&&!initialized)initialized=true;
}
function scoreAnimation(){const score=document.querySelector('.main-score,.main-score-restored');if(!score)return;const value=score.textContent.trim();if(lastMainScore&&value&&value!==lastMainScore){score.classList.remove('score-bump');void score.offsetWidth;score.classList.add('score-bump')}if(value)lastMainScore=value}
function enhance(){scheduled=false;enhanceCards();scoreAnimation()}
function queue(){if(scheduled)return;scheduled=true;requestAnimationFrame(enhance)}
function injectCss(){
 if(document.getElementById('match-event-ui-css'))return; const s=document.createElement('style');s.id='match-event-ui-css';s.textContent=`
 .timeline{gap:12px!important}.event-card,.timeline>.event{position:relative;min-height:112px!important;border-radius:14px!important;padding:18px 20px!important;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease;overflow:hidden}.event-card:hover,.timeline>.event:hover{transform:translateY(-2px);border-color:rgba(150,190,225,.28)!important;box-shadow:0 14px 32px rgba(0,0,0,.18)}
 .event-card{grid-template-columns:92px 58px minmax(0,1fr) auto!important;gap:16px!important}.timeline>.event{grid-template-columns:92px 58px minmax(0,1fr)!important;gap:16px!important}.event-time strong,.timeline>.event time{font-size:22px!important;line-height:1;font-weight:950!important;letter-spacing:-.03em}.event-time span,.timeline>.event time small{margin-top:7px!important;font-size:9px!important;font-weight:800;color:#7f93aa!important;text-transform:uppercase}.event-logo,.event-team-logo{width:52px!important;height:52px!important;object-fit:contain;align-self:center;filter:drop-shadow(0 8px 14px rgba(0,0,0,.2))}.event-main,.eventperson{gap:14px!important}.event-photo,.eventperson>img{width:62px!important;height:62px!important;flex:0 0 62px;border-radius:50%!important;object-fit:cover;border:1px solid rgba(255,255,255,.10);background:#11263e}.event-label-row{display:flex;align-items:center;gap:7px;margin-bottom:5px}.event-type-icon{width:22px;height:22px;display:inline-grid;place-items:center;flex:0 0 22px}.event-type-icon svg{width:100%;height:100%;display:block}[data-event-type=goal] .event-type-icon{color:#65d59e}[data-event-type=penalty] .event-type-icon{color:#ff5865}[data-event-type=goalkeeper] .event-type-icon,[data-event-type=timeout] .event-type-icon{color:#62b2ff}.event-label,.etype{font-size:10px!important;font-weight:950!important;letter-spacing:.11em!important}.event-copy strong,.eventperson strong{font-size:17px!important;line-height:1.18!important;margin-top:0!important}.event-team-name{display:block;margin-top:5px;color:#c4d3e2;font-size:10px;font-weight:850}.event-copy p,.eventperson p{margin-top:6px!important;font-size:11px!important;line-height:1.5!important;color:#96a9bd!important}.event-score{font-size:28px!important;min-width:54px;text-align:right}.on-ice{grid-column:3/5!important;margin-top:4px}
 @keyframes goalCardDrop{0%{opacity:0;transform:translateY(-22px)}100%{opacity:1;transform:translateY(0)}}
 @keyframes goalContentReady{0%,12%{opacity:0}13%,100%{opacity:1}}
 @keyframes goalWipe{0%,7%{clip-path:inset(0 100% 0 0)}24%,62%{clip-path:inset(0 0 0 0)}100%{clip-path:inset(0 100% 0 0)}}
 @keyframes goalLogoPop{0%,20%{opacity:0;transform:scale(.72)}31%,65%{opacity:1;transform:scale(1)}82%,100%{opacity:0;transform:scale(.94)}}
 @keyframes goalWordInL{0%,21%{opacity:0;transform:translateX(-30px)}34%,68%{opacity:1;transform:translateX(0)}82%,100%{opacity:0;transform:translateX(16px)}}
 @keyframes goalWordInR{0%,21%{opacity:0;transform:translateX(30px)}34%,68%{opacity:1;transform:translateX(0)}82%,100%{opacity:0;transform:translateX(-16px)}}
 .goal-celebrating{animation:goalCardDrop .34s cubic-bezier(.18,.8,.25,1) both!important;pointer-events:none}.goal-celebrating>:not(.goal-celebration-layer){animation:goalContentReady 2.65s linear both}.goal-celebration-layer{position:absolute;inset:0;z-index:20;display:grid;grid-template-columns:minmax(0,1fr) 120px minmax(0,1fr);align-items:center;gap:20px;padding:0 34px;background:var(--goal-team-color,#2387d9);color:var(--goal-team-ink,#fff);clip-path:inset(0 100% 0 0);animation:goalWipe 2.65s cubic-bezier(.65,0,.35,1) both;overflow:hidden}.goal-logo-stage{display:grid;place-items:center;animation:goalLogoPop 2.65s ease both}.goal-logo-stage img{max-width:92px;max-height:82px;object-fit:contain;filter:drop-shadow(0 8px 18px rgba(0,0,0,.25))}.goal-word{font-size:clamp(22px,3vw,42px);font-weight:1000;letter-spacing:-.04em;white-space:nowrap;text-transform:uppercase;text-shadow:0 4px 16px rgba(0,0,0,.14)}.goal-word-left{text-align:right;animation:goalWordInL 2.65s ease both}.goal-word-right{text-align:left;animation:goalWordInR 2.65s ease both}
 @keyframes scoreBump{0%{transform:scale(1)}35%{transform:scale(1.12);text-shadow:0 0 24px rgba(127,198,255,.42)}100%{transform:scale(1);text-shadow:none}}.score-bump{animation:scoreBump .48s ease-out}
 @media(max-width:760px){.event-card,.timeline>.event{min-height:96px!important;padding:14px 11px!important}.event-card{grid-template-columns:60px 42px minmax(0,1fr)!important;gap:9px!important}.timeline>.event{grid-template-columns:58px 42px minmax(0,1fr)!important;gap:9px!important}.event-time strong,.timeline>.event time{font-size:17px!important}.event-logo,.event-team-logo{width:38px!important;height:38px!important}.event-photo,.eventperson>img{width:48px!important;height:48px!important;flex-basis:48px}.event-copy strong,.eventperson strong{font-size:14px!important}.event-type-icon{width:19px;height:19px;flex-basis:19px}.event-score{grid-column:3!important;font-size:22px!important;text-align:left;margin-top:2px}.on-ice{grid-column:3!important}.goal-celebration-layer{grid-template-columns:1fr 68px 1fr;gap:7px;padding:0 10px}.goal-logo-stage img{max-width:58px;max-height:58px}.goal-word{font-size:16px;letter-spacing:-.05em}}
 @media(max-width:480px){.goal-word{font-size:13px}.goal-celebration-layer{grid-template-columns:1fr 54px 1fr}.goal-logo-stage img{max-width:46px;max-height:46px}}
 @media(prefers-reduced-motion:reduce){.goal-celebrating,.goal-celebrating>:not(.goal-celebration-layer),.goal-celebration-layer,.goal-logo-stage,.goal-word,.score-bump{animation:none!important}.goal-celebration-layer{display:none}.event-card,.timeline>.event{transition:none!important}.event-card:hover,.timeline>.event:hover{transform:none}}
 `;document.head.appendChild(s)
}
injectCss();const root=document.querySelector('#main,#app')||document.body;new MutationObserver(queue).observe(root,{childList:true,subtree:true,characterData:true});queue();
})();
