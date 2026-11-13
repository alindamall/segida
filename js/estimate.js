/* estimate.js — 옵션 및 견적 페이지 (/estimate/?id=상품ID)
   가격·옵션은 build.py 가 시트 제품목록의 '견적: …' 칸에서 만든 estimate-data.js 에서 옴
   tiers: [[시작 수량, 끝 수량(null=그 이상), 단가(null=별도 문의)]], prints/packs/adds: [[이름, 개당 금액]] */
(function () {
  var EST = window.EST || {};
  var id = new URLSearchParams(location.search).get('id') || '';
  var x = EST[id];
  var grid = document.getElementById('estGrid');
  if (!x) { document.getElementById('estEmpty').hidden = false; return; }

  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var fmt = function (n) { return Math.round(n).toLocaleString('ko-KR'); };
  var won = function (n) { return fmt(n) + '원'; };
  var plus = function (n) { return n ? '+' + won(n) : '무료'; };
  /* 옵션 값 규칙: [[시작 수량, 끝 수량(null=끝없음), 'u' 개당 | 'f' 일괄 | 'q' 별도 문의, 금액]] */
  function cost(rules, n) {
    for (var i = 0; i < rules.length; i++) {
      var r = rules[i];
      if (n >= r[0] && (r[1] == null || n <= r[1])) return { u: r[2] === 'u' ? r[3] : 0, f: r[2] === 'f' ? r[3] : 0, ask: r[2] === 'q' };
    }
    return { u: 0, f: 0, ask: true };
  }
  function label(rules) {
    var one = function (r) { return r[2] === 'q' ? '별도 문의' : r[2] === 'f' ? '일괄 ' + won(r[3]) : plus(r[3]); };
    if (rules.length === 1 && rules[0][0] <= 1 && rules[0][1] == null) return one(rules[0]);
    return rules.map(function (r) {
      var c = r[1] == null ? fmt(r[0]) + '개 이상' : r[0] <= 1 ? fmt(r[1] + 1) + '개 미만' : fmt(r[0]) + '~' + fmt(r[1]) + '개';
      return c + ' ' + one(r);
    }).join(' · ');
  }
  var minQ = x.tiers[0][0];
  document.title = x.name + ' 옵션 및 견적 | 알린다';
  document.getElementById('estCrumbs').innerHTML = '<a href="/">홈</a><i>/</i><a href="/shop/">Shop</a><i>/</i><a href="' + esc(x.url) + '">' + esc(x.name) + '</a><i>/</i><span>옵션 및 견적</span>';

  var packs = x.packs.length ? x.packs : [['포장 안 함', [[1, null, 'u', 0]]]];
  var PACK_PHOTO = '/img/site/pack-giftwrap.webp';  // 선물포장 예시 사진 ('디자인 보기' 버튼)
  function showPhoto(src, cap) {
    var lb = document.createElement('div');
    lb.className = 'est-lb';
    lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', cap);
    lb.innerHTML = '<figure><img src="' + esc(src) + '" alt="' + esc(cap) + '"><figcaption>' + esc(cap) + ' · 실제 포장지 무늬·색상은 조금 다를 수 있어요</figcaption>' +
      '<button type="button" class="est-lb-x" aria-label="닫기">×</button></figure>';
    function close() { lb.remove(); document.removeEventListener('keydown', key); }
    function key(e) { if (e.key === 'Escape') close(); }
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.closest('.est-lb-x')) close(); });
    document.addEventListener('keydown', key);
    document.body.appendChild(lb);
    lb.querySelector('.est-lb-x').focus();
  }
  grid.addEventListener('click', function (e) {
    var b = e.target.closest('.est-photo');
    if (!b) return;
    e.preventDefault(); e.stopPropagation();  // 라벨 안 버튼이라 포장 선택이 바뀌지 않게
    showPhoto(b.getAttribute('data-photo'), b.getAttribute('data-cap'));
  });
  function radios(name, list, priced) {
    return list.map(function (o, i) {
      var title = typeof o === 'string' ? o : o[0];
      var photo = name === 'pack' && /선물\s*포장/.test(title) ? PACK_PHOTO : '';
      return '<label class="est-opt"><input type="radio" name="' + name + '" value="' + i + '"' + (i ? '' : ' checked') + '>' +
        '<span><b>' + esc(title) + (photo ? ' <button type="button" class="est-photo" data-photo="' + photo + '" data-cap="' + esc(title) + ' 예시">디자인 보기</button>' : '') + '</b>' + (priced ? '<small>' + label(o[1]) + '</small>' : '') + '</span></label>';
    }).join('');
  }
  var tierRows = x.tiers.map(function (t) {
    var range = fmt(t[0]) + '개' + (t[1] == null ? ' 이상' : t[1] === t[0] ? '' : ' ~ ' + fmt(t[1]) + '개');
    return '<tr data-q="' + t[0] + '"><td>' + range + '</td><td>' + (t[2] == null ? '별도 문의' : won(t[2])) + '</td></tr>';
  }).join('');
  var last = x.tiers[x.tiers.length - 1];
  if (last[1] != null) tierRows += '<tr><td>' + fmt(last[1] + 1) + '개 이상</td><td>별도 문의</td></tr>';
  var priced = x.tiers.filter(function (t) { return t[2] != null; });
  var startQ = priced.length ? priced[priced.length - 1][0] : minQ;

  grid.innerHTML =
    '<div class="est-media">' + (x.img ? '<img src="' + esc(x.img) + '" alt="' + esc(x.name) + '">' : '<div class="ph">사진 준비 중</div>') + '</div>' +
    '<form class="est-form" id="estForm" onsubmit="return false">' +
      '<div class="pd-cat">' + esc(x.cat) + '</div><h1 class="pd-name">' + esc(x.name) + '</h1>' +
      (window.EST_SAMPLE ? '<p class="est-sample">미리보기용 예시 가격이에요. 시트 제품목록의 \'견적: 수량별 단가\' 칸에 가격을 적으면 실제 가격으로 바뀌어요.</p>' : '') +
      (x.colors.length ? '<fieldset class="est-sec"><legend>색상</legend><div class="est-opts est-opts--chip">' + radios('color', x.colors) + '</div></fieldset>' : '') +
      (x.prints.length ? '<fieldset class="est-sec"><legend>인쇄 방식 <small>개당</small></legend><div class="est-opts">' + radios('print', x.prints, true) + '</div></fieldset>' : '') +
      '<fieldset class="est-sec"><legend>포장' + (x.packs.length ? ' <small>개당</small>' : '') + '</legend><div class="est-opts">' + radios('pack', packs, !!x.packs.length) + '</div></fieldset>' +
      (x.adds.length ? '<fieldset class="est-sec"><legend>추가 옵션 <small>개당 · 선택하지 않아도 돼요</small></legend><div class="est-opts">' +
        x.adds.map(function (o, i) { return '<label class="est-opt"><input type="checkbox" name="add" value="' + i + '"><span><b>' + esc(o[0]) + '</b><small>' + label(o[1]) + '</small></span></label>'; }).join('') +
        '</div></fieldset>' : '') +
      '<fieldset class="est-sec"><legend>수량 <small>최소 ' + fmt(minQ) + '개</small></legend>' +
        '<div class="est-qty"><button type="button" data-step="-1" aria-label="수량 줄이기">−</button>' +
        '<input id="estQty" inputmode="numeric" value="' + fmt(startQ) + '" aria-label="제작 수량"><span>개</span>' +
        '<button type="button" data-step="1" aria-label="수량 늘리기">+</button></div>' +
        '<table class="est-tiers"><thead><tr><th>수량</th><th>제품 단가</th></tr></thead><tbody>' + tierRows + '</tbody></table>' +
      '</fieldset>' +
      '<div class="est-foot" id="estFoot" aria-live="polite"></div>' +
    '</form>';

  var form = document.getElementById('estForm'), qty = document.getElementById('estQty');
  function val(name) { var i = form.querySelector('input[name=' + name + ']:checked'); return i ? +i.value : 0; }
  function q() { return parseInt(String(qty.value).replace(/[^0-9]/g, ''), 10) || 0; }

  function calc() {
    var n = q(), tier = null;
    x.tiers.forEach(function (t) { if (n >= t[0] && (t[1] == null || n <= t[1])) tier = t; });
    var pr = x.prints.length ? x.prints[val('print')] : null;
    var pk = packs[val('pack')];
    var ad = [].map.call(form.querySelectorAll('input[name=add]:checked'), function (i) { return x.adds[+i.value]; });
    var color = x.colors.length ? x.colors[val('color')] : '';
    /* 고른 옵션마다 이 수량에서의 값 (개당 / 일괄 / 별도 문의) */
    var chosen = [];
    if (pr) chosen.push(['인쇄', pr]);
    if (x.packs.length) chosen.push(['포장', pk]);
    ad.forEach(function (o) { chosen.push(['추가', o]); });
    chosen = chosen.map(function (k) { return { kind: k[0], name: k[1][0], c: cost(k[1][1], n) }; });
    var ask = chosen.filter(function (o) { return o.c.ask; })[0];
    var ok = n >= minQ && tier && tier[2] != null && !ask;
    form.querySelectorAll('.est-tiers tr[data-q]').forEach(function (r) { r.classList.toggle('on', !!tier && +r.dataset.q === tier[0]); });
    var c = { n: n, tier: tier, pr: pr, pk: pk, ad: ad, color: color, chosen: chosen, ask: ask, ok: ok, under: n < minQ };
    c.unit = ok ? Math.round(sums(rows(c)).supply / n) : 0;   // 일괄 금액까지 나눈 개당 금액
    return c;
  }
  /* 견적 행: 제품 / 인쇄 / 포장 / 추가 옵션을 각각 한 줄씩. 일괄 금액은 '1식'으로 따로 한 줄
     (세액은 줄마다 계산해 화면·PDF 금액을 똑같이) */
  function rows(c) {
    var r = [{ name: x.name, spec: c.color, qty: c.n, ea: 'EA', unit: c.tier[2] }];
    c.chosen.forEach(function (o) {
      var nm = o.kind + ' · ' + o.name;
      if (o.c.f) r.push({ name: nm + ' (일괄)', spec: '', qty: 1, ea: '식', unit: o.c.f });
      if (o.c.u || !o.c.f) r.push({ name: nm, spec: '', qty: c.n, ea: 'EA', unit: o.c.u });
    });
    return r.map(function (v) { v.supply = v.unit * v.qty; v.vat = Math.round(v.supply * 0.1); return v; });
  }
  function sums(list) { return list.reduce(function (a, r) { a.supply += r.supply; a.vat += r.vat; return a; }, { supply: 0, vat: 0 }); }
  function opts(c) {
    var l = [];
    if (c.color) l.push(['색상', c.color]);
    if (c.pr) l.push(['인쇄', c.pr[0]]);
    l.push(['포장', c.pk[0]]);
    if (c.ad.length) l.push(['추가', c.ad.map(function (o) { return o[0]; }).join(', ')]);
    return l;
  }

  function render() {
    var c = calc(), lines = opts(c), t = c.ok ? sums(rows(c)) : { supply: 0, vat: 0 }, supply = t.supply, vat = t.vat;
    var warn = c.under ? '최소 ' + fmt(minQ) + '개부터 제작할 수 있어요.'
      : c.ask && c.tier && c.tier[2] != null ? c.ask.name + ' · ' + fmt(c.n) + '개는 수량에 맞춰 별도로 견적을 드려요.'
      : !c.ok ? fmt(c.n) + '개는 수량에 맞춰 별도로 견적을 드려요.' : '';
    document.getElementById('estFoot').innerHTML = (warn ? '<p class="est-warn">' + warn + '</p>' : '') +
      '<p class="est-note">표시 금액은 예상 견적이에요(VAT 별도' + (c.ok ? ', 포함 시 ' + won(supply + vat) : '') + '). 디자인·배송 조건에 따라 달라질 수 있어 상담 후 정확한 금액을 안내해 드려요.</p>';
    var msg = '[예상 견적] ' + x.name + '\n' + lines.map(function (l) { return l[0] + ': ' + l[1]; }).join('\n') +
      '\n수량: ' + fmt(c.n) + '개' + (c.ok ? '\n개당 ' + won(c.unit) + ' / 합계 ' + won(supply) + ' (VAT 별도)' : '');
    /* 아래 고정 바: 제작수량 · 예상 제작기간 · 개당 단가 · 예상 견적금액 + 버튼 */
    var bar = document.getElementById('estBar');
    bar.innerHTML =
      '<dl class="eb-stats">' +
        '<div class="eb-q"><dt>제작수량</dt><dd>' + fmt(c.n) + '개</dd></div>' +
        (x.leadtime ? '<div class="eb-lt"><dt>예상 제작기간</dt><dd>' + esc(x.leadtime) + '</dd></div>' : '') +
        '<div class="eb-u"><dt>개당 단가</dt><dd>' + (c.ok ? won(c.unit) : '-') + '</dd></div>' +
        '<div class="eb-t"><dt>예상 견적금액<small>(VAT 별도)</small></dt><dd>' + (c.ok ? won(supply) : '별도 안내') + '</dd></div>' +
      '</dl>' +
      '<div class="eb-btns">' +
        (c.ok ? '<button type="button" class="btn btn--line" id="estPrint">견적서<span class="eb-long"> 다운로드</span></button>' : '') +
        '<button type="button" class="btn btn--primary" data-quote="' + esc(x.id) + '" data-qty="' + esc(fmt(c.n) + '개') + '" data-msg="' + esc(msg) + '"><span class="eb-long">이 조합으로 </span>견적 문의</button>' +
      '</div>';
    var pb = document.getElementById('estPrint');
    if (pb) pb.onclick = function () { doc(c); if (window.track) track('estimate_print', { product: x.id }); window.print(); };
  }

  /* ---------- 인쇄·PDF용 견적서 (알린다 견적서 양식) ---------- */
  function korean(n) {
    var d = '영일이삼사오육칠팔구', sm = ['', '십', '백', '천'], bg = ['', '만', '억', '조'], out = '';
    n = Math.round(n); if (!n) return '영';
    for (var b = 0; n > 0; b++) {
      var ch = n % 10000, s = ''; n = Math.floor(n / 10000);
      for (var i = 0; ch > 0; i++) { var k = ch % 10; ch = Math.floor(ch / 10); if (k) s = (k !== 1 || i === 0 ? d[k] : '') + sm[i] + s; }
      if (s) out = s + bg[b] + out;
    }
    return out;
  }
  function doc(c) {
    var now = new Date(), p2 = function (v) { return ('0' + v).slice(-2); };
    var list = rows(c), t = sums(list), supply = t.supply, vat = t.vat, total = supply + vat;
    var no = 'AL-' + String(now.getFullYear()).slice(2) + p2(now.getMonth() + 1) + p2(now.getDate()) + '-W' + p2(now.getHours()) + p2(now.getMinutes());
    var el = document.getElementById('estDoc') || document.body.appendChild(Object.assign(document.createElement('div'), { id: 'estDoc', className: 'qdoc' }));
    el.innerHTML =
      '<div class="qd-top"><img src="/img/site/quote-logo.webp" alt="alinda"><h1>견 적 서</h1></div>' +
      '<div class="qd-meta"><div class="qd-left">' +
        '<div class="qd-to"><b></b> 귀하</div>' +
        '<div class="qd-info"><div><span>견적일자</span>' + now.getFullYear() + '년 ' + (now.getMonth() + 1) + '월 ' + now.getDate() + '일</div>' +
        '<div><span>유효기간</span>견적일로부터 30일</div><div><span>견적번호</span>' + no + '</div></div>' +
        '<div class="qd-msg">아래와 같이 견적합니다.</div></div>' +
        '<table class="qd-sup"><tr><td class="side" rowspan="5">공<br>급<br>자</td><th>등록번호</th><td colspan="3"><b>484-87-00820</b></td></tr>' +
        '<tr><th>상호</th><td>(주)알린다</td><th>대표자</th><td>이준호</td></tr>' +
        '<tr><th>주소</th><td colspan="3">경기도 하남시 미사강변서로 25, 6층 635호<br>(풍산동, 미사 테스타타워 지식산업센터)</td></tr>' +
        '<tr><th>업태</th><td>제조업, 도소매</td><th>종목</th><td>판촉물</td></tr>' +
        '<tr><th>연락처</th><td colspan="3">T. 1644-2523 / alindamall@naver.com</td></tr></table></div>' +
      '<div class="qd-total"><div class="lab">합계금액</div><div class="val"><span>일금 ' + korean(total) + '원정 <small>(VAT 포함)</small></span><b>₩ ' + fmt(total) + '</b></div></div>' +
      '<table class="qd-items"><thead><tr><th>No</th><th>품명 / 규격</th><th>수량</th><th>단가<br><small>(VAT 별도)</small></th><th>공급가액</th><th>세액</th><th>합계</th></tr></thead><tbody>' +
        list.map(function (r, i) {
          return '<tr><td>' + (i + 1) + '</td><td class="l">' + (i ? esc(r.name) : '<b>' + esc(r.name) + '</b>') + (r.spec ? '<small>' + esc(r.spec) + '</small>' : '') + '</td>' +
            '<td>' + fmt(r.qty) + ' ' + r.ea + '</td><td class="r">' + (r.unit ? fmt(r.unit) : '무료') + '</td><td class="r">' + fmt(r.supply) + '</td>' +
            '<td class="r">' + fmt(r.vat) + '</td><td class="r">' + fmt(r.supply + r.vat) + '</td></tr>';
        }).join('') +
        '</tbody><tfoot><tr><td colspan="2">합계</td><td></td><td class="r">' + (list.some(function (r) { return r.ea === '식'; }) ? '' : fmt(c.unit)) + '</td><td class="r">' + fmt(supply) + '</td><td class="r">' + fmt(vat) + '</td><td class="r"><b>' + fmt(total) + '</b></td></tr></tfoot></table>' +
      '<div class="qd-note"><h3>비고</h3>' +
        '<p>· 상기 금액은 <b>제품·인쇄·포장비와 부가세가 포함</b>된 금액입니다.</p>' +
        '<p>· 홈페이지에서 선택하신 옵션으로 계산한 <b>예상 견적</b>이며, 시안·배송 조건 확인 후 확정됩니다.</p>' +
        (x.leadtime ? '<p>· 예상 제작 기간: ' + esc(x.leadtime) + '</p>' : '') +
        '<p>· 인쇄 시안 확정 후 제작이 진행되며, 수량 변경 시 견적이 달라질 수 있습니다.</p></div>' +
      '<div class="qd-foot"><span>(주)알린다 · 볼펜, 생활용품, OEM, 기업 굿즈 상품 제작 및 무역 대행</span><span>alinda.kr</span></div>';
  }

  form.addEventListener('change', render);
  qty.addEventListener('input', render);
  qty.addEventListener('blur', function () { qty.value = fmt(q() || minQ); render(); });
  form.addEventListener('click', function (e) {
    var b = e.target.closest('[data-step]'); if (!b) return;
    var n = q(), step = n >= 1000 ? 100 : n >= 100 ? 50 : n >= 10 ? 10 : 1;   // 큰 수량일수록 큰 단위로
    qty.value = fmt(Math.max(minQ, +b.dataset.step > 0 ? n + step : n - step)); render();
  });
  form.querySelector('.est-tiers').addEventListener('click', function (e) {
    var r = e.target.closest('tr[data-q]'); if (r) { qty.value = fmt(+r.dataset.q); render(); }
  });

  /* 아래 고정 바(전화·스토어 바 자리)를 견적 바로 바꿈 */
  var qb = document.querySelector('.qbar--est'), bar = document.createElement('div');
  bar.id = 'estBar'; bar.className = 'est-bar'; qb.innerHTML = ''; qb.appendChild(bar);

  grid.hidden = false;
  render();
  if (window.track) track('estimate_view', { product: x.id });
})();
