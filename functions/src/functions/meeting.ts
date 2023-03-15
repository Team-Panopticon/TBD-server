import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import * as functions from "firebase-functions";
import { CreateMeetingDto } from "../dtos/meetings";
import { createMeeting, findMeeting } from "../services/meetings";
import * as express from "express";

const router = express.Router();

router.get("/:meetingId", async (req, res) => {
  functions.logger.info("GET Meeting!", { structuredData: true });

  const { meetingId } = req.params;

  if (meetingId === undefined || meetingId.length === 0) {
    return res.status(404).send({ message: "Not found" });
  }

  const meeting = await findMeeting(meetingId);
  if (meeting === null) {
    return res.status(404).send({ message: "Not found" });
  }

  const { password, ...meetingWithoutPassword } = meeting;
  const meetingWithId = { id: meetingId, ...meetingWithoutPassword };

  // Return created meeting in proper format
  return res.send(meetingWithId);
});

router.post(`/`, async (req, res) => {
  functions.logger.info("POST Meeting!", { structuredData: true });

  const createMeetingDto = plainToInstance(CreateMeetingDto, req.body);

  try {
    await validateOrReject(createMeetingDto);
  } catch (errors) {
    res.status(422).send({ message: "Invalid input" });
    return;
  }

  // Call meetings service to create meeting
  const { password, ...createdMeetingWithoutPassword } = await createMeeting(createMeetingDto);

  // Return created meeting in proper format
  res.send(createdMeetingWithoutPassword);
});

router.put("/", (req, res) => {
  functions.logger.info("PUT Meeting!", { structuredData: true });

  // Stub
  res.send({
    name: "test",
    dates: [],
    types: "meal",
    status: "in progress",
  });
});

export default router;
