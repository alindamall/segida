/* home.js — 메인 전용: Shop 슬라이드, 파트너, 리뉴, 제작 과정·FAQ */
(function () {
  var esc = function (x) { return String(x || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  /* Shop 슬라이드: 3초마다 한 칸씩 */
  var tabs = document.getElementById('tabs'), track = document.getElementById('track'),
      slider = document.getElementById('slider'), prog = document.getElementById('prog');
  var idx = 0, ALL = [], list = [], timer, paused = false;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  tabs.addEventListener('click', function (e) {
    var b = e.target.closest('.tab'); if (!b) return;
    tabs.querySelectorAll('.tab').forEach(function (t) { t.classList.toggle('on', t === b); });
    var c = b.dataset.c;
    list = pick(c);
    render(); restart();
  });
  function card(p) {
    var alt = p.img && p.img2;   // 두 번째 썸네일(인쇄 사례): 마우스를 올리면 보임
    var img = (p.img ? '<img src="' + p.img + '" alt="' + esc(p.name) + '" loading="lazy">' : '<div class="ph">사진 준비 중</div>') +
      (alt ? '<img class="pcard-alt" src="' + p.img2 + '" alt="" loading="lazy">' : '') + (p.badge ? '<span class="pcard-badge pcard-badge--' + p.badge + '">' + (p.badge === 'sold' ? 'SOLD OUT' : 'SALE') + '</span>' : '');
    return '<a class="pcard' + (alt ? ' has-alt' : '') + '" href="' + p.url + '"><div class="pcard-img">' + img + '</div>' +
      '<div class="pcard-cat">' + p.cat + '</div><p class="pcard-name">' + esc(p.name) + '</p>' +
      '<div class="pcard-price">' + p.price + '</div>' +
      (p.one ? '<p class="pcard-one">' + esc(p.one) + '</p>' : '') +
      (p.meta && p.meta.length ? '<div class="pcard-foot"><p class="pcard-meta">' + p.meta.map(esc).join('<i>|</i>') + '</p></div>' : '') + '</a>';
  }
  /* 슬라이드에는 최대 MAX개만 (카드가 너무 많으면 휴대폰에서 느려짐). '전체'는 카테고리를 번갈아 골고루 */
  var MAX = 16;
  function pick(c) {
    if (c !== '전체') return ALL.filter(function (p) { return p.cat === c; }).slice(0, MAX);
    var groups = {}, order = [], out = [];
    ALL.forEach(function (p) { if (!groups[p.cat]) { groups[p.cat] = []; order.push(p.cat); } groups[p.cat].push(p); });
    for (var i = 0; out.length < MAX && order.some(function (k) { return groups[k][i]; }); i++)
      order.forEach(function (k) { if (groups[k][i] && out.length < MAX) out.push(groups[k][i]); });
    return out;
  }
  function gap() { return parseFloat(getComputedStyle(track).gap) || 0; }
  function perView() { var c = track.querySelector('.pcard'); if (!c) return 1; return Math.max(1, Math.floor((slider.clientWidth + gap()) / (c.offsetWidth + gap()))); }
  function maxIdx() { return Math.max(0, list.length - perView()); }
  function go(i) {
    var m = maxIdx(); idx = i > m ? 0 : (i < 0 ? m : i);
    var c = track.querySelector('.pcard'); if (!c) return;
    track.style.transform = 'translateX(' + (-(c.offsetWidth + gap()) * idx) + 'px)';
    prog.style.width = ((idx + 1) / (m + 1) * 100) + '%';
  }
  function render() { track.innerHTML = list.map(card).join(''); idx = 0; go(0); }
  function restart() { clearInterval(timer); if (!reduce) timer = setInterval(function () { if (!paused) go(idx + 1); }, 3000); }
  document.getElementById('next').onclick = function () { go(idx + 1); restart(); };
  document.getElementById('prev').onclick = function () { go(idx - 1); restart(); };
  slider.addEventListener('mouseenter', function () { paused = true; });
  slider.addEventListener('mouseleave', function () { paused = false; });
  var sx = null, moved = false;
  slider.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; moved = false; paused = true; }, { passive: true });
  slider.addEventListener('touchend', function (e) {
    if (sx !== null) { var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) { moved = true; go(idx + (dx < 0 ? 1 : -1)); } }
    sx = null; paused = false; restart();
  });
  slider.addEventListener('click', function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);
  window.addEventListener('resize', function () { go(Math.min(idx, maxIdx())); });
  /* 스마트스토어 상품 목록(/api/products)을 받은 뒤 시작. 시트에서 '메인 노출 N'으로 뺀 상품은 제외 */
  track.innerHTML = '<div class="pcard"><div class="pcard-img"><div class="ph">불러오는 중</div></div></div>';
  loadProducts().then(function (all) {
    ALL = all.filter(function (p) { return p.main !== false && p.img; });   // 사진 있는 제품만
    var cats = CATS.filter(function (c) { return ALL.some(function (p) { return p.cat === c; }); });
    tabs.innerHTML = ['전체'].concat(cats).map(function (c, i) { return '<button class="tab' + (i ? '' : ' on') + '" role="tab" data-c="' + c + '">' + c + '</button>'; }).join('');
    list = pick('전체'); render(); restart();
  });

  /* 파트너 브랜드 */
  var B = ['LOCK&amp;LOCK', 'Tefal', 'Xiaomi', 'LAMY', 'Monami', 'OSULLOC', 'PARKER', 'Corelle'];
  var h = B.map(function (b) { return '<span>' + b + '</span>'; }).join('');
  document.getElementById('marquee').innerHTML = h + h;

  /* 리뷰 (스마트스토어 실구매 후기) */
  var R = [
    { n: 'nam2***', r: 5, d: '2026.04.04', p: '락앤락 커스텀 텀블러', i: 'review_n04.jpg', t: '머그컵이랑 텀블러 주문했는데 진짜 퀄리티가 너무 완벽합니다👏\n하나는 축구팀 로고로, 하나는 귀여운 이미지로 제작했는데 디테일이 진짜 끝판왕이에요.\n색감도 선명하고 마감도 깔끔해서 받자마자 감탄했습니다.' },
    { n: 'te****', r: 5, d: '2026.03.23', p: '락앤락 커스텀 텀블러', i: 'review_n07.jpg', t: '보낸 사진 그대로 털무늬에 표정까지 섬세하게 표현된 거 보고 감탄했어요\n제작 상품이라 오래 걸릴 줄 알았는데 주문하고 딱 3일 만에 도착!' },
    { n: 'vulp*****', r: 5, d: '2026.05.18', p: '락앤락 커스텀 텀블러', i: 'review_n01.jpg', t: '색상도 예쁘고 가벼워요~\n손잡이가 신의 한수에요!!!\n손잡이 덕에 편히 들고 다닐 수 있어요👍' },
    { n: 'gkdl****', r: 5, d: '2026.03.30', p: '락앤락 커스텀 텀블러', i: 'review_n05.jpg', t: '운동갈때 들고가려고 주문했는데 튼튼한 락앤락이라 오래사용할수 있을것 같아요!\n진짜 찐만족!!! 고민말고 꼭 구매하시길🧡' },
    { n: 'ykok***', r: 5, d: '2026.03.25', p: '락앤락 커스텀 텀블러', i: 'review_n06.jpg', t: '너무 너무 너무 대만족입니당 회사에서 쓰려고 샀는데 볼때마다 힐링될거같아요 ㅠㅠ' },
    { n: 'wi****', r: 5, d: '2026.04.21', p: '닥터지 선케어 답례품 세트', i: 'review_n03.jpg', t: '현장나갈때 잘 바르고다녀요' },
    { n: 'ulcu***', r: 4, d: '2026.05.16', p: '락앤락 스쿨핏 텀블러 380ml', i: 'review_n02.jpg', t: '어린이 텀블러로 잘 쓸게요' }
  ];
  document.getElementById('rvScroll').innerHTML = R.map(function (v) {
    return '<article class="rv"><div class="rv-img"><img src="' + IMG + 'review/' + v.i + '" alt="' + v.p + ' 후기 사진" loading="lazy"></div><div class="rv-body"><div class="stars" aria-label="별점 ' + v.r + '점">' + '★★★★★'.slice(0, v.r) + '<span style="color:#E5E7EB">' + '★★★★★'.slice(v.r) + '</span></div><p class="rv-text">' + v.t + '</p><div class="rv-meta"><b>' + v.p + '</b><span>' + v.n + ' · ' + v.d + '</span></div></div></article>';
  }).join('');

})();
