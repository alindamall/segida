# 알린다몰 HTML5 구조 설명서

## 파일 구조

```
alindamall/
├── index.html              단일 랜딩페이지
├── css/style.css           전역 스타일 (디자인 토큰 + 컴포넌트 + 반응형)
├── js/data.js              콘텐츠 데이터 (텍스트·제품·리뷰 전부 JS 객체)
├── js/ui.js                인터랙션 (슬라이더·스크롤·폼·필터·라이트박스)
├── asset/pdf/              회사소개서 PDF
└── img/
    ├── hero/               히어로 슬라이드 3장 (1920×900)
    ├── logo/               로고 4종 + 파비콘
    ├── og/                 SNS 공유 이미지 (1200×630)
    ├── product/            제품 카드 이미지 6장 (640×480)
    └── portfolio/          포트폴리오 이미지 8장 (640×480)
```

---

## `<head>` 구성

| 태그 | 역할 |
|------|------|
| `<meta charset>` `<meta viewport>` | 기본 인코딩 + 모바일 뷰포트 |
| `<title>` `<meta description>` | SEO — 타겟 키워드 포함 |
| `<meta property="og:*">` | SNS 공유 미리보기 (카톡·페이스북 등) |
| `<link rel="canonical">` | 정규 URL (alinda.ai) |
| `<link rel="preload">` + `<link rel="stylesheet">` | Pretendard 폰트 CDN 프리로드 |
| `<style>` (인라인) | Critical CSS — 헤더+히어로 초기 렌더링용 |
| `<link rel="stylesheet" href="css/style.css">` | 메인 스타일시트 |
| `<script type="application/ld+json">` × 2 | Schema.org — LocalBusiness + FAQPage |

---

## `<body>` 섹션 순서

### 1. `<header id="header">` — 스티키 네비게이션

```
header.header
└── div.header-inner
    ├── a.logo                  ← 텍스트 로고 "알린다몰"
    ├── nav.nav                 ← 데스크톱 앵커 링크 7개
    ├── a.header-phone          ← 전화번호 (SVG 아이콘 + 텍스트)
    └── button.hamburger        ← 모바일 햄버거 (span × 3)
```
- 스크롤 60px 이상 → `.scrolled` 클래스 추가 (blur 배경)
- 모바일(768px↓): nav·phone 숨김, hamburger 표시

### 2. `<div id="mobileNav">` — 모바일 전체화면 메뉴

```
div.mobile-nav
├── a.nav-link × 7             ← 앵커 링크
└── a.btn.btn--primary          ← 전화 상담 버튼
```
- 햄버거 클릭 시 `.open` 토글

### 3. `<section id="hero">` — 히어로 슬라이더

```
section.hero
├── div#heroSlides              ← JS가 hero-slide div 3개 생성
├── div.hero-overlay            ← 그라디언트 오버레이
├── div.hero-content
│   ├── h1.hero-title           ← JS가 data.js 텍스트 주입
│   ├── p.hero-subtitle
│   └── div.hero-cta            ← CTA 버튼 2개 (JS 생성)
├── div.hero-dots               ← 인디케이터 도트 (JS 생성)
└── div.hero-scroll-hint        ← "스크롤" + 화살표 SVG
```
- 5초 자동전환, 크로스페이드, Ken Burns 효과
- data.js의 `HERO_SLIDES` 배열에서 콘텐츠 로드

### 4. `<section id="services">` — 핵심 제품 서비스

```
div.services-bg                 ← 배경색 래퍼
└── section.section#services
    ├── div.text-center.fade-up ← 섹션 헤더 (label + h2 + p)
    └── div.card-grid#servicesGrid  ← JS가 카드 6개 생성
```
- 각 카드: `a.card.service-card` → 스마트스토어 링크
- 카드 내부: `.card-img-wrap` + `.card-body` (h3 + p)
- data.js의 `SERVICES` 배열

### 5. `<section id="brand">` — '새기다' 브랜드

```
section.brand-section.section-full  ← 다크 배경 (--bg-dark)
└── div.section
    ├── div.text-center.fade-up     ← 섹션 헤더 (흰색 텍스트)
    └── div.brand-grid#brandGrid    ← JS가 카드 3개 생성
```
- 각 카드: `div.brand-card` (반투명 배경 + 아이콘 + 제목 + 설명)
- data.js의 `BRAND_ITEMS` 배열

### 6. `<section id="process">` — 주문 프로세스

```
div.process-bg                  ← 흰색 배경 래퍼
└── section.section#process
    ├── div.text-center.fade-up ← 섹션 헤더
    └── div.timeline#timeline   ← JS가 5단계 생성
```
- 각 단계: `div.timeline-step` (번호 + SVG 아이콘 + 제목 + 설명)
- 데스크톱: 수평 타임라인 / 모바일(768px↓): 수직 전환
- data.js의 `PROCESS_STEPS` + `PROCESS_SVG`

### 7. `<section id="portfolio">` — 포트폴리오

```
div.portfolio-bg
└── section.section#portfolio
    ├── div.text-center.fade-up     ← 섹션 헤더
    ├── div.filter-bar#filterBar    ← JS가 필터 버튼 4개 생성 (전체/각인/스티커/답례품)
    └── div.portfolio-grid#portfolioGrid  ← JS가 아이템 생성
```
- 각 아이템: `div.portfolio-item` (이미지 + hover 오버레이)
- 클릭 시 라이트박스 오픈
- data.js의 `PORTFOLIO_ITEMS` + `PORTFOLIO_FILTERS`

### 8. `<div id="lightbox">` — 라이트박스 (포트폴리오용)

```
div.lightbox [role="dialog"]
├── button.lightbox-close       ← X 버튼 (SVG)
├── img#lightboxImg
└── div.lightbox-info
    ├── p#lightboxTitle
    └── p#lightboxDesc
```
- ESC키 또는 배경 클릭으로 닫기

### 9. `<section id="reviews">` — 고객 리뷰 (대화형 말풍선)

```
div.reviews-bg
└── section.section#reviews
    ├── div.text-center.fade-up     ← 섹션 헤더
    └── div.chat-list#chatList      ← JS가 채팅 카드 6개 생성
```
- 각 카드 구조:
  ```
  div.chat-card
  ├── div.chat-card-header      ← 작성자명 + 회사 + 별점
  └── div.chat-messages
      ├── div.chat-bubble--customer  ← 고객 말풍선 (왼쪽)
      ├── div.chat-bubble--alinda    ← 알린다 답변 (오른쪽)
      └── div.chat-bubble--customer  ← 후기 (왼쪽)
  ```
- 스크롤 진입 시 말풍선 순차 애니메이션 (delay 0→0.2→0.4초)
- data.js의 `REVIEWS` 배열

### 10. `<section id="guide">` — 가이드 & FAQ

```
div.guide-bg
└── section.section#guide
    ├── div.text-center.fade-up     ← 섹션 헤더
    ├── div.guide-grid#guideGrid    ← JS가 카드 3개 생성
    └── div.accordion#faqAccordion  ← JS가 아코디언 6개 생성
```
- 가이드 카드: SVG 아이콘 + 제목 + 설명
- 아코디언: 클릭 시 하나만 열림 (나머지 자동 닫힘)
- data.js의 `GUIDE_CARDS` + `FAQ_ITEMS`

### 11. `<section id="contact">` — 견적 문의 CTA

```
section.contact-section.section-full  ← 그라디언트 배경 (accent → primary)
└── div.section
    └── div.contact-grid              ← 2컬럼 (모바일: 1컬럼)
        ├── div.fade-up               ← 좌측: 안내 텍스트 + 연락처 + PDF 다운로드
        └── div.fade-up               ← 우측: 문의 폼
```
- 폼 필드: 이름(필수) / 연락처(필수) / 이메일(선택) / 문의내용(필수)
- PDF: `asset/pdf/Proposal_alindamall.pdf` 다운로드 연결

### 12. `<footer id="footer">` — 푸터

```
footer.footer
├── div.footer-inner            ← 3컬럼 그리드
│   ├── div                     ← 로고 + 설명 + SNS 아이콘 4개
│   ├── div                     ← 바로가기 앵커 링크 5개
│   └── div                     ← 외부 링크 3개 (스마트스토어/플레이스/카카오)
└── div.footer-bottom           ← 사업자 정보 + 저작권
```

### 13. 플로팅 요소 (항상 노출)

```
div.floating-bar#floatingBar    ← 하단 고정 바
├── div.float-categories        ← 상품 카테고리 탭 8개 (JS 생성)
└── div.float-form-row          ← 선택된 카테고리 + 이름 + 연락처 + 빠른문의 버튼

a.kakao-float#kakaoFloat        ← 우측 카카오톡 버튼 (데스크톱 전용)
├── svg (카카오 아이콘)
└── span.kakao-tooltip           ← hover 시 "카카오톡 상담" 툴팁
```
- 히어로 아래로 스크롤 시 플로팅바 올라옴 (`.visible`)
- 모바일(768px↓): 카카오 버튼 숨김

---

## JS 동작 방식 (ui.js)

| 기능 | 방식 |
|------|------|
| DOM 생성 | `el()` 헬퍼로 data.js 데이터 → HTML 동적 생성 |
| 스크롤 애니메이션 | 단일 `IntersectionObserver`가 `.fade-up` 전체 감시 → `.visible` 추가 |
| 말풍선 애니메이션 | 별도 `bubbleObserver`가 `.chat-bubble` 감시 (threshold 0.3) |
| 히어로 슬라이더 | `setInterval` 5초 + 도트 클릭 수동 전환 |
| 포트폴리오 필터 | 버튼 클릭 → `renderPortfolio()` 재렌더 + 옵저버 재등록 |
| 아코디언 | `max-height` 토글 (한 번에 하나만 열림) |
| 헤더 | scroll 이벤트 → `.scrolled` 토글 + 현재 섹션 `.active` 표시 |
| 모바일 메뉴 | 햄버거 클릭 → `.open` 토글 + body overflow 제어 |

---

## CSS 공통 클래스 (style.css)

| 클래스 | 용도 |
|--------|------|
| `.section` | 패딩 + max-width 1200px 센터 래퍼 |
| `.section-full` | 풀폭 섹션 (brand, contact) |
| `.card` `.card-grid` | 카드 UI + 반응형 그리드 |
| `.btn` `.btn--primary` `.btn--outline` `.btn--white` | 버튼 변형 |
| `.fade-up` → `.fade-up.visible` | 스크롤 진입 애니메이션 |
| `.text-center` `.text-white` `.heading-*` | 타이포그래피 유틸리티 |

---

## 반응형 브레이크포인트

| 너비 | 변화 |
|------|------|
| **1024px↓** | 카드 그리드 축소, contact 1컬럼, 푸터 2컬럼 |
| **768px↓** | 햄버거 메뉴 전환, 타임라인 수직, 카카오 버튼 숨김 |
| **480px↓** | 카드 1컬럼, 포트폴리오 2컬럼 |
