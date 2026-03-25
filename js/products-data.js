// =====================================================
// 알린다몰 제품 데이터
// thumb: img/product/thumb/파일명.webp (400×400px)
// detail: img/product/detail/파일명.webp (800×800px)
// sample: img/sample/파일명.webp (상세페이지 샘플 이미지)
// cat: tumbler | mug | ceramic | kids | bottle | shaker
// =====================================================
const PRODUCTS = [
  // ── 텀블러 ──
  { id:1,  name:'마일드 원터치 텀블러',                 vol:'500ml', cat:'tumbler', moq:50,  tags:['원터치','보온보냉','스텐'], thumb:'product_01.webp' },
  { id:2,  name:'마일드 노브 텀블러',                   vol:'400ml', cat:'tumbler', moq:50,  tags:['노브캡','보온보냉'],       thumb:'product_02.webp' },
  { id:3,  name:'뉴 메트로 투웨이 텀블러',              vol:'355ml', cat:'tumbler', moq:50,  tags:['투웨이','양방향'],         thumb:'product_03.webp' },
  { id:4,  name:'뉴 메트로 투웨이 텀블러',              vol:'475ml', cat:'tumbler', moq:50,  tags:['투웨이','양방향'],         thumb:'product_04.webp' },
  { id:5,  name:'뉴 메트로 킹 텀블러',                  vol:'820ml', cat:'tumbler', moq:30,  tags:['대용량','킹사이즈'],       thumb:'product_05.webp' },
  { id:6,  name:'뉴 메트로 킹 텀블러',                  vol:'1.2L',  cat:'tumbler', moq:30,  tags:['대용량','킹사이즈'],       thumb:'product_06.webp' },
  { id:7,  name:'데일리 원터치 클립 텀블러',            vol:'550ml', cat:'tumbler', moq:50,  tags:['원터치','클립'],           thumb:'product_07.webp' },
  { id:8,  name:'스쿨핏 코튼캔디 원터치 텀블러',        vol:'370ml', cat:'tumbler', moq:50,  tags:['원터치','파스텔'],         thumb:'product_08.webp' },
  { id:9,  name:'데일리 포켓 텀블러',                   vol:'150ml', cat:'tumbler', moq:100, tags:['미니','포켓사이즈'],       thumb:'product_09.webp' },
  { id:10, name:'슬림핏 원터치 텀블러',                 vol:'-',     cat:'tumbler', moq:50,  tags:['슬림','원터치'],           thumb:'product_10.webp' },
  { id:11, name:'데일리 마카롱 텀블러',                 vol:'480ml', cat:'tumbler', moq:50,  tags:['마카롱','파스텔'],         thumb:'product_11.webp' },
  { id:12, name:'메트로 퍼펙트씰 토트 텀블러',          vol:'600ml', cat:'tumbler', moq:30,  tags:['퍼펙트씰','토트핸들'],     thumb:'product_12.webp' },
  { id:13, name:'메트로 퍼펙트씰 킹 텀블러',            vol:'820ml', cat:'tumbler', moq:30,  tags:['퍼펙트씰','대용량'],       thumb:'product_13.webp' },
  { id:14, name:'메트로 퍼펙트씰 킹 텀블러',            vol:'1100ml',cat:'tumbler', moq:30,  tags:['퍼펙트씰','대용량'],       thumb:'product_14.webp' },
  { id:15, name:'슬로 듀얼 오프닝 텀블러',              vol:'700ml', cat:'tumbler', moq:30,  tags:['듀얼오프닝','대용량'],     thumb:'product_15.webp' },
  { id:16, name:'슬로 울트라 라이트 텀블러',            vol:'630ml', cat:'tumbler', moq:30,  tags:['경량','울트라라이트'],     thumb:'product_16.webp' },
  // ── 머그 ──
  { id:17, name:'뉴 메트로 머그',                       vol:'355ml', cat:'mug',     moq:50,  tags:['머그','보온'],             thumb:'product_17.webp' },
  { id:18, name:'뉴 메트로 머그',                       vol:'475ml', cat:'mug',     moq:50,  tags:['머그','보온'],             thumb:'product_18.webp' },
  { id:19, name:'뉴 메트로 머그',                       vol:'600ml', cat:'mug',     moq:50,  tags:['머그','대용량'],           thumb:'product_19.webp' },
  { id:20, name:'뉴커피 필터 머그',                     vol:'-',     cat:'mug',     moq:30,  tags:['필터','커피'],             thumb:'product_20.webp' },
  { id:21, name:'메트로 퍼펙트씰 머그 텀블러',          vol:'440ml', cat:'mug',     moq:30,  tags:['퍼펙트씰','머그'],         thumb:'product_21.webp' },
  { id:22, name:'메트로 퍼펙트씰 머그 텀블러',          vol:'550ml', cat:'mug',     moq:30,  tags:['퍼펙트씰','머그'],         thumb:'product_22.webp' },
  { id:23, name:'메트로 세라믹머그',                    vol:'600ml', cat:'mug',     moq:30,  tags:['세라믹','머그'],           thumb:'product_23.webp' },
  // ── 세라믹 ──
  { id:24, name:'메트로 카페 세라믹 텀블러',            vol:'400ml', cat:'ceramic', moq:30,  tags:['세라믹','카페'],           thumb:'product_24.webp' },
  { id:25, name:'메트로 카페 세라믹 텀블러',            vol:'500ml', cat:'ceramic', moq:30,  tags:['세라믹','카페'],           thumb:'product_25.webp' },
  { id:26, name:'메트로 카페 세라믹 텀블러',            vol:'650ml', cat:'ceramic', moq:30,  tags:['세라믹','카페'],           thumb:'product_26.webp' },
  { id:27, name:'메트로 카페 세라믹 텀블러',            vol:'750ml', cat:'ceramic', moq:30,  tags:['세라믹','카페'],           thumb:'product_27.webp' },
  { id:28, name:'메트로 카페 탑핸들 세라믹 텀블러',     vol:'710ml', cat:'ceramic', moq:20,  tags:['세라믹','탑핸들'],         thumb:'product_28.webp' },
  { id:29, name:'메트로 카페 탑핸들 세라믹 텀블러',     vol:'900ml', cat:'ceramic', moq:20,  tags:['세라믹','탑핸들'],         thumb:'product_29.webp' },
  { id:30, name:'메트로 카페 듀얼핸들 세라믹 텀블러',   vol:'1.2L',  cat:'ceramic', moq:20,  tags:['세라믹','듀얼핸들','대용량'], thumb:'product_30.webp' },
  { id:31, name:'메트로 가열 텀블러',                   vol:'350ml', cat:'ceramic', moq:30,  tags:['가열','전자레인지'],       thumb:'product_31.webp' },
  // ── 키즈 ──
  { id:32, name:'리틀럽 마망 가열 텀블러',              vol:'300ml', cat:'kids',    moq:30,  tags:['키즈','가열','이유식'],    thumb:'product_32.webp' },
  { id:33, name:'리틀럽 키즈스트랩 텀블러',             vol:'350ml', cat:'kids',    moq:30,  tags:['키즈','스트랩'],           thumb:'product_33.webp' },
  { id:34, name:'리틀럽 키즈스트랩 텀블러',             vol:'500ml', cat:'kids',    moq:30,  tags:['키즈','스트랩'],           thumb:'product_34.webp' },
  { id:35, name:'리틀럽 푸드자',                        vol:'300ml', cat:'kids',    moq:30,  tags:['키즈','이유식','푸드'],    thumb:'product_35.webp' },
  { id:36, name:'마망컵 보온병',                        vol:'355ml', cat:'kids',    moq:50,  tags:['보온병','마망'],           thumb:'product_36.webp' },
  { id:37, name:'키즈스트랩 보틀',                      vol:'400ml', cat:'kids',    moq:30,  tags:['키즈','스트랩','보틀'],    thumb:'product_37.webp' },
  // ── 물병·보틀 ──
  { id:38, name:'데일리 밸런스 보틀',                   vol:'550ml', cat:'bottle',  moq:50,  tags:['보틀','밸런스'],           thumb:'product_38.webp' },
  { id:39, name:'데일리 핸들 콜드컵',                   vol:'720ml', cat:'bottle',  moq:50,  tags:['콜드컵','핸들','대용량'],  thumb:'product_39.webp' },
  { id:40, name:'더블월 콜드컵',                        vol:'720ml', cat:'bottle',  moq:50,  tags:['더블월','콜드컵'],         thumb:'product_40.webp' },
  { id:41, name:'액티브 헬퍼 물병',                     vol:'1L',    cat:'bottle',  moq:50,  tags:['물병','대용량'],           thumb:'product_41.webp' },
  { id:42, name:'에코슬림 물병',                        vol:'500ml', cat:'bottle',  moq:50,  tags:['에코','슬림'],             thumb:'product_42.webp' },
  { id:43, name:'스파우트 물병',                        vol:'600ml', cat:'bottle',  moq:50,  tags:['스파우트','원터치'],       thumb:'product_43.webp' },
  { id:44, name:'스포츠 물병',                          vol:'350ml', cat:'bottle',  moq:50,  tags:['스포츠','물병'],           thumb:'product_44.webp' },
  { id:45, name:'스포츠 물병',                          vol:'500ml', cat:'bottle',  moq:50,  tags:['스포츠','물병'],           thumb:'product_45.webp' },
  { id:46, name:'스포츠 빨대 물병',                     vol:'500ml', cat:'bottle',  moq:50,  tags:['스포츠','빨대'],           thumb:'product_46.webp' },
  { id:47, name:'액티브 라지 물병',                     vol:'1.5L',  cat:'bottle',  moq:30,  tags:['대용량','라지'],           thumb:'product_47.webp' },
  { id:48, name:'액티브 스포츠 물병',                   vol:'730ml', cat:'bottle',  moq:50,  tags:['스포츠','액티브'],         thumb:'product_48.webp' },
  // ── 쉐이킷 ──
  { id:49, name:'쉐이킷 보틀',                          vol:'600ml', cat:'shaker',  moq:30,  tags:['쉐이커','단백질'],         thumb:'product_49.webp' },
  { id:50, name:'액티브 쉐이킷 보틀 노블',              vol:'830ml', cat:'shaker',  moq:30,  tags:['쉐이커','대용량','노블'],  thumb:'product_50.webp' },
  { id:51, name:'쉐이킷보틀 프로 스탠다드',             vol:'650ml', cat:'shaker',  moq:30,  tags:['쉐이커','프로'],           thumb:'product_51.webp' },
  // ── 주방용품 ──
  { id:52, name:'마일드 IH 프라이팬 2p SET', vol:'-', cat:'cookware', moq:10, tags:['IH','프라이팬','세트','각인'], thumb:'마일드 IH 프라이팬 2p SET.jpg', detailImgs:['img/product/detail/마일드 IH 프라이팬 2p SET.jpg'] },
];

const CAT_LABEL = {
  tumbler:'텀블러',
  mug:'머그',
  ceramic:'세라믹',
  kids:'키즈',
  bottle:'물병·보틀',
  shaker:'쉐이킷',
  cookware:'주방용품',
};

