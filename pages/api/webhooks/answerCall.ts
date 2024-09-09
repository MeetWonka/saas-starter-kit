import type { NextApiRequest, NextApiResponse } from 'next';
import { Vonage } from '@vonage/server-sdk';
import base64 from 'base-64';

export default function answerWebhook(req: NextApiRequest, res: NextApiResponse) {
    const VONAGE_API_KEY = process.env.VONAGE_API_KEY;
    const VONAGE_API_SECRET = process.env.VONAGE_API_SECRET;
    const VONAGE_BRAND_NAME = process.env.VONAGE_BRAND_NAME;
  const encodedKey = process.env.VONAGE_PRIVATE_KEY_BASE64;
  if (!encodedKey) {
    return res.status(500).json({ error: "VONAGE_PRIVATE_KEY_BASE64 is not set in the environment" });
  }

  const privateKey = base64.decode(encodedKey);
  const applicationId = process.env.VONAGE_APPLICATION_ID || '';
  const baseUrl = process.env.BASE_URL || '';

  if (!applicationId || !baseUrl) {
    return res.status(500).json({ error: "VONAGE_APPLICATION_ID or BASE_URL is not set in the environment" });
  }

  const vonage = new Vonage({
    applicationId: applicationId,
    privateKey: privateKey,
  });

  const ncco = [
    {
      action: "talk",
      text: "Bonjour, veuillez laisser un message après le signal sonore.",
      language: "fr-FR",
      style: 4
    },
    {
      action: "record",
      endOnSilence: "10",
      eventUrl: [`${process.env.BASE_URL}/api/webhooks/recording`],
      beepStart: "true"
    },
    // Wait five minutes (use a placeholder action here)
  ];

  res.status(200).json(ncco);
}