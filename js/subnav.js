/* subnav.js — 페이지 안 메뉴: 지금 보고 있는 구역 표시 */
(function () {
  var nav = document.getElementById('subnav'); if (!nav) return;
  var links = [].slice.call(nav.querySelectorAll('a'));
  var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function on() {
    var y = scrollY + 160, cur = 0;
    secs.forEach(function (s, i) { if (s && s.offsetTop <= y) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('on', i === cur); });
    var a = links[cur]; if (a && nav.scrollWidth > nav.clientWidth) nav.querySelector('.wrap').scrollLeft = a.offsetLeft - 20;
  }
  window.addEventListener('scroll', on, { passive: true }); on();
})();
