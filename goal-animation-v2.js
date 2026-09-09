(()=>{
'use strict';
if(document.getElementById('goal-animation-v2-style'))return;
const s=document.createElement('style');
s.id='goal-animation-v2-style';
s.textContent=`
@keyframes goalWipeVertical{
  0%,7%{clip-path:inset(0 0 100% 0)}
  28%,62%{clip-path:inset(0 0 0 0)}
  100%{clip-path:inset(0 0 100% 0)}
}
@keyframes goalContentRevealVertical{
  0%,61%{opacity:0}
  62%,100%{opacity:1}
}
.goal-celebrating>:not(.goal-celebration-layer){
  animation:goalContentRevealVertical 2.65s linear both!important;
}
.goal-celebration-layer{
  clip-path:inset(0 0 100% 0)!important;
  animation:goalWipeVertical 2.65s cubic-bezier(.65,0,.35,1) both!important;
  will-change:clip-path;
}
.goal-logo-stage,
.goal-word-left,
.goal-word-right{
  opacity:1!important;
  transform:none!important;
  animation:none!important;
}
@media(prefers-reduced-motion:reduce){
  .goal-celebration-layer{display:none!important}
}
`;
document.head.appendChild(s);
})();
