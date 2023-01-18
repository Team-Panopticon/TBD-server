import * as functions from "firebase-functions";
// import { MeetingModel } from "../model/Meeting";

// NOTE: Meeting 생성 샘플
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

export const getMeeting = async (request: functions.https.Request, response: functions.Response) => {
  functions.logger.info("GET Meeting!", { structuredData: true });
  // Stub
  response.send({
    name: "test",
    dates: [],
    types: "meal",
    status: "in progress",
  })
}

export const postMeeting = async (request: functions.https.Request, response: functions.Response) => {
  functions.logger.info("POST Meeting!", { structuredData: true });
  // Stub
  response.send({
    name: "test",
    dates: [],
    types: "meal",
    status: "in progress",
  })
}

export const putMeeting = async (request: functions.https.Request, response: functions.Response) => {
  functions.logger.info("PUT Meeting!", { structuredData: true });
  // Stub 
  response.send({
    name: "test",
    dates: [],
    types: "meal",
    status: "in progress",
  })
}
