/* Offline support: pages are fetched fresh when online (so updates reach everyone), and saved for offline use. */
const CACHE="asma-v32";
const CORE=["./","index.html","manifest.webmanifest","icon-180.png","icon-192.png","icon-512.png","fonts/Amiri-Bold.woff","fonts/ScheherazadeNew-Regular.woff","fonts/ScheherazadeNew-Bold.woff","fonts/IBMPlexSansArabic-Regular.woff","fonts/IBMPlexSansArabic-SemiBold.woff","fonts/IBMPlexSansArabic-Bold.woff"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const req=e.request;if(req.method!=="GET")return;const url=new URL(req.url);
 /* Calendar reminder files open straight in the phone's Calendar; never cache them as the page. */
 if(url.pathname.endsWith(".ics"))return;
 if(url.origin!==location.origin)return;
 if(req.mode==="navigate"||url.pathname.endsWith("/index.html")||url.pathname.endsWith("/")){
  e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put("index.html",cp));return r}).catch(()=>caches.match("index.html")));return}
 e.respondWith(caches.match(req).then(hit=>{const net=fetch(req).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp))}return r}).catch(()=>hit);return hit||net}))});
