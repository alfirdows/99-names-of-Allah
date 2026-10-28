/* Offline support: pages are fetched fresh when online (so updates reach everyone), and saved for offline use. */
const CACHE="asma-v47";
const CORE=["./","index.html","run.js","manifest.webmanifest","icon-180.png","icon-192.png","icon-512.png","fonts/Amiri-Bold.woff","fonts/ScheherazadeNew-Regular.woff","fonts/ScheherazadeNew-Bold.woff","fonts/IBMPlexSansArabic-Regular.woff","fonts/IBMPlexSansArabic-SemiBold.woff","fonts/IBMPlexSansArabic-Bold.woff"];
/* Listen audio (one file per lesson) is saved too, so it works offline; a failed audio file never blocks the update. */
const AUDIO=Array.from({length:70},(_,i)=>`audio/${String(i+1).padStart(2,"0")}.mp3`);
const NAMES_N=[1,1,2,2,2,2,1,4,2,1,2,1,1,1,1,1,2,3,2,2,1,1,1,1,1,3,1,1,1,1,1,1,1,4,1,1,2,2,2,1,1,1,1,1,1,1,1,2,2,1,3,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,2,1,1,1];
NAMES_N.forEach((n,i)=>{if(i!==2)for(let k=1;k<=n;k++)AUDIO.push(`audio/n/${String(i+1).padStart(2,"0")}-${k}.mp3`)});
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE).then(()=>Promise.all(AUDIO.map(u=>c.add(u).catch(()=>{}))))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const req=e.request;if(req.method!=="GET")return;const url=new URL(req.url);
 /* Calendar reminder files open straight in the phone's Calendar; never cache them as the page. */
 if(url.pathname.endsWith(".ics"))return;
 if(url.origin!==location.origin)return;
 if(req.mode==="navigate"||url.pathname.endsWith("/index.html")||url.pathname.endsWith("/")){
  e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put("index.html",cp));return r}).catch(()=>caches.match("index.html")));return}
 e.respondWith(caches.match(req).then(hit=>{const net=fetch(req).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp))}return r}).catch(()=>hit);return hit||net}))});
