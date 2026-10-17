// Service worker kiosk: halaman & pustaka QR tetap terbuka saat offline
const V='pb-v2',PRE=['./','index.html','manifest.webmanifest','icon-192.png','https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>Promise.all(PRE.map(u=>c.add(u.startsWith('http')?new Request(u,{mode:'no-cors'}):u).catch(()=>{})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(x=>x!=V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!='GET')return;
 if(/(workers\.dev|supabase\.co|cloudinary\.com)$/.test(u.hostname))return; // API selalu langsung ke jaringan
 const net=()=>fetch(r).then(x=>{if(x&&(x.ok||x.type=='opaque')){const y=x.clone();caches.open(V).then(c=>c.put(r,y))}return x});
 if(r.mode=='navigate'||(u.origin==location.origin&&/(\.html|\.js|\/)$/.test(u.pathname))){
  e.respondWith(Promise.race([net(),new Promise((_,j)=>setTimeout(j,4000))]).catch(()=>caches.match(r,{ignoreSearch:true}).then(c=>c||net())));return}
 e.respondWith(caches.match(r).then(c=>c||net()))});
