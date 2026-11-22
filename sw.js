// 캐시 먼저 응답하고 뒤에서 갱신한다: 지하 헬스장처럼 신호가 약해도 바로 열리고, 수정본은 다음 실행 때 반영된다.
const C = 'gymlog-v3';
self.addEventListener('install', e => e.waitUntil(caches.open(C).then(c => c.addAll(['./', 'figure.js', 'manifest.json', 'icon.svg']))));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k))))));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(C).then(async c => {
    const hit = await c.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
