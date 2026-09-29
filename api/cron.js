const BOT_TOKEN = "8947190081:AAFz4qNl_YYZEZA2kbzyMJgYsUKGNF8nUck";
const GROUP_ID = "-1003743119988";
const UID = "4232090116";

async function sendMessage(chatId, text) {
  const response = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text
      })
    }
  );

  return response.json();
}

export default async function handler(req, res) {

  // Telegram /test
  if (req.method === "POST") {
    const message = req.body?.message;

    if (message?.text?.trim() === "/test") {
      await sendMessage(
        message.chat.id,
        "✅ Online hu 🤖"
      );
    }

    return res.status(200).json({ ok: true });
  }

  // Browser test
  if (req.method === "GET") {
    return res.status(200).send("BOT ONLINE ✅");
  }

  return res.status(405).json({
    error: "Method not allowed"
  });
}
