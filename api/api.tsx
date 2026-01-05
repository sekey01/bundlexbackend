import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ error: "Missing data" });
  }

  try {
    await axios.post(
      "https://apps.mnotify.net/smsapi",
      {
        key: process.env.MNOTIFY_KEY,
        to: to,
        msg: message,
        sender_id: "MealMate",
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.status(200).json({ success: true }); 
  } catch (error) {
    return res.status(500).json({ error: "SMS failed: " + error });
  }
}
