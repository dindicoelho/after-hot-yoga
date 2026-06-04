/* Carrega os scripts do jogo num contexto isolado com um DOM/canvas falso,
   pra dar pra testar o motor no Node sem navegador nem build. */
const fs = require('fs');
const vm = require('vm');
const path = require('path');

function makeGame(){
  const ctx = new Proxy({}, { get:(t,p)=> (p in t ? t[p] : ()=>{}) });
  ctx.createLinearGradient = ()=>({ addColorStop(){} });
  const el = ()=>({
    width:0, height:0, getContext:()=>ctx, style:{},
    classList:{ add(){}, remove(){}, toggle(){}, contains:()=>false },
    appendChild(){}, addEventListener(){}, getAttribute:()=>null,
    textContent:'', innerHTML:'', querySelectorAll:()=>[]
  });
  const store = {};
  const localStorage = {
    getItem:k=> (k in store ? store[k] : null),
    setItem:(k,v)=>{ store[k] = ''+v; },
    removeItem:k=>{ delete store[k]; },
  };
  const document = {
    getElementById:()=>el(), createElement:()=>el(),
    querySelectorAll:()=>[], querySelector:()=>el(),
    body:{ classList:{ add(){}, remove(){} } }, hidden:false,
  };
  const sandbox = {
    document, localStorage, navigator:{ maxTouchPoints:0 },
    AudioContext:function(){}, requestAnimationFrame:()=>0,
    setInterval:()=>0, clearInterval:()=>{}, addEventListener:()=>{},
    Math, console, parseInt, isNaN, JSON, Object, Array, Date,
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);

  const dir = path.join(__dirname, '..', 'js');
  for(const f of ['config.js','art.js','sfx.js','storage.js','engine.js','input.js','ui.js']){
    vm.runInContext(fs.readFileSync(path.join(dir,f),'utf8'), sandbox, { filename:'js/'+f });
  }
  return sandbox;
}

// avalia uma expressão dentro do contexto do jogo
function evalIn(sandbox, code){ return vm.runInContext(code, sandbox); }

module.exports = { makeGame, evalIn };
