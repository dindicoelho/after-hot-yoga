/* ============================================================
   AFTER HOT YOGA — dados e constantes
   ============================================================ */

/* ---------- Personagens ---------- */
const CHARACTERS = [
  {id:'clopes', name:'Clopes', desc:'cabelo comprido, chic, óculos escuros, cigarro', female:true,
   skin:'#e9c6a2', hair:'#2b2320', hairStyle:'long', shirt:'#1d1d22', pants:'#0f0f12',
   accent:'#caa15a', glasses:'sun', cigarette:true, lips:'#a85a5e'},
  {id:'w', name:'W', desc:'parda, cabelo trançado, super descolada', female:true,
   skin:'#b87a50', hair:'#1c130d', hairStyle:'braid', shirt:'#e0653a', pants:'#2a2330',
   accent:'#ffd166', lips:'#a04838'},
  {id:'sugar', name:'Sugar', desc:'olho claro, loiro, cabelo curto, oclinhos', female:false,
   skin:'#f6ddc6', hair:'#e8c569', hairStyle:'short', shirt:'#5fb6d4', pants:'#34404a',
   accent:'#bfe3f0', glasses:'clear', eyes:'#7fd0e8'},
  {id:'dindi', name:'Dindi', desc:'bonezinho, cabelo comprido, vibe cyberpunk', female:true,
   skin:'#e7c3a0', hair:'#15131f', hairStyle:'long', shirt:'#1b1430', pants:'#241a3a',
   accent:'#36e0e0', hat:'cap', hatColor:'#101018', neon:'#36e0e0', lips:'#a8455e'},
  {id:'decaum', name:'Decaum', desc:'cabelo preto curto, fortinho', female:false,
   skin:'#e4bf9a', hair:'#161210', hairStyle:'short', shirt:'#b03030', pants:'#222', accent:'#ddd', buff:true},
  {id:'gc', name:'GC', desc:'cabelo enrolado, quiet luxury', female:false,
   skin:'#f3dac3', hair:'#241a12', hairStyle:'curly', shirt:'#cdbb9a', pants:'#6a5a44', accent:'#3a2f22'},
  {id:'mafe', name:'Mafe', desc:'tons pastéis, cabelo médio, morena, casual chic', female:true,
   skin:'#d6a87c', hair:'#3a281c', hairStyle:'medium', shirt:'#f3c6cf', pants:'#cdb3d6', accent:'#fff', lips:'#d08090'},
  {id:'maaah', name:'Maaah', desc:'cabelo comprido, vibe gótica chic', female:true,
   skin:'#f1d9c9', hair:'#0d0a0e', hairStyle:'long', shirt:'#15121a', pants:'#0e0c12', accent:'#7a2548', lips:'#7a2548'},
  {id:'fefito', name:'Fefito', desc:'cabelo batidinho, camiseta preta, barba', female:false,
   skin:'#f0d6bd', hair:'#1a130d', hairStyle:'buzz', shirt:'#141414', pants:'#2a2a2e', accent:'#888', beard:true},
  {id:'pedro', name:'Pedro Potro', desc:'oclinhos, cabelo curto, moreno', female:false,
   skin:'#e6c09b', hair:'#1e150e', hairStyle:'short', shirt:'#3a6e4a', pants:'#33414a', accent:'#fff', glasses:'clear'},
  {id:'aida', name:'Aída', desc:'cabelo longo, moletonzinho adidas', female:true,
   skin:'#d6a578', hair:'#241812', hairStyle:'long', shirt:'#2a2f3a', pants:'#2a2f3a', accent:'#ffffff', stripes:true, lips:'#bb6a6a'},
  {id:'eloy', name:'Eloy', desc:'cabelo curto e boné', female:false,
   skin:'#d2a072', hair:'#1c140e', hairStyle:'short', shirt:'#2f5f8a', pants:'#2c2c30', accent:'#ddd', hat:'cap', hatColor:'#1f2a3a'},
  {id:'ligia', name:'Ligia', desc:'morena, cabelo comprido, boné', female:true,
   skin:'#e7c4a1', hair:'#1a120c', hairStyle:'long', shirt:'#d4738f', pants:'#33303a', accent:'#fff', hat:'cap', hatColor:'#d4738f', lips:'#b85a72'},
  {id:'brubru', name:'brubru', desc:'loira, cabelo médio', female:true,
   skin:'#f0d4bd', hair:'#e3c468', hairStyle:'medium', shirt:'#9ad0c0', pants:'#c8a0b0', accent:'#fff', lips:'#cc8090'},
];

/* a carioca — chefe que todos enfrentam */
const CARIOCA = {id:'carioca', name:'A CARIOCA', female:true, skin:'#c98a5e', hair:'#120d0a',
  hairStyle:'pony', shirt:'#16161a', pants:'#0e0e12', accent:'#ff3b6b', leggings:true, lips:'#c04a5e'};

/* ---------- Armas (copos Stanley) ---------- */
const WEAPONS = [
  {id:'litrao', name:'Copão Litrão', kind:'hammer', tag:'MARRETA',
   desc:'1L com alça e canudo. Lento, mas devasta e arremessa a carioca pra longe.',
   dmg:22, reach:36, cooldown:60, knock:11, color:'#e8e8ec', cap:'#ff5a3c'},
  {id:'cafe', name:'Copo de Café', kind:'grenade', tag:'GRANADA',
   desc:'Cafézinho turbo. Arremessa num arco, explode e queima numa ÁREA. Pega quem foge.',
   dmg:16, cooldown:64, knock:7, color:'#caa97a', cap:'#5a3a22'},
  {id:'quencher', name:'Quencher 1.2', kind:'fast', tag:'RÁPIDO',
   desc:'O clássico de tampa. Golpes RÁPIDOS e seguidos pra sufocar a carioca de pressão.',
   dmg:10, reach:28, cooldown:22, knock:3, color:'#d9b8d0', cap:'#7a5a70'},
  {id:'termo', name:'Garrafa Térmica', kind:'spray', tag:'JATO',
   desc:'Jato de água fervendo: vários toques que ATORDOAM e cortam o ataque dela na metade.',
   dmg:5, hits:4, reach:32, cooldown:52, knock:2, stun:30, color:'#9aa4ae', cap:'#2f3a44'},
  {id:'iceflow', name:'IceFlow Flip', kind:'boomerang', tag:'BUMERANGUE',
   desc:'Tampa flip aerodinâmica. Voa reto, vai e VOLTA — pode acertar duas vezes à distância.',
   dmg:12, cooldown:58, knock:5, color:'#bfe3f0', cap:'#3a8aa8'},
  {id:'adventure', name:'Caneca Adventure', kind:'lunge', tag:'INVESTIDA',
   desc:'Caneca de trilha. Você AVANÇA numa investida que fecha distância e pega de surpresa.',
   dmg:15, reach:34, cooldown:48, knock:8, dash:7.5, color:'#3a6b4a', cap:'#1f3a28'},
  {id:'cryo', name:'IceFlow Cryo', kind:'freeze', tag:'CONGELANTE',
   desc:'Gelo eterno. O acerto CONGELA a carioca por um tempão — janela aberta pra emendar combos.',
   dmg:8, reach:28, cooldown:66, knock:3, freeze:80, color:'#bfeaff', cap:'#2a7aa8'},
];

/* ---------- Especiais por personagem (tecla I — gasta a barra cheia) ---------- */
const SPECIALS = {
  clopes:  {name:'Bituca Flamejante',         type:'projectile', dmg:18, speed:5.2, arc:true, explode:true, knock:7, color:'#ff6a3c', render:'cup'},
  dindi:   {name:'Carro Gaymer',              type:'projectile', dmg:20, speed:7, knock:13, color:'#36e0e0', render:'car', big:true},
  decaum:  {name:'Ice Plunge',                type:'shockwave', dmg:16, knock:7, range:74, freeze:70, color:'#bfeaff'},
  fefito:  {name:'Chuva de Café',             type:'rain', dmg:7, drops:7, knock:5, color:'#5a3a22'},
  gc:      {name:'Raio do Bom Gosto',         type:'beam', dmg:22, knock:8, color:'#ffe08a'},
  maaah:   {name:'Referência de Diva Pop',    type:'shockwave', dmg:13, knock:12, range:86, color:'#ff6ad5'},
  sugar:   {name:'Livrada Icônica',           type:'melee', dmg:18, reach:30, knock:8, stun:30, color:'#5fb6d4'},
  ligia:   {name:'New York Legacy',           type:'projectile', dmg:18, speed:8, knock:13, color:'#ffd23b', render:'taxi', big:true},
  aida:    {name:'Paralisação do Tempo',      type:'flash', dmg:4, freeze:95, range:130, color:'#c8b8ff'},
  w:       {name:'Bolsinha Gucci na Cara',    type:'melee', dmg:17, reach:32, knock:9, stun:24, color:'#1b6e3a'},
  eloy:    {name:'Trator',                    type:'projectile', dmg:19, speed:4.5, knock:15, color:'#2f7f3a', render:'tractor', big:true},
  brubru:  {name:'Empilhadeira',              type:'grab', dmg:24, reach:42, launch:true, color:'#ffb800'},
  pedro:   {name:'Compras do Mercado Livre',  type:'rain', dmg:8, drops:7, knock:6, color:'#ffe600', render:'box'},
  mafe:    {name:'Samambaia Inesperada',      type:'projectile', dmg:15, speed:5, arc:true, explode:true, knock:8, color:'#3a8a4a', render:'plant'},
  carioca: {name:'Chute de Bunda',            type:'melee', dmg:17, reach:38, knock:14, dashVx:6, color:'#ff3b6b'},
};

/* ---------- Constantes de mundo ---------- */
const SW=20, SH=30;                       // grid do sprite em "pixels"
const GROUND=232, GW=480, GH=270, GRAV=0.7;

/* ---------- Níveis de dificuldade da IA (a carioca) ----------
   reactBlock : chance de bloquear quando o player ataca de perto
   delayMin/Max: frames entre decisões (menor = reage mais rápido)
   aggression : tendência a partir pra cima
   speed      : velocidade de andar
   punish     : chance/frame de punir golpe errado do player
   antiAir    : chance/frame de revidar quando o player pula perto
   spRange    : distância em que dispara o especial                         */
const AI_LEVELS = {
  facil:   {name:'Fácil',   reactBlock:0.15, delayMin:16, delayMax:34, aggression:0.45, speed:1.5, punish:0.025, antiAir:0.03, spRange:80},
  normal:  {name:'Normal',  reactBlock:0.42, delayMin:8,  delayMax:22, aggression:0.66, speed:1.9, punish:0.06,  antiAir:0.06, spRange:96},
  dificil: {name:'Difícil', reactBlock:0.72, delayMin:4,  delayMax:12, aggression:0.86, speed:2.25, punish:0.10, antiAir:0.09, spRange:112},
};

/* ---------- Ajustes de jogo (números antes espalhados pelo motor) ----------
   Mexa aqui pra balancear sem caçar valores no meio do código.            */
const CONFIG = {
  physics:{ friction:0.8, koFriction:0.85, frozenDrag:0.7, wallMargin:24 },
  move:   { walk:2.4, jump:-10 },
  punch:  { atkT:18, atkActive:10, dmg:8, reach:30, knock:4, cd:22 },
  hit:    { invuln:12, invulnLow:3, flash:8, hitstun:14,
            blockDmg:0.25, blockKnock:0.4, heavyDmg:14, shakeHeavy:10, shakeLight:5 },
  meter:  { start:30, passive:0.42, onTake:1.6, onDeal:1.1, grabRefund:70 },
  juice:  { floaterLife:46, hitstopHeavy:7, hitstopMid:4, hitstopLight:1, heavyDmg:16, midDmg:10,
            koShake:14, koFlash:10, koHitstop:8 },
};
