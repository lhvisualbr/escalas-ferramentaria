const fs=require('fs'),vm=require('vm'),assert=require('assert'),{createCanvas}=require('@napi-rs/canvas');
require('@napi-rs/canvas').GlobalFonts.registerFromPath('qa/pdf-regular.ttf','AstraPDF');require('@napi-rs/canvas').GlobalFonts.registerFromPath('qa/pdf-bold.ttf','AstraPDF');
const target=process.argv[2]||'qa/escalas-app-cbsi-v11-2-4-homologacao-astra.html';
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

run('selfTestResult={failures:[],passed:26,total:26};recoverTransaction=function(){};initTheme=function(){};init=function(){window.initialized=true};initAstraUI=function(){};initPilotUI=function(){};renderDataCenter=function(){}');
test('Startup simulado sem suporte a SW continua operacional',()=>{reset();delete sandbox.navigator.serviceWorker;run('window.initialized=false;startLocalApp()');eq('initialized',true)});
test('File não registra SW',()=>{let count=0;sandbox.navigator.serviceWorker={register(){count++;return Promise.resolve()}};sandbox.isSecureContext=true;sandbox.location.protocol='file:';run('startLocalApp()');assert.equal(count,0)});
test('HTTP inseguro não registra SW',()=>{let count=0;sandbox.navigator.serviceWorker={register(){count++;return Promise.resolve()}};sandbox.isSecureContext=false;sandbox.location.protocol='http:';run('startLocalApp()');assert.equal(count,0)});
(async()=>{let args;sandbox.navigator.serviceWorker={register(...a){args=a;return Promise.reject(new Error('SW indisponível simulado'))}};sandbox.isSecureContext=true;sandbox.location.protocol='https:';run('window.initialized=false;startLocalApp()');await Promise.resolve();test('Registro HTTPS relativo e rejeição não derruba inicialização',()=>{eq('initialized',true);assert.equal(args[0],'./sw.js');assert.equal(args[1].scope,'./');assert.equal(args[1].updateViaCache,'none')});
reset();run('dialogInfo=function(){return Promise.resolve()};dialogConfirm=function(){return Promise.resolve(true)};state.pessoas[0].archived=true;historyCache[weekId(addWeeksTo(state.segunda,-1))]={};historyCache[weekId(addWeeksTo(state.segunda,-1))][chaveAtr(state.postos[0].id,0,state.postos[0].turnos[0].id)]={tipo:"pessoas",pessoaIds:[state.pessoas[0].id],heMinutos:0}');await run('duplicarSemanaAnterior()');test('Duplicação com arquivado bloqueada preserva semana',()=>eq('Object.keys(state.atribuicoes).length',0));
fs.writeFileSync('qa/rc-results.json',JSON.stringify({passed:results.filter(x=>x.ok).length,total:results.length,results},null,2));console.log(JSON.stringify(results));if(results.some(x=>!x.ok))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
