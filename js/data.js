/* -----------------------------------------------------------
   [새기다 WEBSITE CONTENT DATA]
   운영자는 이 파일의 내용만 수정하여 웹사이트 콘텐츠를 관리합니다.
----------------------------------------------------------- */

const SEGIDA_DATA = {
    
    // 1. 헤더 (Nav 메뉴는 index.html 하드코딩 권장 - 워드프레스 메뉴 시스템 활용 예정)

    // 2. 히어로 섹션 슬라이더 (1920*1080 권장)
    hero_slides: [
        {
            bg_img: 'https://via.placeholder.com/1920x1080/2a2a2a/ffffff?text=SEGIDA+Main+Visual+01', // 실제 이미지 경로로 변경
            title: '브랜드의 가치를<br>확실하게 <span class="point">새기다</span>',
            desc: 'DTF 스티커 | 레이저 각인 | 프리미엄 답례품'
        },
        {
            bg_img: 'https://via.placeholder.com/1920x1080/8a99ff/ffffff?text=SEGIDA+Visual+02+DTF',
            title: '무한한 컬러 표현,<br>정밀한 <span class="point">DTF 스티커</span>',
            desc: '어떤 소재에도 제약 없이 당신의 디자인을 새기세요.'
        },
        {
            bg_img: 'https://via.placeholder.com/1920x1080/b0b8f0/2a2a2a?text=SEGIDA+Visual+03+Laser',
            title: '품격을 높이는<br><span class="point">프리미엄 레이저 각인</span>',
            desc: '0.1mm의 오차도 허용하지 않는 섬세함으로 가치를 더합니다.'
        }
    ],

    // 3. 핵심 서비스 안내
    services: [
        {
            icon: '', // 임시 이모지 (추후 img 또는 svg로 변경 가능)
            title: 'DTF 스티커',
            desc: '강력한 접착력과 선명한 컬러 표현으로 다양한 굿즈 및 의류 제작에 최적화된 솔루션을 제공합니다.'
        },
        {
            icon: '',
            title: '레이저 각인',
            desc: '금속, 목재, 아크릴 등 다양한 자재에 정밀한 마킹을 통해 영구적이고 고급스러운 결과물을 새깁니다.'
        },
        {
            icon: '',
            title: '프리미엄 답례품',
            desc: '기획부터 제작, 패키징까지. 받는 이의 기억에 남을 브랜드 커스텀 답례품을 제안합니다.'
        }
    ],

    // 주문 프로세스
    process: [
        { step: 'STEP 01', title: '상담 및 견적', desc: '제작 사양 확인 후 맞춤형 견적을 제안합니다.' },
        { step: 'STEP 02', title: '디자인 확정', desc: '고객님께서 제공한 데이터를 검토하고 시안을 확정합니다.' },
        { step: 'STEP 03', title: '제작 진행', desc: '최신 설비로 정밀 제작에 들어갑니다.' },
        { step: 'STEP 04', title: '검수 및 배송', desc: '꼼꼼한 최종 검수 후 안전하게 발송합니다.' }
    ],

    // 실제 제작 사례 (포트폴리오 - 정사각형 600*600 권장)
    portfolio: [
        { img: 'https://via.placeholder.com/600x600/f0f0f0/333333?text=DTF+Case+01', title: 'A기업 이벤트 티셔츠', cate: 'DTF 스티커' },
        { img: 'https://via.placeholder.com/600x600/f0f0f0/333333?text=Laser+Case+01', title: 'B호텔 웰컴 텀블러 각인', cate: '레이저 각인' },
        { img: 'https://via.placeholder.com/600x600/f0f0f0/333333?text=Gift+Case+01', title: 'C사 창립기념품 세트', cate: '프리미엄 답례품' },
        { img: 'https://via.placeholder.com/600x600/f0f0f0/333333?text=DTF+Case+02', title: '스타트업 굿즈 패키지', cate: 'DTF 스티커' },
        { img: 'https://via.placeholder.com/600x600/f0f0f0/333333?text=Laser+Case+02', title: 'F&B 브랜드 우드 트레이', cate: '레이저 각인' },
        { img: 'https://via.placeholder.com/600x600/f0f0f0/333333?text=Gift+Case+02', title: 'VIP 고객 프라이빗 기프트', cate: '프리미엄 답례품' }
    ],

    // 5. 푸터 스프레딩 퍼널 (개요 요건)
    funnel: [
        { name: '스마트스토어', link: '#', icon: '' }, // 추후 icon은 SVG 등으로 구현
        { name: '네이버 블로그', link: '#', icon: '' },
        { name: '네이버 플레이스', link: '#', icon: '' },
        { name: '인스타그램', link: '#', icon: '' },
        { name: '유튜브', link: '#', icon: '' },
        { name: '카카오톡 문의', link: '#', icon: '' }
    ],

    // 회사소개서 PDF 링크
    intro_pdf: 'img/segida.pdf' // 실제 파일 위치
};