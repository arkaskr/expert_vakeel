import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// Support both file-based (local) and environment variable-based (Vercel) authentication
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  // For Vercel/production: Use environment variable
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    console.log("Using Firebase credentials from environment variable");
  } catch (error) {
    console.error("Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:", error.message);
    process.exit(1);
  }
} else {
  // For local development: Use file
  const serviceAccountPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./serviceAccountKey.json";

  if (!fs.existsSync(serviceAccountPath)) {
    console.error(`Firebase service account file not found at ${serviceAccountPath}`);
    console.error("For Vercel deployment, set FIREBASE_SERVICE_ACCOUNT_KEY environment variable");
    process.exit(1);
  }

  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
  console.log("Using Firebase credentials from file:", serviceAccountPath);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

export { admin, db };