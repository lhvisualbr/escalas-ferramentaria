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
run('renderTudo=function(){};renderDataCenter=function(){};renderAudit=function(){};toast=function(){};dialogInfo=function(){return Promise.resolve()};selfTestResult=runCoreSelfTests()');
reset();test('Renomear pessoa histórica bloqueado',()=>{assign(0);run('historyCache[state.semanaId]=cloneJson(state.atribuicoes)');eq("salvarPessoa({id:'per_person_001',nome:'Outro'})",false);eq('state.pessoas[0].nome','José Silva')});
test('Renomear posto histórico bloqueado',()=>eq("salvarPosto(Object.assign({},state.postos[0],{nome:'Outro'}))",false));
test('Arquivamento preserva histórico e nome',()=>{eq("setPersonArchived('per_person_001',true)",true);eq('state.pessoas[0].archived',true);eq("nomesPessoas(['per_person_001'])",'José Silva');eq("historyCache[state.semanaId]['pst_station_001__0__shf_admin_001'].pessoaIds[0]",'per_person_001')});
test('Arquivado bloqueado em nova atribuição',()=>assert(run(proposal(1)).some(x=>x.includes('arquivado'))));
test('Arquivado mantém atribuição existente editável',()=>eq(proposal(0,30),[]));
test('Backup preserva arquivamento',()=>eq('validateImportedPack(currentDataPack()).pessoas[0].archived',true));
test('Edição não remove estado de arquivamento',()=>{run("salvarPessoa({id:'per_person_001',nome:'José Silva'})");eq('state.pessoas[0].archived',true)});
test('Reativação permite nova atribuição',()=>{eq("setPersonArchived('per_person_001',false)",true);eq(proposal(1),[])});
test('Auditoria registra reativação',()=>assert(run("storageGet(KEYS.audit,[]).some(x=>x.detail.includes('Reativado'))")));
test('Arquivo com archive inválido rejeitado',()=>assert.throws(()=>run("var p=currentDataPack();p.pessoas[0].archived='false';validateImportedPack(p)")));
for(const [stamp,now,expected] of [[null,0,'ATENÇÃO'],['2026-09-01',Date.parse('2026-09-09'),'ATENÇÃO'],['2026-09-01',Date.parse('2026-09-02'),'APROVADO'],['2026-09-03',Date.parse('2026-09-02'),'ATENÇÃO']])test('Backup freshness '+stamp+' / '+now,()=>assert(run(`backupAgeStatus(${JSON.stringify(stamp)},${now})`).startsWith(expected)));
test('Diagnóstico não escreve nem altera estado',()=>{const before=JSON.stringify([...data]),stateBefore=run('JSON.stringify(state)'),mirror=run('JSON.stringify(memoryStorage)');run('readDiagnostic()');assert.equal(JSON.stringify([...data]),before);eq('JSON.stringify(state)',stateBefore);eq('JSON.stringify(memoryStorage)',mirror)});
test('Diagnóstico expõe falha estrutural',()=>{run("state.pessoas.push({id:'bad',nome:''})");assert(run('readDiagnostic()').includes('Estrutura em memória: FALHA'));reset()});
test('Bloqueio impede storage e transação',()=>{run('sessionReadOnly=true');eq("storageSet('x',1)",false);eq('storeCorePackAtomic(currentDataPack())',false);run('sessionReadOnly=false')});
test('Remoção limpa espelho de armazenamento',()=>{run("storageSet('x',1);storageRemove('x')");eq("Object.prototype.hasOwnProperty.call(memoryStorage,'x')",false)});
test('Ajuda opcional e diagnóstico recolhidos',()=>{assert(html.includes('Como usar'));assert(!html.includes('id="pilotDetails" open'))});
(async()=>{
 await (async()=>{let callback;sandbox.navigator.locks={request:(name,opts,fn)=>{callback=fn;return Promise.resolve()}};run('window.started=0;acquireSession(function(){window.started++})');callback(null);eq('sessionReadOnly',true);eq('started',0);results.push({name:'Segunda aba sem lock não inicializa (simulado)',ok:true});run('sessionReadOnly=false');callback({name:'lock'});eq('started',1);results.push({name:'Primeira aba com lock inicializa (simulado)',ok:true});})();
 const performance=[];
 for(const n of [50,100]){reset();run(`state.pessoas=Array.from({length:${n}},(_,i)=>({id:'per_perf_'+i,nome:'Pessoa teste '+i}));state.postos=Array.from({length:20},(_,i)=>({id:'pst_perf_'+i,nome:'Posto '+i,local:'Teste',turnos:[{id:'shf_a_'+i,label:'Dia',inicio:'07:30',fim:'17:18'},{id:'shf_b_'+i,label:'Noite',inicio:'22:00',fim:'06:00'}]}));historyCache={};for(var w=0;w<52;w++){var wk=weekId(addWeeksTo(state.segunda,-w));historyCache[wk]={};for(var d=0;d<5;d++)state.postos.forEach(function(p,i){historyCache[wk][chaveAtr(p.id,d,p.turnos[0].id)]={tipo:'pessoas',pessoaIds:[state.pessoas[i].id],heMinutos:0}})}state.atribuicoes=historyCache[state.semanaId]`);
 function measure(name,code){const t=performanceNow();run(code);return {name,ms:Math.round((performanceNow()-t)*100)/100};}function performanceNow(){return Number(process.hrtime.bigint())/1e6;}
 performance.push({people:n,posts:20,weeks:52,measurements:[measure('search','state.pessoas.filter(p=>normalizeSearchText(p.nome).includes("teste"))'),measure('backup serialization','JSON.stringify(currentDataPack())'),measure('weekly PDF','montarPdfVetorSemanal()'),measure('validation','validarSemanaCompleta()')]});
 }
 fs.writeFileSync('qa/archive-session-results.json',JSON.stringify({passed:results.filter(x=>x.ok).length,total:results.length,results,performance},null,2));console.log(JSON.stringify({passed:results.filter(x=>x.ok).length,total:results.length,failures:results.filter(x=>!x.ok),performance},null,2));if(results.some(x=>!x.ok))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
