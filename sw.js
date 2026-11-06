/* Cafeteria Igreja Onda (versão nuvem) - service worker
   Ao publicar uma versão nova do app, aumente o número em CACHE. */
var CACHE = "onda-pdv-nuvem-v2";
var ARQUIVOS = ["./", "./index.html", "./app.js", "./config.js", "./manifest.json",
                "./logo-branco.png", "./logo-azul.png", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ARQUIVOS); }));
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(nomes){
      return Promise.all(nomes.map(function(n){ if(n !== CACHE) return caches.delete(n); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("message", function(e){
  if(e.data && e.data.tipo === "atualizar") self.skipWaiting();
});

function cachePrimeiro(req){
  return caches.match(req).then(function(cacheado){
    var rede = fetch(req).then(function(resp){
      if(resp && resp.ok){
        var copia = resp.clone();
        caches.open(CACHE).then(function(c){ c.put(req, copia); });
      }
      return resp;
    }).catch(function(){ return cacheado; });
    return cacheado || rede;
  });
}

self.addEventListener("fetch", function(e){
  var req = e.request;
  if(req.method !== "GET") return;
  var url = new URL(req.url);

  // arquivos do próprio app
  if(url.origin === location.origin){ e.respondWith(cachePrimeiro(req)); return; }

  // biblioteca do Firebase: guarda em cache para o app abrir sem internet
  if(url.origin === "https://www.gstatic.com" && url.pathname.indexOf("/firebasejs/") === 0){
    e.respondWith(cachePrimeiro(req)); return;
  }

  // demais chamadas (banco de dados, login) passam direto - nunca em cache
});
