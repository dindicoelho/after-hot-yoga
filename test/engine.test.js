/* Testes do motor — carrega o jogo num DOM falso e verifica as regras
   que importam (e que já quebraram/ajustamos nas fases anteriores). */
const { test } = require('node:test');
const assert = require('node:assert');
const { makeGame, evalIn } = require('../tools/sandbox');

function freshFight(extra=''){
  const g = makeGame();
  evalIn(g, `chosenChar=CHARACTERS[0]; chosenWeapon=WEAPONS.find(w=>w.id==='quencher'); startFight(); gameState='fight'; ${extra}`);
  return g;
}

test('carrega os 6 módulos e os dados do jogo', () => {
  const g = makeGame();
  assert.strictEqual(evalIn(g, 'CHARACTERS.length'), 14);
  assert.strictEqual(evalIn(g, 'WEAPONS.length'), 7);
  assert.strictEqual(evalIn(g, 'Object.keys(SPECIALS).length'), 15);
});

test('soco básico usa os valores do CONFIG', () => {
  const g = freshFight('startAttack(player);');
  assert.strictEqual(evalIn(g, 'player.atkDmg'), 8);
  assert.strictEqual(evalIn(g, 'player.atkReach'), 30);
  assert.strictEqual(evalIn(g, 'player.cd'), 22);
});

test('a barra de especial começa em 30', () => {
  const g = freshFight();
  assert.strictEqual(evalIn(g, 'player.meter'), 30);
});

test('bloqueio reduz o dano a 25%', () => {
  const g = freshFight();
  const normal  = evalIn(g, `enemy.hp=130;enemy.blocking=false;enemy.invuln=0;enemy.state='idle';hit(enemy,10,1,3,{},player);130-enemy.hp`);
  const blocked = evalIn(g, `enemy.hp=130;enemy.blocking=true;enemy.invuln=0;enemy.state='idle';hit(enemy,10,1,3,{},player);+(130-enemy.hp).toFixed(2)`);
  assert.strictEqual(normal, 10);
  assert.strictEqual(blocked, 2.5);
});

test('corpo-a-corpo só acerta pra FRENTE (fim do phantom hit)', () => {
  const g = freshFight();
  const tryHit = off => evalIn(g, `(function(){
    enemy.hp=130;enemy.invuln=0;enemy.state='idle';
    player.facing=1;player.x=200;enemy.x=200+(${off});enemy.y=player.y;
    player.atkKind='fast';player.atkReach=28;player.atkDmg=10;player.atkKnock=3;player.atkStun=0;player.atkFreeze=0;player.atkMulti=false;
    doMeleeHit(player,enemy); return enemy.hp<130;
  })()`);
  assert.strictEqual(tryHit(20),  true,  'frente dentro do alcance deve acertar');
  assert.strictEqual(tryHit(40),  false, 'frente fora do alcance não acerta');
  assert.strictEqual(tryHit(-6),  false, 'atrás (perto) NÃO deve acertar');
  assert.strictEqual(tryHit(-30), false, 'atrás (longe) não acerta');
});

test('invulnerabilidade bloqueia o segundo acerto', () => {
  const g = freshFight();
  const dano = evalIn(g, `enemy.hp=130;enemy.invuln=0;enemy.state='idle';
    hit(enemy,10,1,3,{},player); const after1=enemy.hp;
    hit(enemy,10,1,3,{},player);            // ainda invulnerável → ignorado
    JSON.stringify([130-after1, after1-enemy.hp])`);
  assert.deepStrictEqual(JSON.parse(dano), [10, 0]);
});

test('KO encerra a luta e registra o placar', () => {
  const g = freshFight('enemy.hp=1; hit(enemy,50,1,5,{},player);');
  assert.strictEqual(evalIn(g, 'gameState'), 'over');
  assert.strictEqual(evalIn(g, 'lastWin'), true);
  assert.strictEqual(evalIn(g, 'scoreboard.wins'), 1);
});

test('placar: sequência reseta na derrota, recorde é mantido', () => {
  const g = makeGame();
  const s = JSON.parse(evalIn(g, `recordResult(true);recordResult(true);recordResult(false);JSON.stringify(getSave())`));
  assert.strictEqual(s.wins, 2);
  assert.strictEqual(s.losses, 1);
  assert.strictEqual(s.streak, 0);
  assert.strictEqual(s.best, 2);
});

test('preferências persistem (música, dificuldade)', () => {
  const g = makeGame();
  evalIn(g, `setSetting('music',true); setAiLevel('dificil');`);
  assert.strictEqual(evalIn(g, `getSetting('music',false)`), true);
  assert.strictEqual(evalIn(g, `getSetting('difficulty','normal')`), 'dificil');
});

test('a IA roda 300 frames sem erro e escala com a dificuldade', () => {
  const g = makeGame();
  assert.doesNotThrow(() => evalIn(g, `
    setAiLevel('dificil'); chosenChar=CHARACTERS[3]; chosenWeapon=WEAPONS[2];
    startFight(); gameState='fight'; msgT=0;
    for(let i=0;i<300;i++){ keys['k']=(i%30<3);
      updateFighter(player,enemy); updateFighter(enemy,player);
      updateProjectiles(); updateFx(); updateWaves(); updateFloaters(); }
  `));
  assert.ok(evalIn(g, 'AI_LEVELS.dificil.reactBlock > AI_LEVELS.facil.reactBlock'));
  assert.ok(evalIn(g, 'player.hp>=0 && enemy.hp>=0'));
});
