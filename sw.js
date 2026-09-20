'use strict';
// Only shell resources. Operational records never enter Cache Storage.
const PREFIX='cbsi-astra-'+encodeURIComponent(self.registration.scope)+'-';
const CACHE=PREFIX+'11.2.6-rc1';
const ASSETS=['index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png'];
const BASE=new URL(self.registration.scope);
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    // Validate the whole release before committing any asset.
    const responses=await Promise.all(ASSETS.map(async path=>{
      const response=await fetch(new Request(new URL(path,BASE),{cache:'reload'}));
      if(!response.ok||response.redirected||response.type==='opaque')throw new Error('Shell unavailable: '+path);
      if(path==='index.html'&&!(await response.clone().text()).includes('V11.2.6 RC1'))throw new Error('HTML release mismatch');
      return response;
    }));
    const cache=await caches.open(CACHE);
    await Promise.all(ASSETS.map((path,i)=>cache.put(new URL(path,BASE).href,responses[i])));
  })());
  // No skipWaiting: an editing session is never reloaded or replaced forcibly.
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==BASE.origin||!url.pathname.startsWith(BASE.pathname))return;
  const relative=url.pathname.slice(BASE.pathname.length);
  const path=relative===''?'index.html':relative;
  if(!ASSETS.includes(path))return;
  const canonical=new URL(path,BASE).href;
  event.respondWith((async()=>{
    let cache=null;try{cache=await caches.open(CACHE);}catch(error){console.info('Shell cache unavailable',error.message);}
    try{
      const response=await fetch(new Request(request,{cache:'no-cache'}));
      // Preserve explicit 4xx errors; do not mask missing deployments with old HTML.
      if(response.status>=500)throw new Error('Server unavailable');
      if(response.ok&&!response.redirected&&response.type!=='opaque'){
        const htmlOK=path!=='index.html'||(response.headers.get('content-type')||'').includes('text/html');
        if(htmlOK&&cache){try{await cache.put(canonical,response.clone());}catch(error){console.info('Shell cache write unavailable',error.message);}}
      }
      return response;
    }catch(error){
      const cached=cache?await cache.match(canonical):null;
      if(cached)return cached;
      throw error;
    }
  })());
});
