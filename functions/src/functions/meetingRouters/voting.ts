import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import * as functions from 'firebase-functions';
import { CreateVotingDto } from '../../dtos/votings';
import * as express from 'express';
import { createVoting, getVoting, getVotings, updateVoting } from '../../services/voting';
import { findMeeting } from '../../services/meetings';
import { Meeting, Voting } from '../../types';

const router = express.Router();

router.post(`/:meetingId/voting`, async (req, res) => {
  functions.logger.info('POST VOTING!', { structuredData: true });
  const { meetingId } = req.params;

  const meeting = await findMeeting(meetingId);
  if (meeting === null) {
    res.status(404).send({ message: 'Not found Meeting Info' });
    return;
  }
  if (meeting.status === 'done') {
    res.status(400).send({ message: 'Meeting Already Closed' });
    return;
  }

  const createVotingDto = plainToInstance(CreateVotingDto, req.body);

  // 유효성 검사
  if (isValidateMeetingInput(createVotingDto, meeting) === false) {
    return res.status(422).send({
      message: 'Invalid input, Selected Date not included in Meeting',
    });
  }

  const createdVoting = await createVoting(meetingId, createVotingDto);

  return res.status(201).send(createdVoting);
});

router.get('/:meetingId/votings', async (req, res) => {
  const { meetingId } = req.params;
  const { username } = req.query;
  functions.logger.info('GET Meeting/Voting! username =' + username, {
    structuredData: true,
  });
  if (meetingId === undefined || meetingId.length === 0) {
    return res.status(404).send({ message: 'Invalid input' });
  }

  // 미팅이 존재하는지 검사
  const meeting = await findMeeting(meetingId);
  if (meeting === null) {
    return res.status(404).send({ message: 'Not found Meeting Info' });
  }

  let votings: {
    [key: string]: Voting;
  } = (await getVotings(meetingId, username as string)) ?? {};

  const parsed = Object.entries(votings).map(([key, value]) => {
    return { id: key, ...value };
  });
  return res.send(parsed);
});

router.get('/:meetingId/votings/:votingId', async (req, res) => {
  const { meetingId, votingId } = req.params;
  functions.logger.info('GET Meeting/Voting! votingId =' + votingId, {
    structuredData: true,
  });
  if (
    meetingId === undefined ||
    meetingId.length === 0 ||
    votingId === undefined ||
    votingId.length === 0
  ) {
    return res.status(422).send({ message: 'Invalid input' });
  }

  const Voting = await getVoting(meetingId, votingId);
  return res.send(Voting);
});

router.put('/:meetingId/votings/:votingId', async (req, res) => {
  const { meetingId, votingId } = req.params;
  functions.logger.info('PUT Meeting/Voting! votingId =' + votingId, {
    structuredData: true,
  });
  if (
    meetingId === undefined ||
    meetingId.length === 0 ||
    votingId === undefined ||
    votingId.length === 0
  ) {
    return res.status(422).send({ message: 'Invalid input' });
  }

  const createVotingDto = plainToInstance(CreateVotingDto, req.body);
  const meeting = await findMeeting(meetingId);
  if (meeting === null) {
    res.status(404).send({ message: 'Not found Meeting Info' });
    return;
  }
  if (meeting.status === 'done') {
    res.status(400).send({ message: 'Meeting Already Closed' });
    return;
  }

  // 유효성 검사
  if (isValidateMeetingInput(createVotingDto, meeting) === false) {
    return res.status(422).send({
      message: 'Invalid input, Selected Date not included in Meeting',
    });
  }

  try {
    await validateOrReject(createVotingDto);
  } catch (errors) {
    res.status(422).send({ message: 'Invalid input' });
    return;
  }
  const voting = await updateVoting(meetingId, votingId, createVotingDto);

  return res.send(voting);
});

export default router;

// validation 함수들의 위치 고민
const isValidateMeetingInput = (createVotingDto: CreateVotingDto, meeting: Meeting) => {
  // 선택한 날짜가 모임 날짜에 포함되어 있는지 확인 : date
  const isValidDate =
    createVotingDto.dateType === undefined ||
    createVotingDto.dateType.every((date) => {
      return meeting.dates?.includes(date.date);
    });
  // 선택한 날짜가 모임 날짜에 포함되어 있는지 확인 : meal
  const isValidMeal =
    createVotingDto.mealType === undefined ||
    createVotingDto.mealType.every((date) => {
      return meeting.dates?.includes(date.date);
    });
  return isValidDate && isValidMeal;
};
