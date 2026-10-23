/* blog.js — 네이버 블로그 출고기 자동 연동 (실제 사이트: /api/blog → Netlify 함수)
   - #blogGrid[data-limit]  : 최신 출고기 카드
   - [data-blog-match="키워드"] : 제목에 키워드가 들어간 글의 사진·링크를 연결
   - API가 안 되면(미리보기 포함) 아래 기본 목록을 보여 줌 */
(function () {
  var BLOG = 'https://blog.naver.com/alindamall';
  var FALLBACK = [
    { title: '창립 25주년 기념품 | 락앤락 탑핸들 세라믹 텀블러 900ml + DTF스티커로 만든 고퀄리티 맞춤굿즈', tag: 'TUMBLER', link: BLOG + '/224424608509' },
    { title: '볼펜 위에 비행기 창문이? 항공사 아크릴 클립 볼펜 판촉 2,400개 출고기', tag: 'PEN', link: BLOG + '/224415010032' },
    { title: '로고 하나하나 놓치지 않는 정성 — 모디 마카롱 핸디팬 레이저 각인 출고 현장', tag: 'FAN', link: BLOG + '/224359537972' },
    { title: '락앤락 실리콘 지퍼백 2L 출고 현장! 굿즈·판촉물 제작은 알린다', tag: 'LOCK&LOCK', link: BLOG + '/224359089730' },
    { title: '탁상용선풍기 DTF스티커 제작기! 하남판촉물알린다', tag: 'DTF', link: BLOG + '/224352909618' }
  ];
  var esc = function (s) { return String(s || '').replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  function fmt(iso) { var d = new Date(iso); return isNaN(d) ? '' : d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0'); }
  function isNew(iso) { var d = new Date(iso); return !isNaN(d) && Date.now() - d.getTime() < 14 * 864e5; }

  var postsP = null;
  function getPosts() {
    if (postsP) return postsP;
    postsP = new Promise(function (resolve) {
      var done = false, t = setTimeout(function () { if (!done) { done = true; resolve(null); } }, 6000);
      fetch('/api/blog', { headers: { accept: 'application/json' } })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) { if (!done) { done = true; clearTimeout(t); resolve(j && j.posts && j.posts.length ? j.posts : null); } })
        .catch(function () { if (!done) { done = true; clearTimeout(t); resolve(null); } });
    });
    return postsP;
  }
  function bindFallback(root) {
    root.querySelectorAll('img[data-proxy]').forEach(function (img) {
      img.addEventListener('error', function () {
        var px = img.getAttribute('data-proxy');
        if (px && img.src.indexOf('/api/blog-thumb') === -1) { img.src = px; return; }
        img.remove();   // 끝내 안 뜨면 파란 타일(태그 글자)로
      });
    });
  }
  function card(p) {
    var img = p.thumb ? '<img src="' + esc(p.thumb) + '" alt="' + esc(p.title) + '" loading="lazy" referrerpolicy="no-referrer" data-proxy="' + esc(p.proxy || '') + '">' : '';
    return '<a class="bcard rv-in vis" href="' + esc(p.link || BLOG) + '" target="_blank" rel="noopener">' +
      '<div class="bthumb"><span class="bbadge">' + (p.date && isNew(p.date) ? 'NEW' : '출고기') + '</span>' +
      '<span class="fb">' + esc(p.tag || 'ALINDA') + '</span>' + img + '</div>' +
      '<div><h3 class="btitle">' + esc(p.title) + '</h3><div class="bmeta">' + (p.date ? fmt(p.date) + ' · ' : '') + '블로그에서 보기 →</div></div></a>';
  }
  function initGrid() {
    var grid = document.getElementById('blogGrid'); if (!grid) return;
    var n = parseInt(grid.getAttribute('data-limit'), 10) || 4;
    grid.innerHTML = FALLBACK.slice(0, n).map(card).join('');   // 먼저 기본 목록, 받아지면 교체
    getPosts().then(function (posts) { if (posts) { grid.innerHTML = posts.slice(0, n).map(card).join(''); bindFallback(grid); } });
  }
  function initMatches() {
    var boxes = document.querySelectorAll('[data-blog-match]'); if (!boxes.length) return;
    getPosts().then(function (posts) {
      if (!posts) return;
      boxes.forEach(function (box) {
        var key = box.getAttribute('data-blog-match');
        var post = posts.filter(function (p) { return (p.title || '').indexOf(key) > -1; })[0];
        if (!post) return;
        box.setAttribute('href', post.link);
        document.querySelectorAll('[data-blog-match-link="' + key + '"]').forEach(function (a) { a.setAttribute('href', post.link); });
        var img = box.querySelector('img');
        if (img && post.thumb) { img.setAttribute('referrerpolicy', 'no-referrer'); if (post.proxy) img.setAttribute('data-proxy', post.proxy); img.src = post.thumb; bindFallback(box); }
      });
    });
  }
  initGrid(); initMatches();
})();
