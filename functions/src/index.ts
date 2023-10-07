import * as dotenv from 'dotenv';
dotenv.config();
import { initializeApp } from 'firebase/app';
import { initializeApp as initializeAdmin } from 'firebase-admin/app';

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: `${process.env.PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.PROJECT_ID,
  storageBucket: `${process.env.PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  databaseURL: process.env.DATABASE_URL,
  appId: process.env.APP_ID,
  // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
  // measurementId: "G-MEASUREMENT_ID",
};

initializeApp(firebaseConfig);

/** 로컬에서 돌릴 떄 필요 */
// const serviceAccount = require('../path-to-service-account.json');
initializeAdmin({
  // credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
});

export * from './functions';
