/* ============================================================
   STORAGE — placar e preferências (localStorage, à prova de falha)
   ============================================================ */
const STORE_KEY = 'aho_save_v1';
let SAVE;   // cache em memória

function loadSave(){
  try{ const s=localStorage.getItem(STORE_KEY); return s?JSON.parse(s):{}; }
  catch(e){ return {}; }   // file:// ou modo privado podem bloquear — segue sem salvar
}
function persist(){ try{ localStorage.setItem(STORE_KEY, JSON.stringify(SAVE)); }catch(e){} }
function getSave(){ if(SAVE===undefined) SAVE=loadSave(); return SAVE; }

// registra o resultado de uma luta e devolve o placar atualizado
function recordResult(win){
  const s=getSave();
  s.wins=s.wins||0; s.losses=s.losses||0; s.streak=s.streak||0; s.best=s.best||0;
  if(win){ s.wins++; s.streak++; if(s.streak>s.best) s.best=s.streak; }
  else { s.losses++; s.streak=0; }
  persist(); return s;
}

// preferências (ex.: música, dificuldade)
function getSetting(k, def){ const v=getSave()[k]; return v===undefined?def:v; }
function setSetting(k, v){ getSave()[k]=v; persist(); }
