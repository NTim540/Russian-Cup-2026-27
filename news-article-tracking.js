(()=>{
  const params=new URL(location.href).searchParams;
  const newsId=Number(params.get('id'));
  if(!Number.isInteger(newsId)||newsId<1)return;
  let bound=false,viewSent=false;

  function classify(a){
    if(a.matches('.broadcast-link,.broadcast-inline,.mc-broadcast-link')||a.closest('.broadcast-link,.broadcast-inline,.mc-broadcast-link'))return'stream';
    const href=a.getAttribute('href')||'';
    if(/match=\d+/i.test(href))return'match';
    try{const u=new URL(a.href,location.href);if(u.origin!==location.origin)return'external'}catch{}
    return'link';
  }
  function send(action,extra={}){
    if(typeof window.rcAnalyticsSend!=='function')return false;
    const title=(document.querySelector('.article h1')?.textContent||document.title||'Новость').trim();
    window.rcAnalyticsSend(action,{match_id:newsId,match_label:'[NEWS] '+title,path:'/news.html?id='+newsId,...extra});
    return true;
  }
  function bind(){
    const article=document.querySelector('.article');if(!article)return false;
    if(!viewSent){viewSent=send('news_view');}
    if(bound)return true;bound=true;
    article.addEventListener('click',e=>{
      const a=e.target.closest?.('a');if(!a||a.classList.contains('back'))return;
      send('news_click',{source:'news_'+classify(a)});
    },true);
    return true;
  }
  let tries=0;const timer=setInterval(()=>{tries++;if(bind()&&typeof window.rcAnalyticsSend==='function')clearInterval(timer);if(tries>100)clearInterval(timer)},150);
  new MutationObserver(()=>bind()).observe(document.body,{childList:true,subtree:true});
  bind();
})();
