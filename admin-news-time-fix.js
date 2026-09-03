(()=>{
  const apply=()=>{
    const input=document.querySelector('#newsDate');
    if(!input||input.dataset.anyTime==='1')return;
    input.dataset.anyTime='1';
    input.type='text';
    input.removeAttribute('min');
    input.removeAttribute('max');
    input.placeholder='Например: 2026-09-03T14:30';
    input.autocomplete='off';
    const label=input.closest('.field')?.querySelector('label');
    if(label)label.textContent='Дата и время публикации · любое';
    const hint=document.createElement('div');
    hint.className='muted';
    hint.style.marginTop='5px';
    hint.textContent='Можно указать прошедшую, текущую или будущую дату и время. Формат: ГГГГ-ММ-ДДTЧЧ:ММ';
    input.insertAdjacentElement('afterend',hint);
  };
  const obs=new MutationObserver(apply);
  obs.observe(document.body,{childList:true,subtree:true});
  apply();
})();
