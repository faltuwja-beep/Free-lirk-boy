const BOT_TOKEN = "8947190081:AAGVvCd0q-DEdeGX0nHeAelz8NtCPqkjGMs";
const GROUP_ID = "1003743119988";

// UID यहाँ बदल सकते हो
const UID = "4232090116";

export default async function handler(req, res) {
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

  const result = await response.json();

  return res.status(response.ok ? 200 : 500).json(result);
}
