import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import * as functions from "firebase-functions";
import { CreateVotingDto } from "../dtos/votings";
import * as express from "express";
import { createVoting, getVoting, getVotings } from "../services/voting";
import { findMeeting } from "../services/meetings";
import { Voting } from "../types";

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
  createVotingDto.date?.every((date) => {
    if (meeting.dates?.indexOf(date.date) === -1) {
      res.status(422).send({ message: "Invalid input" });
      return false;
    }
    return true;
  });
  // 선택한 날짜가 모임 날짜에 포함되어 있는지 확인 : meal
  createVotingDto.meal?.every((date) => {
    if (meeting.dates?.indexOf(date.date) === -1) {
      res.status(422).send({ message: "Invalid input" });
      return false;
    }
    return true;
  });

  // 유저네임 중복 체크
  // const voting = await getVotings(meetingId, CreateVotingDto.name as string);
  // if (voting !== null) {
  //   return res.status(422).send({ message: "Duplicated User Name" });
  // }

  try {
    await validateOrReject(createVotingDto);
  } catch (errors) {
    res.status(422).send({ message: "Invalid input" });
    return;
  }

  const { userName } = await createVoting(meetingId, createVotingDto);

  return res.send(userName);
});

router.get("/:meetingId/voting", async (req, res) => {
  const { meetingId } = req.params;
  const { userName } = req.query;
  functions.logger.info("GET Meeting/Voting! userName =" + userName, {
    structuredData: true,
  });
  if (meetingId === undefined || meetingId.length === 0) {
    return res.status(404).send({ message: "Invalid input" });
  }

  const meeting = await findMeeting(meetingId);
  if (meeting === null) {
    return res.status(404).send({ message: "Not found Meeting Info" });
  }

  let voting: {
    [key: string]: Voting;
  } | null = await getVotings(meetingId, userName as string);

  if (voting === null) {
    return res.status(404).send({ message: "Not found Voting Info" });
  }

  const parsed = Object.entries(voting).map(([key, value]) => {
    return { key: key, ...value };
  });
  return res.send(parsed);
});

router.get("/:meetingId/voting/:votingId", async (req, res) => {
  const { meetingId, votingId } = req.params;
  functions.logger.info("put Meeting/Voting! votingId =" + votingId, {
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

export default router;
