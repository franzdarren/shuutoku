// Vercel serverless function — production equivalent of the dev-only Vite
// proxy in vite.config.js. Same path (/api/jisho?keyword=...), same job:
// fetch Jisho.org server-side, where CORS doesn't apply, and hand the JSON
// back to the browser. src/lib/dictionary.js calls this exact path in both
// environments, so no client code needs to know which one is running.
//
// Runs on Vercel's Edge Runtime rather than a regional Node function —
// tested by hand: Jisho's own WAF returns 403 to Vercel's regional Node
// function IP ranges (confirmed reproducible), but not to the edge network.
export const config = { runtime: "edge" };

export default async function handler(req) {
  const keyword = new URL(req.url).searchParams.get("keyword") || "";
  if (!keyword) {
    return new Response(JSON.stringify({ error: "missing keyword" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const upstream = await fetch(
      "https://jisho.org/api/v1/search/words?keyword=" + encodeURIComponent(keyword)
    );
    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600", // dictionary results don't change
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "upstream fetch failed" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
