(()=>{
  const API='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-news';
  const RENDERER='/news-widgets.js?v=20260903-1';
  const STYLE_ID='admin-news-freeze-style';
  let mode='frozen',currentId=null,snapshotAt=null,rendererPromise=null;
  const q=s=>document.querySelector(s);
  const getPw=()=>{try{if(typeof PW!=='undefined'&&PW)return PW}catch{}return sessionStorage.getItem('rcAdminPw')||''};
  const tournamentId=()=>{try{return Number(D?.tournament?.id)||0}catch{return 0}};

  function ensureRenderer(){
    if(window.renderNewsWidgets)return Promise.resolve();
    if(rendererPromise)return rendererPromise;
    rendererPromise=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=RENDERER;s.onload=()=>resolve();s.onerror=()=>reject(new Error('Не удалось загрузить генератор виджетов'));document.head.appendChild(s)});
    return rendererPromise;
  }

  async function makeSnapshot(body){
    if(!Array.isArray(body.widgets)||!body.widgets.length)return null;
    await ensureRenderer();
    if(typeof window.renderNewsWidgets!=='function')throw new Error('Генератор виджетов недоступен');
    const host=document.createElement('div');host.style.cssText='position:fixed;left:-100000px;top:0;width:900px;visibility:hidden;pointer-events:none';document.body.appendChild(host);
    try{
      await window.renderNewsWidgets({tournament_id:Number(body.tournament_id),widgets:body.widgets,widgets_auto_update:true},host);
      const html=host.innerHTML.trim();
      if(!html||html.includes('Не удалось загрузить виджеты'))throw new Error('Не удалось сформировать снимок виджетов');
      return html;
    }finally{host.remove()}
  }

  function fmtSnapshot(){if(!snapshotAt)return 'Снимок ещё не создан';try{return 'Последний снимок: '+new Date(snapshotAt).toLocaleString('ru-RU')}catch{return 'Снимок создан'}}
  function updateModeUi(){
    const sel=q('#newsWidgetMode'),badge=q('#newsWidgetModeBadge'),help=q('#newsWidgetModeHelp'),refresh=q('#newsWidgetRefresh'),stamp=q('#newsWidgetSnapshotAt');
    if(sel)sel.value=mode;
    if(badge){badge.textContent=mode==='live'?'LIVE':'ЗАФИКСИРОВАНО';badge.classList.toggle('live',mode==='live')}
    if(help)help.textContent=mode==='live'?'Виджеты автоматически показывают текущие данные турнира. Таблица и результаты будут меняться после обновления базы.':'Виджеты фиксируются в момент сохранения новости и больше сами не меняются. Чтобы обновить их позже, нажмите «Обновить виджеты сейчас».';
    if(refresh)refresh.classList.toggle('hidden',mode==='live');
    if(stamp)stamp.textContent=mode==='live'?'Автообновление включено':fmtSnapshot();
  }

  async function loadModeFor(id){
    currentId=id||null;
    if(!currentId){mode='frozen';snapshotAt=null;updateModeUi();return}
    const tid=tournamentId();if(!tid)return;
    try{
      const r=await fetch(API+'?admin=1&tournament_id='+tid,{headers:{'x-admin-password':getPw()},cache:'no-store'}),b=await r.json();
      if(!r.ok)return;
      const n=(b.items||[]).find(x=>Number(x.id)===Number(currentId));
      if(!n)return;
      mode=n.widgets_auto_update===true?'live':'frozen';snapshotAt=n.widgets_snapshot_at||null;updateModeUi();
    }catch(e){console.error('News widget mode:',e)}
  }

  function init(){
    const builder=q('#tab-news .widget-builder'),msg=q('#newsMsg');if(!builder||!msg)return false;
    if(q('#newsWidgetMode'))return true;
    if(!document.getElementById(STYLE_ID)){const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      #tab-news .widget-mode-box{margin:12px 0 0;padding:12px;border:1px solid rgba(127,198,255,.18);border-radius:13px;background:rgba(7,17,31,.24)}
      #tab-news .widget-mode-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:end}
      #tab-news .widget-mode-copy{margin-top:7px;color:var(--muted);font-size:10px;line-height:1.5}
      #tab-news .widget-mode-status{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-top:9px;color:#9fb4cd;font-size:10px;flex-wrap:wrap}
      @media(max-width:620px){#tab-news .widget-mode-row{grid-template-columns:1fr}}
    `;document.head.appendChild(s)}
    const box=document.createElement('div');box.className='widget-mode-box';box.innerHTML=`<div class="widget-mode-row"><div class="field"><label>Обновление данных виджетов</label><select id="newsWidgetMode" class="select"><option value="frozen">Только вручную — зафиксировать данные</option><option value="live">Автоматически — всегда актуальные данные</option></select></div><button id="newsWidgetRefresh" class="btn sec small" type="button">Обновить виджеты сейчас</button></div><div id="newsWidgetModeHelp" class="widget-mode-copy"></div><div class="widget-mode-status"><span id="newsWidgetModeBadge" class="news-badge"></span><span id="newsWidgetSnapshotAt"></span></div>`;
    builder.appendChild(box);
    q('#newsWidgetMode').onchange=e=>{mode=e.target.value==='live'?'live':'frozen';updateModeUi()};
    q('#newsWidgetRefresh').onclick=()=>{mode='frozen';updateModeUi();q('#newsSave')?.click()};
    const syncFromMsg=()=>{const t=msg.textContent||'';const m=t.match(/Редактирование публикации №(\d+)/);if(m)loadModeFor(Number(m[1]));else if(t.includes('Новая публикация'))loadModeFor(null)};
    new MutationObserver(syncFromMsg).observe(msg,{childList:true,subtree:true,characterData:true});syncFromMsg();updateModeUi();
    return true;
  }

  const nativeFetch=window.fetch.bind(window);
  window.fetch=async function(input,init={}){
    const url=typeof input==='string'?input:input?.url||'';
    const method=String(init?.method||'GET').toUpperCase();
    if(url.startsWith(API)&&method==='POST'&&init?.body){
      try{
        const body=JSON.parse(init.body);
        if(body&&['create','update'].includes(String(body.action||''))){
          const live=mode==='live';body.widgets_auto_update=live;
          if(live||!Array.isArray(body.widgets)||!body.widgets.length){body.widgets_snapshot_html=null;body.widgets_snapshot_at=null}
          else{
            const msg=q('#newsMsg');if(msg)msg.textContent='Фиксирую данные виджетов…';
            body.widgets_snapshot_html=await makeSnapshot(body);body.widgets_snapshot_at=new Date().toISOString();snapshotAt=body.widgets_snapshot_at;
          }
          init={...init,body:JSON.stringify(body)};
        }
      }catch(e){
        console.error('News snapshot:',e);
        return new Response(JSON.stringify({error:'Не удалось зафиксировать виджеты: '+(e?.message||e)}),{status:400,headers:{'Content-Type':'application/json'}})
      }
    }
    return nativeFetch(input,init)
  };

  let tries=0;const timer=setInterval(()=>{tries++;if(init()||tries>60)clearInterval(timer)},100);
})();
