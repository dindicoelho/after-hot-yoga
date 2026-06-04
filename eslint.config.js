/* ESLint flat config — os arquivos em js/ são scripts clássicos que
   compartilham um único escopo global (uma função definida num arquivo é
   usada em outro). Por isso listamos esses nomes como globais: assim o
   no-undef ainda pega typos de verdade, sem acusar as referências legítimas
   entre arquivos. */

const RUNTIME = [
  'window','document','navigator','localStorage','AudioContext','webkitAudioContext',
  'requestAnimationFrame','cancelAnimationFrame','setInterval','clearInterval',
  'setTimeout','clearTimeout','addEventListener','module',
];

// tudo que é declarado no topo de algum arquivo de js/ (estado e funções compartilhados)
const GAME = [
  'actx','AI_LEVELS','aiControl','aiLevel','bar','beginGame','buildCharGrid','buildWeaponGrid',
  'burst','CARIOCA','CHARACTERS','chosenChar','chosenWeapon','clamp','CONFIG','controlPlayer','cv',
  'debugHit','doMeleeHit','drawBackground','drawCharacter','drawDebug','drawFighter','drawFloaters',
  'drawHair','drawHeldWeapon','drawHUD','drawMsg','drawPlant','drawProjectile','drawWaves','endFight',
  'enemy','explode','flashScreen','floaters','fx','g','gameState','getSave','getSetting','go','GRAV',
  'GROUND','GH','GW','hit','hitstop','initMeta','IS_TOUCH','keys','lastWin','loadSave','loop','meterBar',
  'mkFighter','msg','msgT','music','MUSIC_SEQ','persist','player','playMusicNote','pressing','projectiles',
  'pushBeam','pushWave','raf','recordResult','render','rint','SAVE','scoreboard','setAiLevel','setSetting',
  'setupTouchControls','sfx','shade','shake','SH','SPECIALS','startAttack','startFight','startMusic',
  'startWeapon','stopMusic','STORE_KEY','SW','toggleMusicSetting','unlockAudio','updateFighter',
  'updateFloaters','updateFx','updateMusicBtn','updateProjectiles','updateWaves','useSpecial','waves','WEAPONS',
];

const globals = {};
for(const n of RUNTIME) globals[n] = 'readonly';
for(const n of GAME)    globals[n] = 'writable';

module.exports = [
  {
    files: ['js/**/*.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'script', globals },
    rules: {
      'no-undef': 'error',
      'no-redeclare': 'off',     // os nomes acima são "globais" e também declarados no próprio arquivo
      'no-unused-vars': 'off',   // funções são usadas entre arquivos; o linter vê um arquivo por vez
      'no-dupe-keys': 'error',
      'no-dupe-args': 'error',
      'no-unreachable': 'error',
      'no-cond-assign': 'error',
      'no-constant-condition': ['error', { checkLoops: false }],
    },
  },
];
