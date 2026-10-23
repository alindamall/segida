/* product.js — 상품 상세: 썸네일 2장 전환 */
(function () {
  var main = document.getElementById('pdMain'), box = document.querySelector('.pd-thumbs');
  if (!main || !box) return;
  box.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    main.src = b.dataset.src;
    box.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
  });
})();
