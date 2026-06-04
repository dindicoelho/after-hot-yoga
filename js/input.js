/* ============================================================
   INPUT — teclado (e toque, ver setupTouchControls em ui.js)
   ============================================================ */
addEventListener('keydown',e=>{
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
  keys[e.key.toLowerCase()]=true;
  if(e.key.toLowerCase()==='r' && document.getElementById('fight').classList.contains('active')) startFight();
});
addEventListener('keyup',e=>{ keys[e.key.toLowerCase()]=false; });

// solta todas as teclas se a janela perde o foco (evita tecla "presa")
addEventListener('blur', ()=>{ for(const k in keys) keys[k]=false; });
addEventListener('visibilitychange', ()=>{ if(document.hidden){ for(const k in keys) keys[k]=false; } });

function pressing(...k){ return k.some(x=>keys[x]); }
