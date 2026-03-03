#!/usr/bin/env node
/**
 * Generates firebase-config.js from .env
 * Run: node scripts/generate-firebase-config.js
 * Or: npm run build
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const outPath = path.join(__dirname, '..', 'firebase-config.js');

if (!fs.existsSync(envPath)) {
  console.error('Error: .env file not found. Copy .env.example to .env and fill in your Firebase config.');
  process.exit(1);
}

const env = Object.fromEntries(
  fs
    .readFileSync(envPath, 'utf8')
    .split('\n')
    .filter((line) => line.trim() && !line.trim().startsWith('#'))
    .map((line) => {
      const idx = line.indexOf('=');
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      return [key, value];
    })
);

const required = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
];
const missing = required.filter((k) => !env[k]);
if (missing.length) {
  console.error('Error: Missing in .env:', missing.join(', '));
  process.exit(1);
}

const config = `// Auto-generated from .env - do not edit directly
// Run: npm run build

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "${env.FIREBASE_API_KEY}",
    authDomain: "${env.FIREBASE_AUTH_DOMAIN}",
    projectId: "${env.FIREBASE_PROJECT_ID}",
    storageBucket: "${env.FIREBASE_STORAGE_BUCKET}",
    messagingSenderId: "${env.FIREBASE_MESSAGING_SENDER_ID}",
    appId: "${env.FIREBASE_APP_ID}",
    measurementId: "${env.FIREBASE_MEASUREMENT_ID || ''}"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, db };
`;

fs.writeFileSync(outPath, config);
console.log('Generated firebase-config.js from .env');