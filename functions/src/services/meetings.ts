import { MeetingModel } from '../model/Meeting';
import { createHash } from 'crypto';
import { CreateMeetingDto } from '../dtos/meetings';

const meetingModel = new MeetingModel();

export const createMeeting = async ({ name, dates, type, deadline, password }: CreateMeetingDto) => {
  let passwordHash = undefined;
  
  if(password !== undefined) {
    passwordHash = createHash('sha256').update(password).digest('hex');
  }
  
  const createdMeeting = await meetingModel.create({
    name,
    dates,
    type,
    status: 'in progress',
    deadline,
    ...(password ? { password: passwordHash } : {})
  });

  return createdMeeting;
}

export const findMeeting = async (meetingId: string) => {
  const meeting = await meetingModel.find(meetingId);
  
  return meeting;
}
