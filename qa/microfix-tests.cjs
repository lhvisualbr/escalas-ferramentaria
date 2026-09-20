const fs=require('fs'),vm=require('vm'),assert=require('assert'),{createCanvas}=require('@napi-rs/canvas');
require('@napi-rs/canvas').GlobalFonts.registerFromPath('qa/pdf-regular.ttf','AstraPDF');require('@napi-rs/canvas').GlobalFonts.registerFromPath('qa/pdf-bold.ttf','AstraPDF');
const target=process.argv[2]||'hotfix/qa/escalas-app-cbsi-v11-2-4-homologacao-astra.html';
const html=fs.readFileSync(target,'utf8');let source=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const data=new Map(),nodes=new Map(),events={};let failKey=null;
const classList={add(){},remove(){},toggle(){},contains(){return false}};
function node(id){if(!nodes.has(id))nodes.set(id,{textContent:'',value:'',className:'',hidden:false,classList,style:{},innerHTML:'',appendChild(){},setAttribute(){},querySelector(){return node('child')},addEventListener(n,f){events[id+':'+n]=f},focus(){},remove(){}});return nodes.get(id)}
const localStorage={get length(){return data.size},key:i=>[...data.keys()][i],getItem:k=>data.has(k)?data.get(k):null,setItem(k,v){if(failKey&&(!failKey.key||k===failKey.key)){if(failKey.once)failKey=null;throw new Error('QuotaExceededError simulado')}data.set(k,String(v))},removeItem:k=>data.delete(k)};
const document={getElementById:node,querySelectorAll:()=>[],querySelector:()=>null,createElement:t=>t==='canvas'?createCanvas(1,1):node('new'),body:node('body'),documentElement:node('html'),addEventListener(){}};
const sandbox={console:{log(){},info(){},error(){}},Date,Math,Number,String,Array,Object,JSON,Set,Map,Promise,Uint8Array,Blob,crypto:require('crypto').webcrypto,document,navigator:{},atob:s=>Buffer.from(s,'base64').toString('binary'),location:{protocol:'file:'},setTimeout:()=>0,clearTimeout(){},URL:{createObjectURL:()=>'',revokeObjectURL(){}},localStorage};sandbox.window=sandbox;sandbox.addEventListener=()=>{};
source=source.replace('  selfTestResult=runCoreSelfTests();',`  window.TEST={run: function(code){return eval(code);}};return;\n  selfTestResult=runCoreSelfTests();`);
vm.createContext(sandbox);vm.runInContext(source,sandbox);
const run=code=>sandbox.TEST.run(code),results=[];
function test(name,fn){try{fn();results.push({name,ok:true});}catch(e){results.push({name,ok:false,error:e.message});}}
function eq(code,expected){assert.deepStrictEqual(JSON.parse(JSON.stringify(run(code))),expected)}
const fixture=`state.segunda=new Date(2026,8,14);state.semanaId=weekId(state.segunda);state.diaSel=0;state.pessoas=[{id:'per_person_001',nome:'José Silva'},{id:'per_person_002',nome:'Jose Silva'}];state.postos=[{id:'pst_station_001',nome:'Posto de teste',local:'Dados fictícios de homologação',turnos:[{id:'shf_admin_001',label:'ADM',inicio:'07:30',fim:'17:18',carga:''},{id:'shf_night_001',label:'Noite',inicio:'22:00',fim:'06:00',carga:''}]}];state.atribuicoes={};historyCache={};storageBackend='local';memoryStorage={};localStorage.clearUnused;`;
function reset(){data.clear();failKey=null;run('storageKeyErrors=Object.create(null)');run(fixture)}
const key=(d,t='shf_admin_001')=>`pst_station_001__${d}__${t}`;
function assign(d,he=0,p='per_person_001',t='shf_admin_001'){run(`state.atribuicoes[${JSON.stringify(key(d,t))}]={tipo:'pessoas',pessoaIds:['${p}'],heMinutos:${he}}`)}
function proposal(d,he=0,t='shf_admin_001'){return `validarPropostaAtribuicao('${key(d,t)}',{tipo:'pessoas',pessoaIds:['per_person_001'],heMinutos:${he}})`}
run('selfTestResult=runCoreSelfTests()');
for(const raw of ['{bad','null','[]','42','"dark"',''])test('Diagnóstico isola meta '+JSON.stringify(raw),()=>{reset();data.set('cbsi_v11_meta',raw);const before=JSON.stringify([...data]),stateBefore=run('JSON.stringify(state)'),mirror=run('JSON.stringify(memoryStorage)'),errors=run('JSON.stringify(storageKeyErrors)');const out=run('readDiagnostic()');assert(out.includes('localStorage: APROVADO'));assert(!out.includes('localStorage: FALHA'));assert(out.includes('Registro cbsi_v11_meta: FALHA'));eq('storageBackend','local');assert.equal(JSON.stringify([...data]),before);eq('JSON.stringify(state)',stateBefore);eq('JSON.stringify(memoryStorage)',mirror);eq('JSON.stringify(storageKeyErrors)',errors)});
test('Meta ausente não é falha',()=>{reset();const out=run('readDiagnostic()');assert(out.includes('localStorage: APROVADO'));assert(!out.includes('Registro cbsi_v11_meta: FALHA'))});
test('Meta válido preserva datas no diagnóstico',()=>{reset();data.set('cbsi_v11_meta',JSON.stringify({schema:113,lastSaveAt:'2026-09-19T12:00:00Z',lastBackupAt:'2026-09-18T12:00:00Z'}));const out=run('readDiagnostic()');assert(out.includes('Última gravação: 2026-09-19T12:00:00Z'));assert(out.includes('Último backup: 2026-09-18T12:00:00Z'))});
test('Meta inválido já conhecido não duplica mensagem',()=>{reset();data.set('cbsi_v11_meta','{bad');run('storageGet(KEYS.meta,{})');const out=run('readDiagnostic()');assert.equal(out.split('Registro cbsi_v11_meta: FALHA').length-1,1);assert(out.includes('localStorage: APROVADO'))});
test('Falha de acesso real: diagnóstico informa sem mutação; storageGet aplica fallback',()=>{reset();const getter=localStorage.getItem;localStorage.getItem=()=>{throw new Error('SecurityError simulado')};try{assert(run('readDiagnostic()').includes('localStorage: FALHA'));eq('storageBackend','local');run('storageGet(KEYS.meta,{})');eq('storageBackend','memory')}finally{localStorage.getItem=getter}});
for(const theme of ['dark','light'])test('Tema legado continua local '+theme,()=>{reset();data.set('cbsi_theme_v11',theme);run('initTheme()');eq('storageBackend','local');assert.equal(data.get('cbsi_theme_v11'),JSON.stringify(theme))});
(async()=>{
 reset();assign(0);run('historyCache[state.semanaId]=cloneJson(state.atribuicoes);pessoaEmEdicao={id:state.pessoas[0].id};dialogInfo=function(title,message){window.dialogMessage=message;return Promise.resolve()};wireEvents()');
 const before=run('JSON.stringify({state:state,history:historyCache})');
 await events['btnExcluirPessoa:click']();
 test('Handler real de exclusão orienta arquivamento e preserva histórico',()=>{assert(sandbox.dialogMessage.includes('Gestão → Arquivamento da equipe'));assert(!sandbox.dialogMessage.includes('ainda não está disponível'));assert(sandbox.dialogMessage.includes('não pode ser excluído'));eq('JSON.stringify({state:state,history:historyCache})',before)});
 test('Nenhuma mensagem genérica nega arquivamento disponível',()=>assert(!html.includes('O arquivamento ainda não está disponível nesta versão.')));
 fs.writeFileSync(process.env.RESULT_FILE||'qa/microfix-results.json',JSON.stringify({target,passed:results.filter(x=>x.ok).length,total:results.length,results},null,2));console.log(JSON.stringify({passed:results.filter(x=>x.ok).length,total:results.length,failures:results.filter(x=>!x.ok)},null,2));if(results.some(x=>!x.ok))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
