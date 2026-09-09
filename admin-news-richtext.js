(()=>{
  const NEWS='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-news';
  const ALLOWED_STYLES=new Set(['body','subtitle','heading']);
  const richByBlock=new Map();
  const newsById=new Map();
  let documentKey=null;

  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const currentId=()=>{const m=String(document.querySelector('#editorId')?.textContent||'').match(/№\s*(\d+)/);return m?Number(m[1]):null};
  const currentKey=()=>currentId()||'new';
  const plainToHtml=text=>String(text||'').split(/\n\s*\n/).map(p=>p.trim()).filter(Boolean).map(p=>`<p>${esc(p).replace(/\n/g,'<br>')}</p>`).join('');

  function safeHref(value){
    let s=String(value||'').trim();if(!s)return null;
    if(!/^[a-z][a-z0-9+.-]*:/i.test(s))s='https://'+s;
    try{const u=new URL(s);return ['http:','https:'].includes(u.protocol)?u.toString():null}catch{return null}
  }
  function sanitizeHtml(raw){
    const src=new DOMParser().parseFromString('<body>'+String(raw||'')+'</body>','text/html').body;
    const out=document.createElement('div');
    const allowed=new Set(['P','DIV','BR','STRONG','B','EM','I','U','S','STRIKE','A','UL','OL','LI','BLOCKQUOTE']);
    function copy(node,parent){
      if(node.nodeType===Node.TEXT_NODE){parent.appendChild(document.createTextNode(node.nodeValue||''));return}
      if(node.nodeType!==Node.ELEMENT_NODE)return;
      const tag=node.tagName.toUpperCase();
      if(!allowed.has(tag)){[...node.childNodes].forEach(ch=>copy(ch,parent));return}
      const canonical={B:'STRONG',I:'EM',STRIKE:'S'}[tag]||tag;
      const el=document.createElement(canonical.toLowerCase());
      if(canonical==='A'){
        const href=safeHref(node.getAttribute('href'));if(!href){[...node.childNodes].forEach(ch=>copy(ch,parent));return}
        el.setAttribute('href',href);el.setAttribute('target','_blank');el.setAttribute('rel','noopener noreferrer');
      }
      [...node.childNodes].forEach(ch=>copy(ch,el));parent.appendChild(el);
    }
    [...src.childNodes].forEach(n=>copy(n,out));
    return out.innerHTML;
  }
  function plainFromEditor(editor){
    return String(editor?.innerText||'').replace(/\u00a0/g,' ').replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim();
  }
  function styleLabel(v){return v==='heading'?'Заголовок':v==='subtitle'?'Подзаголовок':'Обычный текст'}
  function injectStyle(){
    if(document.getElementById('news-richtext-editor-style'))return;
    const s=document.createElement('style');s.id='news-richtext-editor-style';s.textContent=`
      .text-block .block-body{padding:0}.rte-shell{background:#091727}.rte-toolbar{position:sticky;top:68px;z-index:4;display:flex;align-items:center;gap:5px;flex-wrap:wrap;padding:8px 9px;border-bottom:1px solid rgba(255,255,255,.08);background:rgba(9,23,39,.96);backdrop-filter:blur(10px)}
      .rte-kind{width:auto;min-width:150px;height:31px;padding:4px 28px 4px 8px;border:1px solid rgba(255,255,255,.10);border-radius:8px;background:#0d1d30;color:#dbe8f5;font-size:10px;font-weight:800}.rte-divider{width:1px;height:21px;background:rgba(255,255,255,.09);margin:0 2px}.rte-btn{min-width:31px;height:31px;padding:0 8px;border:1px solid rgba(255,255,255,.10);border-radius:8px;background:rgba(255,255,255,.035);color:#b9c9d9;font-size:11px;font-weight:850;cursor:pointer}.rte-btn:hover,.rte-btn.active{color:#fff;border-color:rgba(127,198,255,.34);background:rgba(127,198,255,.09)}.rte-btn em{font-weight:700}.rte-btn u{text-underline-offset:2px}.rte-editor{min-height:150px;padding:16px 17px;outline:none;color:#e3ebf4;line-height:1.72;font-size:15px;caret-color:#7fc6ff}.rte-editor:empty:before{content:attr(data-placeholder);color:#536a80;pointer-events:none}.rte-editor p,.rte-editor div{margin:0 0 12px}.rte-editor p:last-child,.rte-editor div:last-child{margin-bottom:0}.rte-editor ul,.rte-editor ol{margin:9px 0 12px;padding-left:24px}.rte-editor li{margin:4px 0}.rte-editor blockquote{margin:12px 0;padding:10px 14px;border-left:3px solid #4d9ce8;background:rgba(127,198,255,.055);color:#c8d8e8}.rte-editor a{color:#8dcbff;text-decoration:underline;text-underline-offset:2px}.rte-shell[data-style='heading'] .rte-editor{font-size:28px;line-height:1.18;font-weight:850;letter-spacing:-.025em}.rte-shell[data-style='subtitle'] .rte-editor{font-size:20px;line-height:1.38;font-weight:700;color:#d4e1ef}.block-text.rte-hidden{display:none!important}
      @media(max-width:680px){.rte-toolbar{top:64px}.rte-kind{min-width:130px;flex:1}.rte-editor{padding:14px 13px}.rte-shell[data-style='heading'] .rte-editor{font-size:23px}.rte-shell[data-style='subtitle'] .rte-editor{font-size:18px}}
    `;document.head.appendChild(s);
  }
  function loadedMetaForTextIndex(index){
    const id=currentId(),item=id?newsById.get(id):null;
    const textBlocks=Array.isArray(item?.content_blocks)?item.content_blocks.filter(b=>b?.type==='text'):[];
    return textBlocks[index]||null;
  }
  function resetForDocumentIfNeeded(){
    const key=currentKey();if(key===documentKey)return;
    richByBlock.clear();documentKey=key;
  }
  function syncCard(card){
    const id=card.dataset.blockId,state=richByBlock.get(id);if(!state)return;
    const editor=card.querySelector('.rte-editor'),ta=card.querySelector('.block-text');if(!editor||!ta)return;
    state.html=sanitizeHtml(editor.innerHTML);state.text=plainFromEditor(editor);state.style=ALLOWED_STYLES.has(card.querySelector('.rte-kind')?.value)?card.querySelector('.rte-kind').value:'body';
    if(ta.value!==state.text){ta.value=state.text;ta.dispatchEvent(new Event('input',{bubbles:true}))}
  }
  function syncAll(){document.querySelectorAll('.text-block[data-richtext="1"]').forEach(syncCard)}
  function runCommand(editor,cmd,value=null){
    editor.focus();try{document.execCommand(cmd,false,value)}catch{}editor.dispatchEvent(new Event('input',{bubbles:true}))
  }
  function updateButtons(card){
    const editor=card.querySelector('.rte-editor');if(!editor||document.activeElement!==editor)return;
    const states={bold:'bold',italic:'italic',underline:'underline',strikeThrough:'strikeThrough',insertUnorderedList:'insertUnorderedList',insertOrderedList:'insertOrderedList'};
    card.querySelectorAll('.rte-btn[data-cmd]').forEach(btn=>{const cmd=btn.dataset.cmd,q=states[cmd];if(!q)return;let on=false;try{on=document.queryCommandState(q)}catch{}btn.classList.toggle('active',Boolean(on))});
  }
  function enhance(card,textIndex){
    if(card.dataset.richtext==='1')return;
    const ta=card.querySelector('.block-text');if(!ta)return;
    const id=card.dataset.blockId||card.getAttribute('data-block-id');if(!id)return;
    let state=richByBlock.get(id);
    if(!state){const meta=loadedMetaForTextIndex(textIndex);state={style:ALLOWED_STYLES.has(meta?.style)?meta.style:'body',html:meta?.html?sanitizeHtml(meta.html):plainToHtml(ta.value),text:ta.value};richByBlock.set(id,state)}
    const shell=document.createElement('div');shell.className='rte-shell';shell.dataset.style=state.style;
    shell.innerHTML=`<div class="rte-toolbar"><select class="rte-kind" title="Тип текста"><option value="body">Обычный текст</option><option value="subtitle">Подзаголовок</option><option value="heading">Заголовок</option></select><span class="rte-divider"></span><button class="rte-btn" type="button" data-cmd="bold" title="Жирный"><strong>Ж</strong></button><button class="rte-btn" type="button" data-cmd="italic" title="Курсив"><em>К</em></button><button class="rte-btn" type="button" data-cmd="underline" title="Подчёркивание"><u>Ч</u></button><button class="rte-btn" type="button" data-cmd="strikeThrough" title="Зачёркивание"><s>S</s></button><span class="rte-divider"></span><button class="rte-btn" type="button" data-cmd="insertUnorderedList" title="Маркированный список">• ≡</button><button class="rte-btn" type="button" data-cmd="insertOrderedList" title="Нумерованный список">1. ≡</button><button class="rte-btn" type="button" data-quote title="Цитата">❝</button><span class="rte-divider"></span><button class="rte-btn" type="button" data-link title="Добавить ссылку">🔗</button><button class="rte-btn" type="button" data-unlink title="Убрать ссылку">⛓</button><button class="rte-btn" type="button" data-clear title="Очистить форматирование">Tx</button></div><div class="rte-editor" contenteditable="true" spellcheck="true" data-placeholder="Продолжайте текст новости…"></div>`;
    const kind=shell.querySelector('.rte-kind'),editor=shell.querySelector('.rte-editor');kind.value=state.style;editor.innerHTML=state.html||'';
    ta.classList.add('rte-hidden');ta.insertAdjacentElement('afterend',shell);card.dataset.richtext='1';
    kind.addEventListener('change',()=>{state.style=ALLOWED_STYLES.has(kind.value)?kind.value:'body';shell.dataset.style=state.style;document.querySelector('#msg')&&(document.querySelector('#msg').textContent='Есть несохранённые изменения.')});
    shell.querySelectorAll('[data-cmd]').forEach(btn=>btn.addEventListener('mousedown',e=>{e.preventDefault();runCommand(editor,btn.dataset.cmd);updateButtons(card)}));
    shell.querySelector('[data-quote]').addEventListener('mousedown',e=>{e.preventDefault();runCommand(editor,'formatBlock','blockquote')});
    shell.querySelector('[data-link]').addEventListener('mousedown',e=>{e.preventDefault();let value=prompt('Ссылка:','https://');if(value===null)return;const href=safeHref(value);if(!href)return alert('Укажите корректную http/https ссылку');runCommand(editor,'createLink',href)});
    shell.querySelector('[data-unlink]').addEventListener('mousedown',e=>{e.preventDefault();runCommand(editor,'unlink')});
    shell.querySelector('[data-clear]').addEventListener('mousedown',e=>{e.preventDefault();runCommand(editor,'removeFormat')});
    editor.addEventListener('input',()=>{syncCard(card);updateButtons(card);document.querySelector('#msg')&&(document.querySelector('#msg').textContent='Есть несохранённые изменения.')});
    editor.addEventListener('keyup',()=>updateButtons(card));editor.addEventListener('mouseup',()=>updateButtons(card));
    editor.addEventListener('paste',e=>{e.preventDefault();const text=e.clipboardData?.getData('text/plain')||'';document.execCommand('insertText',false,text)});
  }
  function enhanceAll(){
    resetForDocumentIfNeeded();
    const cards=[...document.querySelectorAll('.text-block')];cards.forEach((card,i)=>enhance(card,i));
  }

  const nativeFetch=window.fetch.bind(window);
  window.fetch=async function(input,init={}){
    const url=typeof input==='string'?input:input?.url||'';
    const method=String(init?.method||(typeof input!=='string'&&input?.method)||'GET').toUpperCase();
    let nextInit=init;
    if(url.startsWith(NEWS)&&method==='POST'&&typeof init?.body==='string'){
      syncAll();
      try{
        const payload=JSON.parse(init.body),textCards=[...document.querySelectorAll('.text-block[data-richtext="1"]')].filter(card=>String(card.querySelector('.block-text')?.value||'').trim());let ti=0;
        if(Array.isArray(payload.content_blocks))for(const block of payload.content_blocks){if(block?.type!=='text')continue;const card=textCards[ti++],state=card?richByBlock.get(card.dataset.blockId):null;if(state){block.text=state.text;block.html=sanitizeHtml(state.html);block.style=ALLOWED_STYLES.has(state.style)?state.style:'body'}}
        nextInit={...init,body:JSON.stringify(payload)};
      }catch(e){console.warn('Rich text save patch:',e)}
    }
    const response=await nativeFetch(input,nextInit);
    if(url.startsWith(NEWS)){
      try{
        const data=await response.clone().json();
        const list=Array.isArray(data?.items)?data.items:data?.item?[data.item]:[];
        for(const n of list)if(Number.isInteger(Number(n?.id)))newsById.set(Number(n.id),n);
      }catch{}
    }
    return response;
  };

  injectStyle();
  const observer=new MutationObserver(()=>queueMicrotask(enhanceAll));observer.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('selectionchange',()=>{const card=document.activeElement?.closest?.('.text-block[data-richtext="1"]');if(card)updateButtons(card)});
  enhanceAll();
})();