(()=>{
  const API='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-news';
  const ALLOWED_STYLES=new Set(['body','subtitle','heading']);
  let item=null,loading=false;

  function safeHref(value){try{const u=new URL(String(value||''));return ['http:','https:'].includes(u.protocol)?u.toString():null}catch{return null}}
  function sanitizeHtml(raw){
    const src=new DOMParser().parseFromString('<body>'+String(raw||'')+'</body>','text/html').body;
    const out=document.createElement('div');
    const allowed=new Set(['P','DIV','BR','STRONG','B','EM','I','U','S','STRIKE','A','UL','OL','LI','BLOCKQUOTE']);
    function copy(node,parent){
      if(node.nodeType===Node.TEXT_NODE){parent.appendChild(document.createTextNode(node.nodeValue||''));return}
      if(node.nodeType!==Node.ELEMENT_NODE)return;
      const tag=node.tagName.toUpperCase();
      if(!allowed.has(tag)){[...node.childNodes].forEach(ch=>copy(ch,parent));return}
      const canonical={B:'STRONG',I:'EM',STRIKE:'S'}[tag]||tag,el=document.createElement(canonical.toLowerCase());
      if(canonical==='A'){
        const href=safeHref(node.getAttribute('href'));if(!href){[...node.childNodes].forEach(ch=>copy(ch,parent));return}
        el.href=href;el.target='_blank';el.rel='noopener noreferrer';
      }
      [...node.childNodes].forEach(ch=>copy(ch,el));parent.appendChild(el);
    }
    [...src.childNodes].forEach(n=>copy(n,out));return out.innerHTML;
  }
  function injectStyle(){
    if(document.getElementById('news-richtext-public-style'))return;
    const s=document.createElement('style');s.id='news-richtext-public-style';s.textContent=`
      .article-block-text.rich-body{font-size:16px;line-height:1.75;color:#d7e0eb}.article-block-text.rich-subtitle{font-size:21px;line-height:1.42;font-weight:700;color:#dbe7f3;letter-spacing:-.012em;margin-top:24px}.article-block-text.rich-heading{font-size:30px;line-height:1.16;font-weight:900;color:#f5f8fc;letter-spacing:-.035em;margin-top:30px}.article-block-text.rich-heading p,.article-block-text.rich-heading div,.article-block-text.rich-subtitle p,.article-block-text.rich-subtitle div{margin:0 0 10px}.article-block-text.rich-heading p:last-child,.article-block-text.rich-heading div:last-child,.article-block-text.rich-subtitle p:last-child,.article-block-text.rich-subtitle div:last-child{margin-bottom:0}.article-block-text ul,.article-block-text ol{margin:10px 0 18px;padding-left:26px}.article-block-text li{margin:5px 0}.article-block-text blockquote{margin:16px 0;padding:14px 17px;border-left:3px solid #56a9f0;border-radius:0 12px 12px 0;background:rgba(127,198,255,.055);color:#cad9e7}.article-block-text a{color:#86c9ff;text-decoration:underline;text-underline-offset:3px}.article-block-text u{text-underline-offset:3px}.article-block-text s{opacity:.8}
      @media(max-width:600px){.article-block-text.rich-subtitle{font-size:19px}.article-block-text.rich-heading{font-size:25px}}
    `;document.head.appendChild(s);
  }
  async function loadItem(){
    const id=Number(new URLSearchParams(location.search).get('id'));if(!Number.isInteger(id)||id<1||loading)return null;if(item&&Number(item.id)===id)return item;loading=true;
    try{const r=await fetch(API+'?id='+id,{cache:'no-store'}),b=await r.json();if(r.ok&&b.item)item=b.item}catch(e){console.warn('Rich news text:',e)}finally{loading=false}return item;
  }
  async function apply(){
    const n=await loadItem();if(!n)return;
    const richBlocks=Array.isArray(n.content_blocks)?n.content_blocks.filter(b=>b?.type==='text'):[];
    const nodes=[...document.querySelectorAll('#articleStream .article-block-text')];
    nodes.forEach((node,i)=>{
      const b=richBlocks[i];if(!b||node.dataset.richApplied==='1')return;
      const style=ALLOWED_STYLES.has(b.style)?b.style:'body';node.classList.remove('rich-body','rich-subtitle','rich-heading');node.classList.add('rich-'+style);node.dataset.richApplied='1';
      if(String(b.html||'').trim())node.innerHTML=sanitizeHtml(b.html);
    });
  }
  injectStyle();
  const observer=new MutationObserver(()=>queueMicrotask(apply));observer.observe(document.documentElement,{childList:true,subtree:true});
  apply();
})();