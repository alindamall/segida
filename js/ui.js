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
          el('div', {
            className: 'card-img img-placeholder',
            style: 'aspect-ratio:4/3',
            html: s.svgIcon
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
    renderPortfolio(key);
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
     6. REVIEWS — 대화형 말풍선 채팅
  ---------------------------------------------------------- */
  function initReviews() {
    const chatList = document.getElementById('chatList');

    REVIEWS.forEach(r => {
      const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);

      // 채팅 카드
      const card = el('div', { className: 'chat-card fade-up' });

      // 헤더 (작성자 + 별점)
      const header = el('div', { className: 'chat-card-header' }, [
        el('div', {}, [
          el('div', { className: 'chat-card-author', text: r.name }),
          el('div', { className: 'chat-card-company', text: r.company }),
        ]),
        el('div', { className: 'chat-card-stars', text: stars }),
      ]);
      card.appendChild(header);

      // 채팅 메시지들
      const messages = el('div', { className: 'chat-messages' });
      r.chat.forEach((c, idx) => {
        const isCustomer = c.who === 'customer';
        const bubble = el('div', {
          className: `chat-bubble chat-bubble--${c.who} chat-bubble-delay-${idx}`,
        }, [
          el('div', {
            className: 'chat-bubble-label',
            text: isCustomer ? '고객' : '알린다',
          }),
          el('span', { text: c.msg }),
        ]);
        messages.appendChild(bubble);
      });
      card.appendChild(messages);

      chatList.appendChild(card);
    });
  }

  /* 말풍선 스크롤 애니메이션 전용 옵저버 */
  const bubbleObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.3 });

  function observeBubbles() {
    document.querySelectorAll('.chat-bubble').forEach(b => bubbleObserver.observe(b));
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

    // 빠른 문의
    document.getElementById('floatSubmit').addEventListener('click', () => {
      const name = document.getElementById('floatName').value.trim();
      const phone = document.getElementById('floatPhone').value.trim();
      if (!name || !phone) {
        alert('이름과 연락처를 입력해주세요.');
        return;
      }
      const catLabel = selectedCategory
        ? FLOAT_CATEGORIES.find(c => c.key === selectedCategory)?.label || ''
        : '미선택';
      alert(`${name}님, [${catLabel}] 문의가 접수되었습니다!\n빠른 시간 내에 연락드리겠습니다.`);
      document.getElementById('floatName').value = '';
      document.getElementById('floatPhone').value = '';
    });
  }

  /* ----------------------------------------------------------
     10. CONTACT FORM
  ---------------------------------------------------------- */
  function initContactForm() {
    document.getElementById('contactForm').addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const name = fd.get('name');
      alert(`${name}님, 견적 문의가 접수되었습니다!\n24시간 이내에 연락드리겠습니다.`);
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
  function init() {
    initHero();
    initHeroSwipe();
    initServices();
    initBrand();
    initProcess();
    initPortfolio();
    initReviews();
    initGuide();
    initHeader();
    initFloating();
    initContactForm();
    initObserver();
    observeBubbles();
    initPromo();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
