(()=>{
  const original=window.renderNewsWidgets;
  if(typeof original!=='function')return;
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
})();
