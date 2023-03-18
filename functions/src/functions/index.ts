import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import MeetingRouter from "./meeting";

import UserRouter from "./user";

const corsMiddleware = cors({ origin: process.env.CORS_ORIGIN });

const app = express();

app.use(corsMiddleware);

app.use("/meetings", MeetingRouter);
app.use("/meetings", UserRouter);

export const v1 = functions.https.onRequest(app);
