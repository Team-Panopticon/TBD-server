import * as express from 'express';
import MeetingRouter from './meeting';
import VotingRouter from './voting';

const router = express.Router();
router.use(VotingRouter, MeetingRouter);

export default router;
