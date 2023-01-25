import { MeetingModel } from '../model/Meeting';
import { CreateMeetingDto } from '../types'

const meetingModel = new MeetingModel();

export const createMeeting = async ({ name, dates, type, deadline, password }: CreateMeetingDto) => {
  const createdMeeting = await meetingModel.create({
    name,
    dates,
    type,
    status: 'in progress',
    deadline,
  });

  return createdMeeting;
}
