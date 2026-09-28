/* ============================================================
   blog.js — 네이버 블로그 출고기 자동 연동
   /api/blog (Netlify Function)에서 "판촉물·홍보굿즈 제작사례" 카테고리
   최신 글을 받아 카드로 표시. 실패하면 아래 기본 목록을 보여줌.
   ============================================================ */
(function () {
  var BLOG_HOME = 'https://blog.naver.com/alindamall';

  /* API 실패 시 보여줄 기본 목록 (새 글은 자동으로 추가되므로 수정 불필요) */
  var FALLBACK = [
    { title: '창립 25주년 기념품 | 락앤락 탑핸들 세라믹 텀블러 900ml + DTF스티커로 만든 고퀄리티 맞춤굿즈', tag: 'TUMBLER' },
    { title: '볼펜 위에 비행기 창문이? 항공사 아크릴 클립 볼펜 판촉 2,400개 출고기', tag: 'PEN' },
    { title: '로고 하나하나 놓치지 않는 정성 — 모디 마카롱 핸디팬 레이저 각인 출고 현장', tag: 'FAN' },
    { title: '락앤락 실리콘 지퍼백 2L 출고 현장! 굿즈·판촉물 제작은 알린다', tag: 'LOCK&LOCK' },
    { title: '탁상용선풍기 DTF스티커 제작기! 하남판촉물알린다', tag: 'DTF' }
  ];

  function esc(s) {
    return String(s || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmtDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d)) return '';
    return d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0');
  }
  function isNew(iso) {
    var d = new Date(iso);
    return !isNaN(d) && (Date.now() - d.getTime()) < 14 * 864e5;
  }

  function card(p) {
    var thumb = p.thumb
      ? '<img src="' + esc(p.thumb) + '" alt="' + esc(p.title) + '" loading="lazy" referrerpolicy="no-referrer" data-proxy="' + esc(p.proxy || '') + '">'
      : '';
    return '<a class="blog-card fade-up visible" href="' + esc(p.link || BLOG_HOME) + '" target="_blank" rel="noopener">' +
      '<div class="blog-thumb">' +
        '<span class="blog-badge">출고기</span>' +
        (p.date && isNew(p.date) ? '<span class="blog-badge blog-new">NEW</span>' : '') +
        '<span class="blog-thumb-fallback">' + esc(p.tag || 'ALINDA') + '</span>' +
        thumb +
      '</div>' +
      '<div class="blog-body">' +
        '<h3 class="blog-title">' + esc(p.title) + '</h3>' +
        '<div class="blog-meta"><span>' + fmtDate(p.date) + '</span><span>블로그에서 보기 →</span></div>' +
      '</div>' +
    '</a>';
  }

  function bindImgFallback(root) {
    root.querySelectorAll('.blog-thumb img').forEach(function (img) {
      img.addEventListener('error', function () {
        var proxy = img.getAttribute('data-proxy');
        if (proxy && img.src.indexOf('/api/blog-thumb') === -1) { img.src = proxy; return; }
        img.remove(); /* 이미지가 끝내 안 뜨면 브랜드 컬러 타일로 */
      });
    });
  }

  function render(grid, posts) {
    var limit = parseInt(grid.getAttribute('data-limit'), 10) || 8;
    grid.innerHTML = posts.slice(0, limit).map(card).join('');
    bindImgFallback(grid);
  }

  /* 블로그 글 목록을 한 번만 받아서 여러 곳에서 같이 씀 */
  var postsPromise = null;
  function getPosts() {
    if (postsPromise) return postsPromise;
    if (window.__BLOG_PREVIEW) { postsPromise = Promise.resolve(window.__BLOG_PREVIEW); return postsPromise; }
    postsPromise = new Promise(function (resolve) {
      var done = false;
      var timer = setTimeout(function () { if (!done) { done = true; resolve(null); } }, 6000);
      fetch('/api/blog', { headers: { accept: 'application/json' } })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) { if (!done) { done = true; clearTimeout(timer); resolve(j && j.posts && j.posts.length ? j.posts : null); } })
        .catch(function () { if (!done) { done = true; clearTimeout(timer); resolve(null); } });
    });
    return postsPromise;
  }

  /* 특정 출고기 연결: data-blog-match="제목 키워드"
     - 블로그에서 제목이 맞는 글을 찾으면 대표사진·링크를 자동으로 넣음
     - 못 찾으면 img의 src(직접 넣은 사진) → data-fallback 순서로 표시 */
  function initMatches() {
    var boxes = document.querySelectorAll('[data-blog-match]');
    if (!boxes.length) return;
    boxes.forEach(function (box) {
      var img = box.querySelector('img');
      if (img) img.addEventListener('error', function onErr() {
        var fb = img.getAttribute('data-fallback');
        var proxy = img.getAttribute('data-proxy');
        if (proxy && img.src.indexOf('/api/blog-thumb') === -1) { img.src = proxy; return; }
        if (fb && img.src.indexOf(fb) === -1) { img.src = fb; return; }
        img.removeEventListener('error', onErr);
      });
    });
    getPosts().then(function (posts) {
      if (!posts) return;
      boxes.forEach(function (box) {
        var key = box.getAttribute('data-blog-match');
        var post = posts.filter(function (p) { return (p.title || '').indexOf(key) !== -1; })[0];
        if (!post) return;
        if (post.link) {
          box.setAttribute('href', post.link);
          document.querySelectorAll('[data-blog-match-link="' + key + '"]').forEach(function (a) { a.setAttribute('href', post.link); });
        }
        var img = box.querySelector('img');
        if (img && post.thumb) {
          if (post.proxy) img.setAttribute('data-proxy', post.proxy);
          img.src = post.thumb;
        }
      });
    });
  }

  function init() {
    initMatches();
    var grid = document.getElementById('blogGrid');
    if (!grid) return;
    grid.innerHTML = '<div class="blog-skeleton"></div><div class="blog-skeleton"></div><div class="blog-skeleton"></div><div class="blog-skeleton"></div>';
    getPosts().then(function (posts) { render(grid, posts || FALLBACK); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
