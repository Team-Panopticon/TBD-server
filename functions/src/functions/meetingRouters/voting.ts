import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import * as functions from "firebase-functions";
import { CreateVotingDto } from "../../dtos/votings";
import * as express from "express";
import {
  createVoting,
  getVoting,
  getVotings,
  updateVoting,
} from "../../services/voting";
import { findMeeting } from "../../services/meetings";
import { Voting } from "../../types";

const router = express.Router();

router.post(`/:meetingId/voting`, async (req, res) => {
  functions.logger.info("POST VOTING!", { structuredData: true });
  const { meetingId } = req.params;

  const meeting = await findMeeting(meetingId);
  if (meeting === null) {
    res.status(404).send({ message: "Not found Meeting Info" });
    return;
  }
  if (meeting.status === "done") {
    res.status(400).send({ message: "Meeting Already Closed" });
    return;
  }

  const createVotingDto = plainToInstance(CreateVotingDto, req.body);
  // 선택한 날짜가 모임 날짜에 포함되어 있는지 확인 : date
  createVotingDto.dateType?.every((date) => {
    if (meeting.dates?.indexOf(date.date) === -1) {
      res.status(422).send({ message: "Invalid input" });
      return false;
    }
    return true;
  });
  // 선택한 날짜가 모임 날짜에 포함되어 있는지 확인 : meal
  createVotingDto.mealType?.every((date) => {
    if (meeting.dates?.indexOf(date.date) === -1) {
      res.status(422).send({ message: "Invalid input" });
      return false;
    }
    return true;
  });

  try {
    await validateOrReject(createVotingDto);
  } catch (errors) {
    res.status(422).send({ message: "Invalid input" });
    return;
  }

  const { userName } = await createVoting(meetingId, createVotingDto);

  return res.send(userName);
});

router.get("/:meetingId/votings", async (req, res) => {
  const { meetingId } = req.params;
  const { userName } = req.query;
  functions.logger.info("GET Meeting/Voting! userName =" + userName, {
    structuredData: true,
  });
  if (meetingId === undefined || meetingId.length === 0) {
    return res.status(404).send({ message: "Invalid input" });
  }

  // 미팅이 존재하는지 검사
  const meeting = await findMeeting(meetingId);
  if (meeting === null) {
    return res.status(404).send({ message: "Not found Meeting Info" });
  }

  let votings: {
    [key: string]: Voting;
  } | null = await getVotings(meetingId, userName as string);

  if (votings === null) {
    return res.status(404).send({ message: "Not found Voting Info" });
  }

  const parsed = Object.entries(votings).map(([key, value]) => {
    return { id: key, ...value };
  });
  return res.send(parsed);
});

router.get("/:meetingId/votings/:votingId", async (req, res) => {
  const { meetingId, votingId } = req.params;
  functions.logger.info("GET Meeting/Voting! votingId =" + votingId, {
    structuredData: true,
  });
  if (
    (meetingId === undefined || meetingId.length === 0,
    votingId === undefined || votingId.length === 0)
  ) {
    return res.status(404).send({ message: "Invalid input" });
  }

  const Voting = await getVoting(meetingId, votingId);
  return res.send(Voting);
});

router.put("/:meetingId/votings/:votingId", async (req, res) => {
  const { meetingId, votingId } = req.params;
  functions.logger.info("PUT Meeting/Voting! votingId =" + votingId, {
    structuredData: true,
  });
  if (
    (meetingId === undefined || meetingId.length === 0,
    votingId === undefined || votingId.length === 0)
  ) {
    return res.status(404).send({ message: "Invalid input" });
  }

  const createVotingDto = plainToInstance(CreateVotingDto, req.body);
  const meeting = await findMeeting(meetingId);
  if (meeting === null) {
    res.status(404).send({ message: "Not found Meeting Info" });
    return;
  }
  if (meeting.status === "done") {
    res.status(400).send({ message: "Meeting Already Closed" });
    return;
  }
  // 선택한 날짜가 모임 날짜에 포함되어 있는지 확인 : date
  createVotingDto.dateType?.every((date) => {
    if (meeting.dates?.indexOf(date.date) === -1) {
      res.status(422).send({ message: "Invalid input" });
      return false;
    }
    return true;
  });
  // 선택한 날짜가 모임 날짜에 포함되어 있는지 확인 : meal
  createVotingDto.mealType?.every((date) => {
    if (meeting.dates?.indexOf(date.date) === -1) {
      res.status(422).send({ message: "Invalid input" });
      return false;
    }
    return true;
  });

  try {
    await validateOrReject(createVotingDto);
  } catch (errors) {
    res.status(422).send({ message: "Invalid input" });
    return;
  }
  const voting = await updateVoting(meetingId, votingId, createVotingDto);

  return res.send(voting);
});

export default router;
