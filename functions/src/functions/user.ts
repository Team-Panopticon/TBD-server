import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import * as functions from "firebase-functions";
import { CreateUserDto } from "../dtos/user";
import * as express from "express";
import { createUser, getAllUser } from "../services/user";
import { findMeeting } from "../services/meetings";

const router = express.Router();

router.post(`/:meetingId/voting`, async (req, res) => {
  functions.logger.info("POST USER!", { structuredData: true });
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

  const createUserDto = plainToInstance(CreateUserDto, req.body);
  // 선택한 날짜가 모임 날짜에 포함되어 있는지 확인 : date
  createUserDto.date?.every((date) => {
    if (meeting.dates?.indexOf(date.date) === -1) {
      res.status(422).send({ message: "Invalid input" });
      return false;
    }
    return true;
  });
  // 선택한 날짜가 모임 날짜에 포함되어 있는지 확인 : meal
  createUserDto.meal?.every((date) => {
    if (meeting.dates?.indexOf(date.date) === -1) {
      res.status(422).send({ message: "Invalid input" });
      return false;
    }
    return true;
  });

  try {
    await validateOrReject(createUserDto);
  } catch (errors) {
    res.status(422).send({ message: "Invalid input" });
    return;
  }

  const { name } = await createUser(meetingId, createUserDto);

  res.send(name);
});

router.options("/", (req, res) => {
  functions.logger.info("OPTIONS USER!", { structuredData: true });

  res.status(204).send();
});

router.get("/:meetingId/voting", async (req, res) => {
  const { meetingId } = req.params;
  const { name } = req.query;
  functions.logger.info("GET Meeting/Voting! name =" + name, {
    structuredData: true,
  });
  if (meetingId === undefined || meetingId.length === 0) {
    return res.status(404).send({ message: "Invalid input" });
  }

  const meeting = await findMeeting(meetingId);
  if (meeting === null) {
    return res.status(404).send({ message: "Not found Meeting Info" });
  }

  const voting = await getAllUser(meetingId, name as string);
  if (voting === null) {
    return res.status(404).send({ message: "Not found Voting Info" });
  }
  return res.send(voting);
});

export default router;
