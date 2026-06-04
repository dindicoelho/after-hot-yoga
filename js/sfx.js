/* ============================================================
   SFX (WebAudio minimalista)
   ============================================================ */
let actx;

// Desbloqueia o áudio dentro de um gesto do usuário (necessário em iOS/Android)
function unlockAudio(){
  try{
    actx = actx || new (window.AudioContext||window.webkitAudioContext)();
    if(actx.state==='suspended') actx.resume();
  }catch(e){}
}

function sfx(type){
  try{
    actx=actx||new (window.AudioContext||window.webkitAudioContext)();
    const o=actx.createOscillator(), gn=actx.createGain(); o.connect(gn); gn.connect(actx.destination);
    const t=actx.currentTime; let f=200, d=0.1, vol=0.12, ty='square';
    switch(type){
      case 'select': f=520; d=0.07; break;
      case 'jump': f=380; d=0.12; o.frequency.setValueAtTime(280,t); o.frequency.exponentialRampToValueAtTime(520,t+0.1); break;
      case 'swing': f=160; d=0.08; ty='sawtooth'; break;
      case 'heavy': f=90; d=0.16; ty='sawtooth'; break;
      case 'hit': f=120; d=0.12; ty='square'; vol=0.16; break;
      case 'block': f=300; d=0.06; break;
      case 'explode': f=70; d=0.32; ty='sawtooth'; vol=0.2; break;
      case 'special': f=300; d=0.3; ty='sawtooth'; vol=0.18; o.frequency.setValueAtTime(200,t); o.frequency.exponentialRampToValueAtTime(700,t+0.28); break;
    }
    o.type=ty; o.frequency.setValueAtTime(f,t);
    gn.gain.setValueAtTime(vol,t); gn.gain.exponentialRampToValueAtTime(0.001,t+d);
    o.start(t); o.stop(t+d);
  }catch(e){}
}
