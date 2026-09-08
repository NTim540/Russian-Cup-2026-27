(()=>{
  const API='https://wcucbtdfkghjirpbqzzk.supabase.co/functions/v1/russian-cup-team-admin';
  const MAX=5*1024*1024;
  function mount(){
    const input=document.querySelector('#teamHeroImageUrl');
    if(!input||document.querySelector('#teamHeroFile'))return;
    const box=document.createElement('div');
    box.style.marginTop='10px';
    box.innerHTML='<label for="teamHeroFile">Загрузить фото с компьютера</label><input id="teamHeroFile" class="input" type="file" accept="image/jpeg,image/png,image/webp"><div class="muted" style="margin-top:6px">JPG, PNG или WebP, до 5 МБ. После загрузки нажмите «Сохранить команду».</div><div role="status" aria-live="polite" class="muted" style="margin-top:6px"></div><img alt="Предпросмотр фото города / арены" hidden style="max-width:100%;max-height:180px;margin-top:10px;border-radius:8px">';
    input.insertAdjacentElement('afterend',box);
    const fileInput=box.querySelector('input'),status=box.querySelector('[role="status"]'),preview=box.querySelector('img');
    fileInput.addEventListener('change',async()=>{
      const file=fileInput.files?.[0];
      if(!file)return;
      if(!['image/jpeg','image/png','image/webp'].includes(file.type)||!file.size||file.size>MAX){
        status.textContent='Выберите JPG, PNG или WebP размером до 5 МБ.';fileInput.value='';return;
      }
      const teamId=document.querySelector('#teamAdminSelect')?.value;
      const controls=[...document.querySelectorAll('#teamAdminForm input,#teamAdminForm button,#teamAdminSelect,#teamAdminReload')];
      const disabled=controls.map(el=>el.disabled);
      controls.forEach(el=>el.disabled=true);
      status.textContent='Загружаю фото…';
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),60000);
      try{
        const decoded=await createImageBitmap(file);decoded.close();
        const r=await fetch(API+'?action=upload_team_hero&id='+encodeURIComponent(teamId),{
          method:'POST',headers:{'Content-Type':file.type,'x-admin-password':PW},body:file,signal:controller.signal
        });
        const b=await r.json().catch(()=>({}));
        if(!r.ok||!b.ok||!b.url)throw Error(b.error||'Не удалось загрузить фото');
        if(!input.isConnected||document.querySelector('#teamAdminSelect')?.value!==teamId)return;
        input.value=b.url;
        input.dispatchEvent(new Event('input',{bubbles:true}));
        preview.src=b.url;preview.hidden=false;
        status.textContent='Фото загружено. Нажмите «Сохранить команду», чтобы обновить сайт.';
      }catch(e){status.textContent=e.name==='AbortError'?'Загрузка заняла слишком много времени. Попробуйте ещё раз.':'Ошибка загрузки: '+(e.message||'Проверьте файл и повторите попытку.');}
      finally{clearTimeout(timer);controls.forEach((el,i)=>el.disabled=disabled[i]);fileInput.value='';}
    });
  }
  const form=document.querySelector('#teamAdminForm');
  if(form){new MutationObserver(mount).observe(form,{childList:true,subtree:true});mount();}
})();
