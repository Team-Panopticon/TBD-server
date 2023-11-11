import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import MeetingRouters from './meetingRouters';

const corsMiddleware = cors();

const app = express();

app.use(corsMiddleware);

app.use('/meetings', MeetingRouters);

// Stub API for preventing cold start
app.get('/warmer', (req, res) => {
  res.send('Warming cloud functions instance')
})

export const v1 = functions.https.onRequest(app);
export const dev = v1;
