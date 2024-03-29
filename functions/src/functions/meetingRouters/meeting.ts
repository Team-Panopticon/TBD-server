import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import * as functions from 'firebase-functions';
import { CreateMeetingDto, UpdateMeetingDto } from '../../dtos/meetings';
import { confirmMeeting, createMeeting, findMeeting, updateMeeting } from '../../services/meetings';
import * as express from 'express';
import { createHash } from 'crypto';
import { sign, verify } from 'jsonwebtoken';
import { VotingSlotDto } from '../../dtos/votings';

const router = express.Router();

router.post('/:meetingId/auth', async (req, res) => {
  functions.logger.info('Authorize Meeting', { structuredData: true });

  const { meetingId } = req.params;
  const meeting = await findMeeting(meetingId);

  if (!meeting) {
    return res.status(404).send({ message: 'Not found' });
  }

  const isPrivateMeeting = meeting.adminAccess === 'private';
  const password = req.body.password;
  const hashedPassword = isPrivateMeeting ? createHash('sha256').update(password).digest('hex') : undefined;

  if (meeting.password !== hashedPassword) {
    return res.status(401).send({ message: 'Authorization Failed' });
  }

  const token = sign(
    {
      id: meetingId,
    },
    process.env.JWT_SECRET_KEY as string,
  );

  return res.send({ token });
});

router.post('/:meetingId/confirm', async (req, res) => {
  functions.logger.info('Confirm Meeting!', { structuredData: true });

  const token = req.headers.authorization?.split('Bearer ')[1];

  const { meetingId } = req.params;
  if (!token || !meetingId) {
    return res.status(401).send({ message: 'Authorization Failed' });
  }

  const decodedToken = verify(token, process.env.JWT_SECRET_KEY as string);

  if (typeof decodedToken === 'string' || decodedToken.id !== meetingId) {
    return res.status(401).send({ message: 'Authorization Failed' });
  }

  const votingSlotDto = plainToInstance(VotingSlotDto, req.body);  
  try {
    await validateOrReject(votingSlotDto);
  } catch (errors) {
    return res.status(422).send({ message: 'Invalid input' });
  }

  await confirmMeeting(meetingId, votingSlotDto);

  return res.status(201).send();
});

router.get('/:meetingId', async (req, res) => {
  functions.logger.info('GET Meeting!', { structuredData: true });

  const { meetingId } = req.params;

  if (meetingId === undefined || meetingId.length === 0) {
    return res.status(404).send({ message: 'Not found' });
  }

  const meeting = await findMeeting(meetingId);
  if (meeting === null) {
    return res.status(404).send({ message: 'Not found' });
  }

  const { password, ...meetingWithoutPassword } = meeting;
  const meetingWithId = { id: meetingId, ...meetingWithoutPassword };

  return res.send(meetingWithId);
});

router.post(`/`, async (req, res) => {
  functions.logger.info('POST Meeting!', { structuredData: true });

  const createMeetingDto = plainToInstance(CreateMeetingDto, req.body);

  try {
    await validateOrReject(createMeetingDto);
  } catch (errors) {
    res.status(422).send({ message: 'Invalid input' });
    return;
  }

  // Call meetings service to create meeting
  const { password, ...createdMeetingWithoutPassword } = await createMeeting(createMeetingDto);

  res.status(201).send(createdMeetingWithoutPassword);
});

router.put('/:meetingId', async (req, res) => {
  functions.logger.info('PUT Meeting!', { structuredData: true });
  const { meetingId } = req.params;

  const meeting = await findMeeting(meetingId);
  if (meeting === null) {
    return res.status(404).send({ message: 'Not found' });
  }

  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).send({ message: 'Authorization Failed' });
  }

  const decodedToken = verify(token, process.env.JWT_SECRET_KEY as string);
  if (typeof decodedToken === 'string' || decodedToken.id !== meetingId) {
    return res.status(401).send({ message: 'Authorization Failed' });
  }

  const updateMeetingDto = plainToInstance(UpdateMeetingDto, req.body, { excludeExtraneousValues: true });

  try {
    await validateOrReject(updateMeetingDto);
  } catch (errors) {
    res.status(422).send({ message: 'Invalid input' });
    return;
  }

  await updateMeeting(meetingId, updateMeetingDto);
  const updatedMeeting = await findMeeting(meetingId);
  if (updatedMeeting === null) {
    return res.status(500).send({ message: 'Internal server error' });
  }

  const { password, ...meetingWithoutPassword } = updatedMeeting;
  const meetingWithId = { id: meetingId, ...meetingWithoutPassword };

  return res.status(200).send(meetingWithId);
});

export default router;