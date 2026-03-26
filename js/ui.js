/* ============================================================
   ui.js — 알린다몰 전체 인터랙션
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
    items.forEach(p => {
      const item = el('div', {
        className: 'portfolio-item fade-up',
        onClick: () => openLightbox(p)
      }, [
        el('div', {
          className: 'img-placeholder--dark',
          style: 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:.8125rem;color:var(--text-muted);text-align:center;padding:16px',
          text: p.title
        }),
        el('div', { className: 'portfolio-item-overlay' }, [
          el('p', { className: 'portfolio-item-title', text: p.title }),
          el('p', { className: 'portfolio-item-desc', text: p.desc })
        ])
      ]);
      grid.appendChild(item);
    });
    grid.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
  }

  /* Lightbox */
  function openLightbox(item) {
    const lb = document.getElementById('lightbox');
    document.getElementById('lightboxImg').style.display = 'none';
    document.getElementById('lightboxTitle').textContent = item.title;
    document.getElementById('lightboxDesc').textContent = item.desc;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightbox').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeLightbox();
  });

  function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  /* ----------------------------------------------------------
     6. REVIEWS — X(트위터) 스타일 카드
  ---------------------------------------------------------- */
  const VERIFIED_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="#1d9bf0"><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91C1.88 9.33 1 10.57 1 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.8 3.91s2.52 1.26 3.92.8c.66 1.31 1.9 2.19 3.33 2.19s2.68-.88 3.34-2.19c1.39.46 2.9.2 3.91-.8s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/></svg>';

  function initReviews() {
    const list = document.getElementById('chatList');
    list.className = 'tweet-list';

    REVIEWS.forEach((r, i) => {
      const initials = r.name.replace(/[^가-힣a-zA-Z]/g, '').slice(0, 1) || '?';

      const card = el('div', { className: 'tweet-card fade-up' }, [
        el('div', { className: 'tweet-header' }, [
          el('div', { className: 'tweet-avatar', style: `background:${r.avatarColor}`, text: initials }),
          el('div', { className: 'tweet-author' }, [
            el('div', { className: 'tweet-name-row' }, [
              el('span', { className: 'tweet-name', text: r.name }),
              ...(r.verified ? [el('span', { className: 'tweet-verified', html: VERIFIED_SVG })] : []),
            ]),
            el('div', { className: 'tweet-handle', text: r.handle }),
          ]),
          el('div', { className: 'tweet-meta' }, [
            el('span', { className: 'tweet-time', text: r.time }),
            el('span', { className: 'tweet-dots', text: '···' }),
          ]),
        ]),
        el('p', { className: 'tweet-body', text: r.text }),
        ...(r.img ? [el('div', { className: 'tweet-img-wrap' }, [
          el('img', { className: 'tweet-img', src: `img/review/${r.img}`, alt: '텀블러판촉물' })
        ])] : []),
        el('div', { className: 'tweet-actions' }, [
          el('span', { className: 'tweet-action', html: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f91880" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#f91880"/></svg>${r.likes}` }),
          el('span', { className: 'tweet-action', html: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#536471" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>${r.comments}` }),
          el('span', { className: 'tweet-action', html: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#536471" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>${r.retweets}` }),
        ]),
      ]);
      list.appendChild(card);
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
      const name = document.getElementById('floatName').value.trim();
      const phone = document.getElementById('floatPhone').value.trim();
      const message = document.getElementById('floatMessage').value.trim();
      const catLabel = selectedCategory
        ? FLOAT_CATEGORIES.find(c => c.key === selectedCategory)?.label || ''
        : '미선택';

      const payload = { name, phone, message, category: catLabel, source: 'float' };
      submitInquiry(payload);
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
  const GOOGLE_APPS_SCRIPT_URL = ''; // TODO: Apps Script 배포 URL

  function submitInquiry(payload) {
    if (GOOGLE_APPS_SCRIPT_URL) {
      fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      .then(res => res.json())
      .then(() => {
        alert(`${payload.name}님, 문의가 접수되었습니다!\n빠른 시간 내에 연락드리겠습니다.`);
      })
      .catch(() => {
        alert('전송 중 오류가 발생했습니다. 전화(02-465-0817)로 문의해주세요.');
      });
    } else {
      alert(`${payload.name}님, 문의가 접수되었습니다!\n빠른 시간 내에 연락드리겠습니다.`);
    }
  }

  function initContactForm() {
    document.getElementById('contactForm').addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const payload = {
        name: fd.get('name'),
        phone: fd.get('phone'),
        email: fd.get('email'),
        message: fd.get('message'),
        source: 'contact',
      };
      submitInquiry(payload);
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
    const src = 'img/logo/logo_hash.png';
    const count = 16;
    let html = '';
    for (let i = 0; i < count; i++) {
      html += '<img src="' + src + '" alt="돌잔치" loading="lazy">';
    }
    ['marqueeTrack1','marqueeTrack2','marqueeTrack3'].forEach(function(id) {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
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
