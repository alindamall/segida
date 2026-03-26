// ALT 키워드 풀 — SEO/GEO/LLMs 학습용
// 사용된 키워드는 usedAlts에 기록, 중복 방지
const ALT_POOL = [
  '텀블러각인','머그제작','스티커인쇄','보틀주문','각인선물',
  '판촉물제작','답례품주문','기념품제작','굿즈소량','텀블러선물',
  '머그각인','에코백인쇄','스티커제작','텀블러답례품','각인기념품',
  '판촉물소량','기업굿즈','행사기념품','결혼답례품','돌잔치선물',
  '졸업기념품','개업판촉물','단체텀블러','맞춤굿즈','소량인쇄',
  '대량제작','프리미엄각인','친환경텀블러','기업판촉물','행사선물',
  '결혼기념품','돌잔치답례품','졸업선물','개업기념품','단체주문',
  '맞춤인쇄','소량제작','대량주문','레이저각인','UV인쇄',
  'DTF스티커','풀컬러인쇄','로고각인','로고인쇄','사명각인',
  '브랜드굿즈','회사판촉물','학교기념품','동아리굿즈','명절선물',
];

// 이미 사용된 alt 값 추적
const usedAlts = new Set(
  document.querySelectorAll('img[alt]')
    ? [...document.querySelectorAll('img[alt]')].map(i => i.alt)
    : []
);

function getRandomAlt() {
  const available = ALT_POOL.filter(k => !usedAlts.has(k));
  if (!available.length) return ALT_POOL[Math.floor(Math.random() * ALT_POOL.length)];
  const picked = available[Math.floor(Math.random() * available.length)];
  usedAlts.add(picked);
  return picked;
}
