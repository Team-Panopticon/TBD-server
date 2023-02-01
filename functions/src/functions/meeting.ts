import * as functions from "firebase-functions";
import { createMeeting } from "../services/meetings";
import { CreateMeetingDto } from "../types";

export const meetings = functions.https.onRequest(async (request, response) => {
  try {
    switch (request.method) {
      case 'GET':
        await getMeeting(request, response);
        break;
      case 'POST':
        await postMeeting(request, response);
        break;
      case 'PUT':
        await putMeeting(request, response);
        break;
      default:
        response.status(405).send('Method Not Allowed');
        break;
    }
  } catch (error) {
    response.send(error);
  }
})

const getMeeting = async (request: functions.https.Request, response: functions.Response) => {
  functions.logger.info("GET Meeting!", { structuredData: true });
  // Stub
  response.send({
    name: "test",
    dates: [],
    types: "meal",
    status: "in progress",
  })
}

const postMeeting = async (request: functions.https.Request, response: functions.Response) => {
  functions.logger.info("POST Meeting!", { structuredData: true });
  // Input validation
  const createMeetingDto = request.body as CreateMeetingDto;

  // Call meetings service to create meeting
  const createdMeeting = await createMeeting(createMeetingDto);

  // Return created meeting in proper format
  response.send(createdMeeting)
}

const putMeeting = async (request: functions.https.Request, response: functions.Response) => {
  functions.logger.info("PUT Meeting!", { structuredData: true });
  // Stub 
  response.send({
    name: "test",
    dates: [],
    types: "meal",
    status: "in progress",
  })
}
