(()=>{
  const ID='maintenance-notice',STYLE_ID='maintenance-notice-style';
  if(document.getElementById(ID))return;

  if(!document.getElementById(STYLE_ID)){
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      #${ID}{position:relative;z-index:70;border-bottom:1px solid rgba(127,198,255,.16);background:linear-gradient(90deg,rgba(47,111,237,.13),rgba(10,28,47,.96) 38%,rgba(226,58,71,.07));color:#e8f2fb}
      #${ID} .mn-inner{width:min(1240px,calc(100% - 32px));margin:auto;min-height:54px;display:flex;align-items:center;gap:13px;padding:9px 0}
      #${ID} .mn-icon{width:30px;height:30px;flex:0 0 30px;display:grid;place-items:center;border-radius:9px;border:1px solid rgba(127,198,255,.22);background:rgba(127,198,255,.08);font-size:14px}
      #${ID} .mn-copy{min-width:0;display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;line-height:1.4}
      #${ID} strong{font-size:11px;text-transform:uppercase;letter-spacing:.09em;font-weight:950;color:#cfeaff}
      #${ID} span{font-size:12px;color:#9fb0c4}
      html[data-theme='light'] #${ID}{background:linear-gradient(90deg,rgba(47,111,237,.08),rgba(255,255,255,.96) 42%,rgba(226,58,71,.04));border-bottom-color:rgba(20,45,80,.10);color:#102139}
      html[data-theme='light'] #${ID} .mn-icon{background:rgba(47,111,237,.06);border-color:rgba(47,111,237,.15)}
      html[data-theme='light'] #${ID} strong{color:#245a94}
      html[data-theme='light'] #${ID} span{color:#66788e}
      @media(max-width:680px){#${ID} .mn-inner{width:calc(100% - 20px);align-items:flex-start;padding:10px 0}#${ID} .mn-copy{display:grid;gap:2px}#${ID} span{font-size:11px}}
    `;
    document.head.appendChild(style);
  }

  const notice=document.createElement('div');
  notice.id=ID;
  notice.setAttribute('role','status');
  notice.innerHTML=`<div class="mn-inner"><div class="mn-icon" aria-hidden="true">⚙</div><div class="mn-copy"><strong>Технические работы</strong><span>Ведём работу по оптимизации карточек команд. Отдельные элементы на страницах команд могут временно отображаться нестабильно.</span></div></div>`;

  const header=document.querySelector('.site-header,.header');
  if(header)header.insertAdjacentElement('afterend',notice);else document.body.prepend(notice);
})();
