/* Admin support for single-match news widgets. */
(()=>{
  const API='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-news';
  const RESULT='match_result',ANNOUNCE='match_announce',TYPES=new Set([RESULT,ANNOUNCE]);
  const q=s=>document.querySelector(s);
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pending=[];
  let lastSig='';

  function currentStage(){try{return Number(D?.stage?.id)||0}catch{return 0}}
  function teamName(id){try{return D?.teams?.find(t=>Number(t.id)===Number(id))?.name||'—'}catch{return'—'}}
  function matchLabel(m){const d=m?.game_date?new Date(m.game_date+'T12:00:00').toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit'}):'';return`${d} · №${m?.game_no??'—'} · ${teamName(m.home_team_id)} — ${teamName(m.away_team_id)}`}
  function defaultTitle(type,m){return type===RESULT?`${teamName(m.home_team_id)} — ${teamName(m.away_team_id)}`:`${teamName(m.home_team_id)} — ${teamName(m.away_team_id)} · трансляция`}

  function ensurePublicRenderer(){
    if(document.querySelector('script[data-news-match-widgets]'))return;
    const s=document.createElement('script');s.src='/news-match-widgets.js?v=20260904-1';s.dataset.newsMatchWidgets='1';document.head.appendChild(s);
  }

  function ensureUi(){
    const type=q('#widgetType'),fields=q('#tab-news .widget-fields');if(!type||!fields)return false;
    if(!type.querySelector(`option[value="${ANNOUNCE}"]`)){const o=document.createElement('option');o.value=ANNOUNCE;o.textContent='Анонс конкретного матча';type.insertBefore(o,type.firstChild)}
    if(!type.querySelector(`option[value="${RESULT}"]`)){const o=document.createElement('option');o.value=RESULT;o.textContent='Итог конкретного матча';type.insertBefore(o,type.firstChild)}
    if(!q('#widgetMatchField')){
      const box=document.createElement('div');box.className='field hidden';box.id='widgetMatchField';box.innerHTML='<label>Матч</label><select id="widgetMatch" class="select"></select>';
      fields.appendChild(box);
    }
    type.addEventListener('change',syncUi);
    q('#widgetAdd')?.addEventListener('click',captureAdd,true);
    syncUi();populateMatches();return true;
  }

  function populateMatches(){
    const sel=q('#widgetMatch');if(!sel)return;
    let ms=[];try{ms=[...(D?.matches||[])].sort((a,b)=>(a.game_date||'').localeCompare(b.game_date||'')||(a.start_time||'').localeCompare(b.start_time||'')||(a.game_no||0)-(b.game_no||0))}catch{}
    const sig=currentStage()+'|'+ms.map(m=>m.id).join(',');if(sig===lastSig&&sel.options.length)return;lastSig=sig;
    sel.innerHTML=ms.map(m=>`<option value="${m.id}">${esc(matchLabel(m))}</option>`).join('');
  }

  function syncUi(){
    const t=q('#widgetType')?.value,match=TYPES.has(t);
    q('#widgetMatchField')?.classList.toggle('hidden',!match);
    if(match){q('#widgetDateField')?.classList.add('hidden');q('#widgetGroupField')?.classList.add('hidden');populateMatches()}
  }

  function captureAdd(e){
    const type=q('#widgetType')?.value;if(!TYPES.has(type))return;
    const matchId=Number(q('#widgetMatch')?.value),stageId=currentStage();let m=null;try{m=D?.matches?.find(x=>Number(x.id)===matchId)}catch{}
    if(!matchId||!m){e.preventDefault();e.stopImmediatePropagation();alert('Выберите матч');return}
    const title=q('#widgetTitle');if(title&&!title.value.trim())title.value=defaultTitle(type,m);
    pending.push({type,stage_id:stageId,title:title?.value.trim()||'',match_id:matchId});
  }

  // Enrich the normal news widget payload before the freeze/snapshot layer processes it.
  function installFetch(){
    if(window.__newsMatchWidgetsFetch)return;window.__newsMatchWidgetsFetch=true;
    const prev=window.fetch.bind(window);
    window.fetch=async function(input,init={}){
      const url=typeof input==='string'?input:input?.url||'',method=String(init?.method||'GET').toUpperCase();
      let touched=false;
      if(url.startsWith(API)&&method==='POST'&&init?.body){
        try{
          const body=JSON.parse(init.body);
          if(body&&['create','update'].includes(String(body.action||''))&&Array.isArray(body.widgets)){
            const used=new Set();
            for(const w of body.widgets){
              if(!TYPES.has(w?.type)||w.match_id)continue;
              let idx=pending.findIndex((p,i)=>!used.has(i)&&p.type===w.type&&Number(p.stage_id)===Number(w.stage_id)&&String(p.title||'')===String(w.title||''));
              if(idx<0)idx=pending.findIndex((p,i)=>!used.has(i)&&p.type===w.type&&Number(p.stage_id)===Number(w.stage_id));
              if(idx>=0){w.match_id=pending[idx].match_id;used.add(idx);touched=true}
            }
            if(touched)init={...init,body:JSON.stringify(body)};
          }
        }catch(e){console.error('Match widget payload:',e)}
      }
      const r=await prev(input,init);if(touched&&r.ok)pending.splice(0,pending.length);return r;
    };
  }

  ensurePublicRenderer();installFetch();
  let tries=0;const timer=setInterval(()=>{tries++;const ok=ensureUi();populateMatches();if(ok&&tries>20)clearInterval(timer);if(tries>120)clearInterval(timer)},100);
  const obs=new MutationObserver(()=>{ensureUi();populateMatches();syncUi()});
  setTimeout(()=>{if(document.body)obs.observe(document.body,{childList:true,subtree:true})},0);
  setTimeout(()=>obs.disconnect(),20000);
})();
