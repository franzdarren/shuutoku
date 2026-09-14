// Vercel serverless function — production equivalent of the dev-only Vite
// proxy in vite.config.js. Same path (/api/jisho?keyword=...), same job:
// fetch Jisho.org server-side, where CORS doesn't apply, and hand the JSON
// back to the browser. src/lib/dictionary.js calls this exact path in both
// environments, so no client code needs to know which one is running.
export default async function handler(req, res) {
  const keyword = typeof req.query.keyword === "string" ? req.query.keyword : "";
  if (!keyword) {
    res.status(400).json({ error: "missing keyword" });
    return;
  }

  try {
    const upstream = await fetch(
      "https://jisho.org/api/v1/search/words?keyword=" + encodeURIComponent(keyword)
    );
    const body = await upstream.text();
    res.status(upstream.status);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600"); // dictionary results don't change
    res.send(body);
  } catch {
    res.status(502).json({ error: "upstream fetch failed" });
  }
}
