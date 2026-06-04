/* ============================================================
   FIGHT ENGINE — física, IA, golpes, projéteis
   ============================================================ */
const cv=document.getElementById('game'), g=cv.getContext('2d');
g.imageSmoothingEnabled=false;

let player, enemy, projectiles, fx, waves, floaters, shake, flashScreen, hitstop, gameState, msg, msgT, keys={}, raf;
let aiLevel='normal';                                  // dificuldade da IA (ver AI_LEVELS)
let lastWin=false, scoreboard=null;                    // resultado/placar pra tela de fim
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rint=(a,b)=>a+Math.floor(Math.random()*(b-a+1));   // inteiro aleatório em [a,b]

function mkFighter(cfg, weapon, x, facing, hp, isPlayer){
  return {
    cfg, weapon, x, y:GROUND, vx:0, vy:0, facing, hp, maxhp:hp, isPlayer,
    state:'idle', t:0, atkT:0, cd:0, onGround:true, invuln:0, blocking:false,
    legPhase:0, blink:0, flash:0, aiT:0, aiMode:'approach',
    meter:30, special:SPECIALS[cfg.id]||null, specialT:0, atkMulti:false
  };
}

/* ---------- update ---------- */
function updateFighter(f, foe){
  f.t++; f.blink=(f.blink+1)%180;
  if(f.invuln>0)f.invuln--; if(f.cd>0)f.cd--; if(f.flash>0)f.flash--; if(f.specialT>0)f.specialT--;
  if(f.state!=='ko') f.meter=Math.min(100, f.meter+0.42);   // enchimento passivo da barra de especial

  // sempre vira pro oponente quando parado
  if(f.state==='idle'||f.state==='walk') f.facing = foe.x>f.x?1:-1;

  if(f.state==='frozen'){
    f.atkT--; f.vx*=0.7;
    f.x+=f.vx; f.y+=f.vy; if(f.y<GROUND){f.vy+=GRAV;} else {f.y=GROUND;f.vy=0;f.onGround=true;}
    if(f.atkT<=0) f.state='idle';
    return;
  }
  if(f.state==='hit'){ f.atkT--; if(f.atkT<=0) f.state='idle'; }
  else if(f.state==='ko'){ /* nada */ }
  else if(f.state==='attack'){
    f.atkT--;
    if(f.atkMulti){                                 // vários toques (jato, chicote, rodopio, corridinha)
      if(f.atkT<=f.atkActive && f.atkHitsLeft>0){
        if(f.atkHitGap<=0){ doMeleeHit(f, foe); f.atkHitsLeft--; f.atkHitGap=4; }
        else f.atkHitGap--;
      }
    } else if(f.atkActive>=0 && f.atkT===f.atkActive){
      doMeleeHit(f, foe);
    }
    if(f.atkT<=0) f.state='idle';
  } else {
    // controle (player) ou IA (enemy)
    if(f.isPlayer) controlPlayer(f, foe); else aiControl(f, foe);
  }

  // física
  f.x += f.vx;
  f.y += f.vy;
  if(f.y<GROUND){ f.vy+=GRAV; f.onGround=false; }
  else { f.y=GROUND; f.vy=0; if(!f.onGround){f.onGround=true;} }
  f.vx*=0.8;
  f.x=Math.max(24,Math.min(GW-24,f.x));

  if(f.state==='walk' && Math.abs(f.vx)<0.4 && f.onGround) f.state='idle';
  if(f.onGround && f.state==='jump') f.state='idle';
  f.legPhase += Math.abs(f.vx)*0.3;
}

function controlPlayer(f, foe){
  f.blocking = pressing('l') && f.onGround;
  if(f.blocking){ f.vx*=0.5; f.state='idle'; return; }
  let mv=0;
  if(pressing('arrowleft','a')) mv=-1;
  if(pressing('arrowright','d')) mv=1;
  if(mv!==0 && f.onGround){ f.vx=mv*2.4; f.facing=mv; f.state='walk'; }
  if(pressing('arrowup','w',' ') && f.onGround){ f.vy=-10; f.state='jump'; sfx('jump'); }
  if(keys['i'] && f.special && f.meter>=100 && f.cd<=0){ useSpecial(f, foe); return; }
  if(keys['j'] && f.cd<=0){ startAttack(f, 'punch'); }
  if(keys['k'] && f.cd<=0){ startWeapon(f, foe); }
}

function aiControl(f, foe){
  const L = AI_LEVELS[aiLevel] || AI_LEVELS.normal;
  f.aiT--;
  f.blocking=false;
  const dist=Math.abs(foe.x-f.x);
  const dir = foe.x>f.x?1:-1;
  f.facing = dir;

  // 1) REAÇÃO ao ataque do player: decide UMA vez por ataque (trava o sorteio)
  if(foe.state==='attack' && dist<72 && f.onGround){
    if(!f.reacted){ f.reacted=true; f.reactRoll=Math.random(); }
    if(f.reactRoll < L.reactBlock){ f.blocking=true; f.vx*=0.5; return; }          // defende
    if(f.reactRoll < L.reactBlock+0.22 && dist<46){ f.vx=-dir*L.speed; f.state='walk'; return; } // se esquiva pra trás
  } else { f.reacted=false; }

  // 2) ESPECIAL quando a barra enche e está no alcance
  if(f.special && f.meter>=100 && f.cd<=0 && dist<L.spRange){ useSpecial(f,foe); f.aiMode='wait'; f.aiT=22; return; }

  // 3) ANTI-AÉREO: player no ar e perto → soco quando dá
  if(!foe.onGround && dist<66 && f.onGround && f.cd<=0 && Math.random()<L.antiAir){ startAttack(f,'punch'); return; }

  // 4) PUNIR whiff: player em recuperação (cd) e perto → fecha e bate
  if(foe.cd>0 && foe.state!=='attack' && f.onGround && f.cd<=0 && dist<82 && Math.random()<L.punish){
    if(dist<58){ startAttack(f,'punch'); return; }
    f.aiMode='approach'; f.aiT=10;
  }

  // 5) DECISÃO periódica de modo (já não é determinística)
  if(f.aiT<=0){
    const r=Math.random();
    if(dist>80){ f.aiMode='approach'; f.aiT=rint(L.delayMin,L.delayMax); }
    else if(dist<32){ f.aiMode = r<0.55?'attack':'retreat'; f.aiT=14; }   // colado: bate ou afasta
    else if(r<L.aggression){ f.aiMode='attack'; f.aiT=16; }
    else if(r<L.aggression+0.16){ f.aiMode='retreat'; f.aiT=16; }
    else { f.aiMode='jump'; f.aiT=28; }
  }

  // 6) EXECUTA o modo escolhido
  if(f.aiMode==='approach' && f.onGround){ f.vx=dir*L.speed; f.state='walk'; }
  else if(f.aiMode==='retreat' && f.onGround){ f.vx=-dir*L.speed*0.9; f.state='walk'; }
  else if(f.aiMode==='jump' && f.onGround){ f.vy=-9; f.vx=dir*1.6; f.state='jump'; f.aiMode='approach'; }
  else if(f.aiMode==='attack'){
    if(dist<60 && f.cd<=0){ startAttack(f,'punch'); f.aiMode='approach'; f.aiT=rint(8,18); }
    else if(f.onGround){ f.vx=dir*L.speed; f.state='walk'; }   // fora do alcance: aproxima
  }
  else if(f.aiMode==='wait'){ f.vx*=0.7; }
}

function startAttack(f, kind){
  f.state='attack'; f.atkT=18; f.atkActive=10; f.atkKind='punch';
  f.atkDmg=8; f.atkReach=30; f.atkKnock=4; f.atkStun=0; f.atkFreeze=0; f.atkHitsLeft=1; f.atkMulti=false;
  f.cd=22; f.vx+=f.facing*0.5;
  sfx('swing');
}
function startWeapon(f, foe){
  const w=f.weapon; if(!w) return;
  f.cd=w.cooldown;
  if(w.kind==='grenade'){
    projectiles.push({x:f.x+f.facing*14, y:f.y-42, vx:f.facing*4.6, vy:-4.4, owner:f, w, spin:0, type:'grenade'});
    f.state='attack'; f.atkT=16; f.atkActive=-1; f.atkKind='throw'; sfx('swing'); return;
  }
  if(w.kind==='boomerang'){
    projectiles.push({x:f.x+f.facing*14, y:f.y-42, vx:f.facing*6, vy:0, owner:f, w, spin:0, type:'boomerang', age:0, hitCd:0});
    f.state='attack'; f.atkT=16; f.atkActive=-1; f.atkKind='throw'; sfx('swing'); return;
  }
  // corpo-a-corpo: hammer / fast / spray / lunge / freeze
  f.state='attack'; f.atkKind=w.kind; f.atkDmg=w.dmg; f.atkReach=w.reach;
  f.atkKnock=w.knock||4; f.atkStun=w.stun||0; f.atkFreeze=w.freeze||0;
  f.atkHitsLeft=w.hits||1; f.atkHitGap=0; f.atkMulti=(w.hits||1)>1;
  if(w.kind==='hammer'){ f.atkT=30; f.atkActive=15; f.vx+=f.facing*0.3; sfx('heavy'); }
  else if(w.kind==='lunge'){ f.atkT=22; f.atkActive=11; f.vx=f.facing*(w.dash||7); f.vy=-2.4; sfx('swing'); }
  else if(w.kind==='spray'){ f.atkT=28; f.atkActive=20; sfx('swing'); }
  else if(w.kind==='freeze'){ f.atkT=22; f.atkActive=12; sfx('swing'); }
  else { f.atkT=16; f.atkActive=9; f.vx+=f.facing*0.6; sfx('swing'); } // fast
}

function useSpecial(f, foe){
  const s=f.special; if(!s) return;
  f.meter=0; f.cd=42; f.specialT=22;
  const dir=f.facing;
  sfx('special'); fx.push(...burst(f.x, f.y-40, s.color, 12));
  switch(s.type){
    case 'projectile':{
      const type = s.boomerang?'boomerang':(s.explode?'grenade':'shot');
      projectiles.push({x:f.x+dir*16, y:f.y-42, vx:dir*(s.speed||6), vy:s.arc?-4.2:0, owner:f, special:s,
        big:!!s.big, render:s.render, w:{dmg:s.dmg, knock:s.knock||6, color:s.color, cap:shade(s.color,-22)},
        spin:0, type, age:0, hitCd:0});
      f.state='attack'; f.atkT=18; f.atkActive=-1; f.atkKind='throw'; f.atkMulti=false;
      break;
    }
    case 'rain':{   // chuva de café / compras do mercado livre
      const n=s.drops||6, base=foe.x;
      for(let i=0;i<n;i++){
        const dx=(i-(n-1)/2)*22 + ((i*53)%17-8);
        projectiles.push({x:clamp(base+dx,12,GW-12), y:-10-i*14, vx:0, vy:2.2, owner:f, special:s,
          render:s.render, w:{dmg:s.dmg, knock:s.knock||5, color:s.color, cap:shade(s.color,-22)}, spin:0, type:'grenade', age:0, hitCd:0});
      }
      f.state='attack'; f.atkT=22; f.atkActive=-1; f.atkKind='cast';
      break;
    }
    case 'beam':{   // raio do bom gosto: linha instantânea pra frente
      pushBeam(f.x+dir*14, f.y-42, dir, GW, s.color);
      if((foe.x-f.x)*dir>0 && Math.abs(foe.y-f.y)<48) hit(foe, s.dmg, dir, s.knock||8, {}, f);
      f.state='attack'; f.atkT=22; f.atkActive=-1; f.atkKind='cast'; shake=8; flashScreen=7;
      break;
    }
    case 'melee':{   // chicote / cabeçada / coice / corridinha / chute de bunda
      f.state='attack'; f.atkKind='special'; f.atkDmg=s.dmg; f.atkReach=s.reach||34;
      f.atkKnock=s.knock||6; f.atkStun=s.stun||0; f.atkFreeze=0;
      f.atkHitsLeft=s.hits||1; f.atkHitGap=0; f.atkMulti=(s.hits||1)>1;
      f.atkColor=s.color;
      if((s.hits||1)>1){ f.atkT=28; f.atkActive=20; } else { f.atkT=22; f.atkActive=11; }
      if(s.dashVx){ f.vx=dir*s.dashVx; f.vy=-2; }
      break;
    }
    case 'spin':{    // rodopio: acerta dos dois lados
      f.state='attack'; f.atkKind='spin'; f.atkDmg=s.dmg; f.atkReach=s.range||40;
      f.atkKnock=s.knock||6; f.atkStun=0; f.atkFreeze=0; f.atkColor=s.color;
      f.atkHitsLeft=s.hits||3; f.atkHitGap=0; f.atkMulti=true; f.atkT=28; f.atkActive=22;
      break;
    }
    case 'shockwave':{   // onda pastel / diva pop / ice plunge (com freeze)
      pushWave(f.x+dir*8, f.y-40, s.range||72, s.color);
      if((foe.x-f.x)*dir>-12 && Math.abs(foe.x-f.x)<(s.range||72) && Math.abs(foe.y-f.y)<64)
        hit(foe, s.dmg, dir, s.knock||8, s.freeze?{freeze:s.freeze}:{}, f);
      f.state='attack'; f.atkT=24; f.atkActive=-1; f.atkKind='cast'; shake=10;
      break;
    }
    case 'flash':{   // flash / paralisação do tempo (freeze longo)
      pushWave(f.x, f.y-40, s.range||90, s.color); flashScreen=12;
      if(Math.abs(foe.x-f.x)<(s.range||90))
        hit(foe, s.dmg||6, foe.x>f.x?1:-1, 3, s.freeze?{freeze:s.freeze}:{stun:s.stun||50}, f);
      f.state='attack'; f.atkT=20; f.atkActive=-1; f.atkKind='cast'; shake=6;
      break;
    }
    case 'teleport':{
      hit(foe, s.dmg, dir, 8, {}, f);
      f.x = clamp(foe.x + dir*30, 24, GW-24); f.facing=-dir; f.invuln=16;
      fx.push(...burst(foe.x, foe.y-40, s.color, 16));
      f.state='attack'; f.atkT=18; f.atkActive=-1; f.atkKind='cast';
      break;
    }
    case 'grab':{   // empilhadeira: agarra e arremessa pro alto
      if(Math.abs(foe.x-f.x)<(s.range||36) && foe.state!=='ko'){
        hit(foe, s.dmg, dir, 6, {stun:42}, f);
        foe.vy=s.launch?-12:-7; foe.vx=dir*(s.launch?5:2); shake=14;
        fx.push(...burst(foe.x, foe.y-40, s.color||'#fff', 14));
      } else { f.meter=70; }   // errou: devolve parte da barra
      f.state='attack'; f.atkT=24; f.atkActive=-1; f.atkKind='grab';
      break;
    }
  }
}
function pushWave(x,y,r,color){ waves.push({type:'ring', x,y,r:6,maxR:r,color,life:16}); }
function pushBeam(x,y,dir,len,color){ waves.push({type:'beam', x,y,dir,len,color,life:12}); }
function updateWaves(){ for(let i=waves.length-1;i>=0;i--){ const w=waves[i]; if(w.type==='ring'){ w.r+=(w.maxR-w.r)*0.34+2; } w.life--; if(w.life<=0) waves.splice(i,1); } }
function drawWaves(){
  waves.forEach(w=>{
    g.save(); g.globalAlpha=Math.max(0,w.life/16);
    if(w.type==='beam'){
      const h=10+(12-w.life); g.fillStyle=w.color; g.fillRect(w.x, w.y-h/2, w.dir*w.len, h);
      g.fillStyle='#fff'; g.fillRect(w.x, w.y-2, w.dir*w.len, 4);
    } else {
      g.strokeStyle=w.color; g.lineWidth=3; g.beginPath(); g.arc(w.x, w.y, w.r, 0, 7); g.stroke();
      g.globalAlpha*=0.5; g.lineWidth=6; g.stroke();
    }
    g.restore();
  });
}

function doMeleeHit(f, foe){
  const dist=(foe.x-f.x)*f.facing;
  const inRange = f.atkKind==='spin' ? (Math.abs(foe.x-f.x)<f.atkReach && Math.abs(foe.y-f.y)<44)
                                     : (dist>-8 && dist<f.atkReach && Math.abs(foe.y-f.y)<44);
  if(inRange){
    const ddir = f.atkKind==='spin' ? (foe.x>f.x?1:-1) : f.facing;
    hit(foe, f.atkDmg, ddir, f.atkKnock, {stun:f.atkStun, freeze:f.atkFreeze, lowInvuln:f.atkMulti}, f);
    if(f.atkKind==='hammer'){ shake=12; fx.push(...burst(foe.x,foe.y-40,'#ffce6b',12)); }
    else if(f.atkKind==='spray'){ fx.push(...burst(foe.x,foe.y-40,'#bfe3f0',5)); }
    else if(f.atkKind==='freeze'){ fx.push(...burst(foe.x,foe.y-40,'#bfeaff',10)); }
    else if(f.atkColor && (f.atkKind==='special'||f.atkKind==='spin')){ fx.push(...burst(foe.x,foe.y-40,f.atkColor,7)); }
  } else if(f.atkKind==='spray'){
    for(let i=0;i<3;i++) fx.push({x:f.x+f.facing*(20+i*9), y:f.y-40+(i-1)*4, vx:f.facing*2.4, vy:0, life:8, color:'#cdeefa'});
  }
}

function hit(target, dmg, dir, knock, eff={}, attacker=null){
  if(target.invuln>0||target.state==='ko') return;
  if(target.blocking){ dmg*=0.25; knock*=0.4; sfx('block'); fx.push(...burst(target.x+dir*-10,target.y-40,'#9ad',5)); }
  else { sfx('hit'); fx.push(...burst(target.x,target.y-42,'#ff5a3c',8)); }
  target.hp=Math.max(0,target.hp-dmg);
  target.vx+=dir*knock; target.vy-=knock*0.4;
  target.invuln=eff.lowInvuln?3:12; target.flash=8;
  // número de dano flutuante
  floaters.push({x:target.x, y:target.y-58, vy:-0.85, life:46, maxlife:46,
    text:''+Math.round(dmg), color: target.blocking?'#9cc7ee':(dmg>=14?'#ffce6b':'#ffffff'), big:dmg>=14});
  // hitstop (freeze-frame) — quanto mais forte o golpe, mais "crunch"
  if(!target.blocking) hitstop=Math.max(hitstop, dmg>=16?7:(dmg>=10?4:1));
  // enche a barra de especial (quem apanha enche mais)
  target.meter=Math.min(100, target.meter + dmg*1.6);
  if(attacker) attacker.meter=Math.min(100, attacker.meter + dmg*1.1);
  if(!target.blocking){
    if(eff.freeze){ target.state='frozen'; target.atkT=eff.freeze; }
    else { target.state='hit'; target.atkT=eff.stun||14; }
  }
  shake=Math.max(shake, dmg>14?10:5);
  if(target.hp<=0){ target.state='ko'; target.vy=-6; target.vx=dir*4; shake=Math.max(shake,14); flashScreen=Math.max(flashScreen,10); hitstop=Math.max(hitstop,8); endFight(target); }
}

function updateProjectiles(){
  for(let i=projectiles.length-1;i>=0;i--){
    const p=projectiles[i]; p.spin+=0.5;
    const foe = p.owner.isPlayer?enemy:player;
    if(p.type==='boomerang'){
      p.age++; p.vx -= p.owner.facing*0.17; p.x+=p.vx;
      if(p.hitCd>0) p.hitCd--;
      if(p.hitCd<=0 && Math.abs(p.x-foe.x)<20 && Math.abs(p.y-(foe.y-42))<36){
        hit(foe, p.w.dmg, p.x<foe.x?1:-1, p.w.knock, {}, p.owner); p.hitCd=18;
        fx.push(...burst(foe.x,foe.y-42,p.w.color,6));
      }
      if(p.age>16 && (p.x-p.owner.x)*p.owner.facing < -4) projectiles.splice(i,1);
      else { p.x=Math.max(2,Math.min(GW-2,p.x)); }
      continue;
    }
    if(p.type==='shot'){   // tiro reto / veículo que atropela (big)
      p.x+=p.vx;
      const hw=p.big?30:18, hh=p.big?42:36;
      if(p.hitCd>0) p.hitCd--;
      if(p.hitCd<=0 && Math.abs(p.x-foe.x)<hw && Math.abs(p.y-(foe.y-40))<hh){
        hit(foe, p.w.dmg, p.vx>0?1:-1, p.w.knock, {}, p.owner);
        fx.push(...burst(foe.x,foe.y-42,p.w.color,8));
        if(p.big){ p.hitCd=12; } else { projectiles.splice(i,1); continue; }
      }
      if(p.x<-40||p.x>GW+40) projectiles.splice(i,1);
      continue;
    }
    // granada (arco) / chuva
    p.vy+=GRAV*0.7; p.x+=p.vx; p.y+=p.vy;
    const hitFoe = Math.abs(p.x-foe.x)<22 && Math.abs(p.y-(foe.y-40))<34;
    if(p.y>=GROUND-2 || hitFoe || p.x<8 || p.x>GW-8){
      explode(p.x, Math.min(p.y,GROUND-4), p);
      projectiles.splice(i,1);
    }
  }
}
function explode(x,y,p){
  sfx('explode'); shake=12;
  const col=p.w.color||'#ff7a2c';
  fx.push(...burst(x,y,col,16)); fx.push(...burst(x,y,shade(col,30),10));
  [player,enemy].forEach(t=>{
    if(t===p.owner) return;
    if(Math.abs(t.x-x)<46 && Math.abs((t.y-40)-y)<58){
      hit(t, p.w.dmg, t.x>x?1:-1, p.w.knock||7, {}, p.owner);
    }
  });
}
function burst(x,y,color,n){
  const a=[]; for(let i=0;i<n;i++){ const ang=Math.PI*2*i/n + (i*0.7);
    a.push({x,y,vx:Math.cos(ang)*(1+i%3),vy:Math.sin(ang)*(1+i%3)-1,life:18,color}); }
  return a;
}
function updateFx(){
  for(let i=fx.length-1;i>=0;i--){ const p=fx[i]; p.x+=p.vx; p.y+=p.vy; p.vy+=0.2; p.life--; if(p.life<=0)fx.splice(i,1); }
}
function updateFloaters(){
  for(let i=floaters.length-1;i>=0;i--){ const f=floaters[i]; f.y+=f.vy; f.vy*=0.92; f.life--; if(f.life<=0)floaters.splice(i,1); }
}

function endFight(loser){
  if(gameState==='over') return;
  gameState='over';
  lastWin = (loser===enemy);
  scoreboard = recordResult(lastWin);     // atualiza e persiste o placar
  msg = lastWin ? 'VOCÊ VENCEU! 🧘' : 'A CARIOCA VENCEU...';
  msgT=99999;
}
