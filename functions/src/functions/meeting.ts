import * as functions from "firebase-functions";
import { MeetingModel } from "../model/Meeting";

// NOTE: Meeting 생성 샘플

export const createMeeting2 = functions.https.onRequest(async (request, response) => {
  functions.logger.info("create Meeting!", { structuredData: true });

  try {
    const Meeting = new MeetingModel();

    const result = await Meeting.create({
      name: "test",
      dates: [],
      types: "meal",
      status: "in progress",
    });

    response.send(result);
  } catch (err) {
    response.send(err);
  }
});

export const createMeeting3 = functions.https.onRequest(async (request, response) => {
  functions.logger.info("create Meeting!", { structuredData: true });

  try {
    const Meeting = new MeetingModel();

    const result = await Meeting.create({
      name: "test",
      dates: [],
      types: "meal",
      status: "in progress",
    });

    response.send(result);
  } catch (err) {
    response.send(err);
  }
});
