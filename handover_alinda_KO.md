# 알린자 홈페이지 — 인수인계 브리핑 (한국어)

**모델:** claude-opus-4-6 | **작업:** 단일 랜딩페이지 (HTML/CSS/JS)
**호스팅:** Cafe24 → WordPress (HTML 먼저 제작)

---

## 작업 제약사항 (우선순위 순)
1. **폰트:** Pretendard Variable CDN만 사용 — `https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css` (로컬 OTF 파일 사용 안 함)
2. **토큰 절약:** CSS 클래스 / JS 함수를 전 섹션 공유. 섹션별 중복 코드 금지.
3. **로딩 최적화 최우선:** Critical CSS는 `<head>` 인라인. 히어로 이미지만 `fetchpriority="high"`, 나머지는 `loading="lazy"`. 폰트 `preload` 링크 태그 필수.
4. **코드 구조:** `.card`, `.section`, `.btn` 등 공통 패턴 한 번 정의 후 전체 재사용. IntersectionObserver 단일 인스턴스로 모든 스크롤 애니메이션 처리.

---

## 파일 구조
```
alindamall/
├── index.html       ← 단일 파일, 시맨틱 HTML5
├── css/style.css    ← 전역 스타일 + 애니메이션 (섹션별 파일 분리 금지)
├── js/data.js       ← 전체 텍스트/제품/리뷰 콘텐츠 (JS 객체로 관리)
├── js/ui.js         ← 전체 인터랙션 (슬라이더, 스크롤, 폼, 플로팅)
└── img/             ← hero_01~03.webp, product_*.webp, brochure.pdf
```

---

## 페이지 섹션 구성 (위 → 아래)

| ID | 섹션 | 핵심 사항 |
|----|------|-----------|
| `#header` | 스티키 네비게이션 | 로고 + 앵커 링크 + CTA 버튼. 스크롤 시 `backdrop-filter:blur` + 배경 투명도 변화. 모바일: 햄버거 메뉴. **소메뉴 없음.** |
| `#hero` | 전체화면 슬라이더 | 이미지 3장, 5초 자동 전환, 크로스페이드. 텍스트 오버레이 + CTA 버튼 2개. 활성 슬라이드에 Ken Burns 효과. |
| `#services` | 핵심 제품 서비스 | 카드 그리드: 텀블러/볼펜/선풍기 등. 호버 시 이미지 줌. → 스마트스토어 CTA |
| `#brand` | '새기다' 브랜드 | 다크 배경 섹션. DTF스티커/레이저각인/프리미엄답례품. 스크롤 진입 시 reveal 애니메이션. |
| `#process` | 주문 프로세스 | 수평 타임라인 (모바일: 수직 전환). 단계: 주문→시안→제작→검수→배송 |
| `#portfolio` | 포트폴리오 | 마소네리/필터 그리드. 필터 탭: 전체/각인/스티커/답례품. 클릭 시 라이트박스. |
| `#reviews` | 고객 리뷰 | 3열 자동 슬라이더. 별점+텍스트+작성자. 신뢰 지표 수치 (누적 건수, 재주문율). |
| `#guide` | 가이드 / FAQ | 정보 카드 + 아코디언 FAQ. 파일가이드/최소수량/제작기간. |
| `#contact` | CTA / 견적 문의 | 인라인 폼 (이름/연락처/문의내용). PDF 다운로드 버튼. 브랜드 컬러 풀블리드 배경. |
| `#footer` | 푸터 | 사업자정보, 지도 링크, SNS 아이콘, 저작권. |

**플로팅 / 오버레이 요소 (항상 노출):**
- 하단 고정: 이름+연락처 미니 폼 → 문의하기 CTA 바
- 우측 고정: 카카오톡 채널 말풍선 버튼 (모바일에서는 숨김)

---

## 디자인 토큰 (CSS 변수)
**테마: 블루/화이트 — 신뢰감, 깔끔함, 전문성**
```css
--primary:     #0D2B5E;   /* 딥 네이비 — 헤더, 본문 텍스트 */
--accent:      #1565C0;   /* 브랜드 블루 — 버튼, 강조 */
--accent-lt:   #2196F3;   /* 라이트 블루 — 호버, 링크 */
--surface:     #FFFFFF;   /* 카드 / 섹션 배경 */
--bg:          #F4F7FB;   /* 페이지 배경 — 쿨톤 오프화이트 */
--bg-dark:     #0A1F44;   /* 다크 섹션 (새기다 브랜드) */
--border:      #D0DEF0;   /* 블루 틴트 테두리 */
--text:        #0D2B5E;   /* 본문 텍스트 */
--text-muted:  #5A7BA8;   /* 보조 텍스트 */
--gold:        #C9A84C;   /* 포인트 전용 — 신뢰 뱃지, 별점 */
--radius:      10px;
--shadow:      0 4px 24px rgba(13,43,94,0.10);
--transition:  0.25s ease;
```
**분위기:** 화이트 스페이스 중심. 네이비로 구조 잡기. 블루 CTA. 은은한 블루 계열 그림자로 깊이감 표현. 강한 대비보다 안정감 — 흥분보다 신뢰를 전달.

---

## 공통 패턴 (한 번 정의 후 전체 재사용)

**CSS — 공통 클래스:**
```css
.section          /* 패딩, max-width 래퍼 */
.section--dark    /* 다크 배경 섹션 수정자 */
.card             /* 테두리, radius, 패딩 */
.card-grid        /* CSS Grid, auto-fill */
.btn              /* 버튼 기본형 */
.btn--primary     /* 채워진 버튼 */
.btn--outline     /* 외곽선 버튼 */
.fade-up          /* 스크롤 애니메이션 초기 상태 */
.fade-up.visible  /* IntersectionObserver 트리거 후 상태 */
```

**JS — 단일 IntersectionObserver로 모든 스크롤 애니메이션 처리:**
```js
// ui.js — 옵저버 하나로 .fade-up 전체 담당
const io = new IntersectionObserver(entries => {
  entries.forEach(e => e.isIntersecting && e.target.classList.add('visible'));
}, { threshold: 0.15 });
document.querySelectorAll('.fade-up').forEach(el => io.observe(el));
```

---

## 아웃바운드 링크 (퍼널 채널)

| 채널 | 홈페이지 내 진입점 |
|------|------------------|
| 네이버 스마트스토어 | `#services` 카드 CTA 버튼 |
| 네이버 플레이스 | 푸터 + `#contact` 지도 링크 |
| 네이버 블로그 | 푸터 SNS |
| 카카오채널 | 우측 플로팅 버튼 + `#contact` |
| 전화 | 헤더 전화번호 + 하단 플로팅 바 |
| 인스타그램 | 푸터 SNS + `#portfolio` |
| 유튜브 | `#process` 영상 임베드 + 푸터 SNS |

---

## 분석 / 추적 코드 (론칭 전 `<head>`에 삽입)
- GA4 스니펫
- GTM 컨테이너 코드
- Meta Pixel
- 네이버 서치어드바이저 사이트 인증 메타 태그

**GTM 이벤트 설정 필요:**
`click_smartstore`, `click_kakao_float`, `click_pdf_download`, `form_submit`, `click_instagram`, `youtube_play`

---

## SEO 필수 항목
- `<title>`, `<meta description>` — 타겟 키워드 포함 (각인 텀블러 제작, 기업 답례품, DTF 스티커)
- OG 태그 (og:title, og:image, og:description)
- `<link rel="canonical">`
- Schema.org: `LocalBusiness` + `FAQPage` JSON-LD → `<script type="application/ld+json">`
- 루트에 `sitemap.xml` + `robots.txt` 배치

---

## 성능 체크리스트
- [ ] 히어로 이미지: `fetchpriority="high"`, `lazy` 금지
- [ ] 나머지 이미지: `loading="lazy"`
- [ ] Pretendard 폰트: `<link rel="preload" as="style">`
- [ ] 어보브 폴드 Critical CSS: `<head>` 인라인
- [ ] JS 파일: `defer` 속성 적용
- [ ] 섹션별 불필요한 CSS/JS 로딩 없음
- [ ] 목표: Lighthouse ≥ 90점, LCP < 2.5초

---

## WordPress 이관 관련 참고
HTML을 시맨틱 구조(`<section id="">`, `<article>`, `<header>`, `<footer>`)로 깔끔하게 제작해두면 이후 WordPress 테마 변환이 수월함. 인라인 스타일 지양. 모든 콘텐츠 문자열은 `data.js`에서 관리 — 추후 ACF 필드 매핑 용이.
