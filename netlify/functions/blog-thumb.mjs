/* ============================================================
   /api/blog-thumb?u=... — 블로그 대표사진 중계 (예비용)
   네이버 이미지가 외부 사이트에서 바로 안 열릴 때만 사용됨.
   네이버 이미지 주소(pstatic.net)만 허용, CDN에 7일 캐시.
   ============================================================ */
export default async (req) => {
  const u = new URL(req.url).searchParams.get('u') || '';
  let target;
  try { target = new URL(u); } catch { return new Response('bad url', { status: 400 }); }
  if (target.protocol !== 'https:' || !/(^|\.)pstatic\.net$/.test(target.hostname)) {
    return new Response('forbidden', { status: 403 });
  }
  const r = await fetch(target, { headers: { referer: 'https://blog.naver.com/' } });
  if (!r.ok) return new Response('not found', { status: 404 });
  return new Response(r.body, {
    headers: {
      'content-type': r.headers.get('content-type') || 'image/jpeg',
      'cache-control': 'public, max-age=86400',
      'netlify-cdn-cache-control': 'public, durable, s-maxage=604800',
    },
  });
};

export const config = { path: '/api/blog-thumb' };
