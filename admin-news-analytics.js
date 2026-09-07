(()=>{
  const API='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-analytics';
  const section=document.querySelector('#tab-news');
  if(!section||document.querySelector('#newsArticleAnalytics'))return;
  const nf=n=>Number(n||0).toLocaleString('ru-RU');
  let map=new Map(),busy=false,lastLoaded=0,decorateTimer=null;

  const style=document.createElement('style');
  style.textContent=`
    #tab-news .news-analytics-mini{display:inline-flex;align-items:center;gap:5px;padding:4px 7px;border:1px solid rgba(127,198,255,.13);border-radius:999px;background:rgba(127,198,255,.045);color:#a8c8df;font-size:9px;font-weight:800}
    #tab-news .news-analytics-panel{margin-top:14px;padding:14px;border:1px solid rgba(127,198,255,.16);border-radius:15px;background:linear-gradient(180deg,rgba(127,198,255,.045),rgba(255,255,255,.018))}
    #tab-news .news-analytics-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:11px}.news-analytics-head h3{margin:0 0 3px;font-size:15px}.news-analytics-refresh{border:1px solid var(--line);background:rgba(255,255,255,.04);color:#cfe7f8;border-radius:9px;padding:7px 9px;font-size:10px;font-weight:800;cursor:pointer}.news-analytics-refresh:disabled{opacity:.55;cursor:wait}
    #tab-news .news-analytics-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.news-analytics-stat{padding:12px;border:1px solid rgba(255,255,255,.075);border-radius:11px;background:rgba(255,255,255,.022)}.news-analytics-stat strong{display:block;font-size:21px;line-height:1;font-weight:950}.news-analytics-stat span{display:block;margin-top:6px;color:var(--muted);font-size:8px;text-transform:uppercase;letter-spacing:.075em}.news-analytics-foot{margin-top:9px;color:#738ca2;font-size:9px;line-height:1.45}
    @media(max-width:600px){#tab-news .news-analytics-grid{grid-template-columns:1fr 1fr}.news-analytics-stat:last-child{grid-column:1/-1}}
  `;
  document.head.appendChild(style);

  const editor=section.querySelector('.news-admin-grid > .card.panel');
  if(!editor)return;
  const panel=document.createElement('div');panel.id='newsArticleAnalytics';panel.className='news-analytics-panel';
  panel.innerHTML=`<div class="news-analytics-head"><div><h3>Статистика новости</h3><div class="muted">Анонимные просмотры и уникальные читатели.</div></div><button type="button" class="news-analytics-refresh">Обновить</button></div><div class="news-analytics-grid"><div class="news-analytics-stat"><strong data-na="views">—</strong><span>Просмотры · 30 дней</span></div><div class="news-analytics-stat"><strong data-na="visitors">—</strong><span>Уникальные · 30 дней</span></div><div class="news-analytics-stat"><strong data-na="depth">—</strong><span>Просмотров / читателя</span></div></div><div class="news-analytics-foot">Статистика по отдельным статьям собирается с момента подключения счётчика.</div>`;
  const msg=editor.querySelector('#newsMsg');if(msg)msg.insertAdjacentElement('beforebegin',panel);else editor.appendChild(panel);
  const refreshBtn=panel.querySelector('.news-analytics-refresh');

  function pw(){try{if(typeof PW!=='undefined'&&PW)return PW}catch{}return sessionStorage.getItem('rcAdminPw')||''}
  function selectedId(){return Number(section.querySelector('.news-item.active')?.dataset.id)||0}
  function stat(id){return map.get(Number(id))||{pageviews:0,visitors:0,known:false}}
  function renderPanel(){
    const id=selectedId(),s=stat(id),v=Number(s.pageviews||0),u=Number(s.visitors||0);
    panel.querySelector('[data-na="views"]').textContent=id?(s.known?nf(v):'0'):'—';
    panel.querySelector('[data-na="visitors"]').textContent=id?(s.known?nf(u):'0'):'—';
    panel.querySelector('[data-na="depth"]').textContent=id&&s.known&&u?(v/u).toLocaleString('ru-RU',{minimumFractionDigits:1,maximumFractionDigits:1}):'—';
    panel.style.opacity=id?'1':'.6';
  }
  function decorate(){
    section.querySelectorAll('.news-item[data-id]').forEach(el=>{
      const id=Number(el.dataset.id),s=stat(id),meta=el.querySelector('.news-item-meta');if(!meta)return;
      let badge=meta.querySelector('.news-analytics-mini');if(!badge){badge=document.createElement('span');badge.className='news-analytics-mini';meta.appendChild(badge)}
      const text=s.known?`Просм. ${nf(s.pageviews)} · уник. ${nf(s.visitors)}`:'Просм. 0 · уник. 0';
      if(badge.textContent!==text)badge.textContent=text;
    });
    renderPanel();
  }
  function scheduleDecorate(){clearTimeout(decorateTimer);decorateTimer=setTimeout(decorate,80)}
  function parse(d){
    const next=new Map();
    for(const r of d.top_pages||[]){const m=String(r.path||'').match(/^\/news(?:\.html)?\?id=(\d+)/);if(!m)continue;next.set(Number(m[1]),{pageviews:Number(r.pageviews)||0,visitors:Number(r.visitors)||0,known:true})}
    map=next;decorate();
  }
  async function load(force=false){
    if(busy)return;if(!force&&Date.now()-lastLoaded<10000){decorate();return}
    busy=true;refreshBtn.disabled=true;
    try{const r=await fetch(API+'/dashboard?limit=500',{headers:{'x-admin-password':pw()},cache:'no-store'}),d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||'Не удалось загрузить аналитику');parse(d);lastLoaded=Date.now()}catch(e){console.warn('News analytics:',e)}finally{busy=false;refreshBtn.disabled=false}
  }

  refreshBtn.addEventListener('click',()=>load(true));
  const newsBtn=document.querySelector('.tab[data-tab="news"]');newsBtn?.addEventListener('click',()=>setTimeout(()=>{scheduleDecorate();load(true)},100));
  section.addEventListener('click',e=>{if(e.target.closest?.('.news-item'))setTimeout(renderPanel,60)},true);
  setInterval(()=>{if(!section.classList.contains('hidden')){scheduleDecorate();load()}},15000);
  decorate();
})();
