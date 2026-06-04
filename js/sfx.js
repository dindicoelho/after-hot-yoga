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

/* ---------- Música de fundo (loop sintetizado, opcional) ---------- */
const music = {on:false, timer:null, i:0};
// progressão simples em pentatônica (Hz; 0 = silêncio) — baixo + melodia alternados
const MUSIC_SEQ = [
  131, 0, 196, 262,  0, 196, 247, 196,
  147, 0, 220, 294,  0, 220, 262, 220,
  165, 0, 247, 330,  0, 247, 294, 247,
  147, 0, 220, 294,  0, 175, 220, 175,
];
function playMusicNote(freq){
  if(!freq) return;
  try{
    actx=actx||new (window.AudioContext||window.webkitAudioContext)();
    const o=actx.createOscillator(), gn=actx.createGain();
    o.type = freq<180 ? 'triangle' : 'square';      // graves arredondados, agudos chiptune
    o.frequency.value=freq; o.connect(gn); gn.connect(actx.destination);
    const t=actx.currentTime, vol = freq<180?0.06:0.035;
    gn.gain.setValueAtTime(0.0001,t);
    gn.gain.exponentialRampToValueAtTime(vol,t+0.02);
    gn.gain.exponentialRampToValueAtTime(0.0001,t+0.26);
    o.start(t); o.stop(t+0.28);
  }catch(e){}
}
function startMusic(){
  if(music.on) return; music.on=true; music.i=0;
  music.timer=setInterval(()=>{ playMusicNote(MUSIC_SEQ[music.i % MUSIC_SEQ.length]); music.i++; }, 210);
}
function stopMusic(){ music.on=false; if(music.timer){ clearInterval(music.timer); music.timer=null; } }

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
