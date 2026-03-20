/* -----------------------------------------------------------
   [새기다 WEBSITE UI & INTERACTION]
----------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    
    // [1. 데이터 렌더링] data.js의 내용을 HTML에 주입
    renderHeroSlider();
    renderServices();
    renderPortfolio();
    renderProcess();
    renderFunnelLinks();

    // [2. UI 상호작용 기능 초기화]
    initHeaderScroll();
    initMobileMenu();
    initHeroSlider(); // 렌더링 후 초기화
    initSmoothScroll();
});

// --- 상세 구현 함수들 ---

// 데이터 렌더링: 히어로 슬라이드
function renderHeroSlider() {
    const slider = document.querySelector('.hero-slider');
    const dotsContainer = document.querySelector('.slider-dots');
    
    SEGIDA_DATA.hero_slides.forEach((slide, index) => {
        // 슬라이드 생성
        const item = document.createElement('div');
        item.className = `hero-item ${index === 0 ? 'active' : ''}`;
        item.style.backgroundImage = `url('${slide.bg_img}')`;
        item.innerHTML = `
            <div class="hero-content container">
                <h1>${slide.title}</h1>
                <p>${slide.desc}</p>
            </div>
        `;
        slider.appendChild(item);
        
        // 점(Dot) 생성
        const dot = document.createElement('span');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.dataset.slide = index;
        dotsContainer.appendChild(dot);
    });
}

// 데이터 렌더링: 서비스 Grid
function renderServices() {
    const container = document.getElementById('service-grid');
    if (!container) return;
    
    SEGIDA_DATA.services.forEach(item => {
        container.innerHTML += `
            <div class="service-item glass-card">
                <span class="service-icon">${item.icon}</span>
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
            </div>
        `;
    });
}

// 데이터 렌더링: 포트폴리오 Grid
function renderPortfolio() {
    const container = document.getElementById('portfolio-grid');
    if (!container) return;

    SEGIDA_DATA.portfolio.forEach(item => {
        container.innerHTML += `
            <div class="portfolio-item">
                <img src="${item.img}" alt="${item.title}" loading="lazy">
                <div class="pf-overlay">
                    <span>${item.cate}</span>
                    <h4>${item.title}</h4>
                </div>
            </div>
        `;
    });
}

// 데이터 렌더링: 타임라인
function renderProcess() {
    const container = document.getElementById('process-timeline');
    if (!container) return;

    SEGIDA_DATA.process.forEach(item => {
        container.innerHTML += `
            <div class="tl-item">
                <div class="tl-dot"></div>
                <div class="tl-content">
                    <div class="tl-step">${item.step}</div>
                    <h4>${item.title}</h4>
                    <p>${item.desc}</p>
                </div>
            </div>
        `;
    });
}

// 데이터 렌더링: 푸터 퍼널 링크
function renderFunnelLinks() {
    const container = document.getElementById('funnel-links');
    if (!container) return;

    SEGIDA_DATA.funnel.forEach(item => {
        container.innerHTML += `<a href="${item.link}" target="_blank">${item.name}</a>`;
    });
}

// 동작: 헤더 스크롤시 스타일 변경 (알약 -> 상단 고정)
function initHeaderScroll() {
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// 동작: 모바일 햄버거 메뉴 토글
function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-menu');
    
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        nav.classList.toggle('open');
    });
    
    // 메뉴 링크 클릭시 메뉴 닫기 (랜딩페이지 필수)
    nav.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            toggle.classList.remove('open');
            nav.classList.remove('open');
        }
    });
}

// 동작: 히어로 슬라이더 자동 전환 (개요 요건)
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-item');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const intervalTime = 5000; // 5초
    let slideInterval;

    const nextSlide = () => {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    };

    // 자동 재생 시작
    slideInterval = setInterval(nextSlide, intervalTime);

    // 점(Dot) 클릭 이벤트
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval); // 클릭시 자동재생 멈춤
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            currentSlide = index;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
            slideInterval = setInterval(nextSlide, intervalTime); // 다시 시작
        });
    });
}

// 동작: 부드러운 스크롤 (Anchor 링크)
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}