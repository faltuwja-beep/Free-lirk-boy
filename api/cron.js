export default async function handler(req, res) {
  const cronSecret = process.env.CRON_SECRET;

  if (
    cronSecret &&
    req.headers.authorization !== `Bearer ${cronSecret}`
  ) {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const botToken = process.env.BOT_TOKEN;
  const groupId = process.env.GROUP_CHAT_ID;

  if (!redisUrl || !redisToken || !botToken || !groupId) {
    return res.status(500).json({
      error: "Environment variables missing"
    });
  }

  // Get all saved UIDs
  const redisResponse = await fetch(redisUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redisToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(["SMEMBERS", "like_uids"])
  });

  const redisData = await redisResponse.json();
  const uids = redisData.result || [];

  const results = [];

  // Send /like command for every UID
  for (const uid of uids) {
    const command = `/like ind ${uid}`;

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: groupId,
          text: command
        })
      }
    );

    results.push({
      uid,
      sent: response.ok
    });
  }

  return res.status(200).json({
    success: true,
    count: uids.length,
    results
  });
}
