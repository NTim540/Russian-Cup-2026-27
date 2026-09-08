(()=>{
  const style=document.createElement('style');
  style.id='hide-rules-section';
  style.textContent='#rules{display:none!important}';
  document.head.appendChild(style);

  function linkRegulation(){
    document.querySelectorAll('.nav a[href="#rules"],.footer-nav a[href="#rules"]').forEach(a=>{
      a.href='/regulation.html';
      a.textContent='Регламент';
      a.style.display='';
    });
  }
  linkRegulation();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',linkRegulation,{once:true});
})();
