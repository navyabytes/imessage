
import "dotenv/config";
import mongoose from "mongoose";
import { createClerkClient } from "@clerk/backend";
import User from "./src/models/user.model.js";

const USER_ID = "user_3Lu1JkMPdmW5Ptr2TQV8ZImviDW";

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

async function syncUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const clerkUser = await clerk.users.getUser(USER_ID);

    const email =
      clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      )?.emailAddress ??
      clerkUser.emailAddresses[0]?.emailAddress;

    const fullName =
      [clerkUser.firstName, clerkUser.lastName]
        .filter(Boolean)
        .join(" ") ||
      clerkUser.username ||
      email?.split("@")[0];

    if (!email || !fullName) {
      throw new Error("User email or name is missing");
    }

    const user = await User.findOneAndUpdate(
      { clerkId: clerkUser.id },
      {
        clerkId: clerkUser.id,
        email,
        fullName,
        profilePicture: clerkUser.imageUrl,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    console.log("User synced successfully!");
    console.log({
      clerkId: user.clerkId,
      email: user.email,
      fullName: user.fullName,
    });

  } catch (error) {
    console.error("Sync failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

syncUser();
