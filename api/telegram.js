export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const update = req.body;
  const message = update?.message;

  if (!message?.text) {
    return res.status(200).json({ ok: true });
  }

  const chatId = message.chat.id;
  const text = message.text.trim();

  // Commands
  const parts = text.split(/\s+/);
  const command = parts[0].toLowerCase();

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const botToken = process.env.BOT_TOKEN;

  if (!redisUrl || !redisToken || !botToken) {
    return res.status(500).json({ error: "Environment variables missing" });
  }

  async function redis(command) {
    const response = await fetch(redisUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redisToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(command)
    });

    return await response.json();
  }

  async function send(text) {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text
      })
    });
  }

  // /set ind UID
  if (command === "/set") {
    if (parts.length !== 3 || parts[1].toLowerCase() !== "ind") {
      await send("❌ Format:\n/set ind UID");
      return res.status(200).json({ ok: true });
    }

    const uid = parts[2];

    if (!/^\d+$/.test(uid)) {
      await send("❌ UID केवल numbers में होना चाहिए।");
      return res.status(200).json({ ok: true });
    }

    await redis(["SADD", "like_uids", uid]);

    await send(
      `✅ UID add हो गया!\n\n🌍 Region: ind\n🆔 UID: ${uid}\n\n⏰ रोज़ 5:00 AM पर /like ind ${uid} भेजा जाएगा।`
    );

    return res.status(200).json({ ok: true });
  }

  // /remove ind UID
  if (command === "/remove") {
    if (parts.length !== 3 || parts[1].toLowerCase() !== "ind") {
      await send("❌ Format:\n/remove ind UID");
      return res.status(200).json({ ok: true });
    }

    const uid = parts[2];

    await redis(["SREM", "like_uids", uid]);

    await send(`🗑️ UID remove कर दिया गया:\n${uid}`);

    return res.status(200).json({ ok: true });
  }

  // /list
  if (command === "/list") {
    const result = await redis(["SMEMBERS", "like_uids"]);
    const uids = result.result || [];

    if (uids.length === 0) {
      await send("📋 अभी कोई UID saved नहीं है।");
      return res.status(200).json({ ok: true });
    }

    let msg = "📋 Saved UIDs:\n\n";

    uids.forEach((uid, index) => {
      msg += `${index + 1}. ${uid}\n`;
    });

    await send(msg);

    return res.status(200).json({ ok: true });
  }

  if (command === "/start") {
    await send(
      "🤖 Like Bot Ready!\n\n" +
      "/set ind UID - UID add करें\n" +
      "/remove ind UID - UID हटाएँ\n" +
      "/list - सभी UID देखें"
    );

    return res.status(200).json({ ok: true });
  }

  return res.status(200).json({ ok: true });
}
