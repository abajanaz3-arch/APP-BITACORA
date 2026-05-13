const CACHE_NAME = 'bitacora-v2';
const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  'https://cdn-icons-png.flaticon.com/512/1048/1048953.png'
];

// Instalación: Guarda los archivos en el caché del celular
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
  self.skipWaiting();
});

// Limpia versiones antiguas del cache para que se vean los cambios recientes.
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Estrategia: usa primero la red para evitar mostrar archivos viejos.
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(res => {
      const copia = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(e.request, copia));
      return res;
    }).catch(() => {
      return caches.match(e.request);
    })
  );
});
