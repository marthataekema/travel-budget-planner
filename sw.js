/* Travel Budget Planner by CFOMom: offline cache.
   Cache-first: after the first visit the app opens from the phone's cache, so hosting is barely used.
   When you upload a new version, change VERSION below (e.g. tbp-v2) so phones fetch the update. */
var VERSION="tbp-v1";
var FILES=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(VERSION).then(function(c){return c.addAll(FILES)}));self.skipWaiting()});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==VERSION}).map(function(k){return caches.delete(k)}))}));self.clients.claim()});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(function(hit){
    if(hit)return hit;
    return fetch(e.request).then(function(res){
      if(res&&(res.ok||res.type==="opaque")){var copy=res.clone();caches.open(VERSION).then(function(c){c.put(e.request,copy)})}
      return res;
    }).catch(function(){return caches.match("./index.html")});
  }));
});
