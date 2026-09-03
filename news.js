(()=>{
  const NEWS_API='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-news';
  const STYLE_ID='home-news-style';
  if(document.getElementById('homeNewsSection'))return;

  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmtDate=x=>{try{return new Date(x).toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'})}catch{return ''}};

  if(!document.getElementById(STYLE_ID)){
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      #homeNewsSection .news-home-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:13px}
      #homeNewsSection .news-home-card{display:flex;flex-direction:column;min-height:330px;border:1px solid var(--line);border-radius:20px;overflow:hidden;background:linear-gradient(180deg,rgba(18,36,59,.9),rgba(10,23,40,.96));transition:.2s ease;box-shadow:var(--shadow)}
      #homeNewsSection .news-home-card:hover{transform:translateY(-3px);border-color:rgba(127,198,255,.26)}
      #homeNewsSection .news-home-cover{height:150px;background:radial-gradient(circle at 24% 15%,rgba(127,198,255,.25),transparent 38%),linear-gradient(135deg,rgba(47,111,237,.28),rgba(226,58,71,.12));overflow:hidden;position:relative}
      #homeNewsSection .news-home-cover img{width:100%;height:100%;object-fit:cover;display:block}
      #homeNewsSection .news-home-cover:after{content:'U16';position:absolute;right:14px;bottom:7px;font-size:44px;font-weight:950;letter-spacing:-.08em;color:rgba(255,255,255,.09)}
      #homeNewsSection .news-home-body{padding:16px;display:flex;flex-direction:column;flex:1}
      #homeNewsSection .news-home-date{color:var(--ice);font-size:10px;text-transform:uppercase;letter-spacing:.1em;font-weight:900}
      #homeNewsSection h3{font-size:18px;line-height:1.15;margin:9px 0 8px;letter-spacing:-.025em}
      #homeNewsSection p{font-size:12px;line-height:1.55;color:var(--muted);margin:0 0 14px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
      #homeNewsSection .news-home-more{margin-top:auto;color:#cce8ff;font-size:12px;font-weight:850}
      #homeNewsSection .news-home-empty{padding:28px;border:1px dashed var(--line);border-radius:18px;color:var(--muted);text-align:center;grid-column:1/-1}
      html[data-theme='light'] #homeNewsSection .news-home-card{background:#fff}
      @media(max-width:980px){#homeNewsSection .news-home-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:580px){#homeNewsSection .news-home-grid{grid-template-columns:1fr}#homeNewsSection .news-home-card{min-height:0}#homeNewsSection .news-home-cover{height:180px}}
    `;document.head.appendChild(s);
  }

  const section=document.createElement('section');
  section.id='homeNewsSection';section.className='section wrap reveal';
  section.innerHTML=`<div class="section-head"><div><div class="section-kicker">Пресс-центр</div><h2>Новости</h2><div class="section-sub">Главное о турнире: объявления, результаты и важные обновления.</div></div><a class="link-arrow" href="/news.html">Все новости →</a></div><div id="homeNewsGrid" class="news-home-grid"><div class="news-home-empty">Загружаем новости…</div></div>`;
  const target=document.querySelector('#overall')||document.querySelector('main section:last-of-type');
  if(target)target.insertAdjacentElement('beforebegin',section);else document.body.appendChild(section);

  const nav=document.querySelector('.nav');
  if(nav&&!nav.querySelector('a[href="/news.html"]')){const a=document.createElement('a');a.href='/news.html';a.textContent='Новости';nav.appendChild(a)}

  let loadedFor=null;
  async function load(){
    const tid=typeof D!=='undefined'&&D?.tournament?.id?Number(D.tournament.id):null;
    if(!tid||loadedFor===tid)return;
    loadedFor=tid;
    try{
      const r=await fetch(NEWS_API+'?tournament_id='+tid+'&limit=4',{cache:'no-store'});const b=await r.json();if(!r.ok)throw Error(b.error||'Ошибка');
      const items=b.items||[],grid=document.getElementById('homeNewsGrid');if(!grid)return;
      grid.innerHTML=items.length?items.map(n=>`<a class="news-home-card" href="/news.html?id=${n.id}"><div class="news-home-cover">${n.cover_url?`<img src="${esc(n.cover_url)}" alt="" loading="lazy">`:''}</div><div class="news-home-body"><div class="news-home-date">${esc(fmtDate(n.published_at||n.created_at))}</div><h3>${esc(n.title)}</h3>${n.excerpt?`<p>${esc(n.excerpt)}</p>`:''}<div class="news-home-more">Читать →</div></div></a>`).join(''):'<div class="news-home-empty">Опубликованных новостей пока нет.</div>';
      if(typeof activateReveal==='function')activateReveal();
    }catch(e){console.error('News:',e);const grid=document.getElementById('homeNewsGrid');if(grid)grid.innerHTML='<div class="news-home-empty">Не удалось загрузить новости.</div>'}
  }
  const timer=setInterval(()=>{load();if(loadedFor)clearInterval(timer)},350);
  load();
})();
