(()=>{
  const STREAM_API='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-stream';
  const style=document.createElement('style');
  style.textContent=`
    .stream-admin-field{grid-column:1/-1}
    .stream-admin-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center}
    .stream-admin-help{margin-top:5px;color:var(--muted);font-size:11px;line-height:1.45}
    .stream-admin-btn.saved{background:rgba(72,195,139,.16);border:1px solid rgba(72,195,139,.35);color:#bdf4d7}
    @media(max-width:560px){.stream-admin-row{grid-template-columns:1fr}.stream-admin-btn{width:100%}}
  `;
  document.head.appendChild(style);

  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function matchById(id){return typeof D!=='undefined'&&Array.isArray(D?.matches)?D.matches.find(m=>Number(m.id)===Number(id)):null}
  function isValidUrl(v){if(!v)return true;try{const u=new URL(v);return ['http:','https:'].includes(u.protocol)}catch{return false}}
  async function saveStream(card){
    const input=card.querySelector('.mstream'),btn=card.querySelector('.stream-admin-btn');if(!input||!btn)return;
    const value=input.value.trim();
    if(!isValidUrl(value)){alert('Ссылка должна начинаться с http:// или https://');input.focus();return}
    const old=btn.textContent;btn.disabled=true;btn.textContent='Сохраняю…';btn.classList.remove('saved');
    try{
      const r=await fetch(STREAM_API,{method:'POST',headers:{'Content-Type':'application/json','x-admin-password':PW},body:JSON.stringify({match_id:Number(card.dataset.id),stream_url:value||null})});
      const b=await r.json().catch(()=>({}));if(!r.ok)throw Error(b.error||'Ошибка сохранения');
      const m=matchById(card.dataset.id);if(m)m.stream_url=value||null;
      btn.textContent='Сохранено';btn.classList.add('saved');
      setTimeout(()=>{btn.textContent='Сохранить ссылку';btn.classList.remove('saved')},1600);
    }catch(e){alert(e.message||String(e));btn.textContent=old}
    finally{btn.disabled=false}
  }
  function decorate(){
    if(typeof D==='undefined'||!Array.isArray(D?.matches))return;
    document.querySelectorAll('.match-card').forEach(card=>{
      if(card.querySelector('.mstream'))return;
      const m=matchById(card.dataset.id),extra=card.querySelector('.match-extra');if(!m||!extra)return;
      const field=document.createElement('div');field.className='field stream-admin-field';
      field.innerHTML='<label>Ссылка на трансляцию</label><div class="stream-admin-row"><input class="input mstream" type="url" inputmode="url" placeholder="https://..." value="'+esc(m.stream_url||'')+'"><button class="btn sec stream-admin-btn" type="button">Сохранить ссылку</button></div><div class="stream-admin-help">Если ссылка заполнена, на публичном сайте появится кнопка «Смотреть трансляцию». Поле можно очистить, чтобы убрать кнопку.</div>';
      extra.appendChild(field);field.querySelector('.stream-admin-btn').onclick=()=>saveStream(card);
      field.querySelector('.mstream').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();saveStream(card)}});
    });
  }
  let queued=false;const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})};
  new MutationObserver(queue).observe(document.body,{childList:true,subtree:true});
  setInterval(queue,1000);decorate();
})();