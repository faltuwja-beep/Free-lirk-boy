const BOT_TOKEN = "8947190081:AAFz4qNl_YYZEZA2kbzyMJgYsUKGNF8nUck";
const GROUP_ID = "-1003743119988";
const UID = "4232090116";

export default async function handler(req, res) {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: GROUP_ID,
          text: `/like ind ${UID}`
        })
      }
    );

    const data = await response.json();

    return res.status(response.ok ? 200 : 500).json(data);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}
