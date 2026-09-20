const fs=require('fs'),vm=require('vm'),assert=require('assert');
const root='rc1/Escalas_CBSI_V11_2_6_RC1_PWA/',html=fs.readFileSync(root+'index.html','utf8'),source=fs.readFileSync(root+'sw.js','utf8'),manifest=JSON.parse(fs.readFileSync(root+'manifest.webmanifest','utf8'));
const results=[];async function test(name,fn){try{await fn();results.push({name,ok:true})}catch(e){results.push({name,ok:false,error:e.message})}}
const scope='https://example.test/repositorio/',prefix='cbsi-astra-'+encodeURIComponent(scope)+'-',cacheName=prefix+'11.2.6-rc1';
const events={},buckets=new Map(),deleted=[];let mode='online',responseBody='V11.2.6 RC1',requests=[],cacheFailure=false,writeFailure=false;
const sandbox={URL,Request,Response,console,self:{registration:{scope},clients:{claim:async()=>{}},addEventListener:(n,f)=>events[n]=f},caches:{open:async key=>{if(cacheFailure)throw Error('Cache unavailable');if(!buckets.has(key))buckets.set(key,new Map());const map=buckets.get(key);return {put:async(k,v)=>{if(writeFailure)throw Error('Quota');map.set(k,v.clone())},match:async k=>map.has(k)?map.get(k).clone():undefined}},keys:async()=>[...buckets.keys()],delete:async key=>{deleted.push(key);return buckets.delete(key)}},fetch:async req=>{requests.push(req);if(mode==='offline')throw Error('offline');return new Response(responseBody,{status:mode==='500'?500:mode==='404'?404:200,headers:{'content-type':req.url.endsWith('.png')?'image/png':'text/html'}})}};
vm.runInNewContext(source,sandbox);
async function lifecycle(n){let p;events[n]({waitUntil:x=>p=x});await p}
function get(path='index.html',method='GET'){let p;events.fetch({request:new Request(new URL(path,scope),{method}),respondWith:x=>p=x});return p}
(async()=>{
await test('Manifest caminhos relativos e standalone',()=>{for(const x of [manifest.id,manifest.start_url,manifest.scope,...manifest.icons.map(x=>x.src)])assert(x.startsWith('./'));assert.equal(manifest.display,'standalone');assert.equal(new URL(manifest.start_url,scope).pathname,'/repositorio/index.html')});
await test('Manifest assets existentes e PNG dimensões declaradas',()=>{for(const icon of manifest.icons){const b=fs.readFileSync(root+icon.src);assert.equal(b.toString('hex',0,8),'89504e470d0a1a0a');assert.equal(b.readUInt32BE(16)+'x'+b.readUInt32BE(20),icon.sizes);assert.equal(icon.type,'image/png')}assert(fs.existsSync(root+manifest.start_url))});
await test('HTML RC idêntico ao index',()=>assert.equal(html,fs.readFileSync('rc1/escalas-app-cbsi-v11-2-6-rc1.html','utf8')));
await test('Sem scripts ou CSS remotos obrigatórios',()=>assert(!/<(?:script|link)[^>]+(?:src|href)=["']https?:/i.test(html)));
await test('Registro restrito a contexto seguro HTTP(S), escopo relativo',()=>{assert(html.includes("window.isSecureContext && /^https?:$/.test(location.protocol)"));assert(html.includes("register('./sw.js',{scope:'./',updateViaCache:'none'})"));assert(html.includes("'serviceWorker' in navigator"))});
await test('Manifest HTML referenciado existe',()=>assert(html.includes('href="manifest.webmanifest"')&&fs.existsSync(root+'manifest.webmanifest')));
await test('Instala shell RC no cache exclusivo e subpasta',async()=>{await lifecycle('install');assert(buckets.has(cacheName));assert.equal(buckets.get(cacheName).size,4);assert(requests.every(r=>r.url.startsWith(scope)&&r.cache==='reload'))});
await test('Instalação rejeita HTML de outra versão sem substituir cache',async()=>{responseBody='V11.2.5.2';const before=await buckets.get(cacheName).get(scope+'index.html').clone().text();await assert.rejects(()=>lifecycle('install'));assert.equal(await buckets.get(cacheName).get(scope+'index.html').clone().text(),before);responseBody='V11.2.6 RC1'});
await test('Remove cache antigo próprio, preserva outro app e escopo',async()=>{for(const k of [prefix+'11.2.5','other-app','cbsi-astra-'+encodeURIComponent('https://example.test/outro/')+'-11.2.5'])buckets.set(k,new Map());await lifecycle('activate');assert.deepStrictEqual(deleted,[prefix+'11.2.5']);assert(buckets.has('other-app'));assert(buckets.has(cacheName))});
await test('Online prioriza HTML novo sobre cache',async()=>{responseBody='V11.2.7 TESTE';assert.equal(await (await get()).text(),responseBody);assert.equal(requests.at(-1).cache,'no-cache')});
await test('Offline usa último shell disponível',async()=>{mode='offline';assert.equal(await (await get()).text(),'V11.2.7 TESTE');mode='online'});
await test('Raiz e query usam mesmo index offline',async()=>{mode='offline';assert.equal(await (await get('./?teste=1')).text(),'V11.2.7 TESTE');mode='online'});
await test('404 não é escondido por HTML antigo',async()=>{mode='404';assert.equal((await get()).status,404);mode='online'});
await test('500 usa shell previamente disponível',async()=>{mode='500';assert.equal(await (await get()).text(),'V11.2.7 TESTE');mode='online'});
await test('Ignora POST, outras origens, outros escopos e dados',()=>{for(const [p,m] of [['index.html','POST'],['https://other.test/index.html','GET'],['../outro/index.html','GET'],['dados.json','GET']])assert.equal(get(p,m),undefined)});
await test('Sem localStorage/IndexedDB no worker',()=>assert(!/localStorage|indexedDB/.test(source)));
await test('Sem ativação forçada, reload ou loop',()=>{assert(!/\.skipWaiting\s*\(|\.navigate\s*\(|setInterval\s*\(/.test(source));assert(!html.includes('controllerchange'))});
await test('Falha de cache não impede resposta online',async()=>{cacheFailure=true;responseBody='online';assert.equal(await (await get()).text(),'online');cacheFailure=false});
await test('Quota cache não impede resposta online',async()=>{writeFailure=true;assert.equal(await (await get()).text(),'online');writeFailure=false});
fs.writeFileSync('rc1/qa/pwa-results.json',JSON.stringify({passed:results.filter(x=>x.ok).length,total:results.length,results},null,2));console.log(JSON.stringify({passed:results.filter(x=>x.ok).length,total:results.length,failures:results.filter(x=>!x.ok)},null,2));if(results.some(x=>!x.ok))process.exitCode=1;
})();
