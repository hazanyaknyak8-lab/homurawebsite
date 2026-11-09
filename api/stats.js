// Vercel serverless proxy: lets the https site read the bot's http stats endpoint.
module.exports = async (req, res) => {
  try {
    const r = await fetch(process.env.BOT_STATS_URL, { signal: AbortSignal.timeout(5000) });
    const data = await r.json();
    res.setHeader("Cache-Control", "s-maxage=10, stale-while-revalidate=20");
    res.status(200).json(data);
  } catch (e) {
    res.status(502).json({ error: "bot offline" });
  }
};
