const fs = require('fs');
const path = require('path');

const BASE = path.resolve('./04_모든상품');
const THUMB_OUT = path.resolve('./img/product/thumb');
const DETAIL_OUT = path.resolve('./img/product/detail');

const CATS = [
  { dir: '01_메탈 볼펜',               prefix: 'm', cat: 'metal-pen', moq: 30, tags: ['각인','메탈볼펜','판촉물'] },
  { dir: '02_일반 볼펜',               prefix: 'p', cat: 'pen',       moq: 50, tags: ['볼펜','판촉물','소량제작'] },
  { dir: '03_락앤락 텀블러',           prefix: 't', cat: 'tumbler',   moq: 30, tags: ['각인','텀블러','판촉물'] },
  { dir: '04_마일드 IH 후라이팬&특판', prefix: 'c', cat: 'cookware',  moq: 10, tags: ['각인','주방용품','특판'] },
  { dir: '05_락앤락 기프트세트',       prefix: 'g', cat: 'giftset',   moq: 10, tags: ['기프트세트','답례품','선물'] },
];

const IMG_EXT = /\.(jpg|jpeg|png|webp)$/i;
const NUM_RE  = /^(\d+)/;

function extractVol(name) {
  const m = name.match(/(\d+(?:\.\d+)?)\s*(ml|L|l)/i);
  return m ? m[1] + m[2].toLowerCase() : '-';
}

function extractName(filename) {
  return filename
    .replace(/^\d+[_\-]?\s*/, '')
    .replace(IMG_EXT, '')
    .trim();
}

let products = [];
let id = 1;

CATS.forEach(({ dir, prefix, cat, moq, tags }) => {
  const thumbDir  = path.join(BASE, dir, '썸네일');
  const detailDir = path.join(BASE, dir, '상세페이지');

  if (!fs.existsSync(thumbDir)) return;

  const thumbFiles = fs.readdirSync(thumbDir).filter(f => IMG_EXT.test(f)).sort();

  // detail 파일을 숫자 prefix로 그룹화
  const detailByNum = {};
  if (fs.existsSync(detailDir)) {
    fs.readdirSync(detailDir).filter(f => IMG_EXT.test(f)).forEach(f => {
      const m = f.match(NUM_RE);
      if (m) {
        const n = parseInt(m[1], 10);
        if (!detailByNum[n]) detailByNum[n] = [];
        detailByNum[n].push(f);
      }
    });
  }

  thumbFiles.forEach(thumbFile => {
    const m = thumbFile.match(NUM_RE);
    if (!m) return;
    const num = parseInt(m[1], 10);
    const name = extractName(thumbFile);
    const ext  = (thumbFile.match(IMG_EXT) || [])[0] || '.jpg';
    const newThumb = `${prefix}_${String(num).padStart(2,'0')}${ext}`;

    // thumb 복사
    try { fs.copyFileSync(path.join(thumbDir, thumbFile), path.join(THUMB_OUT, newThumb)); } catch(e) {}

    // detail 복사
    const detailImgs = [];
    (detailByNum[num] || []).sort().forEach((df, i) => {
      const dExt = (df.match(IMG_EXT) || [])[0] || '.jpg';
      const newDetail = `${prefix}_${String(num).padStart(2,'0')}_${String(i+1).padStart(2,'0')}${dExt}`;
      try { fs.copyFileSync(path.join(detailDir, df), path.join(DETAIL_OUT, newDetail)); } catch(e) {}
      detailImgs.push(`img/product/detail/${newDetail}`);
    });

    products.push({ id, name, vol: extractVol(name), cat, moq, tags, thumb: newThumb, detailImgs: detailImgs.length ? detailImgs : undefined });
    id++;
  });
});

// products-data.js 생성
const lines = products.map(p => {
  const base = `  { id:${p.id}, name:'${p.name.replace(/'/g,"\\'")}', vol:'${p.vol}', cat:'${p.cat}', moq:${p.moq}, tags:${JSON.stringify(p.tags)}, thumb:'${p.thumb}'`;
  const detail = p.detailImgs ? `, detailImgs:${JSON.stringify(p.detailImgs)}` : '';
  return base + detail + ' }';
});

const output = `// AUTO GENERATED — do not edit manually
// Generated: ${new Date().toISOString()}

const CAT_LABEL = {
  all:'전체',
  'metal-pen':'메탈볼펜',
  pen:'일반볼펜',
  tumbler:'텀블러',
  ceramic:'세라믹',
  kids:'키즈',
  bottle:'물병·보틀',
  shaker:'쉐이킷',
  cookware:'주방용품',
  giftset:'기프트세트',
};

const PRODUCTS = [
${lines.join(',\n')}
];
`;

fs.writeFileSync('./js/products-data.js', output, 'utf8');
console.log(`완료: ${products.length}개 상품 등록`);
products.forEach(p => console.log(`  [${p.id}] ${p.name} (${p.cat})`));
