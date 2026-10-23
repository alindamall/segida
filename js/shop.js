/* shop.js — Shop 목록 필터: 카테고리(?cat=pen) + 카테고리별 세부 분류(?sub=…) */
(function () {
  var nav = document.getElementById('shopTabs'), btns = nav ? [].slice.call(nav.querySelectorAll('button')) : [],
      list = document.getElementById('shopList'), grid = document.getElementById('shopGrid'), cnt = document.getElementById('shopCount'),
      subBoxes = [].slice.call(document.querySelectorAll('.subtabs[data-for]'));
  if (!nav) return;
  var cat = 'all', sub = '';
  function apply() {
    var n = 0;
    btns.forEach(function (x) { x.classList.toggle('on', x.dataset.f === cat); });
    var box = null;
    subBoxes.forEach(function (bx) { bx.hidden = bx.getAttribute('data-for') !== cat; if (!bx.hidden) box = bx; });
    if (!box) sub = '';
    else box.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x.dataset.sub === sub); });
    grid.querySelectorAll('.pcard').forEach(function (c) {
      var show = (cat === 'all' || c.dataset.cat === cat) && (!sub || c.dataset.sub === sub);
      c.hidden = !show; if (show) n++;
    });
    cnt.textContent = n + '개 제품';
    var on = nav.querySelector('button.on'); if (on) nav.querySelector('.wrap').scrollLeft = on.offsetLeft - 20;
    var u = new URL(location.href), b = nav.querySelector('button.on');
    if (b && b.dataset.slug) u.searchParams.set('cat', b.dataset.slug); else u.searchParams.delete('cat');
    if (sub) u.searchParams.set('sub', sub); else u.searchParams.delete('sub');
    history.replaceState(null, '', u);
  }
  function toTop() {
    var top = list.getBoundingClientRect().top + scrollY - nav.offsetHeight - document.getElementById('header').offsetHeight;
    if (scrollY > top) window.scrollTo({ top: top, behavior: 'smooth' });
  }
  nav.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    cat = b.dataset.f; sub = ''; apply(); toTop();
  });
  subBoxes.forEach(function (bx) {
    bx.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      sub = b.dataset.sub; apply(); toTop();
    });
  });
  var q = new URLSearchParams(location.search), t = q.get('cat') && nav.querySelector('[data-slug="' + q.get('cat') + '"]');
  if (t) { cat = t.dataset.f; sub = q.get('sub') || ''; apply(); }
})();
