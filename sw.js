/* Service worker cangkang aplikasi Laporan CS: menyimpan halaman pembuka & ikon supaya aplikasi cepat terbuka.
   Isi laporan tetap selalu diambil langsung dari Google (butuh internet). */
var CACHE = 'laporan-cs-v1';
var FILE = ['./', 'index.html', 'manifest.webmanifest', 'icon-32.png', 'icon-180.png', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILE); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) {
    return Promise.all(k.filter(function (n) { return n !== CACHE; }).map(function (n) { return caches.delete(n); }));
  }).then(function () { return self.clients.claim(); }));
});

// file cangkang: ambil yang terbaru dari internet, pakai simpanan kalau sedang offline
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin) return;
  e.respondWith(fetch(e.request).then(function (r) {
    var salin = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, salin); });
    return r;
  }).catch(function () { return caches.match(e.request); }));
});
