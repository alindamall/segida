/* ============================================================
   data.js — 알린다몰 콘텐츠 데이터
   모든 텍스트/제품/리뷰 콘텐츠를 JS 객체로 관리
   ============================================================ */

const SITE = {
  name: '알린다몰',
  tagline: '기업 판촉물 · 답례품 · 각인 전문',
  phone: '02-465-0817',
  email: 'alindamall@naver.com',
  kakao: 'https://pf.kakao.com/_YBFEX',
  smartstore: 'https://smartstore.naver.com/alindamall',
  instagram: 'https://instagram.com/alindamall',
  youtube: 'https://youtube.com/@alindamall',
  blog: 'https://blog.naver.com/alindamall',
  naverPlace: 'https://naver.me/x5m0ABfi',
  address: '경기 하남시 미사강변서로 25 6층 635호',
  bizNum: '484-87-00820',
  ceo: '이준호',
  company: '주식회사 알린다',
};

const HERO_SLIDES = [
  {
    id: 1,
    img: 'img/hero/hero_01.webp',
    placeholder: 'linear-gradient(135deg, #0D2B5E 0%, #1565C0 100%)',
    title: '기업 판촉물,\n알린다에서 시작하세요',
    subtitle: '텀블러 · 볼펜 · USB · 에코백 — 각인부터 배송까지 원스톱',
    cta1: { text: '무료 견적 받기', link: '#contact' },
    cta2: { text: '스마트스토어 바로가기', link: SITE.smartstore },
  },
  {
    id: 2,
    img: 'img/hero/hero_02.webp',
    placeholder: 'linear-gradient(135deg, #1565C0 0%, #2196F3 100%)',
    title: 'DTF 스티커 · 레이저 각인\n브랜드를 새기다',
    subtitle: '소량 50개부터 대량 10,000개까지 — 정밀 커스텀 제작',
    cta1: { text: '포트폴리오 보기', link: '#portfolio' },
    cta2: { text: '카카오 상담', link: SITE.kakao },
  },
  {
    id: 3,
    img: 'img/hero/hero_03.webp',
    placeholder: 'linear-gradient(135deg, #0A1F44 0%, #0D2B5E 100%)',
    title: '프리미엄 답례품\n특별한 순간을 완성합니다',
    subtitle: '돌잔치 · 결혼 · 기업행사 — 감동을 전하는 맞춤 답례품',
    cta1: { text: '답례품 상담', link: '#contact' },
    cta2: { text: '인스타그램', link: SITE.instagram },
  },
];

/* SVG icons for services */
const SERVICE_SVG = {
  tumbler: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M6 8h11v9a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="17" y2="1"/><line x1="6" y1="4" x2="17" y2="4"/></svg>',
  pen: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',
  fan: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12c-2-2.67-6-7-6-10a6 6 0 0 1 12 0c0 3-4 7.33-6 10z"/><circle cx="12" cy="12" r="2"/><path d="M12 12c2 2.67 6 7 6 10a6 6 0 0 1-12 0c0-3 4-7.33 6-10z"/><path d="M12 12c2.67-2 7-6 10-6a6 6 0 0 1 0 12c-3 0-7.33-4-10-6z"/><path d="M12 12c-2.67 2-7 6-10 6a6 6 0 0 1 0-12c3 0 7.33 4 10 6z"/></svg>',
  usb: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="4" cy="20" r="2"/><circle cx="16" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M12 2v10l4-2"/><path d="M12 12l-8 6"/><path d="M12 12l8 2"/></svg>',
  ecobag: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  gift: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>',
};

const SERVICES = [
  {
    id: 'tumbler',
    svgIcon: SERVICE_SVG.tumbler,
    title: '각인 텀블러',
    desc: '스텐·도자기·트라이탄 —\n레이저 & UV 각인으로\n브랜드를 새깁니다.',
    img: 'img/product/product_tumbler.png',
    link: SITE.smartstore,
  },
  {
    id: 'pen',
    svgIcon: SERVICE_SVG.pen,
    title: '판촉 볼펜',
    desc: '제트스트림·모나미 프리미엄 —\n기업 로고 인쇄 50개부터.',
    img: 'img/product/product_pen.png',
    link: SITE.smartstore,
  },
  {
    id: 'fan',
    svgIcon: SERVICE_SVG.fan,
    title: '핸디 선풍기',
    desc: '여름 시즌 판촉 필수템 —\n풀컬러 인쇄, 개별포장 가능.',
    img: 'img/product/product_fan.png',
    link: SITE.smartstore,
  },
  {
    id: 'usb',
    svgIcon: SERVICE_SVG.usb,
    title: 'USB · 보조배터리',
    desc: '실용성 최강 IT 판촉물 —\n레이저 각인 & 풀컬러 UV 인쇄.',
    img: 'img/product/product_usb.png',
    link: SITE.smartstore,
  },
  {
    id: 'ecobag',
    svgIcon: SERVICE_SVG.ecobag,
    title: '에코백 · 파우치',
    desc: '친환경 캔버스 원단 —\n실크스크린, 디지털 전사 인쇄.',
    img: 'img/product/product_ecobag.png',
    link: SITE.smartstore,
  },
  {
    id: 'gift',
    svgIcon: SERVICE_SVG.gift,
    title: '세트 · 선물 패키지',
    desc: '텀블러+볼펜+에코백 세트 —\n답례품·행사 선물 맞춤 구성.',
    img: 'img/product/product_gift.png',
    link: SITE.smartstore,
  },
];

/* ===== ICEBERG SECTION ===== */
const ICEBERG = {
  aboveLabel: 'VISIBLE 10%',
  aboveTitle: '고객이 받는 판촉물 하나',
  aboveDesc: '완성된 결과물, 그것이 전부로 보입니다.',
  dividerLeft: '겉으로 보이는 건',
  dividerBold: '완성품 하나',
  dividerRight: '입니다.',
  belowLabel: 'INVISIBLE 90%',
  belowTitle: '그 하나를 위해,\n알린다는 이렇게 합니다.',
  belowDesc: '보이지 않는 곳에서 완성도를 만드는 알린다의 제작 프로세스',
};

const ICEBERG_SVG = {
  consult:  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  design:   '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>',
  material: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  engrave:  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  color:    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12" r="2.5"/><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12a10 10 0 0 0 8 9.8"/></svg>',
  check:    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  pack:     '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>',
  delivery: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
  after:    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
};

const ICEBERG_ITEMS = [
  { svg: ICEBERG_SVG.consult,  num: '01', title: '1:1 맞춤 상담',       desc: '용도·수량·예산에 맞는 최적 제안' },
  { svg: ICEBERG_SVG.design,   num: '02', title: '디자인 시안 제작',    desc: '24시간 내 시안, 수정 무제한' },
  { svg: ICEBERG_SVG.material, num: '03', title: '원자재 품질 선별',    desc: '검증된 공급처, 불량률 1% 미만' },
  { svg: ICEBERG_SVG.engrave,  num: '04', title: '정밀 각인 · 인쇄',    desc: '레이저·UV·DTF — 기법별 최적화' },
  { svg: ICEBERG_SVG.color,    num: '05', title: '색상 보정 · 테스트',  desc: '시안과 실물 차이 최소화' },
  { svg: ICEBERG_SVG.check,    num: '06', title: '전수 품질 검수',      desc: '1:1 수작업 검수, 불량 0% 목표' },
  { svg: ICEBERG_SVG.pack,     num: '07', title: '개별 포장 · 패키징',  desc: '감성 포장, 답례품 맞춤 구성' },
  { svg: ICEBERG_SVG.delivery, num: '08', title: '안전 배송',           desc: '에어캡+박스 이중포장, 추적 가능' },
  { svg: ICEBERG_SVG.after,    num: '09', title: 'A/S · 재주문 관리',   desc: '납품 후에도 책임지는 사후관리' },
];

/* SVG icons for brand items */
const BRAND_SVG = {
  dtf: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-lt)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-2-3.92-2-6.5 0 2.58.93 4.36 2 6.5.5 1 1 1.62 1 3a2.5 2.5 0 0 1-2.5 2.5z"/><path d="M12.5 14.5A2.5 2.5 0 0 0 15 12c0-1.38-.5-2-1-3-1.07-2.14-2-3.92-2-6.5 0 2.58.93 4.36 2 6.5.5 1 1 1.62 1 3a2.5 2.5 0 0 1-2.5 2.5z"/><path d="M6 22v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/><path d="M6 18H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2"/></svg>',
  laser: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-lt)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  premium: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-lt)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9z"/><path d="M11 3l1 6"/><path d="M2 9h20"/><path d="M7 9l5 13 5-13"/></svg>',
};

const BRAND_ITEMS = [
  {
    svgIcon: BRAND_SVG.dtf,
    title: 'DTF 스티커',
    desc: '의류·모자·가방에 열전사 —\n풀컬러 소량 가능,\n내구성 우수.',
  },
  {
    svgIcon: BRAND_SVG.laser,
    title: '레이저 각인',
    desc: '금속·나무·가죽 정밀 각인 —\n반영구적 마감으로\n고급스러움.',
  },
  {
    svgIcon: BRAND_SVG.premium,
    title: '프리미엄 답례품',
    desc: '돌잔치·결혼·회갑 —\n개별 포장 & 감성 디자인\n맞춤 제작.',
  },
];

/* SVG icons for process steps */
const PROCESS_SVG = {
  order: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
  design: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>',
  factory: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20"/><path d="M5 20V8l5 4V8l5 4V4h3a2 2 0 0 1 2 2v14"/><path d="M8 16h.01"/><path d="M12 16h.01"/><path d="M16 16h.01"/></svg>',
  check: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  delivery: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
};

const PROCESS_STEPS = [
  { step: 1, svgIcon: PROCESS_SVG.order, title: '주문 접수', desc: '카카오톡·전화·폼으로\n원하시는 제품과 수량을\n알려주세요.' },
  { step: 2, svgIcon: PROCESS_SVG.design, title: '시안 확인', desc: '24시간 내 디자인 시안을\n보내드립니다.\n수정 무제한.' },
  { step: 3, svgIcon: PROCESS_SVG.factory, title: '제작 진행', desc: '시안 확정 후 3~7일 내\n자체 공장에서\n제작합니다.' },
  { step: 4, svgIcon: PROCESS_SVG.check, title: '품질 검수', desc: '1:1 수작업 검수로\n완벽한 품질을\n보장합니다.' },
  { step: 5, svgIcon: PROCESS_SVG.delivery, title: '안전 배송', desc: '개별 포장 후\n안전하게 배송해\n드립니다.' },
];

const PORTFOLIO_ITEMS = [
  { id: 1, category: 'engrave', img: 'img/portfolio/portfolio_01.webp', title: '대기업 A사 텀블러 각인', desc: '스텐 텀블러 500ml 레이저 각인 2,000개' },
  { id: 2, category: 'sticker', img: 'img/portfolio/portfolio_02.webp', title: '통신사 B사 DTF 스티커', desc: '유니폼 열전사 스티커 500장' },
  { id: 3, category: 'gift', img: 'img/portfolio/portfolio_03.webp', title: '건설사 C사 답례품 세트', desc: '텀블러+볼펜+에코백 세트 1,000개' },
  { id: 4, category: 'engrave', img: 'img/portfolio/portfolio_04.webp', title: 'IT기업 D사 볼펜 로고 인쇄', desc: '제트스트림 볼펜 UV 인쇄 3,000개' },
  { id: 5, category: 'sticker', img: 'img/portfolio/portfolio_05.webp', title: '스포츠브랜드 E사 DTF 전사', desc: '모자 열전사 스티커 2,000장' },
  { id: 6, category: 'gift', img: 'img/portfolio/portfolio_06.webp', title: '돌잔치 답례품 패키지', desc: '미니 디퓨저+타올 세트 300개' },
  { id: 7, category: 'engrave', img: 'img/portfolio/portfolio_07.webp', title: '에너지기업 F사 USB 각인', desc: '메탈 USB 32GB 레이저 각인 1,500개' },
  { id: 8, category: 'sticker', img: 'img/portfolio/portfolio_08.webp', title: '프랜차이즈 G사 라벨', desc: 'PVC 스티커 풀컬러 인쇄 10,000장' },
];

const PORTFOLIO_FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'engrave', label: '각인' },
  { key: 'sticker', label: '스티커' },
  { key: 'gift', label: '답례품' },
];

/* X(트위터) 스타일 리뷰 */
const REVIEWS = [
  {
    id: 1,
    name: '김*영 님',
    handle: 'IT기업 홍보팀',
    avatarColor: '#1565C0',
    verified: true,
    time: '3일 전',
    text: '시안부터 배송까지 3일 만에 완료! 사내 행사용 텀블러 500개 주문했는데 퀄리티도 기대 이상이었어요. 다음 행사도 무조건 알린다몰입니다',
    likes: 128, comments: 14, retweets: 32,
    img: 'review_01.jpg',
  },
  {
    id: 2,
    name: '박*수 님',
    handle: '웨딩플래너',
    avatarColor: '#E91E63',
    verified: true,
    time: '1주 전',
    text: '결혼식 답례품 텀블러 각인, 하객분들 반응이 최고였어요. UV 풀컬러 감성 디자인에 포장까지 너무 예뻤습니다! 재주문 확정',
    likes: 214, comments: 27, retweets: 58,
    img: 'review_02.jpg',
  },
  {
    id: 3,
    name: '이*진 님',
    handle: '스타트업 대표',
    avatarColor: '#FF5722',
    verified: false,
    time: '2주 전',
    text: '50개 소량인데도 대량 주문처럼 친절하게 상담해주셨어요. 각인 퀄리티 정말 좋고 납기도 정확했습니다. 소량 제작 고민하시는 분들 강추!',
    likes: 87, comments: 9, retweets: 21,
    img: 'review_03.jpg',
  },
  {
    id: 4,
    name: '최*미 님',
    handle: '대학 총학생회',
    avatarColor: '#009688',
    verified: false,
    time: '3주 전',
    text: '예산이 빠듯했는데 딱 맞는 에코백 원단이랑 인쇄 방식 추천해주셔서 300개 잘 제작했어요. 디자인 수정도 빠르고 가격도 합리적!',
    likes: 63, comments: 5, retweets: 12,
    img: 'review_04.jpg',
  },
  {
    id: 5,
    name: '정*호 님',
    handle: '제약회사 마케팅',
    avatarColor: '#7B1FA2',
    verified: true,
    time: '1달 전',
    text: '학술대회 볼펜 3,000개 대량 주문, 납기 하나도 안 밀리고 정확하게 왔어요. 인쇄 품질도 깔끔해서 내부 평가 최고 받았습니다.',
    likes: 156, comments: 18, retweets: 44,
    img: 'review_05.jpg',
  },
  {
    id: 6,
    name: '한*은 님',
    handle: '돌잔치 준비맘',
    avatarColor: '#F57C00',
    verified: false,
    time: '1달 전',
    text: '아기 돌잔치 답례품으로 미니 디퓨저+타올 세트 했는데 너무 예쁘게 만들어주셔서 감동이었어요. 손님들이 다들 어디서 했냐고 물어봤어요',
    likes: 302, comments: 41, retweets: 89,
    img: 'review_06.jpg',
  },
];

const FAQ_ITEMS = [
  {
    q: '최소 주문 수량은 얼마인가요?',
    a: '제품에 따라 다르지만, 대부분 50개부터 주문 가능합니다. 소량 주문도 상담해 주세요!',
  },
  {
    q: '제작 기간은 얼마나 걸리나요?',
    a: '시안 확정 후 보통 3~7일(영업일 기준)입니다. 긴급 제작도 가능하니 별도 문의해 주세요.',
  },
  {
    q: '시안은 어떻게 확인하나요?',
    a: '주문 접수 후 24시간 이내에 카카오톡 또는 이메일로 디자인 시안을 보내드립니다. 수정은 횟수 제한 없이 가능합니다.',
  },
  {
    q: '로고 파일은 어떤 형식으로 보내야 하나요?',
    a: 'AI, PDF, PNG(고해상도) 파일을 권장합니다. 파일이 없으시면 이미지 기반으로 시안 작업도 가능합니다.',
  },
  {
    q: '샘플 제작이 가능한가요?',
    a: '네, 유료 샘플 제작이 가능합니다. 대량 주문 확정 시 샘플 비용을 환불해 드립니다.',
  },
  {
    q: '세금계산서 발행이 되나요?',
    a: '네, 사업자 등록증 확인 후 전자세금계산서를 발행해 드립니다.',
  },
];

/* SVG icons for guide cards */
const GUIDE_SVG = {
  file: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>',
  box: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  clock: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
};

const GUIDE_CARDS = [
  {
    svgIcon: GUIDE_SVG.file,
    title: '파일 가이드',
    desc: 'AI, PDF, PNG 고해상도 파일 권장.\n로고가 없어도 시안 작업 가능합니다.',
  },
  {
    svgIcon: GUIDE_SVG.box,
    title: '최소 수량',
    desc: '대부분 50개부터 주문 가능.\n소량·대량 모두 친절히 상담해 드립니다.',
  },
  {
    svgIcon: GUIDE_SVG.clock,
    title: '제작 기간',
    desc: '시안 확정 후 3~7일.\n긴급 제작 가능 (별도 문의).',
  },
];

/* 플로팅바 상품 카테고리 */
const FLOAT_CATEGORIES = [
  { key: 'tumbler', label: '텀블러', svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M6 8h11v9a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="17" y2="1"/><line x1="6" y1="4" x2="17" y2="4"/></svg>' },
  { key: 'pen', label: '볼펜', svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>' },
  { key: 'fan', label: '선풍기', svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 12c-2-2.67-6-7-6-10a6 6 0 0 1 12 0c0 3-4 7.33-6 10z"/><circle cx="12" cy="12" r="2"/><path d="M12 12c2 2.67 6 7 6 10a6 6 0 0 1-12 0c0-3 4-7.33 6-10z"/></svg>' },
  { key: 'usb', label: 'USB', svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="4" cy="20" r="2"/><circle cx="16" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M12 2v10l4-2"/><path d="M12 12l-8 6"/><path d="M12 12l8 2"/></svg>' },
  { key: 'ecobag', label: '에코백', svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' },
  { key: 'gift', label: '답례품', svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>' },
  { key: 'sticker', label: '스티커', svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>' },
  { key: 'etc', label: '기타', svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>' },
];
