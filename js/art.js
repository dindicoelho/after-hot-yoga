/* ============================================================
   PIXEL ART — desenho dos personagens, cenário e projéteis
   ============================================================ */

// desenha um personagem num contexto, com tamanho de pixel P, a partir de (0,0)
// pose: {arm, leg, lean, crouch, weapon, blink}
function drawCharacter(ctx, c, P, pose={}){
  const arm=pose.arm||0, leg=pose.leg||0, lean=pose.lean||0;
  const crouch=pose.crouch?3:0;
  const fem = !!c.female;
  const px=(x,y,w,h,col)=>{ if(!col)return; ctx.fillStyle=col; ctx.fillRect(Math.round(x*P),Math.round(y*P),Math.ceil(w*P),Math.ceil(h*P)); };

  const cx=10;                 // centro horizontal
  // sombra no chão
  px(5,28.4,10,1.4,'rgba(0,0,0,.35)');

  // ----- pernas -----
  const legY=20+crouch, legH=8-crouch;
  const lw = fem?2.5:3.2;          // largura da perna
  const lgap = fem?0.7:0.4;        // espaço entre pernas (mulher: mais junto)
  const lLx = cx - lgap - lw, lRx = cx + lgap;
  const stepL = leg<0?-0.8:0, stepR = leg>0?0.8:0;
  px(lLx+stepL, legY, lw, legH, shade(c.pants,-14));   // perna de trás
  px(lRx+stepR, legY, lw, legH, c.pants);              // perna da frente
  if(c.leggings){ px(lLx+stepL+0.3,legY,0.8,legH-1,shade(c.pants,22)); px(lRx+stepR+0.3,legY,0.8,legH-1,shade(c.pants,22)); }
  if(c.stripes){ px(lLx+stepL,legY+1,lw,.7,c.accent); px(lRx+stepR,legY+1,lw,.7,c.accent); }
  // tênis
  px(lLx+stepL-0.5, legY+legH-1, lw+1, 1.7,'#e6e6e6'); px(lRx+stepR-0.5, legY+legH-1, lw+1,1.7,'#f4f4f4');
  px(lLx+stepL-0.5, legY+legH+0.4, lw+1,0.4,'#bbb'); px(lRx+stepR-0.5, legY+legH+0.4, lw+1,0.4,'#ccc');

  // ----- tronco -----
  const torY=12+crouch;
  const sh = c.shirt;
  let bodyHalf; // metade da largura do corpo (p/ posicionar braços)
  if(fem){
    px(cx-3.4+lean, torY,       6.8, 3, sh);                 // busto
    px(cx-2.4+lean, torY+3,     4.8, 3, shade(sh,-7));       // cintura
    px(cx-3.7+lean, torY+5.6,   7.4, 2.8, sh);               // quadril
    bodyHalf=3.5;
  } else {
    const shW=c.buff?10.4:8.8;
    px(cx-shW/2+lean, torY, shW, 2.4, sh);                   // ombros
    const tw=c.buff?9:7.6;
    px(cx-tw/2+lean, torY+2.4, tw, 6, shade(sh,-4));         // tronco
    bodyHalf=c.buff?5:4.3;
  }
  // detalhes de roupa
  if(c.stripes){ px(cx-bodyHalf+lean, torY+0.4, 0.9, 7, c.accent); px(cx+bodyHalf-0.9+lean, torY+0.4, 0.9, 7, c.accent); }
  if(c.id==='gc'){ px(cx-1.6+lean, torY, 3.2, 8, shade(sh,-16)); }   // camadinha quiet luxury
  if(c.neon){ px(cx-3+lean, torY+6, 6, .7, c.neon); }

  // ----- braços + arma -----
  const armW = fem?1.9:(c.buff?3:2.5);
  const sy = torY+1.4;
  // braço de trás
  px(cx-bodyHalf-armW+0.6+lean, sy, armW, 6, shade(c.skin,-22));
  px(cx-bodyHalf-armW+0.6+lean, sy, armW, 2, sh);            // mangazinha
  // braço da frente (segura arma)
  const ax = cx+bodyHalf-0.6+lean + arm*4.5;
  const ay = sy - arm*3;
  const aLen = 6 - arm*1.5;
  px(ax, ay, armW, aLen, c.skin);
  px(ax, ay, armW, 2, sh);                                   // mangazinha
  px(ax, ay+aLen, armW, 1.8, shade(c.skin,-8));              // mão
  if(pose.weapon) drawHeldWeapon(ctx, pose.weapon, P, ax+armW/2, ay+aLen+1, arm);

  // ----- cabeça -----
  const headW = fem?5.8:6.4;
  const hx=cx-headW/2+lean, hy=4+crouch;
  px(hx, hy, headW, 6.4, c.skin);                           // rosto inteiro de pele
  px(hx+0.6, hy+6.2, headW-1.2, 0.7, shade(c.skin,-9));     // sombrinha fina sob a mandíbula
  px(cx-0.7+lean, hy+6.7, 1.4, 1.3, shade(c.skin,-5));      // pescoço
  px(hx-0.6, hy+2.6, 1, 1.6, shade(c.skin,-12));            // orelha

  // cabelo
  drawHair(px, c, hx, hy, headW);

  // boné
  if(c.hat==='cap'){
    px(hx-0.7, hy-1.3, headW+1.4, 2, c.hatColor);
    px(hx+headW-2, hy+0.3, 3.6, 1.4, shade(c.hatColor,-14)); // aba
    px(hx-0.7, hy-1.3, headW+1.4, 0.7, shade(c.hatColor,16));
    if(c.id==='dindi'){ px(hx+1, hy-1.3,1.6,2,c.neon); }
  }

  // olhos / óculos
  const eyeY=hy+2.7, e1=hx+1, e2=hx+headW-2.6;
  if(c.glasses==='sun'){
    px(hx+0.4, eyeY-0.4, headW-0.8, 1.9, '#0c0c0e');
    px(e1+0.3, eyeY, 1.4,0.8,'#3a3a44'); px(e2+0.3, eyeY,1.4,0.8,'#3a3a44');
  } else if(c.glasses==='clear'){
    ctx.strokeStyle='#2a2a2e'; ctx.lineWidth=Math.max(1,P*.16);
    ctx.strokeRect((e1)*P,(eyeY-0.3)*P,2.1*P,1.9*P);
    ctx.strokeRect((e2)*P,(eyeY-0.3)*P,2.1*P,1.9*P);
    px(e1+0.4, eyeY-0.1, 1.4,1.6,'rgba(190,220,235,.22)');
    px(e2+0.4, eyeY-0.1, 1.4,1.6,'rgba(190,220,235,.22)');
    if(!pose.blink){ px(e1+0.7,eyeY+.3,1,1,c.eyes||'#2a201a'); px(e2+0.7,eyeY+.3,1,1,c.eyes||'#2a201a'); }
  } else {
    if(!pose.blink){
      px(e1, eyeY, 1.5,1.5, '#fff'); px(e1+0.4,eyeY+.3,0.9,1,c.eyes||'#2a201a');
      px(e2, eyeY, 1.5,1.5, '#fff'); px(e2+0.4,eyeY+.3,0.9,1,c.eyes||'#2a201a');
    } else { px(e1,eyeY+.6,1.5,.5,'#3a2a22'); px(e2,eyeY+.6,1.5,.5,'#3a2a22'); }
  }

  // toques femininos: cílios + blush
  if(fem){
    px(e1-0.2, eyeY-0.5, 1.1,0.6,'#1a1014'); px(e2+1.4, eyeY-0.5,1.1,0.6,'#1a1014');
    px(hx+0.2, hy+4, 1.2,1,'rgba(255,120,130,.30)'); px(hx+headW-1.4, hy+4,1.2,1,'rgba(255,120,130,.30)');
  }

  // boca / batom
  const lipW = fem?2.6:2.2;
  px(cx-lipW/2+lean, hy+4.5, lipW, fem?1:0.8, c.lips||shade(c.skin,-26));

  // barba
  if(c.beard){ px(hx, hy+3.6, headW, 2.6, shade(c.hair,8)); px(hx+1.6,hy+4.3,headW-3.2,1.2,c.skin); }

  // cigarro
  if(c.cigarette){
    px(hx+headW-1, hy+4.4, 3, .8, '#f4f0e6'); px(hx+headW+1.8, hy+4.2,1,1.2,'#ff6a3c');
    px(hx+headW+2.4, hy+2.8,1,1,'rgba(220,220,220,.5)'); px(hx+headW+3, hy+1.6,1,1,'rgba(220,220,220,.3)');
  }
}

function drawHair(px, c, hx, hy, hw){
  const H=c.hair, Hl=shade(H,16);
  switch(c.hairStyle){
    case 'long':
      px(hx-0.8, hy-1.6, hw+1.6, 3, H); px(hx-0.4,hy-1.6,hw+0.8,0.8,Hl);
      px(hx-1.3, hy, 1.7, 11, H); px(hx+hw-0.4, hy, 1.7, 11, H);   // mechas longas
      px(hx-1.3, hy+8, 1.7, 3, shade(H,8)); px(hx+hw-0.4, hy+8, 1.7,3, shade(H,8));
      break;
    case 'braid':
      px(hx-0.7, hy-1.5, hw+1.4, 2.8, H); px(hx-0.4,hy-1.5,hw+0.8,0.8,Hl);
      px(hx-1, hy, 1.5, 5, H); px(hx+hw-0.5, hy, 1.5, 5, H);
      for(let i=0;i<5;i++){ px(hx+hw-0.6, hy+5+i*1.6, 1.8,1.3, i%2?Hl:H); }  // trança
      break;
    case 'short':
      px(hx-0.6, hy-1.5, hw+1.2, 2.7, H); px(hx-0.4,hy-1.5,hw+0.6,0.7,Hl);
      px(hx-0.6,hy,1,2.6,H); px(hx+hw-0.4,hy,1,2.6,H);
      break;
    case 'buzz':
      px(hx-0.2, hy-1.1, hw+0.4, 1.9, H); px(hx,hy-1.1,hw,0.6,Hl);
      break;
    case 'curly':
      px(hx-1.1, hy-2.2, hw+2.2, 3.8, H);
      px(hx-1.1, hy-2.4,1.7,1.7,Hl); px(hx+1,hy-2.8,1.7,1.7,H);
      px(hx+2.6,hy-2.8,1.7,1.7,Hl); px(hx+hw-0.6,hy-2.2,1.7,1.7,H);
      px(hx-1.3,hy+0.4,1.7,3.2,H); px(hx+hw-0.4,hy+0.4,1.7,3.2,H);
      break;
    case 'medium':
      px(hx-0.8, hy-1.5, hw+1.6, 2.9, H); px(hx-0.4,hy-1.5,hw+0.8,0.8,Hl);
      px(hx-1.1, hy, 1.6, 6, H); px(hx+hw-0.5, hy, 1.6, 6, H);
      break;
    case 'pony':
      px(hx-0.6, hy-1.3, hw+1.2, 2.5, H); px(hx-0.4,hy-1.3,hw+0.6,0.7,Hl);
      px(hx-0.6,hy,1,2.2,H); px(hx+hw-0.4,hy,1,2.2,H);
      px(hx+hw, hy-1.2, 2, 1.7, H); px(hx+hw+1.3, hy+0.2,1.7,6,H); px(hx+hw+0.7,hy+5,1.7,3.5,shade(H,10)); // rabo
      break;
  }
}

/* armas */
function drawHeldWeapon(ctx, w, P, x, y, arm){
  if(!w) return;
  const px=(X,Y,W,H,col)=>{ctx.fillStyle=col; ctx.fillRect(Math.round(X*P),Math.round(Y*P),Math.ceil(W*P),Math.ceil(H*P));};
  const k=w.kind;
  if(k==='hammer'){
    const hy=y-9;
    px(x-0.2, y-9, 1, 9, '#9a9a9e');          // cabo
    px(x-2.2, hy-1, 5.2, 7, w.color);          // copo grande
    px(x-2.2, hy-1, 5.2, 1.6, shade(w.color,18));
    px(x-2.6, hy+0.5, 1.2, 4, w.cap);          // alça
    px(x+3, hy-2.4, 0.8, 4, '#ff9a3c');        // canudo
    px(x-2.2, hy+5, 5.2, 1.6, w.cap);
  } else if(k==='spray'){
    const hy=y-11;                              // garrafa térmica alta
    px(x-0.2, y-9, 1, 9, '#9a9a9e');
    px(x-1.8, hy, 3.6, 10, w.color); px(x-1.8, hy, 3.6, 1.4, shade(w.color,18));
    px(x-1.8, hy-1.8, 3.6, 2, w.cap); px(x+1.4, hy-2.6, 0.9, 2, '#ccc');
    px(x-1.8, hy+8, 3.6, 1.2, w.cap);
  } else if(k==='lunge'){
    const hy=y-7;                               // caneca robusta com alça
    px(x-2, hy, 4.2, 7, w.color); px(x-2, hy, 4.2, 1.4, shade(w.color,18));
    px(x+2.2, hy+1.4, 1.4, 3.4, w.cap); px(x+2.6, hy+1.4, 0.9, 3.4, w.color);
    px(x-2, hy+6, 4.2, 1.4, w.cap);
  } else if(k==='freeze'){
    const hy=y-7;                               // copo gelado
    px(x-1.8, hy, 3.8, 7, w.color); px(x-1.8, hy, 3.8, 1.4, '#ffffff');
    px(x-1.8, hy+6, 3.8, 1.2, w.cap);
    px(x+1.4, hy-1.8, 0.8, 3, '#7fd0e8');       // canudo
    px(x-0.9, hy+2, 1, 1, '#fff'); px(x+0.7, hy+4, 1, 1, '#fff'); // gelo
  } else if(k==='fast'){
    const hy=y-6;
    px(x-1.6, hy, 3.4, 6, w.color); px(x-1.6, hy, 3.4, 1.2, shade(w.color,18));
    px(x-1.6, hy+5, 3.4, 1.2, w.cap); px(x+1.4, hy-1.6, 0.7, 3, '#ff9a3c');
  } else {
    const hy=y-5;                               // copo pequeno (café/iceflow)
    px(x-1.4, hy, 3, 5, w.color); px(x-1.4, hy-1.2, 3, 1.4, w.cap);
    px(x-1.4, hy+4.5, 3, 1, w.cap); px(x+1.4, hy-2.4, 0.7, 2.4, '#ff9a3c');
  }
}

function shade(hex, amt){
  const n=parseInt(hex.slice(1),16);
  let r=(n>>16)+amt, g=((n>>8)&255)+amt, b=(n&255)+amt;
  r=Math.max(0,Math.min(255,r)); g=Math.max(0,Math.min(255,g)); b=Math.max(0,Math.min(255,b));
  return '#'+((r<<16)|(g<<8)|b).toString(16).padStart(6,'0');
}

/* ---------- render do palco ---------- */
function drawBackground(){
  // parede quente
  const grd=g.createLinearGradient(0,0,0,GROUND);
  grd.addColorStop(0,'#5a2b24'); grd.addColorStop(1,'#7a3a2c');
  g.fillStyle=grd; g.fillRect(0,0,GW,GROUND);
  // luz quente
  g.fillStyle='rgba(255,160,90,.10)'; g.beginPath(); g.arc(240,40,220,0,7); g.fill();
  // placa HOT YOGA
  g.fillStyle='#2a1714'; g.fillRect(150,24,180,40);
  g.fillStyle='#ff6a3c'; g.font='bold 26px Trebuchet MS'; g.textAlign='center';
  g.fillText('HOT YOGA',240,52);
  g.fillStyle='#ffcf6b'; g.font='10px Trebuchet MS'; g.fillText('— sala de espera —',240,63);
  // plantas
  drawPlant(40,GROUND); drawPlant(440,GROUND);
  // banco
  g.fillStyle='#3a2418'; g.fillRect(70,GROUND-26,90,8); g.fillRect(74,GROUND-18,6,18); g.fillRect(150,GROUND-18,6,18);
  // recepção
  g.fillStyle='#4a2e22'; g.fillRect(330,GROUND-30,80,30); g.fillStyle='#5e3a2a'; g.fillRect(330,GROUND-34,80,5);
  // tapetes de yoga enrolados
  for(let i=0;i<4;i++){ g.fillStyle=['#d4738f','#7bdc8a','#5fb6d4','#ffcf6b'][i]; g.fillRect(340+i*16,GROUND-30,12,4); }
  // chão de madeira
  g.fillStyle='#6b4326'; g.fillRect(0,GROUND,GW,GH-GROUND);
  g.strokeStyle='rgba(0,0,0,.18)'; g.lineWidth=1;
  for(let x=0;x<GW;x+=24){ g.beginPath(); g.moveTo(x,GROUND); g.lineTo(x-14,GH); g.stroke(); }
}
function drawPlant(x,y){
  g.fillStyle='#3a2418'; g.fillRect(x-8,y-14,16,14);
  g.fillStyle='#2f6b3a';
  for(let i=0;i<5;i++){ const a=-Math.PI/2 + (i-2)*0.5;
    g.save(); g.translate(x,y-14); g.rotate(a);
    g.fillRect(-2,-26,4,26); g.restore(); }
}

function drawFighter(f){
  g.save();
  const w=SW*4, h=SH*4;
  if(f.facing<0){ g.translate(f.x+w/2, f.y-h); g.scale(-1,1); }
  else { g.translate(f.x-w/2, f.y-h); }
  // flash branco quando toma dano
  const pose={
    arm: f.state==='attack'? (f.atkKind==='hammer'? (f.atkT>f.atkActive?0.9:0.2) : 0.7) : 0.25,
    leg: f.state==='walk'? Math.sin(f.legPhase) : 0,
    lean: f.state==='hit'? -2 : 0,
    crouch: f.blocking,
    weapon: f.weapon,
    blink: f.blink<6 || f.state==='frozen'
  };
  if(f.state==='ko'){ g.translate(0,h*0.5); g.rotate(-Math.PI/2*f.facing); g.translate(-h*0.4,-w*0.2); }
  drawCharacter(g, f.cfg, 4, pose);
  if(f.flash>0){ g.globalCompositeOperation='source-atop'; g.fillStyle='rgba(255,255,255,'+(f.flash/12)+')'; g.fillRect(0,0,w,h); }
  if(f.state==='frozen'){ g.globalCompositeOperation='source-atop'; g.fillStyle='rgba(130,205,255,.45)'; g.fillRect(0,0,w,h); }
  g.restore();
  if(f.state==='frozen'){ // lasquinhas de gelo
    g.fillStyle='rgba(200,240,255,.8)';
    for(let i=0;i<3;i++){ const a=f.t*0.1+i*2; g.fillRect(f.x-14+i*12, f.y-70+Math.sin(a)*4, 2,2); }
  }

  if(f.blocking){ g.fillStyle='rgba(140,190,230,.35)'; g.beginPath(); g.arc(f.x+f.facing*8,f.y-46,22,0,7); g.fill(); }
}

function drawProjectile(p){
  const r=p.render, face=p.vx<0?-1:1;
  g.save(); g.translate(p.x,p.y);
  if(r==='car'||r==='taxi'||r==='tractor'){
    g.scale(face,1);
    if(r==='taxi'){
      g.fillStyle='#ffd23b'; g.fillRect(-18,-12,36,12);
      g.fillStyle='#ffe78a'; g.fillRect(-10,-20,18,9);
      g.fillStyle='#222'; g.fillRect(-9,-19,7,7); g.fillRect(1,-19,7,7);
      g.fillStyle='#111'; for(let i=-13;i<14;i+=5) g.fillRect(i,-12,3,3);
      g.fillStyle='#1a1a1a'; g.fillRect(-13,-2,7,7); g.fillRect(7,-2,7,7);
      g.fillStyle='#fff'; g.fillRect(16,-9,3,4);
    } else if(r==='tractor'){
      g.fillStyle='#2f7f3a'; g.fillRect(-16,-14,26,12);
      g.fillStyle='#3a9a48'; g.fillRect(-2,-22,12,10);
      g.fillStyle='#9fe0a8'; g.fillRect(0,-21,8,6);
      g.fillStyle='#111'; g.beginPath(); g.arc(9,2,9,0,7); g.fill(); g.beginPath(); g.arc(-12,2,5,0,7); g.fill();
      g.fillStyle='#ffd23b'; g.fillRect(-13,-7,2,5);
    } else {
      const cols=['#ff3b3b','#ff9a3c','#ffe600','#3ad06a','#3aa0ff','#a85aff'];
      for(let i=0;i<6;i++){ g.fillStyle=cols[i]; g.fillRect(-18+i*6,-12,6,12); }
      g.fillStyle='#cdeffd'; g.fillRect(-10,-19,18,8);
      g.fillStyle='#1a1a1a'; g.fillRect(-13,-2,7,7); g.fillRect(7,-2,7,7);
      g.fillStyle='#fff'; g.fillRect(16,-9,3,4);
    }
  } else if(r==='plant'){
    g.rotate(p.spin*0.5);
    g.fillStyle='#3a8a4a';
    for(let a=0;a<7;a++){ g.save(); g.rotate(a*0.9-2.7); g.fillRect(-1.5,-15,3,15); g.restore(); }
    g.fillStyle='#4fb05f'; g.beginPath(); g.arc(0,-2,4,0,7); g.fill();
    g.fillStyle='#7a4a2a'; g.fillRect(-5,3,10,8);
  } else if(r==='box'){
    g.rotate(p.spin);
    g.fillStyle='#ffe600'; g.fillRect(-8,-8,16,16);
    g.fillStyle='#1a1a1a'; g.fillRect(-8,-1,16,2);
    g.fillStyle='#2d3277'; g.fillRect(-6,-6,6,3);
  } else {
    g.rotate(p.spin);
    g.fillStyle=p.w.color; g.fillRect(-5,-7,10,14);
    g.fillStyle=p.w.cap; g.fillRect(-5,-9,10,3);
    g.fillStyle='rgba(0,0,0,.2)'; g.fillRect(-5,5,10,2);
  }
  g.restore();
}

/* exporta funções puras para teste em Node (ignorado no browser) */
if (typeof module !== 'undefined' && module.exports) { module.exports = { shade }; }
