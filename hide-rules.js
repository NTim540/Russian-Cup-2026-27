(()=>{
  const style=document.createElement('style');
  style.id='hide-rules-section';
  style.textContent='#rules,#maintenance-notice{display:none!important}';
  document.head.appendChild(style);

  function cleanupLaunchUi(){
    document.querySelectorAll('.nav a[href="#rules"],.footer-nav a[href="#rules"]').forEach(a=>{
      a.href='/regulation.html';
      a.textContent='Регламент';
      a.style.display='';
    });
    document.getElementById('maintenance-notice')?.remove();
  }
  cleanupLaunchUi();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',cleanupLaunchUi,{once:true});
})();
