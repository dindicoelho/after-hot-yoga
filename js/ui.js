/* ============================================================
   UI — telas de seleção, HUD, mensagens, loop principal
   ============================================================ */
let chosenChar=null, chosenWeapon=null;

function buildCharGrid(){
  const grid=document.getElementById('charGrid');
  CHARACTERS.forEach(c=>{
    const card=document.createElement('div');
    card.className='card';
    const cv=document.createElement('canvas'); cv.width=84; cv.height=108;
    const ctx=cv.getContext('2d'); ctx.imageSmoothingEnabled=false;
    drawCharacter(ctx, c, 84/SW, {arm:0.3, leg:0});
    card.appendChild(cv);
    const nm=document.createElement('div'); nm.className='nm'; nm.textContent=c.name; card.appendChild(nm);
    card.onclick=()=>{
      chosenChar=c;
      document.querySelectorAll('#charGrid .card').forEach(e=>e.classList.remove('sel'));
      card.classList.add('sel');
      document.getElementById('selHint').textContent='→ '+c.name+' selecionado';
      document.getElementById('toWeapons').style.display='inline-block';
      sfx('select');
    };
    grid.appendChild(card);
  });
}

function buildWeaponGrid(){
  const grid=document.getElementById('weaponGrid');
  WEAPONS.forEach(w=>{
    const card=document.createElement('div');
    card.className='card';
    const cv=document.createElement('canvas'); cv.width=120; cv.height=120;
    const ctx=cv.getContext('2d'); ctx.imageSmoothingEnabled=false;
    ctx.save(); ctx.translate(52,98); drawHeldWeapon(ctx,w,7,0,0,0); ctx.restore();
    card.appendChild(cv);
    const nm=document.createElement('div'); nm.className='nm'; nm.innerHTML=w.name+' <span style="color:var(--hot);font-size:11px">['+w.tag+']</span>'; card.appendChild(nm);
    const ds=document.createElement('div'); ds.className='ds'; ds.textContent=w.desc; card.appendChild(ds);
    card.onclick=()=>{
      chosenWeapon=w;
      document.querySelectorAll('#weaponGrid .card').forEach(e=>e.classList.remove('sel'));
      card.classList.add('sel');
      document.getElementById('toFight').style.display='inline-block';
      sfx('select');
    };
    grid.appendChild(card);
  });
}

function go(screen){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(screen).classList.add('active');
}

function startFight(){
  go('fight');
  player = mkFighter(chosenChar, chosenWeapon, 130, 1, 100, true);
  enemy  = mkFighter(CARIOCA, null, 350, -1, 130, false);
  projectiles=[]; fx=[]; waves=[]; floaters=[]; shake=0; flashScreen=0; hitstop=0; gameState='intro'; msg='ROUND 1'; msgT=90;
  if(!raf) loop();
}

/* ---------- HUD ---------- */
function drawHUD(){
  // barras de vida
  bar(20,16,180, player.hp/player.maxhp, '#7bdc8a', chosenChar.name.toUpperCase());
  bar(GW-20-180,16,180, enemy.hp/enemy.maxhp, '#ff3b6b', 'A CARIOCA', true);
  // barras de especial
  meterBar(20, 34, 150, player.meter/100, false, player);
  meterBar(GW-20-150, 34, 150, enemy.meter/100, true, enemy);
  // arma
  g.fillStyle='#ffcf6b'; g.font='10px Trebuchet MS'; g.textAlign='left';
  g.fillText('🥤 '+chosenWeapon.name, 22, 62);
}
function meterBar(x,y,w,pct,right,f){
  g.fillStyle='#0008'; g.fillRect(x-1,y-1,w+2,8);
  g.fillStyle='#2a2030'; g.fillRect(x,y,w,6);
  const full=pct>=1, blink=(f.t%16<8);
  g.fillStyle= full ? (blink?'#ffffff':'#ffcf3b') : '#caa15a';
  const bw=w*Math.min(1,pct);
  g.fillRect(right?x+w-bw:x, y, bw, 6);
  if(f.special){
    g.textAlign=right?'right':'left';
    if(full){ g.fillStyle=blink?'#ffffff':'#ffcf3b'; g.font='bold 9px Trebuchet MS';
      g.fillText('★ '+f.special.name+(f.isPlayer?' [I]':''), right?x+w:x, y+15); }
    else { g.fillStyle='#9a8a7a'; g.font='8px Trebuchet MS';
      g.fillText(f.special.name, right?x+w:x, y+15); }
  }
}
function bar(x,y,w,pct,color,label,right){
  g.fillStyle='#0008'; g.fillRect(x-2,y-2,w+4,16);
  g.fillStyle='#3a2730'; g.fillRect(x,y,w,12);
  g.fillStyle=color; const bw=w*Math.max(0,pct);
  g.fillRect(right?x+w-bw:x, y, bw, 12);
  g.fillStyle='#fff'; g.font='bold 11px Trebuchet MS';
  g.textAlign=right?'right':'left'; g.fillText(label, right?x+w:x, y-5);
}

function drawMsg(){
  if(msgT<=0) return; msgT--;
  g.save(); g.textAlign='center';
  g.font='bold 40px Trebuchet MS';
  g.fillStyle='#000'; g.fillText(msg,242,140);
  g.fillStyle=gameState==='over'?'#ffcf6b':'#ff5a3c'; g.fillText(msg,240,138);
  if(gameState==='over'){ g.fillStyle='#f6e9df'; g.font='14px Trebuchet MS'; g.fillText('aperte R para revanche',240,168); }
  g.restore();
}

/* ---------- loop ---------- */
function loop(){
  raf=requestAnimationFrame(loop);

  // hitstop (freeze-frame): congela a simulação por uns frames, mas continua desenhando
  if(hitstop>0 && gameState==='fight'){
    hitstop--;
    if(shake>0)shake*=0.85; if(shake<0.4)shake=0;   // o tremor continua durante o congela (dá o "crunch")
    render();
    return;
  }

  if(gameState==='intro'){ msgT--; if(msgT<=0){gameState='fight'; msg='';} }

  if(gameState==='fight'){
    updateFighter(player, enemy);
    updateFighter(enemy, player);
    updateProjectiles();
  } else {
    // ainda atualiza física residual (knockback/ko)
    [player,enemy].forEach(f=>{ f.x+=f.vx; f.y+=f.vy; if(f.y<GROUND){f.vy+=GRAV;}else{f.y=GROUND;f.vy=0;} f.vx*=0.85; });
    updateProjectiles();
  }
  updateFx(); updateWaves(); updateFloaters();
  if(shake>0)shake*=0.85; if(shake<0.4)shake=0;
  if(flashScreen>0)flashScreen--;

  render();
}

function render(){
  g.save();
  g.clearRect(0,0,GW,GH);
  if(shake>0.5) g.translate((Math.random()-0.5)*shake,(Math.random()-0.5)*shake);
  drawBackground();
  // ordena por x pra profundidade simples
  const order=[player,enemy].sort((a,b)=>a.y-b.y);
  order.forEach(drawFighter);
  projectiles.forEach(drawProjectile);
  drawWaves();
  fx.forEach(p=>{ g.globalAlpha=Math.max(0,p.life/18); g.fillStyle=p.color; g.fillRect(p.x-2,p.y-2,4,4); g.globalAlpha=1; });
  drawFloaters();
  g.restore();
  if(flashScreen>0){ g.fillStyle='rgba(255,255,255,'+(flashScreen/14)+')'; g.fillRect(0,0,GW,GH); }
  drawHUD();
  drawMsg();
}

function drawFloaters(){
  g.textAlign='center';
  floaters.forEach(f=>{
    const a=Math.max(0, Math.min(1, f.life/f.maxlife));
    const pop=f.life>f.maxlife-6 ? 1.25 : 1;            // "pop" rápido ao aparecer
    const size=(f.big?20:14)*pop;
    g.globalAlpha=a; g.font='bold '+size.toFixed(0)+'px Trebuchet MS';
    g.fillStyle='#000'; g.fillText(f.text, f.x+1, f.y+1);   // contorno escuro
    g.fillStyle=f.color; g.fillText(f.text, f.x, f.y);
    g.globalAlpha=1;
  });
}

/* ============================================================
   CONTROLES TOUCH (mobile)
   ============================================================ */
const IS_TOUCH = ('ontouchstart' in window) || (navigator.maxTouchPoints>0);

function setupTouchControls(){
  if(!IS_TOUCH) return;
  document.body.classList.add('touch');

  // cada botão segura uma tecla "virtual" enquanto pressionado
  document.querySelectorAll('#touchControls [data-key]').forEach(btn=>{
    const key=btn.getAttribute('data-key');
    const down=e=>{ e.preventDefault(); unlockAudio(); keys[key]=true; btn.classList.add('on'); };
    const up=e=>{ e.preventDefault(); keys[key]=false; btn.classList.remove('on'); };
    btn.addEventListener('touchstart',down,{passive:false});
    btn.addEventListener('touchend',up,{passive:false});
    btn.addEventListener('touchcancel',up,{passive:false});
  });

  // botão de reiniciar (chama startFight direto — o R vive no handler de teclado)
  const rst=document.getElementById('btnRestart');
  if(rst) rst.addEventListener('touchstart',e=>{ e.preventDefault(); unlockAudio(); startFight(); },{passive:false});

  // desbloqueia áudio no primeiro toque em qualquer lugar
  addEventListener('touchstart', unlockAudio, {once:true, passive:true});
}

/* init */
buildCharGrid();
buildWeaponGrid();
setupTouchControls();
