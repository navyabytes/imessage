
import express from "express";
import User from "../models/user.model.js";
import { verifyWebhook } from "@clerk/backend/webhooks";

const router = express.Router();

router.post("/", async (req, res) => {
  const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!signingSecret) {
    return res.status(503).json({ message: "Webhook secret is not provided" });
  }

  try {
    if (!Buffer.isBuffer(req.body)) {
      return res.status(400).json({ message: "Raw webhook body is missing" });
    }

    const request = new Request("http://internal/webhooks/clerk", {
      method: "POST",
      headers: new Headers(req.headers),
      body: req.body.toString("utf8"),
    });

    const evt = await verifyWebhook(request, { signingSecret });

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const u = evt.data;

      const email =
        u.email_addresses?.find(
          (e) => e.id === u.primary_email_address_id
        )?.email_address ??
        u.email_addresses?.[0]?.email_address;

      const fullName =
        [u.first_name, u.last_name].filter(Boolean).join(" ") ||
        u.username ||
        email?.split("@")[0];

      if (!email || !fullName) {
        return res.status(400).json({ message: "User email or name is missing" });
      }

      await User.findOneAndUpdate(
        { clerkId: u.id },
        {
          clerkId: u.id,
          email,
          fullName,
          profilePicture: u.image_url,
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    if (evt.type === "user.deleted" && evt.data.id) {
      await User.findOneAndDelete({ clerkId: evt.data.id });
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Clerk webhook processing error:", error);

    if (error.message?.toLowerCase().includes("signature") ||
        error.message?.toLowerCase().includes("webhook")) {
      return res.status(400).json({ message: "Webhook verification failed" });
    }

    return res.status(500).json({ message: "Webhook processing failed" });
  }
});

export default router;
