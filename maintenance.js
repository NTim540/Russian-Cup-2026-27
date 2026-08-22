(()=>{
  if(document.getElementById('maintenance-notice')) return;
  const style=document.createElement('style');
  style.id='maintenance-notice-style';
  style.textContent=`
    #maintenance-notice{position:relative;z-index:25;border-bottom:1px solid rgba(226,58,71,.45);background:linear-gradient(90deg,rgba(226,58,71,.18),rgba(226,58,71,.09));backdrop-filter:blur(12px)}
    #maintenance-notice .maintenance-in{width:min(1240px,calc(100% - 26px));margin:auto;display:flex;align-items:center;gap:12px;padding:11px 0;color:#ffd9dd;font-size:12px;font-weight:750;line-height:1.45}
    #maintenance-notice .maintenance-dot{width:9px;height:9px;border-radius:50%;background:#e23a47;box-shadow:0 0 0 5px rgba(226,58,71,.12);flex:0 0 auto}
    #maintenance-notice strong{color:#fff;font-weight:950;text-transform:uppercase;letter-spacing:.08em;font-size:11px;margin-right:5px}
    html[data-theme='light'] #maintenance-notice{background:linear-gradient(90deg,rgba(226,58,71,.10),rgba(226,58,71,.045));border-bottom-color:rgba(190,38,52,.22)}
    html[data-theme='light'] #maintenance-notice .maintenance-in{color:#7d2c35}
    html[data-theme='light'] #maintenance-notice strong{color:#a61f2c}
    @media(max-width:700px){#maintenance-notice .maintenance-in{width:min(100% - 22px,1240px);padding:10px 0;font-size:11px;align-items:flex-start}#maintenance-notice strong{font-size:10px}}
  `;
  document.head.appendChild(style);
  const notice=document.createElement('div');
  notice.id='maintenance-notice';
  notice.setAttribute('role','status');
  notice.innerHTML='<div class="maintenance-in"><span class="maintenance-dot" aria-hidden="true"></span><div><strong>Технические работы</strong>На сайте проводятся технические работы. Информация может временно отображаться неверно.</div></div>';
  const header=document.querySelector('header');
  if(header) header.insertAdjacentElement('afterend',notice);
  else document.body.prepend(notice);
})();