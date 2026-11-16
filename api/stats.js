// Vercel serverless proxy: lets the https site read the bot's http stats endpoint.
// BOT_STATS_URL = http://YOUR_BOT_IP:9076/api/stats
module.exports = async (req, res) => {
  try {
    const r = await fetch(process.env.BOT_STATS_URL, { signal: AbortSignal.timeout(6000), cache: "no-store" });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const data = await r.json();
    res.setHeader("Cache-Control", "s-maxage=3, stale-while-revalidate=6");
    res.status(200).json(data);
  } catch (e) {
    res.setHeader("Cache-Control", "no-store");
    res.status(502).json({ error: "bot offline" });
  }
};
