/* ============================================================
   ui.js — 알린다 전체 인터랙션
   슬라이더, 스크롤, 폼, 플로팅, 포트폴리오 필터, 라이트박스
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     Helper: create element
  ---------------------------------------------------------- */
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'html') { node.innerHTML = v; return; }
      if (k === 'text') { node.textContent = v; return; }
      if (k === 'className') { node.className = v; return; }
      if (k.startsWith('on')) { node.addEventListener(k.slice(2).toLowerCase(), v); return; }
      node.setAttribute(k, v);
    });
    if (children) children.forEach(c => { if (c) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return node;
  }

  /* ----------------------------------------------------------
     1. HERO SLIDER
  ---------------------------------------------------------- */
  const heroSlides = document.getElementById('heroSlides');
  const heroTitle = document.getElementById('heroTitle');
  const heroSubtitle = document.getElementById('heroSubtitle');
  const heroCta = document.getElementById('heroCta');
  const heroDots = document.getElementById('heroDots');
  let heroIdx = 0;
  let heroInterval;

  function initHero() {
    HERO_SLIDES.forEach((s, i) => {
      const slide = el('div', { className: `hero-slide${i === 0 ? ' active' : ''}` }, [
        el('div', { className: 'hero-slide-bg', style: `background-image:${s.placeholder};background-image:url(${s.img}),${s.placeholder}` })
      ]);
      heroSlides.appendChild(slide);
      const dot = el('button', { className: `hero-dot${i === 0 ? ' active' : ''}`, 'aria-label': `슬라이드 ${i + 1}`, onClick: () => goHero(i) });
      heroDots.appendChild(dot);
    });
    updateHeroContent(0);
    heroInterval = setInterval(() => goHero((heroIdx + 1) % HERO_SLIDES.length), 5000);
  }

  function goHero(idx) {
    if (idx === heroIdx) return;
    const slides = heroSlides.children;
    const dots = heroDots.children;
    slides[heroIdx].classList.remove('active');
    dots[heroIdx].classList.remove('active');
    heroIdx = idx;
    slides[heroIdx].classList.add('active');
    dots[heroIdx].classList.add('active');
    updateHeroContent(idx);
    clearInterval(heroInterval);
    heroInterval = setInterval(() => goHero((heroIdx + 1) % HERO_SLIDES.length), 5000);
  }

  function updateHeroContent(idx) {
    const s = HERO_SLIDES[idx];
    heroTitle.textContent = s.title;
    heroSubtitle.textContent = s.subtitle;
    heroCta.innerHTML = '';
    heroCta.appendChild(el('a', { className: 'btn btn--primary', href: s.cta1.link, text: s.cta1.text }));
    const isExternal = s.cta2.link.startsWith('http');
    heroCta.appendChild(el('a', {
      className: 'btn btn--outline', href: s.cta2.link, text: s.cta2.text,
      style: 'border-color:rgba(255,255,255,.4);color:#fff',
      ...(isExternal ? { target: '_blank', rel: 'noopener' } : {})
    }));
  }

  /* Hero touch swipe */
  function initHeroSwipe() {
    const hero = document.getElementById('hero');
    let startX = 0;
    let endX = 0;
    hero.addEventListener('touchstart', e => { startX = e.changedTouches[0].screenX; }, { passive: true });
    hero.addEventListener('touchend', e => {
      endX = e.changedTouches[0].screenX;
      const diff = startX - endX;
      if (Math.abs(diff) > 50) {
        const next = diff > 0
          ? (heroIdx + 1) % HERO_SLIDES.length
          : (heroIdx - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
        goHero(next);
      }
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     2. SERVICES GRID
  ---------------------------------------------------------- */
  function initServices() {
    const grid = document.getElementById('servicesGrid');
    SERVICES.forEach((s, i) => {
      const card = el('a', {
        className: `card service-card fade-up fade-up-delay-${(i % 3) + 1}`,
        href: s.link, target: '_blank', rel: 'noopener'
      }, [
        el('div', { className: 'card-img-wrap' }, [
          el('img', {
            className: 'card-img',
            src: s.img,
            alt: s.title,
            loading: 'lazy',
            style: 'aspect-ratio:4/3;object-fit:cover;width:100%'
          })
        ]),
        el('div', { className: 'card-body' }, [
          el('h3', { className: 'heading-sm card-title', text: s.title }),
          el('p', { className: 'card-desc', text: s.desc })
        ])
      ]);
      grid.appendChild(card);
    });
  }

  /* ----------------------------------------------------------
     2-1. ICEBERG GRID
  ---------------------------------------------------------- */
  function initIceberg() {
    const grid = document.getElementById('icebergGrid');
    ICEBERG_ITEMS.forEach((item, i) => {
      const card = el('div', { className: `iceberg-card fade-up fade-up-delay-${(i % 3) + 1}` }, [
        el('span', { className: 'iceberg-card-num', text: item.num }),
        el('div', { className: 'iceberg-card-head' }, [
          el('div', { className: 'iceberg-card-icon', html: item.svg }),
          el('span', { className: 'iceberg-card-title', text: item.title }),
        ]),
        el('p', { className: 'iceberg-card-desc', text: item.desc }),
      ]);
      grid.appendChild(card);
    });
  }

  /* ----------------------------------------------------------
     3. BRAND GRID
  ---------------------------------------------------------- */
  function initBrand() {
    const grid = document.getElementById('brandGrid');
    BRAND_ITEMS.forEach((b, i) => {
      const card = el('div', { className: `brand-card fade-up fade-up-delay-${i + 1}` }, [
        el('div', { className: 'card-icon', html: b.svgIcon }),
        el('h3', { className: 'heading-sm card-title text-white', text: b.title }),
        el('p', { className: 'card-desc', text: b.desc })
      ]);
      grid.appendChild(card);
    });
  }

  /* ----------------------------------------------------------
     4. PROCESS TIMELINE — SVG 아이콘
  ---------------------------------------------------------- */
  function initProcess() {
    const timeline = document.getElementById('timeline');
    PROCESS_STEPS.forEach((p, i) => {
      const step = el('div', { className: `timeline-step fade-up fade-up-delay-${Math.min(i + 1, 3)}` }, [
        el('span', { className: 'timeline-num', text: `0${p.step}` }),
        el('div', { className: 'timeline-icon', html: p.svgIcon }),
        el('h4', { className: 'timeline-title', text: p.title }),
        el('p', { className: 'timeline-desc', text: p.desc })
      ]);
      timeline.appendChild(step);
    });
  }

  /* ----------------------------------------------------------
     5. PORTFOLIO (filter + lightbox)
  ---------------------------------------------------------- */
  let activeFilter = 'all';
  let currentItems = [];

  function initPortfolio() {
    const bar = document.getElementById('filterBar');
    PORTFOLIO_FILTERS.forEach(f => {
      const btn = el('button', {
        className: `filter-btn${f.key === 'all' ? ' active' : ''}`,
        text: f.label,
        'data-filter': f.key,
        onClick: () => filterPortfolio(f.key)
      });
      bar.appendChild(btn);
    });
    renderPortfolio('all');
  }

  function filterPortfolio(key) {
    activeFilter = key;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === key));
    if (document.startViewTransition) {
      document.startViewTransition(() => renderPortfolio(key));
    } else {
      renderPortfolio(key);
    }
  }

  function renderPortfolio(key) {
    const grid = document.getElementById('portfolioGrid');
    grid.innerHTML = '';
    const items = key === 'all' ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter(p => p.category === key);
    currentItems = items;
    items.forEach(p => {
      const item = el('div', {
        className: 'portfolio-item fade-up',
        onClick: () => openLightbox(currentItems, currentItems.indexOf(p))
      }, [
        el('img', { src: p.img, alt: p.title, loading: 'lazy', style: 'width:100%;height:100%;object-fit:cover;display:block;' }),
        el('div', { className: 'portfolio-item-overlay' }, [
          el('p', { className: 'portfolio-item-title', text: p.title }),
          el('p', { className: 'portfolio-item-desc', text: p.desc })
        ])
      ]);
      grid.appendChild(item);
    });
    grid.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
  }

  /* Lightbox (이미지 + 이전/다음 내비게이션) */
  let lbItems = [];
  let lbIndex = 0;

  function openLightbox(list, index) {
    if (!Array.isArray(list) || !list.length) return;
    lbItems = list;
    lbIndex = (typeof index === 'number' && index >= 0) ? index : 0;
    renderLightbox();
    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function renderLightbox() {
    const item = lbItems[lbIndex];
    if (!item) return;
    const img = document.getElementById('lightboxImg');
    img.style.display = 'block';
    img.src = item.img;
    img.alt = item.title;
    document.getElementById('lightboxTitle').textContent = item.title;
    document.getElementById('lightboxDesc').textContent = item.desc;
    const counter = document.getElementById('lightboxCounter');
    if (counter) counter.textContent = `${lbIndex + 1} / ${lbItems.length}`;
  }

  function lbPrev() { lbIndex = (lbIndex - 1 + lbItems.length) % lbItems.length; renderLightbox(); }
  function lbNext() { lbIndex = (lbIndex + 1) % lbItems.length; renderLightbox(); }

  function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightbox').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeLightbox();
  });
  (function () {
    const prev = document.getElementById('lightboxPrev');
    const next = document.getElementById('lightboxNext');
    if (prev) prev.addEventListener('click', e => { e.stopPropagation(); lbPrev(); });
    if (next) next.addEventListener('click', e => { e.stopPropagation(); lbNext(); });
  })();

  document.addEventListener('keydown', e => {
    const lb = document.getElementById('lightbox');
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') lbPrev();
    else if (e.key === 'ArrowRight') lbNext();
  });

  /* ----------------------------------------------------------
     6. REVIEWS — 네이버 스마트스토어 리뷰 스타일
  ---------------------------------------------------------- */
  function reviewStars(n) {
    let out = '<span class="review-stars">';
    for (let i = 1; i <= 5; i++) {
      out += `<svg class="review-star" viewBox="0 0 24 24" fill="${i <= n ? '#FFB400' : '#dfe3e8'}"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
    }
    return out + '</span>';
  }

  function initReviews() {
    const list = document.getElementById('chatList');
    list.className = 'naver-reviews';
    list.innerHTML = '';

    const avg = (REVIEWS.reduce((a, r) => a + (r.rating || 5), 0) / REVIEWS.length).toFixed(1);

    // 사진 후기만 모아 라이트박스용 리스트 구성 (사진 클릭 시 확대)
    const photoReviews = REVIEWS.filter(r => r.img);
    const reviewLb = photoReviews.map(r => ({
      img: `img/review/${r.img}`,
      title: r.product || '구매 후기',
      desc: r.option ? `${r.name} · ${r.option}` : r.name,
    }));

    // 요약 헤더
    list.appendChild(el('div', { className: 'review-summary' }, [
      el('div', { className: 'review-summary-score', text: avg }),
      el('div', { className: 'review-summary-stars' }, [
        el('div', { className: 'stars', html: reviewStars(Math.round(avg)) }),
        el('div', { className: 'review-summary-count', text: `엄선된 실구매 후기 ${REVIEWS.length}건` }),
      ]),
      el('a', {
        className: 'review-summary-badge',
        href: 'https://smartstore.naver.com/alindamall', target: '_blank', rel: 'noopener',
        html: '<svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M3 3h8v8.5l2-2.5V3h8v18h-8v-8.5l-2 2.5V21H3z"/></svg><span>스마트스토어 리뷰</span>',
      }),
    ]));

    // 리뷰 항목
    REVIEWS.forEach(r => {
      const rating = r.rating || 5;

      list.appendChild(el('div', { className: 'review-item fade-up' }, [
        el('div', { className: 'review-top' }, [
          el('div', { className: 'review-id-row' }, [
            el('span', { html: reviewStars(rating) }),
            el('span', { className: 'review-id', text: r.name }),
          ]),
          el('span', { className: 'review-date', text: r.date || r.time || '' }),
        ]),
        (r.product || r.option)
          ? el('div', { className: 'review-option', html: `${r.product ? `<strong>${r.product}</strong>` : ''}${r.option ? ` · ${r.option}` : ''}` })
          : null,
        el('p', { className: 'review-text', text: r.text }),
        r.img
          ? el('div', {
              className: 'review-photo',
              onClick: () => openLightbox(reviewLb, photoReviews.indexOf(r))
            }, [
              el('img', {
                src: `img/review/${r.img}`, alt: r.product || '구매 후기', loading: 'lazy',
                onError: function () { this.parentElement.style.display = 'none'; }
              })
            ])
          : null,
      ]));
    });
  }

  /* ----------------------------------------------------------
     7. GUIDE & FAQ — SVG 아이콘
  ---------------------------------------------------------- */
  function initGuide() {
    const grid = document.getElementById('guideGrid');
    GUIDE_CARDS.forEach((g, i) => {
      grid.appendChild(el('div', { className: `guide-card fade-up fade-up-delay-${i + 1}` }, [
        el('div', { className: 'card-icon', html: g.svgIcon }),
        el('h3', { className: 'heading-sm', text: g.title }),
        el('p', { className: 'card-desc', text: g.desc, style: 'margin-top:8px' })
      ]));
    });

    const accordion = document.getElementById('faqAccordion');
    FAQ_ITEMS.forEach((f, i) => {
      const item = el('div', { className: `accordion-item fade-up fade-up-delay-${Math.min(i + 1, 3)}` }, [
        el('button', {
          className: 'accordion-header',
          html: `<span>${f.q}</span><svg class="accordion-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>`,
          onClick: function () { toggleAccordion(this.parentElement); }
        }),
        el('div', { className: 'accordion-body' }, [
          el('div', { className: 'accordion-body-inner', text: f.a })
        ])
      ]);
      accordion.appendChild(item);
    });
  }

  function toggleAccordion(item) {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.accordion-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.accordion-body').style.maxHeight = '0';
    });
    if (!isOpen) {
      item.classList.add('open');
      const body = item.querySelector('.accordion-body');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  }

  /* ----------------------------------------------------------
     8. HEADER (scroll effects + hamburger + active nav)
  ---------------------------------------------------------- */
  function initHeader() {
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      header.classList.toggle('scrolled', y > 60);

      const navLinks = document.querySelectorAll('.nav-link');
      let current = '';
      document.querySelectorAll('[id]').forEach(sec => {
        if (sec.tagName === 'SECTION' || sec.tagName === 'DIV') {
          const top = sec.offsetTop - 100;
          if (y >= top) current = sec.id;
        }
      });
      navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
      });
    }, { passive: true });

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('.nav-link').forEach(l => {
      l.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ----------------------------------------------------------
     9. FLOATING BAR — 상품 카테고리 롤아웃 탭
  ---------------------------------------------------------- */
  let selectedCategory = null;

  function initFloating() {
    const bar = document.getElementById('floatingBar');
    const heroEl = document.getElementById('hero');
    const catContainer = document.getElementById('floatCategories');
    const selectedEl = document.getElementById('floatSelected');

    // 카테고리 탭 렌더
    FLOAT_CATEGORIES.forEach(cat => {
      const btn = el('button', {
        className: 'float-cat-btn',
        'data-cat': cat.key,
        html: `${cat.svg}<span>${cat.label}</span>`,
        onClick: () => selectCategory(cat),
      });
      catContainer.appendChild(btn);
    });

    function selectCategory(cat) {
      selectedCategory = cat.key;
      document.querySelectorAll('.float-cat-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.cat === cat.key)
      );
      selectedEl.style.display = 'flex';
      selectedEl.innerHTML = `${cat.svg}<span>${cat.label}</span>`;
    }

    // 스크롤 시 표시
    window.addEventListener('scroll', () => {
      const heroBottom = heroEl.offsetTop + heroEl.offsetHeight;
      bar.classList.toggle('visible', window.scrollY > heroBottom);
    }, { passive: true });

    // 빠른 문의 (Google Sheets + Gmail 연동 대비)
    document.getElementById('floatForm').addEventListener('submit', e => {
      e.preventDefault();
      const btn = document.getElementById('floatSubmit');
      const name = document.getElementById('floatName').value.trim();
      const phone = document.getElementById('floatPhone').value.trim();
      const message = document.getElementById('floatMessage').value.trim();
      const catLabel = selectedCategory
        ? FLOAT_CATEGORIES.find(c => c.key === selectedCategory)?.label || ''
        : '미선택';

      const payload = { name, phone, message, category: catLabel, source: 'float' };
      submitInquiry(payload, btn);
      e.target.reset();
    });
  }

  /* ----------------------------------------------------------
     10. CONTACT FORM
  ---------------------------------------------------------- */
  /* ----------------------------------------------------------
     Google Sheets / Gmail 연동 공통 제출 함수
     → GOOGLE_APPS_SCRIPT_URL 에 Apps Script 웹앱 URL 넣으면 자동 연동
  ---------------------------------------------------------- */
  const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw27W5GCpfui0s15yyFt2RlCSn8kF_-SeSPk4lJvqbkxEvjGgBDDc48CnP21CAH8KFu/exec';

  function showToast(message, type) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = el('div', { id: 'toast', className: 'toast' });
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = 'toast show' + (type ? ' toast--' + type : '');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => { toast.className = 'toast'; }, 3800);
  }

  function submitInquiry(payload, btnEl) {
    const origText = btnEl ? btnEl.textContent : '';
    if (btnEl) { btnEl.disabled = true; btnEl.textContent = '전송 중...'; }
    const restore = () => { if (btnEl) { btnEl.disabled = false; btnEl.textContent = origText; } };

    if (!payload.name || !payload.phone) {
      showToast('이름과 연락처를 입력해 주세요.', 'error');
      restore();
      return;
    }

    if (!GOOGLE_APPS_SCRIPT_URL) {
      showToast(`${payload.name}님, 문의가 접수되었습니다. 곧 연락드리겠습니다.`, 'success');
      restore();
      return;
    }

    const body = new URLSearchParams();
    Object.entries(payload).forEach(([k, v]) => body.append(k, v == null ? '' : v));

    fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: body.toString(),
    })
    .then(() => {
      showToast(`${payload.name}님, 문의가 정상 접수되었습니다. 빠르게 연락드리겠습니다.`, 'success');
    })
    .catch(() => {
      showToast('전송 중 오류가 발생했습니다. 1644-2523으로 문의해 주세요.', 'error');
    })
    .finally(restore);
  }

  function initContactForm() {
    document.getElementById('contactForm').addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const btn = e.target.querySelector('button[type="submit"]');
      const payload = {
        name: fd.get('name'),
        phone: fd.get('phone'),
        email: fd.get('email'),
        category: fd.get('category') || '',
        message: fd.get('message'),
        source: 'contact',
      };
      submitInquiry(payload, btn);
      e.target.reset();
    });
  }

  /* ----------------------------------------------------------
     11. INTERSECTION OBSERVER (single instance)
  ---------------------------------------------------------- */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  function initObserver() {
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
  }

  /* ----------------------------------------------------------
     12. PROMO POPUP MODAL
  ---------------------------------------------------------- */
  function initPromo() {
    const overlay = document.getElementById('promoOverlay');
    if (!overlay) return;

    // 모바일에서 숨김
    if (window.innerWidth <= 768) {
      overlay.remove();
      return;
    }

    // 오늘 하루 보지 않기 체크
    const today = new Date().toISOString().slice(0, 10);
    if (localStorage.getItem('promoHide') === today) {
      overlay.remove();
      return;
    }

    document.body.style.overflow = 'hidden';

    function closePromo() {
      overlay.classList.add('closing');
      document.body.style.overflow = '';
      setTimeout(() => overlay.remove(), 350);
    }

    document.getElementById('promoClose').addEventListener('click', closePromo);
    document.getElementById('promoJustClose').addEventListener('click', closePromo);

    document.getElementById('promoTodayClose').addEventListener('click', () => {
      localStorage.setItem('promoHide', today);
      closePromo();
    });

    document.getElementById('promoCta').addEventListener('click', closePromo);

    overlay.addEventListener('click', e => {
      if (e.target === overlay) closePromo();
    });
  }

  /* ----------------------------------------------------------
     INIT
  ---------------------------------------------------------- */
  function initMarquee() {
    const logos = [
      { src: 'img/partners/고려기프트판촉물_1도.png', alt: '고려기프트판촉물' },
      { src: 'img/partners/락앤락%202021%20로고.png', alt: '락앤락' },
      { src: 'img/partners/랜드로버.png', alt: '랜드로버' },
      { src: 'img/partners/러시아월드컵.png', alt: '러시아 월드컵' },
      { src: 'img/partners/르노삼성.png', alt: '르노삼성' },
      { src: 'img/partners/모디.png', alt: '모디' },
      { src: 'img/partners/배화여자대학교%20로고.png', alt: '배화여자대학교' },
      { src: 'img/partners/벤틀리.png', alt: '벤틀리' },
      { src: 'img/partners/쉐보레.png', alt: '쉐보레' },
      { src: 'img/partners/진에어.png', alt: '진에어' },
      { src: 'img/partners/파커.png', alt: '파커' },
    ];
    // translateX(-50%) 무한 루프를 위해 동일 세트를 2배 복제
    const make = arr => arr.concat(arr)
      .map(l => `<img src="${l.src}" alt="${l.alt} 파트너사" loading="lazy">`).join('');
    const reversed = logos.slice().reverse();
    const shifted = logos.slice(4).concat(logos.slice(0, 4));
    const tracks = {
      marqueeTrack1: make(logos),
      marqueeTrack2: make(reversed),
      marqueeTrack3: make(shifted),
    };
    Object.keys(tracks).forEach(id => {
      const node = document.getElementById(id);
      if (node) node.innerHTML = tracks[id];
    });
  }

  function init() {
    initHero();
    initHeroSwipe();
    initServices();
    initIceberg();
    // initBrand(); /* 브랜드 섹션 개편 예정, 임시 비활성 */
    initProcess();
    initPortfolio();
    initReviews();
    initGuide();
    initMarquee();
    initHeader();
    initFloating();
    initContactForm();
    initObserver();
    observeBubbles();
    // initPromo(); /* 프로모 팝업 제거 */
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
