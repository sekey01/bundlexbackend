import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const provider = Array.isArray(req.query.provider)
    ? req.query.provider[0]
    : req.query.provider;

  if (!provider || typeof provider !== "string") {
    return res.status(400).json({
      error: "Missing or invalid provider parameter"
    });
  }

  if (!process.env.MAC_API_KEY) {
    return res.status(500).json({
      error: "Server configuration error: API key not found"
    });
  }

  try {
    const response = await axios.get(
      `https://reseller.macelectronics.net/api/v1/partner/offers?provider=${provider}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MAC_API_KEY}`,
        },
      }
    );

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      return res.status(403).json({
        error: "Authorization failed. Invalid API key.",
      });
    }

    return res.status(500).json({
      error: "Failed to fetch offers. Please try again later.",
    });
  }
}
