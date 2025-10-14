try{
  console.log('[popunder-debug] script loaded');
  window.__popunder_debug_loaded = true;
  // poll for popMagic exposure (if vendor script exposes it)
  setTimeout(function(){
    try{
      console.log('[popunder-debug] popMagic present?', !!window.popMagic, typeof window.popMagic);
      console.log('[popunder-debug] __popunder_loaded?', !!window.__popunder_loaded);
    }catch(e){
      console.error('[popunder-debug] error checking popMagic', e);
    }
  }, 500);
}catch(e){
  // fail silently
}
