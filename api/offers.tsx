import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { provider } = req.query;

  if (!provider) {
    return res
      .status(400)
      .json({ error: "Missing data, No provider specified" });
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
    return res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      return res.status(403).json({
        error:
          "Authorization failed: Invalid or missing MAC_API_KEY. Please check your API credentials.",
      });
    }
    return res.status(500).json({ error: "Failed to fetch offers: " + error });
  }
}

//Error 500 means : Internal Server Error
//Error 400 means : Bad Request
//Error 405 means : Method Not Allowed
