import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import MeetingRouters from "./meetingRouters";

const corsMiddleware = cors({ origin: process.env.CORS_ORIGIN });

const app = express();

app.use(corsMiddleware);

app.use("/meetings", MeetingRouters);

export const v1 = functions.https.onRequest(app);
