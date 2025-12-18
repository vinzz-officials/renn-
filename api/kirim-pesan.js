// api/kirim-pesan.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { pesan } = req.body;

  if (!pesan) return res.status(400).json({ error: "Pesan kosong" });

  const TELEGRAM_BOT_TOKEN = process.env.token_renn;
  const TELEGRAM_CHAT_ID = process.env.id_renn;

  try {
    const telegramRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: pesan
      })
    });

    const data = await telegramRes.json();

    if (!telegramRes.ok || !data.ok) {
      return res.status(500).json({ error: data.description || "Gagal kirim ke Telegram" });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
