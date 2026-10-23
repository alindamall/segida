/* ---------- 마케팅 추적: GA4 · GTM · 메타 픽셀 (설정된 것만 동작) ---------- */
window.track = function (name, params) {
  params = params || {};
  try { if (window.gtag) gtag('event', name, params); } catch (e) {}
  try { (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: name }, params)); } catch (e) {}
  try { if (window.fbq) fbq(name === 'generate_lead' ? 'track' : 'trackCustom', name === 'generate_lead' ? 'Lead' : name, params); } catch (e) {}
};
document.addEventListener('click', function (e) {
  var a = e.target.closest('a[href]'); if (!a) return;
  var h = a.getAttribute('href') || '';
  if (h.indexOf('tel:') === 0) track('click_phone', { link_url: h });
  else if (h.indexOf('smartstore.naver.com') > -1) track('click_store', { link_url: h, page: location.pathname });
  else if (h.indexOf('talk.naver.com') > -1) track('click_talk', { link_url: h });
  else if (h.indexOf('blog.naver.com') > -1) track('click_blog', { link_url: h });
  else if (/\.pdf($|\?)/i.test(h)) track('file_download', { link_url: h });
});

/* ---------- 견적 문의 전송 (구글 Apps Script → 구글 시트) ----------
   - 숨은 칸(website)에 값이 있으면 로봇으로 보고 조용히 무시
   - 페이지를 연 지 3초 안에 보낸 것도 로봇으로 봄
   - 시안(미리보기)에서는 FORM_ENDPOINT 가 비어 있어 실제로 보내지 않음 */
window.__pageOpened = Date.now();
window.sendInquiry = function (data, btn, done) {
  if (data.website || Date.now() - window.__pageOpened < 3000) { done && done(true); return; }   // 스팸으로 보고 무시
  delete data.website;
  var p = (window.PRODUCTS || []).filter(function (x) { return x.id === data.product; })[0];
  data.product = p ? p.name : (data.product === 'undecided' ? '아직 못 정함(추천 요청)' : (data.product || ''));
  data.category = data.product || data.purpose || '';   // 예전 시트의 '관심 제품' 칸에도 들어가게
  data.source = location.pathname;
  data.sentAt = new Date().toISOString();
  if (!window.FORM_ENDPOINT) {
    toast('시안이라 실제로 전송되지 않아요. (반영 시 구글 시트로 전송)'); done && done(true); return;
  }
  var label = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = '보내는 중...'; }
  var body = new URLSearchParams();
  Object.keys(data).forEach(function (k) { body.append(k, data[k] == null ? '' : data[k]); });
  fetch(window.FORM_ENDPOINT, { method: 'POST', mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }, body: body.toString() })
    .then(function () {
      toast((data.name || '') + '님, 견적 문의가 접수되었어요. 빠르게 연락드릴게요.');
      track('generate_lead', { form: data.source, product: data.product, purpose: data.purpose || '' });
      done && done(true);
    })
    .catch(function () { toast('전송 중 문제가 생겼어요. 1644-2523으로 전화 주세요.'); done && done(false); })
    .finally(function () { if (btn) { btn.disabled = false; btn.textContent = label; } });
};
function formData(f) { var o = {}; new FormData(f).forEach(function (v, k) { o[k] = v; }); return o; }

/* site.js — 모든 페이지 공통: 헤더, 모바일 메뉴, 등장 효과, 빠른 문의, 견적 폼 */
(function () {
  var R = window.SITE_ROOT || '/';

  /* 알림 */
  window.toast = function (m) {
    var t = document.getElementById('toast'); if (!t) return;
    t.textContent = m; t.classList.add('show');
    clearTimeout(window.toast._t); window.toast._t = setTimeout(function () { t.classList.remove('show'); }, 3200);
  };

  /* 헤더 · 모바일 메뉴 */
  var h = document.getElementById('header'), m = document.getElementById('mnav');
  window.addEventListener('scroll', function () { h.classList.toggle('scrolled', scrollY > 10); }, { passive: true });
  function setNav(o) { m.classList.toggle('open', o); m.setAttribute('aria-hidden', !o); document.body.style.overflow = o ? 'hidden' : ''; }
  document.getElementById('burger').onclick = function () { setNav(true); };
  document.getElementById('mclose').onclick = function () { setNav(false); };
  m.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });

  /* 스크롤 등장 */
  window.revealAll = function (root) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('vis'); io.unobserve(en.target); } });
    }, { threshold: .12 });
    (root || document).querySelectorAll('.rv-in:not(.vis)').forEach(function (el) { io.observe(el); });
  };
  revealAll();

  /* 견적 폼: Shop 제품 목록으로 선택지 채우기 (?product=상품ID 이면 미리 선택) */
  var sel = document.getElementById('productSelect');
  if (sel && window.loadProducts) loadProducts().then(function () {
    CATS.forEach(function (c) {
      var items = PRODUCTS.filter(function (p) { return p.cat === c; });
      if (!items.length) return;
      var g = document.createElement('optgroup'); g.label = c;
      items.forEach(function (p) { var o = document.createElement('option'); o.value = p.id; o.textContent = p.name; g.appendChild(o); });
      sel.appendChild(g);
    });
    var o = document.createElement('option'); o.value = 'undecided'; o.textContent = '아직 못 정했어요 (추천 받기)'; sel.appendChild(o);
    var want = new URLSearchParams(location.search).get('product');
    if (want) sel.value = want;
  });
  var cf = document.getElementById('contactForm');
  if (cf) cf.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = [].slice.call(cf.querySelectorAll('[required]')).filter(function (i) { return i.type === 'checkbox' ? !i.checked : !String(i.value).trim(); });
    cf.querySelectorAll('.err').forEach(function (i) { i.classList.remove('err'); });
    if (bad.length) { bad.forEach(function (i) { i.classList.add('err'); }); bad[0].focus(); toast('표시된 칸을 채워 주세요.'); return; }
    sendInquiry(formData(cf), cf.querySelector('button[type=submit]'), function (ok) { if (ok) cf.reset(); });
  });
})();

/* ---------- 견적 문의 팝업: [data-quote="상품ID"] 버튼을 누르면 그 페이지에서 바로 접수 ----------
   모바일은 아래에서 올라오고, PC는 가운데 팝업으로 뜹니다. */
(function () {
  if (!document.querySelector('[data-quote]')) return;
  var esc = function (s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var wrap = document.createElement('div');
  wrap.className = 'qm'; wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML =
    '<div class="qm-bg" data-close></div>' +
    '<div class="qm-box" role="dialog" aria-modal="true" aria-labelledby="qmTitle">' +
      '<div class="qm-grip" data-close aria-hidden="true"></div>' +
      '<div class="qm-head"><h2 id="qmTitle">견적 문의</h2>' +
        '<button type="button" class="qm-x" data-close aria-label="닫기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg></button></div>' +
      '<form class="qm-form" id="qmForm" novalidate>' +
        '<span class="qm-tag" id="qmTag"></span>' +
        '<div class="qm-prod" id="qmProd"></div>' +
        '<input type="hidden" name="purpose" id="qmPurpose">' +
        '<input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">' +
        '<div class="field" id="qmPick"><label>제품 선택</label><select name="product" id="qmProduct"></select></div>' +
        '<div class="f-row">' +
          '<div class="field"><label>이름 / 회사명 <em>*</em></label><input name="name" required placeholder="홍길동 / 알린다" autocomplete="name"></div>' +
          '<div class="field"><label>연락처 <em>*</em></label><input name="phone" type="tel" required placeholder="010-0000-0000" autocomplete="tel"></div>' +
        '</div>' +
        '<div class="f-row">' +
          '<div class="field"><label>예상 수량</label><input name="quantity" placeholder="대략적인 수량"></div>' +
          '<div class="field"><label>희망 납기</label><input name="deadline" type="date"></div>' +
        '</div>' +
        '<div class="field"><label>이메일</label><input name="email" type="email" placeholder="선택 입력" autocomplete="email"></div>' +
        '<div class="field"><label>문의 내용</label><textarea name="message" rows="3" placeholder="각인·인쇄할 내용, 용도, 요청 사항 등을 자유롭게 적어 주세요."></textarea></div>' +
        '<label class="agree"><input type="checkbox" required checked> 견적 안내를 위한 개인정보 수집·이용에 동의합니다.</label>' +
        '<button class="btn btn--primary" type="submit">견적 요청 보내기</button>' +
      '</form>' +
    '</div>';
  document.body.appendChild(wrap);
  var form = wrap.querySelector('#qmForm'), last = null;

  /* 제품 선택칸 (용도별 문의처럼 제품이 정해지지 않았을 때만 보임) */
  var pick = wrap.querySelector('#qmProduct');
  pick.innerHTML = '<option value="undecided">아직 못 정했어요 (추천 받기)</option>';
  var ready = (window.loadProducts ? loadProducts() : Promise.resolve([])).then(function (all) {
    (window.CATS || []).forEach(function (c) {
      var items = all.filter(function (p) { return p.cat === c; });
      if (!items.length) return;
      var g = document.createElement('optgroup'); g.label = c;
      items.forEach(function (p) { var o = document.createElement('option'); o.value = p.id; o.textContent = p.name; g.appendChild(o); });
      pick.appendChild(g);
    });
  });

  function open(id, purpose, pre) { ready.then(function () { show(id, purpose, pre); }); }
  function show(id, purpose, pre) {
    /* 상품 페이지에서는 하단 바 등 어떤 견적 버튼을 눌러도 그 제품이 미리 들어감 */
    var here = document.querySelector('[data-page-product]');
    if (!id && !purpose && here) id = here.getAttribute('data-page-product');
    var p = (window.PRODUCTS || []).filter(function (x) { return x.id === id; })[0];
    pick.value = p ? id : 'undecided';
    wrap.querySelector('#qmPick').hidden = !!p;
    wrap.querySelector('#qmPurpose').value = purpose || '';
    wrap.querySelector('#qmTag').textContent = purpose ? '용도 · ' + purpose : '';
    wrap.querySelector('#qmProd').innerHTML = p
      ? (p.img ? '<img src="' + esc(p.img) + '" alt="">' : '<span class="qm-ph"></span>') +
        '<div><small>' + esc(p.cat) + '</small><b>' + esc(p.name) + '</b></div>'
      : '';
    /* 옵션·견적 페이지에서 온 경우: 수량·고른 옵션을 미리 채움 */
    if (pre && pre.qty) form.querySelector('input[name=quantity]').value = pre.qty;
    if (pre && pre.msg) form.querySelector('textarea[name=message]').value = pre.msg;
    last = document.activeElement;
    wrap.classList.add('open'); wrap.setAttribute('aria-hidden', 'false');
    track('quote_open', { product: id || '', purpose: purpose || '', page: location.pathname });
    document.body.style.overflow = 'hidden';
    setTimeout(function () { form.querySelector('input[name=name]').focus({ preventScroll: true }); }, 320);
  }
  function close() {
    wrap.classList.remove('open'); wrap.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (last) last.focus();
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-quote]');
    if (b) { e.preventDefault(); open(b.getAttribute('data-quote'), b.getAttribute('data-purpose'), { qty: b.getAttribute('data-qty'), msg: b.getAttribute('data-msg') }); }
  });
  wrap.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && wrap.classList.contains('open')) close(); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = [].slice.call(form.querySelectorAll('[required]')).filter(function (i) { return i.type === 'checkbox' ? !i.checked : !i.value.trim(); });
    form.querySelectorAll('.err').forEach(function (i) { i.classList.remove('err'); });
    if (bad.length) { bad.forEach(function (i) { i.classList.add('err'); }); bad[0].focus(); toast('이름과 연락처를 입력해 주세요.'); return; }
    sendInquiry(formData(form), form.querySelector('button[type=submit]'), function (ok) {
      if (ok) { close(); form.reset(); pick.value = 'undecided'; }
    });
  });
})();

/* ---------- 자주 묻는 질문 접기/펼치기 (.faq.js-acc) ---------- */
document.querySelectorAll('.faq.js-acc').forEach(function (faq) {
  faq.addEventListener('click', function (e) {
    var b = e.target.closest('.faq-q'); if (!b) return;
    var it = b.parentNode, a = it.querySelector('.faq-a'), open = !it.classList.contains('open');
    it.classList.toggle('open', open); b.setAttribute('aria-expanded', open);
    a.style.maxHeight = open ? a.scrollHeight + 'px' : 0;
  });
});

/* ---------- 상품 카드 자리 채우기: <div data-products="cat:텀블러" 또는 "cur:기업 선물" data-limit="4"> ---------- */
(function () {
  var boxes = document.querySelectorAll('[data-products]:not([data-filled])');
  if (!boxes.length || !window.loadProducts) return;
  var esc = function (s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function card(p) {
    var alt = p.img && p.img2;
    return '<a class="pcard pcard--grid' + (alt ? ' has-alt' : '') + '" href="' + p.url + '"><div class="pcard-img">' +
      (p.img ? '<img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy">' : '<div class="ph">사진 준비 중</div>') +
      (alt ? '<img class="pcard-alt" src="' + esc(p.img2) + '" alt="" loading="lazy">' : '') +
      (p.badge ? '<span class="pcard-badge pcard-badge--' + p.badge + '">' + (p.badge === 'sold' ? 'SOLD OUT' : 'SALE') + '</span>' : '') + '</div>' +
      '<div class="pcard-cat">' + esc(p.cat) + '</div><p class="pcard-name">' + esc(p.name) + '</p><div class="pcard-price">' + esc(p.price) + '</div>' +
      (p.one ? '<p class="pcard-one">' + esc(p.one) + '</p>' : '') +
      (p.meta && p.meta.length ? '<div class="pcard-foot"><p class="pcard-meta">' + p.meta.map(esc).join('<i>|</i>') + '</p></div>' : '') + '</a>';
  }
  loadProducts().then(function (all) {
    boxes.forEach(function (box) {
      var q = box.getAttribute('data-products'), key = q.slice(0, 3), val = q.slice(4);
      var n = parseInt(box.getAttribute('data-limit'), 10) || 8;
      var list = all.filter(function (p) { return key === 'cat' ? p.cat === val : (p.curation || []).indexOf(val) > -1; }).slice(0, n);
      box.innerHTML = list.length ? list.map(card).join('')
        : '<p class="pgrid-empty">준비 중인 제품이에요. 견적 문의로 먼저 상담해 보세요.</p>';
    });
  });
})();

/* ---------- 캐러셀: 3.5초마다 한 칸씩, 화살표·손가락 밀기, 마우스 올리면 멈춤 ---------- */
document.querySelectorAll('[data-carousel]').forEach(function (car) {
  var track = car.querySelector('.car-track'), bar = car.querySelector('.car-prog i');
  var sec = car.closest('section') || document;
  var items = track.children, timer, paused = false;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function step() { return items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : track.clientWidth; }
  function atEnd() { return track.scrollLeft + track.clientWidth >= track.scrollWidth - 4; }
  function go(dir) {
    if (dir > 0 && atEnd()) track.scrollTo({ left: 0 });
    else if (dir < 0 && track.scrollLeft <= 4) track.scrollTo({ left: track.scrollWidth });
    else track.scrollBy({ left: dir * step() });
  }
  function prog() {
    var max = track.scrollWidth - track.clientWidth;
    if (bar) bar.style.width = (max > 0 ? Math.max(8, (track.scrollLeft / max) * 100) : 100) + '%';
  }
  function restart() { clearInterval(timer); if (!reduce) timer = setInterval(function () { if (!paused) go(1); }, 3500); }
  sec.querySelectorAll('[data-car]').forEach(function (b) {
    b.addEventListener('click', function () { go(b.getAttribute('data-car') === 'next' ? 1 : -1); restart(); });
  });
  car.addEventListener('mouseenter', function () { paused = true; });
  car.addEventListener('mouseleave', function () { paused = false; });
  track.addEventListener('touchstart', function () { paused = true; }, { passive: true });
  track.addEventListener('touchend', function () { paused = false; restart(); });
  track.addEventListener('scroll', prog, { passive: true });
  prog(); restart();
});

/* ---------- 입력칸 이름표 연결 (화면 읽기 프로그램용) ---------- */
(function () {
  var n = 0;
  function link() {
    document.querySelectorAll('.field').forEach(function (f) {
      var l = f.querySelector('label'), i = f.querySelector('input,select,textarea');
      if (!l || !i || l.htmlFor) return;
      if (!i.id) i.id = 'fld' + (++n);
      l.htmlFor = i.id;
    });
  }
  link(); setTimeout(link, 0);
})();

/* Shop 카드: 휴대폰에서 손가락으로 누르고 있으면 두 번째 썸네일(인쇄 사례) 보이기
   (스크롤하려고 스치는 손가락에는 반응하지 않도록 0.12초 기다림) */
(function () {
  var t, card;
  function off() { clearTimeout(t); if (card) card.classList.remove('alt-on'); card = null; }
  document.addEventListener('touchstart', function (e) {
    off();
    var c = e.target.closest && e.target.closest('.pcard.has-alt');
    if (!c) return;
    card = c; t = setTimeout(function () { c.classList.add('alt-on'); }, 120);
  }, { passive: true });
  ['touchend', 'touchcancel', 'touchmove'].forEach(function (n) { document.addEventListener(n, off, { passive: true }); });
})();
