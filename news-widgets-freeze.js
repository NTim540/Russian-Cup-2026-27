(()=>{
  const original=window.renderNewsWidgets;
  if(typeof original==='function'){
    window.renderNewsWidgets=async function(news,container){
      if(!container)return;
      const widgets=Array.isArray(news?.widgets)?news.widgets:[];
      if(!widgets.length){container.innerHTML='';return}
      if(news?.widgets_auto_update!==true){
        if(news?.widgets_snapshot_html){container.innerHTML=news.widgets_snapshot_html;return}
        container.innerHTML='<div class="nw-empty">Данные виджетов зафиксированы, но снимок ещё не создан. Обновите виджеты этой новости в админке.</div>';
        return;
      }
      return original(news,container)
    };
  }
  if(!document.querySelector('script[data-news-match-widgets]')){
    const s=document.createElement('script');s.src='/news-match-widgets.js?v=20260904-1';s.dataset.newsMatchWidgets='1';document.head.appendChild(s);
  }
  if(!document.querySelector('script[data-site-analytics]')){
    const a=document.createElement('script');a.src='/analytics.js?v=20260908-2';a.dataset.siteAnalytics='1';
    a.onload=()=>{
      if(document.querySelector('script[data-news-article-tracking]'))return;
      const t=document.createElement('script');t.src='/news-article-tracking.js?v=20260908-1';t.dataset.newsArticleTracking='1';document.head.appendChild(t);
    };
    document.head.appendChild(a);
  }else if(!document.querySelector('script[data-news-article-tracking]')){
    const t=document.createElement('script');t.src='/news-article-tracking.js?v=20260908-1';t.dataset.newsArticleTracking='1';document.head.appendChild(t);
  }
})();
