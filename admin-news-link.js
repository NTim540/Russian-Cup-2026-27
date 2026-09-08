(()=>{
  function add(){const tabs=document.querySelector('.tabs');if(!tabs||tabs.querySelector('[data-news-editor-link]'))return;const a=document.createElement('a');a.className='tab';a.href='/admin-news.html';a.dataset.newsEditorLink='1';a.textContent='Новости ↗';const info=[...tabs.querySelectorAll('a')].find(x=>/Инфографика/.test(x.textContent||''));if(info)tabs.insertBefore(a,info);else tabs.appendChild(a)}
  add();new MutationObserver(add).observe(document.body,{childList:true,subtree:true});
})();
