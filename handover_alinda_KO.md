# 알린다몰 프로젝트 인수인계서

> 최종 업데이트: 2026-03-23

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | 알린다몰 (alinda.ai) |
| 유형 | 싱글페이지 랜딩 웹사이트 (정적) |
| 기술 스택 | HTML5 + CSS3 + Vanilla JS (프레임워크 없음) |
| 도메인 | alinda.ai |
| 사업자 | 주식회사 알린다 / 이준호 / 484-87-00820 |
| 연락처 | 02-465-0817 / alindamall@naver.com |
| 주소 | 경기 하남시 미사강변서로 25 6층 635호 |

---

## 2. 디렉토리 구조

```
alindamall/
├── index.html              ← 메인 (유일한 HTML)
├── css/
│   └── style.css           ← 전역 스타일시트 (~950줄)
├── js/
│   ├── data.js             ← 콘텐츠 데이터 (텍스트, SVG 아이콘, 리뷰 등)
│   └── ui.js               ← 인터랙션 (슬라이더, 폼, 스크롤, 플로팅 등)
├── img/
│   ├── hero/               ← 메인 배너 3장 (1920×900)
│   ├── logo/               ← 로고 5종
│   ├── og/                 ← OG 이미지 1장 (1200×630)
│   ├── portfolio/          ← 포트폴리오 8장 (640×480)
│   └── product/            ← 제품 카드 6장 (640×480)
├── asset/
│   └── pdf/                ← 회사소개서 PDF (로컬 백업)
├── node_modules/           ← serve 패키지 (로컬 개발용)
├── package.json
├── .claude/
│   └── launch.json         ← 개발 서버 설정
├── structure.md            ← HTML5 태그 구조 문서
├── handover_designer_KO.md ← 디자이너 이미지 작업 요청서
└── handover_alinda_KO.md   ← 이 파일
```

---

## 3. 페이지 섹션 구성 (위→아래 순서)

| # | 섹션 | HTML id | 설명 |
|---|------|---------|------|
| 1 | 헤더 | `header` | 고정 상단 네비게이션, 스크롤 전 투명+흰색 → 스크롤 후 흰 배경+어두운 텍스트 |
| 2 | 히어로 | `hero` | 3장 자동 슬라이드, Ken Burns 효과, 터치 스와이프 지원 |
| 3 | 서비스 | `services` | 6개 제품 카드 그리드 (텀블러, 볼펜, 선풍기, USB, 에코백, 선물세트) |
| 4 | What We Do | `iceberg` | 9개 카드 그리드 (어두운 배경), 제작 프로세스 상세 |
| 5 | 커스텀 (브랜드) | `brand` | 3개 카드 (DTF 스티커, 레이저 각인, 프리미엄 답례품) |
| 6 | 포트폴리오 | `portfolio` | 8개 항목, 필터 (전체/각인/스티커/답례품), 라이트박스 |
| 7 | 제작리뷰 | `reviews` | 6개 대화형 말풍선 채팅 카드, 모바일 3개만 표시 |
| 8 | 제작과정 | `process` | 5단계 타임라인 (주문→시안→제작→검수→배송) |
| 9 | 제작가이드 & FAQ | `guide` | 3개 가이드 카드 + 6개 아코디언 FAQ |
| 10 | 문의 | `contact` | 좌: 연락처+PDF 다운로드 / 우: 문의 폼 (이름, 연락처, 이메일, 내용) |
| 11 | 푸터 | `footer` | 바로가기, 외부 링크, SNS, 사업자 정보 |

### 네비게이션 메뉴 (데스크톱 & 모바일 동일)

서비스 → 커스텀 → 포트폴리오 → 제작리뷰 → 제작과정 → 제작가이드 → 문의

---

## 4. 핵심 기능

### 4-1. 히어로 슬라이더
- 3장 자동 순환 (5초 간격)
- Ken Burns 확대 애니메이션
- 닷 인디케이터 + 모바일 터치 스와이프
- 어두운 오버레이 (rgba(0,0,0)) + 텍스트 오버레이

### 4-2. 헤더 스크롤 변환
- 스크롤 0~60px: 투명 배경, 로고/메뉴/전화번호 **흰색**
- 스크롤 60px+: `.scrolled` 클래스, 흰 배경 blur, 어두운 텍스트

### 4-3. 플로팅 요소 (3개)
- **하단 플로팅바**: 상품 카테고리 탭 + 빠른문의 폼 (이름/연락처/전달사항)
- **네이버 스마트스토어 버튼** (PC만): 초록 원형, 우측 하단
- **카카오톡 상담 버튼** (PC+모바일): 노란 원형, 우측 하단

### 4-4. 프로모션 팝업
- 첫 방문 시 모달 팝업
- "오늘 하루 보지 않기" → localStorage 저장
- segida.netlify.app OG 이미지 사용

### 4-5. 문의 폼 (Google Sheets 연동 대비)
- `ui.js` 내 `GOOGLE_APPS_SCRIPT_URL` 상수에 Apps Script URL 삽입하면 자동 연동
- 플로팅바 빠른문의 / 하단 문의폼 모두 `submitInquiry()` 공통 함수 사용
- payload에 `source` 필드 (`'float'` / `'contact'`)로 유입 경로 구분

### 4-6. 스크롤 애니메이션
- `.fade-up` 클래스 → IntersectionObserver가 `.visible` 추가
- `.chat-bubble` 말풍선은 별도 옵저버 (순차 딜레이)

### 4-7. SEO
- Schema.org JSON-LD (LocalBusiness + FAQPage)
- OG 태그 (segida.netlify.app 이미지)
- Canonical URL: alinda.ai
- Critical CSS 인라인

---

## 5. 파일별 역할

### `index.html` (368줄)
- 전체 HTML 구조 (섹션 10개 + 팝업 + 플로팅)
- `<head>`: 메타, OG, favicon, Pretendard 폰트 CDN, critical CSS, JSON-LD
- `<body>`: 섹션 순서대로 + 팝업 모달 + 플로팅 3종
- 스크립트: `data.js` → `ui.js` (defer)

### `css/style.css` (~950줄)
- CSS 커스텀 프로퍼티 (`:root` 디자인 토큰)
- 모든 오버레이 색상: `rgba(0,0,0,...)` (검정 계열, 파란 끼 없음)
- 브랜드 UI 색상: `--accent: #1565C0`, `--accent-lt: #2196F3`
- 반응형 breakpoint: 1024px / 768px / 480px
- 모바일: 햄버거 메뉴, 리뷰 3개 제한, 네이버 플로팅 숨김, 전달사항 input 숨김

### `js/data.js` (~344줄)
- `SITE`: 사업자 정보
- `HERO_SLIDES`: 슬라이드 3장 (이미지, 텍스트, CTA)
- `SERVICE_SVG` + `SERVICES`: 서비스 카드 6개
- `ICEBERG_SVG` + `ICEBERG_ITEMS`: What We Do 카드 9개
- `BRAND_SVG` + `BRAND_ITEMS`: 브랜드 카드 3개
- `PROCESS_SVG` + `PROCESS_STEPS`: 타임라인 5단계
- `PORTFOLIO_ITEMS` + `PORTFOLIO_FILTERS`: 포트폴리오 8개 + 필터 4개
- `REVIEWS`: 대화형 리뷰 6개
- `FAQ_ITEMS`: FAQ 6개
- `GUIDE_SVG` + `GUIDE_CARDS`: 가이드 카드 3개
- `FLOAT_CATEGORIES`: 플로팅바 카테고리 8개

### `js/ui.js` (~555줄)
- IIFE 패턴으로 전역 오염 방지
- `el()` 헬퍼: DOM 엘리먼트 생성
- init 함수 12개: Hero → HeroSwipe → Services → Iceberg → Brand → Process → Portfolio → Reviews → Guide → Header → Floating → ContactForm → Observer → Bubbles → Promo

---

## 6. 디자인 토큰 (CSS 변수)

```css
:root {
  --primary:    #0D2B5E;   /* 딥 네이비 — 헤더, 본문 텍스트 */
  --accent:     #1565C0;   /* 브랜드 블루 — 버튼, 강조 */
  --accent-lt:  #2196F3;   /* 라이트 블루 — 호버, 링크 */
  --surface:    #FFFFFF;   /* 카드/섹션 배경 */
  --bg:         #F4F7FB;   /* 페이지 배경 — 쿨톤 오프화이트 */
  --bg-dark:    #0A1F44;   /* 다크 섹션 (브랜드) */
  --border:     #D0DEF0;   /* 테두리 */
  --text:       #0D2B5E;   /* 본문 텍스트 */
  --text-muted: #5A7BA8;   /* 보조 텍스트 */
  --gold:       #C9A84C;   /* 별점, 포인트 */
  --radius:     12px;
  --shadow:     0 4px 24px rgba(0,0,0,.10);
  --transition: .3s cubic-bezier(.4,0,.2,1);
  --header-h:   72px;
  --max-w:      1200px;
  --floating-h: 56px;
}
```

**오버레이 규칙:** 모든 오버레이/그림자는 `rgba(0,0,0,...)` 사용. 파란 끼 없음.

---

## 7. 외부 의존성

| 리소스 | 용도 | 방식 |
|--------|------|------|
| Pretendard Variable | 웹 폰트 | CDN (jsDelivr) |
| serve (npm) | 로컬 개발 서버 | node_modules 로컬 설치 |
| segida.netlify.app | OG 이미지, 팝업 이미지 | 외부 URL |
| GitHub raw (alindamall/shop-images) | 브로슈어 PDF 다운로드 | 외부 URL |

### 외부 서비스 연결 링크

| 서비스 | URL |
|--------|-----|
| 카카오톡 채널 | pf.kakao.com/_YBFEX |
| 네이버 스마트스토어 | smartstore.naver.com/alindamall |
| 네이버 플레이스 | naver.me/x5m0ABfi |
| 네이버 블로그 | blog.naver.com/alindamall |
| 인스타그램 | instagram.com/alindamall |
| 유튜브 | youtube.com/@alindamall |

---

## 8. 이미지 에셋 현황

**총 23개 플레이스홀더 파일 생성 완료** — 디자이너에게 `handover_designer_KO.md` 전달 후 이미지 대기 중

| 경로 | 파일 수 | 사이즈 | 상태 |
|------|---------|--------|------|
| `img/logo/` | 5 | 다양 | 빈 파일 |
| `img/hero/` | 3 | 1920×900 | 빈 파일 |
| `img/product/` | 6 | 640×480 | 빈 파일 |
| `img/portfolio/` | 8 | 640×480 | 빈 파일 |
| `img/og/` | 1 | 1200×630 | 빈 파일 |

이미지가 준비되면 해당 경로에 **같은 파일명으로 덮어쓰기**만 하면 됩니다. 코드 수정 불필요.

---

## 9. 로컬 개발 환경

### 요구사항
- Node.js 설치

### 실행 방법
```bash
cd alindamall
npx serve -l 8080
```
→ `http://localhost:8080` 에서 확인

### `.claude/launch.json` 설정
```json
{
  "version": "0.0.1",
  "configurations": [{
    "name": "알린다몰 로컬 서버",
    "runtimeExecutable": "C:/Program Files/nodejs/node.exe",
    "runtimeArgs": ["node_modules/serve/build/main.js", "-l", "8080"],
    "port": 8080
  }]
}
```

---

## 10. 콘텐츠 수정 가이드

### 텍스트 수정
`js/data.js`에서 해당 객체 수정 → 자동 반영 (HTML 수정 불필요)

| 수정 대상 | data.js 위치 |
|-----------|-------------|
| 사업자 정보 | `SITE` 객체 |
| 히어로 배너 문구 | `HERO_SLIDES` 배열 |
| 서비스 카드 | `SERVICES` 배열 |
| What We Do 카드 | `ICEBERG_ITEMS` 배열 |
| 브랜드 카드 | `BRAND_ITEMS` 배열 |
| 제작과정 | `PROCESS_STEPS` 배열 |
| 포트폴리오 | `PORTFOLIO_ITEMS` 배열 |
| 리뷰 | `REVIEWS` 배열 |
| FAQ | `FAQ_ITEMS` 배열 |
| 가이드 | `GUIDE_CARDS` 배열 |

### 아이콘 수정
- 모든 아이콘은 인라인 SVG (`SERVICE_SVG`, `BRAND_SVG`, `PROCESS_SVG`, `ICEBERG_SVG`, `GUIDE_SVG`)
- 이모지 없음 — 전부 SVG로 교체 완료

### 색상 변경
- `css/style.css` 상단 `:root` 디자인 토큰 수정
- 오버레이: `rgba(0,0,0,...)` — 파란 끼 없음

---

## 11. 반응형 브레이크포인트

| 뷰포트 | 주요 변경 |
|---------|-----------|
| 1024px↓ | 카드 그리드 축소, 문의 1열, 푸터 2열 |
| 768px↓ | 햄버거 메뉴, 히어로 축소, 타임라인 세로 중앙정렬, 리뷰 3개만, 네이버 플로팅 숨김, 플로팅바 전달사항 숨김 |
| 480px↓ | 카드 1열, 포트폴리오 2열, What We Do 1열 |

---

## 12. 배포 미완료 작업

### 우선순위 높음
| 작업 | 설명 | 필요한 것 |
|------|------|-----------|
| Google Sheets 연동 | 문의 폼 → 시트 자동 저장 + Gmail 알림 | Apps Script 배포 URL → `ui.js`의 `GOOGLE_APPS_SCRIPT_URL`에 삽입 |
| 이미지 에셋 교체 | 23개 플레이스홀더 → 실제 이미지 | 디자이너 작업물 |
| 도메인 배포 | alinda.ai에 호스팅 | Netlify/Vercel 등 |

### 우선순위 중간
| 작업 | 설명 | 필요한 것 |
|------|------|-----------|
| GA4 + GTM | Google Analytics 트래킹 | GA4 Measurement ID |
| Meta Pixel | Facebook/Instagram 광고 트래킹 | Pixel ID |
| sitemap.xml + robots.txt | 검색 엔진 크롤링 | 도메인 확정 후 생성 |
| 네이버 서치어드바이저 | 네이버 검색 등록 | meta 인증 태그 |

### 우선순위 낮음
| 작업 | 설명 |
|------|------|
| Lighthouse 최적화 | 이미지 교체 후 성능 점수 튜닝 |
| GTM 이벤트 태깅 | CTA 클릭, 폼 제출 등 데이터 수집 |
| 폼 스팸 방지 | reCAPTCHA 또는 허니팟 필드 |

---

## 13. 참고 문서

| 파일 | 설명 |
|------|------|
| `structure.md` | HTML5 태그 구조 일목요연 요약 |
| `handover_designer_KO.md` | 디자이너 이미지 작업 요청서 (23장, 사이즈, 파일명) |
| `asset/pdf/Proposal_alindamall.pdf` | 회사소개서 (로컬 백업) |
