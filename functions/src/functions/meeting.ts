import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import * as functions from "firebase-functions";
import { CreateMeetingDto } from "../dtos/meetings";
import { createMeeting, findMeeting } from "../services/meetings";

const cors = require('cors')({ origin: process.env.CORS_ORIGIN });

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
      case 'OPTIONS':
        await optionsMeeting(request, response);
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

  cors(request, response, async () => {
    const meetingId = request.path.split('/').pop();
    if (meetingId === undefined || meetingId.length === 0) {
      return response.status(404).send({ message: "Not found" });
    }
    
    const meeting = await findMeeting(meetingId);
    if (meeting === null) {
      return response.status(404).send({ message: "Not found" });
    }

    const { password, ...meetingWithoutPassword } = meeting;
    const meetingWithId = {  id: meetingId, ...meetingWithoutPassword };

    // Return created meeting in proper format
    return response.send(meetingWithId);
  })
}

const postMeeting = async (request: functions.https.Request, response: functions.Response) => {
  functions.logger.info("POST Meeting!", { structuredData: true });
  // CORS middleware
  cors(request, response, async () => {
  
    // Input validation
  const createMeetingDto = plainToInstance(CreateMeetingDto, request.body);

  try {
    await validateOrReject(createMeetingDto);
  } catch (errors) {
    response.status(422).send({ message: "Invalid input" });
    return;
  }

  // Call meetings service to create meeting
  const { password, ...createdMeetingWithoutPassword } = await createMeeting(createMeetingDto);

  // Return created meeting in proper format
  response.send(createdMeetingWithoutPassword);
  })
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

const optionsMeeting = async (request: functions.https.Request, response: functions.Response) => {
  functions.logger.info("OPTIONS Meeting!", { structuredData: true });
  
  cors(request, response, () => {
    response.status(204).send();
  })
}
