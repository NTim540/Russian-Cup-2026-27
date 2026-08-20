(()=>{
  const style=document.createElement('style');
  style.id='hide-rules-section';
  style.textContent=`
    #rules{display:none!important}
    .nav a[href="#rules"],.footer-nav a[href="#rules"]{display:none!important}
  `;
  document.head.appendChild(style);
})();
