import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import * as functions from "firebase-functions";
import * as dotenv from "dotenv";

dotenv.config();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  const emailRef = ref(database, "email");

  onValue(
    emailRef,
    (snapshot) => {
      const data = snapshot.val();
      response.send(JSON.stringify(data));
    },
    (err) => {
      response.send("error");
    }
  );
});
