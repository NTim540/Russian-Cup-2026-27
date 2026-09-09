(()=>{
'use strict';
if(!/\/mhl-test\.html$/i.test(location.pathname))return;
const ICON=`<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="22" cy="40" r="11" fill="none" stroke="currentColor" stroke-width="5"/><path d="M31 34h15c5 0 9 4 9 9s-4 9-9 9H31M27 30l9-16 8 4-7 13M43 16l7-7" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
function injectCss(){if(document.getElementById('mhl-penalty-icon-css'))return;const s=document.createElement('style');s.id='mhl-penalty-icon-css';s.textContent=`
.timeline>.event.penalty .event-type-icon{color:#ff5865!important;width:24px!important;height:24px!important;display:inline-grid!important;place-items:center!important}
.timeline>.event.penalty .event-type-icon svg{width:24px!important;height:24px!important;display:block!important}
.penalty-demo-layer .penalty-demo-whistle{color:#fff!important}
`;document.head.appendChild(s)}
function fix(){injectCss();document.querySelectorAll('.timeline>.event.penalty').forEach(card=>{const icon=card.querySelector('.event-type-icon');if(icon&&!icon.dataset.clearWhistle){icon.innerHTML=ICON;icon.dataset.clearWhistle='1'}})}
injectCss();fix();
const mo=new MutationObserver(fix);mo.observe(document.documentElement,{childList:true,subtree:true});
})();
