/* ============================================================
   /api/blog — 네이버 블로그 출고기 목록 (자동 연동)
   - RSS에서 "제작사례" 카테고리 글만 골라 제목·링크·날짜·대표사진을 JSON으로 반환
   - 대표사진은 각 글의 og:image(블로그 대표 이미지)를 사용
   - Netlify CDN에 1시간 캐시 → 함수 실행은 시간당 1번 수준 (크레딧 거의 안 씀)
   ============================================================ */
const BLOG_ID = 'alindamall';
const CATEGORY_KEYWORD = '제작사례'; // 카테고리 이름: "판촉물·홍보굿즈 제작사례"
const MAX_POSTS = 12;
const UA = 'Mozilla/5.0 (compatible; alinda.kr-blog-widget/1.0; +https://alinda.kr)';

function decode(s = '') {
  return s.trim()
    .replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .trim();
}
function tag(xml, name) {
  const m = xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]) : '';
}
function logNoOf(link) {
  const m = link.match(/\/(\d{9,})/) || link.match(/logNo=(\d+)/);
  return m ? m[1] : '';
}
async function ogImage(logNo) {
  try {
    const r = await fetch(`https://m.blog.naver.com/${BLOG_ID}/${logNo}`, { headers: { 'user-agent': UA } });
    if (!r.ok) return '';
    const html = await r.text();
    const m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
           || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    return m ? decode(m[1]).replace(/^http:/, 'https:') : '';
  } catch { return ''; }
}

export default async () => {
  try {
    const res = await fetch(`https://rss.blog.naver.com/${BLOG_ID}.xml`, { headers: { 'user-agent': UA } });
    if (!res.ok) throw new Error(`RSS ${res.status}`);
    const xml = await res.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => m[1]);

    const posts = items
      .map(it => {
        const link = tag(it, 'link').split('?')[0];
        const descImg = (tag(it, 'description').match(/<img[^>]+src=["']([^"']+)["']/i) || [])[1] || '';
        return {
          title: tag(it, 'title'),
          link,
          logNo: logNoOf(link),
          date: new Date(tag(it, 'pubDate')).toISOString(),
          category: tag(it, 'category'),
          thumb: descImg.replace(/^http:/, 'https:'),
        };
      })
      .filter(p => p.category.includes(CATEGORY_KEYWORD))
      .slice(0, MAX_POSTS);

    await Promise.all(posts.map(async p => {
      if (p.logNo) {
        const og = await ogImage(p.logNo);
        if (og) p.thumb = og;
      }
      p.proxy = p.thumb ? `/api/blog-thumb?u=${encodeURIComponent(p.thumb)}` : '';
    }));

    return new Response(JSON.stringify({ posts, updated: new Date().toISOString() }), {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=300',
        'netlify-cdn-cache-control': 'public, durable, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ posts: [], error: String(e.message || e) }), {
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
    });
  }
};

export const config = { path: '/api/blog' };
