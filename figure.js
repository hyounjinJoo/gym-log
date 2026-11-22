// 동작 그림. 관절 인형을 시작 자세와 끝 자세 사이에서 움직이고, 쓰는 근육을 빨갛게 칠한다.
// 그림은 전부 이 파일의 코드로 그린다(외부 그림 파일 없음). 화면은 240x220이고 옆모습 인형은 오른쪽을 본다.
//
// 옆모습(기본): hip 골반 위치, tor 몸통 각도(-90이 똑바로 선 자세), hand 손 위치, foot 발목 위치, fa 발 각도.
//   0은 시작 자세, 1은 끝 자세이고 1을 생략하면 움직이지 않는다. fh·ff는 화면 뒤쪽 팔·다리를 따로 움직일 때 쓴다.
//   eb·kb는 팔꿈치·무릎이 꺾이는 방향(1 또는 -1).
//   arc: 'h'(팔)나 'f'(다리)를 적으면 그 팔다리는 손·발을 직선으로 옮기지 않고 관절 각도를 돌려서 움직인다.
//   컬이나 익스텐션처럼 팔꿈치·무릎이 제자리에 있어야 하는 종목에 쓴다.
// 앞모습(v:'f'): hipY 골반 높이, hand 오른손 위치(왼손은 좌우 대칭), as 팔 길이 비율(몸 앞으로 뻗어 짧아 보일 때),
//   seat 앉은 자세, knee 무릎 벌림, back 뒷모습.
// eq 기구: pad 받침, bar 뼈대, back 등받이, lever 지렛대, cable 케이블, stack 무게 추, grip 손잡이, roll 롤 패드, db 덤벨, plate 발판.
const FIG = {
  '체스트 프레스 머신': { hip0: [104, 152], tor0: -93, hand0: [122, 100], hand1: [163, 98], foot0: [152, 200], eq: [['pad', 92, 164, 136, 164], ['bar', 110, 166, 110, 206], ['back', 17], ['stack', 44, 64], ['bar', 54, 60, 100, 60], ['bar', 100, 60, 100, 90], ['lever', 150, 204, 'W'], ['grip', 'W']] },
  '인클라인 체스트 프레스 머신': { hip0: [98, 156], tor0: -118, hand0: [98, 104], hand1: [92, 48], foot0: [156, 200], eq: [['pad', 88, 168, 134, 168], ['bar', 110, 170, 110, 206], ['back', 17], ['lever', 46, 80, 'W'], ['stack', 14, 96], ['grip', 'W']] },
  '케이블 푸시다운': { hip0: [112, 112], tor0: -82, hand0: [144, 72], hand1: [130, 117], foot0: [112, 200], arc: 'h', eq: [['stack', 170, 124], ['bar', 166, 8, 166, 206], ['bar', 148, 10, 168, 10], ['cable', 150, 12, 'W'], ['grip', 'W']] },
  '오버헤드 케이블 익스텐션': { hip0: [120, 114], tor0: -88, hand0: [104, 40], hand1: [124, 4], foot0: [122, 200], ff0: [134, 200], arc: 'h', eq: [['stack', 22, 90], ['bar', 52, 50, 52, 206], ['cable', 54, 186, 'W'], ['grip', 'W']] },
  '뉴트럴 그립 랫 풀다운': { hip0: [100, 158], tor0: -93, hand0: [108, 40], hand1: [118, 104], foot0: [148, 200], tor1: -98, eq: [['pad', 88, 170, 126, 170], ['bar', 106, 172, 106, 206], ['pad', 118, 145, 140, 145], ['bar', 178, 6, 178, 206], ['bar', 108, 8, 180, 8], ['stack', 184, 60], ['cable', 112, 10, 'W'], ['grip', 'W']] },
  '풀오버 머신': { hip0: [100, 158], tor0: -100, hand0: [68, 42], hand1: [122, 134], foot0: [148, 200], eq: [['pad', 88, 170, 128, 170], ['bar', 108, 172, 108, 206], ['back', 17], ['lever', 'S', 'E'], ['roll', 'E', 1]] },
  '체스트 서포티드 로우 머신': { hip0: [94, 158], tor0: -84, hand0: [158, 108], hand1: [112, 118], foot0: [146, 200], eq: [['pad', 82, 170, 118, 170], ['bar', 100, 172, 100, 206], ['pad', 116, 102, 115, 138], ['bar', 115, 140, 115, 206], ['stack', 182, 96], ['lever', 165, 70, 'W'], ['grip', 'W']] },
  '케이블 페이스 풀': { v: 'f', back: 1, hipY: 112, hand0: [130, 50], as0: 0.45, hand1: [158, 28], as1: 1, eq: [['bar', 120, 6, 120, 206], ['cable', 120, 12, 'W'], ['cable', 120, 12, 'V'], ['grip', 'W']] },
  '해머 컬': { hip0: [112, 110], tor0: -90, hand0: [113, 115], hand1: [138, 70], foot0: [112, 200], arc: 'h', eq: [['db', 'W']] },
  '프리처 컬 머신': { hip0: [90, 158], tor0: -64, hand0: [160, 142], hand1: [142, 92], foot0: [140, 200], arc: 'h', eq: [['pad', 78, 170, 112, 170], ['bar', 96, 172, 96, 206], ['pad', 114, 117, 142, 141], ['bar', 130, 134, 130, 206], ['stack', 178, 92], ['bar', 152, 70, 152, 206], ['bar', 142, 134, 152, 134], ['grip', 'W']] },
  '레그 프레스': { hip0: [84, 172], tor0: -138, hand0: [88, 176], foot0: [116, 124], foot1: [158, 120], fa0: -125, eq: [['pad', 72, 186, 106, 186], ['back', 17], ['bar', 60, 196, 200, 196], ['bar', 100, 196, 214, 116], ['bar', 150, 196, 214, 150], ['plate', 'M', -125, 40]] },
  '싱글 레그 프레스': { hip0: [84, 172], tor0: -138, hand0: [88, 176], foot0: [134, 130], foot1: [152, 118], fa0: -125, ff0: [124, 198], eq: [['pad', 72, 186, 106, 186], ['back', 17], ['bar', 60, 196, 200, 196], ['bar', 120, 196, 214, 102], ['bar', 150, 196, 214, 132], ['plate', 'M', -125, 40]] },
  '레그 프레스 카프 레이즈': { hip0: [84, 172], tor0: -138, hand0: [88, 176], foot0: [153, 113], fa0: -100, fa1: -140, foot1: [149, 117], eq: [['pad', 72, 186, 106, 186], ['back', 17], ['bar', 60, 196, 200, 196], ['bar', 150, 196, 214, 150], ['plate', 'T', -130, 34]] },
  '레그 익스텐션': { hip0: [92, 152], tor0: -100, hand0: [98, 156], foot0: [132, 198], foot1: [183, 155], fa0: 10, fa1: -60, arc: 'f', eq: [['pad', 82, 164, 138, 164], ['bar', 104, 166, 104, 206], ['back', 17], ['stack', 36, 76], ['roll', 'A', 1]] },
  '시티드 레그 컬': { hip0: [92, 152], tor0: -105, hand0: [96, 156], foot0: [180, 154], foot1: [120, 193], fa0: -70, fa1: 20, arc: 'f', eq: [['stack', 206, 110], ['pad', 82, 164, 138, 164], ['bar', 104, 166, 104, 206], ['back', 17], ['pad', 122, 139, 150, 139], ['roll', 'A', -1]] },
  '힙 쓰러스트 머신': { hip0: [116, 170], hip1: [130, 136], tor0: -140, tor1: -177, hand0: [118, 160], hand1: [132, 126], foot0: [176, 200], eq: [['pad', 46, 146, 88, 146], ['bar', 54, 148, 54, 206], ['bar', 82, 148, 82, 206], ['roll', 'H', 0]] },
  '데드버그': { hip0: [142, 186], tor0: 180, hand0: [86, 124], hand1: [24, 178], fh0: [88, 124], foot0: [188, 140], ff0: [188, 140], ff1: [221, 178], floor: 202, eq: [] },
  '팔로프 프레스': { hip0: [108, 112], tor0: -90, hand0: [136, 80], hand1: [170, 62], foot0: [108, 200], eq: [['grip', 'W']] },
  '덤벨 사이드 레터럴 레이즈': { v: 'f', hipY: 112, hand0: [146, 118], hand1: [210, 58], arc: 'h', eq: [['db', 'W']] },
  '케이블 사이드 레터럴 레이즈': { v: 'f', hipY: 112, hand0: [150, 118], hand1: [204, 58], lh0: [103, 108], arc: 'h', eb: -1, eq: [['stack', 26, 140], ['bar', 52, 20, 52, 206], ['cable', 54, 196, 'W'], ['grip', 'W']] },
  '펙덱 플라이': { v: 'f', hipY: 150, seat: 1, hand0: [174, 61], hand1: [132, 50], as1: 0.5, knee0: 16, eq: [['stack', 22, 130], ['bar', 16, 20, 16, 206], ['bar', 56, 20, 56, 206], ['bar', 16, 20, 56, 20], ['roll', 'F', 0]] },
  '케이블 플라이': { v: 'f', hipY: 112, hand0: [208, 62], hand1: [126, 110], as1: 0.8, eq: [['bar', 12, 8, 228, 8], ['stack', 18, 120], ['stack', 202, 120], ['bar', 228, 8, 228, 206], ['bar', 12, 8, 12, 206], ['cable', 226, 14, 'W'], ['cable', 14, 14, 'V'], ['grip', 'W']] },
  '리버스 펙덱 플라이': { v: 'f', back: 1, hipY: 150, seat: 1, hand0: [112, 86], as0: 0.5, hand1: [198, 86], knee0: 16, eq: [['stack', 110, 30], ['bar', 60, 14, 180, 14], ['bar', 60, 14, 60, 206], ['bar', 180, 14, 180, 206], ['grip', 'W']] },
  '힙 어브덕션 머신': { v: 'f', hipY: 150, seat: 1, hand0: [148, 156], knee0: 9, knee1: 42, eq: [['pad', 93, 84, 93, 150], ['pad', 147, 84, 147, 150], ['roll', 'K', 1]] },
};

// 두 마디 관절: 뿌리 r에서 목표 p까지 길이 a, b인 두 마디를 잇는다. s는 가운데 관절이 꺾이는 쪽
function ik(r, p, a, b, s) {
  const dx = p[0] - r[0], dy = p[1] - r[1], d = Math.max(Math.abs(a - b) + .01, Math.min(Math.hypot(dx, dy), a + b - .01));
  const base = Math.atan2(dy, dx), ang = Math.acos((a * a + d * d - b * b) / (2 * a * d));
  return [[r[0] + a * Math.cos(base + s * ang), r[1] + a * Math.sin(base + s * ang)], [r[0] + d * Math.cos(base), r[1] + d * Math.sin(base)]];
}

// t: 0(시작 자세) ~ 1(끝 자세). pri·sec: 주로 쓰는 근육과 돕는 근육의 이름표 배열
function figSvg(name, t, pri, sec) {
  const c = FIG[name];
  if (!c) return '';
  const st = (...keys) => (keys.some(k => pri.includes(k)) ? 'on' : keys.some(k => sec.includes(k)) ? 'half' : '');
  const mix = (a, b = a) => (typeof a === 'number' ? a + (b - a) * t : [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
  const at = (p, ang, len) => [p[0] + len * Math.cos(ang), p[1] + len * Math.sin(ang)];
  const f = v => v.toFixed(1);
  const line = (a, b, w, cls) => `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke-width="${w}" class="${cls}"/>`;
  const dot = (p, r, cls) => `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${r}" class="${cls}"/>`;
  const limb = (a, b, w, far) => line(a, b, w + 2.4, 'ol') + line(a, b, w, far ? 'far' : 'skin');
  // 근육: 마디 a→b의 f0~f1 구간을 앞쪽(+off)이나 뒤쪽(-off)으로 비켜 칠한다. flip은 몸통처럼 앞뒤 기준이 반대인 마디
  const mus = (state, a, b, f0, f1, off, w, flip) => {
    if (!state) return '';
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, n = flip ? [-dy / l, dx / l] : [dy / l, -dx / l];
    const p = k => [a[0] + dx * k + n[0] * off, a[1] + dy * k + n[1] * off];
    return line(p(f0), p(f1), w, 'mu ' + state);
  };
  // 관절 각도로 움직이기: 양 끝 자세에서 두 마디의 각도를 구하고 그 사이를 가까운 쪽으로 돈다
  const turn = (u, v) => u + ((((v - u) % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI) - Math.PI) * t;
  const dir = (u, v) => Math.atan2(v[1] - u[1], v[0] - u[0]);
  const sweep = (root, r0, p0, r1, p1, la0, lb0, la1, lb1, la, lb, bend) => {
    const [j0, e0] = ik(r0, p0, la0, lb0, bend), [j1, e1] = ik(r1, p1, la1, lb1, bend), j = at(root, turn(dir(r0, j0), dir(r1, j1)), la);
    return [j, at(j, turn(dir(j0, e0), dir(j1, e1)), lb)];
  };
  const blob = (state, p, r) => (state ? dot(p, r, 'mu ' + state) : '');
  const rad = Math.PI / 180, floorY = c.floor || 206;
  let J = {}, body = '';

  if (c.v === 'f') {
    const cx = 120, hy = c.hipY, sy = hy - 58, scale = mix(c.as0 ?? 1, c.as1 ?? c.as0 ?? 1), spread = mix(c.knee0 ?? 0, c.knee1 ?? c.knee0 ?? 0);
    const side = s => {
      const sh = [cx + s * 21, sy], hipJ = [cx + s * 10, hy + 2];
      const h = s < 0 && c.lh0 ? c.lh0 : mix(c.hand0, c.hand1), hand = s < 0 && c.lh0 ? h : [cx + s * (h[0] - cx), h[1]];
      const mir = p => [cx + s * (p[0] - cx), p[1]], s0 = c.as0 ?? 1, s1 = c.as1 ?? s0, bend = s * (c.eb ?? 1);
      const [E, W] = c.arc?.includes('h') && c.hand1 && !(s < 0 && c.lh0)
        ? sweep(sh, sh, mir(c.hand0), sh, mir(c.hand1), 33 * s0, 31 * s0, 33 * s1, 31 * s1, 33 * scale, 31 * scale, bend)
        : ik(sh, hand, 33 * scale, 31 * scale, bend);
      const A = c.seat ? [cx + s * spread, 198] : [cx + s * 13, hy + 93], K = c.seat ? [cx + s * spread, hy + 10] : ik(hipJ, A, 47, 45, -s)[0];
      return { sh, hipJ, E, W, K, A };
    };
    const R = side(1), L = side(-1);
    J = { W: R.W, V: L.W, E: R.E, F: R.E, K: R.K, S: R.sh, H: [cx, hy] };
    const leg = p => limb(p.hipJ, p.K, 16) + limb(p.K, p.A, 11.5) + limb(p.A, [p.A[0] + (c.seat ? 0 : p.A[0] > cx ? 6 : -6), p.A[1] + 3], 8);
    const pts = [[cx - 21, sy], [cx + 21, sy], [cx + 15, hy - 12], [cx + 16, hy + 4], [cx - 16, hy + 4], [cx - 15, hy - 12]].map(p => p.join(',')).join(' ');
    const arm = p => limb(p.sh, p.E, 11.5) + limb(p.E, p.W, 9.5) + dot(p.W, 5.6, 'ol') + dot(p.W, 4.4, 'skin')
      + mus(st(c.back ? 'tri' : 'bi'), p.sh, p.E, .3, .9, 0, 6) + mus(st('fore'), p.E, p.W, .08, .7, 0, 6)
      + blob(c.back ? st('delR', 'delS') : st('delS', 'delF'), p.sh, 8.5);
    const torsoMus = s => (c.back
      ? mus(st('lat'), [cx + s * 14, sy + 16], [cx + s * 9, hy - 16], 0, 1, 0, 9) + mus(st('trap'), [cx + s * 4, sy - 7], [cx + s * 14, sy - 3], 0, 1, 0, 6) + blob(st('glu'), [cx + s * 8, hy + 4], 8)
      : mus(st('chest'), [cx + s * 5, sy + 12], [cx + s * 14, sy + 10], 0, 1, 0, 12) + mus(st('chestU'), [cx + s * 5, sy + 3], [cx + s * 14, sy + 2], 0, 1, 0, 6)
        + mus(st('obl'), [cx + s * 11.5, sy + 26], [cx + s * 11, hy - 8], 0, 1, 0, 5) + mus(st('trap'), [cx + s * 5, sy - 7], [cx + s * 14, sy - 3], 0, 1, 0, 5))
      + blob(st('hipS'), [cx + s * 16, hy + 2], 6.5);
    body = (c.seat ? line([cx - 26, hy + 16], [cx + 26, hy + 16], 9, 'pad') + line([cx, hy + 18], [cx, floorY], 4, 'bar') : '')
      + leg(L) + leg(R)
      + `<polygon points="${pts}" class="olp"/><polygon points="${pts}" class="skinp"/>` + line([cx, sy - 2], [cx, sy - 12], 9, 'ol') + dot([cx, sy - 19], 11.7, 'ol') + dot([cx, sy - 19], 10.5, 'skin')
      + (c.back ? mus(st('mid'), [cx, sy + 6], [cx, sy + 24], 0, 1, 0, 20) + mus(st('low'), [cx, hy - 16], [cx, hy - 4], 0, 1, 0, 10) : mus(st('abs'), [cx, sy + 26], [cx, hy - 8], 0, 1, 0, 13))
      + torsoMus(1) + torsoMus(-1) + arm(L) + arm(R);
    J.A = R.A; J.B = L.A; J.L = L;
  } else {
    const hip = mix(c.hip0, c.hip1), ta = mix(c.tor0, c.tor1) * rad, sh = at(hip, ta, 58), head = at(hip, ta, 76);
    const hipEnd = c.hip1 || c.hip0, shStart = at(c.hip0, c.tor0 * rad, 58), shEnd = at(hipEnd, (c.tor1 ?? c.tor0) * rad, 58);
    const arm = (h0, h1) => (c.arc?.includes('h') && h1 ? sweep(sh, shStart, h0, shEnd, h1, 33, 31, 33, 31, 33, 31, c.eb ?? 1) : ik(sh, mix(h0, h1), 33, 31, c.eb ?? 1));
    const leg = (f0, f1) => (c.arc?.includes('f') && f1 ? sweep(hip, c.hip0, f0, hipEnd, f1, 47, 45, 47, 45, 47, 45, c.kb ?? -1) : ik(hip, mix(f0, f1), 47, 45, c.kb ?? -1));
    const [E, W] = arm(c.hand0, c.hand1), [K, A] = leg(c.foot0, c.foot1);
    const [E2, W2] = c.fh0 ? arm(c.fh0, c.fh1) : [E, W], [K2, A2] = c.ff0 ? leg(c.ff0, c.ff1) : [K, A];
    const fa = mix(c.fa0 ?? 0, c.fa1 ?? c.fa0 ?? 0) * rad, T = at(A, fa, 15), T2 = at(A2, c.ff0 ? 0 : fa, 15);
    const back = [Math.sin(ta), -Math.cos(ta)]; // 몸통의 등 쪽 방향
    J = { H: hip, S: sh, E, W, K, A, T, M: [(A[0] + T[0]) / 2, (A[1] + T[1]) / 2], back, ta };
    body = limb(hip, K2, 16, 1) + limb(K2, A2, 11.5, 1) + limb(A2, T2, 7, 1) + limb(sh, E2, 11.5, 1) + limb(E2, W2, 9.5, 1)
      + limb(hip, sh, 27) + line(sh, at(hip, ta, 68), 9, 'ol') + dot(head, 11.7, 'ol') + dot(head, 10.5, 'skin')
      + mus(st('obl'), hip, sh, .14, .5, 1, 13, 1) + mus(st('abs'), hip, sh, .12, .52, 8.5, 8, 1) + mus(st('chest'), hip, sh, .6, .84, 8, 11, 1) + mus(st('chestU'), hip, sh, .84, .93, 7, 8, 1)
      + mus(st('low'), hip, sh, .08, .3, -8.5, 8, 1) + mus(st('lat'), hip, sh, .3, .74, -6.5, 12, 1) + mus(st('mid'), hip, sh, .66, .9, -8, 9, 1) + mus(st('trap'), hip, sh, .9, 1.02, -6, 8, 1)
      + limb(hip, K, 16) + limb(K, A, 11.5) + limb(A, T, 7)
      + mus(st('quad'), hip, K, .14, .9, 4.2, 7.5) + mus(st('ham'), hip, K, .16, .9, -4.2, 7.5) + mus(st('calf'), K, A, .06, .62, -3, 6.5)
      + blob(st('glu'), [hip[0] + back[0] * 7 + Math.cos(ta) * 3, hip[1] + back[1] * 7 + Math.sin(ta) * 3], 9.5) + blob(st('hipS'), hip, 6.5)
      + limb(sh, E, 11.5) + limb(E, W, 9.5) + dot(W, 5.6, 'ol') + dot(W, 4.4, 'skin')
      + mus(st('bi'), sh, E, .28, .92, 3, 6) + mus(st('tri'), sh, E, .22, .92, -3, 6) + mus(st('fore'), E, W, .06, .7, 0, 7) + blob(st('delF', 'delS', 'delR'), sh, 8);
  }

  const pt = (x, y) => (typeof x === 'string' ? J[x] : [x, y]);
  let behind = line([14, floorY], [226, floorY], 2, 'floor'), front = '';
  for (const e of c.eq || []) {
    const k = e[0];
    if (k === 'pad') behind += line([e[1], e[2]], [e[3], e[4]], 9, 'pad');
    else if (k === 'bar') behind += line([e[1], e[2]], [e[3], e[4]], 4, 'bar');
    else if (k === 'stack') behind += `<rect x="${e[1]}" y="${e[2]}" width="20" height="${floorY - e[2]}" rx="3" class="pad"/>`;
    else if (k === 'back') behind += line([J.H[0] + J.back[0] * e[1] + Math.cos(J.ta) * 4, J.H[1] + J.back[1] * e[1] + Math.sin(J.ta) * 4], [J.S[0] + J.back[0] * e[1] + Math.cos(J.ta) * 6, J.S[1] + J.back[1] * e[1] + Math.sin(J.ta) * 6], 9, 'pad');
    else if (k === 'lever') { const p = typeof e[1] === 'string' ? J[e[1]] : [e[1], e[2]], q = J[e[e.length - 1]]; behind += line(p, q, 4, 'bar') + dot(p, 3.6, 'pad'); }
    else if (k === 'cable') { const q = J[e[3]]; behind += line([e[1], e[2]], q, 1.5, 'cab') + dot([e[1], e[2]], 4.2, 'bar'); }
    else if (k === 'grip') { front += dot(J.W, 3.4, 'pad'); if (c.v === 'f' && !c.lh0) front += dot(J.V, 3.4, 'pad'); }
    else if (k === 'db') { for (const w of c.v === 'f' ? [J.W, J.V] : [J.W]) front += line([w[0] - 7, w[1]], [w[0] + 7, w[1]], 3, 'pad') + dot([w[0] - 8, w[1]], 4.2, 'pad') + dot([w[0] + 8, w[1]], 4.2, 'pad'); }
    else if (k === 'plate') { const p = J[e[1]], a = e[2] * rad; front += line(at(p, a, -e[3] / 2 - 4), at(p, a, e[3] / 2), 5, 'pad'); }
    else if (k === 'roll') {
      const p = J[e[1]];
      if (c.v === 'f') { for (const s of [1, -1]) { const q = e[1] === 'K' ? [120 + s * (Math.abs(p[0] - 120) + 11), p[1]] : s > 0 ? J.E : J.L.E; front += dot(q, 6, 'pad'); } }
      else { const a = e[1] === 'A' ? J.K : e[1] === 'E' ? J.S : p, dx = p[0] - a[0], dy = p[1] - a[1], l = Math.hypot(dx, dy) || 1; front += dot([p[0] + dy / l * 9 * e[2], p[1] - dx / l * 9 * e[2] - (e[1] === 'H' ? 12 : 0)], 6, 'pad'); }
    }
  }
  return `<svg class="fig" viewBox="0 0 240 220" aria-hidden="true">${behind}${body}${front}</svg>`;
}
