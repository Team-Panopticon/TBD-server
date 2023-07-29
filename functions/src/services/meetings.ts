import { MeetingModel } from '../model/Meeting';
import { createHash } from 'crypto';
import { CreateMeetingDto, UpdateMeetingDto } from '../dtos/meetings';
import { VotingSlotDto } from '../dtos/votings';

const meetingModel = new MeetingModel();

export const createMeeting = async ({ name, dates, type, password }: CreateMeetingDto) => {
  let passwordHash = undefined;

  if (password !== undefined) {
    passwordHash = createHash('sha256').update(password).digest('hex');
  }

  const createdMeeting = await meetingModel.create({
    name,
    dates,
    type,
    status: 'in progress',
    // HACK: Firebase does not accept object with undefined value
    // Don't add 'password' key in object when password is undefined
    ...(password ? { password: passwordHash } : {}),
  });

  return createdMeeting;
};

export const updateMeeting = async (meetingId: string, { name, dates, type }: UpdateMeetingDto) => {
  const updatedMeeting = await meetingModel.update(meetingId, {
    name,
    dates,
    type,
  });

  return updatedMeeting;
}

export const findMeeting = async (meetingId: string) => {
  const meeting = await meetingModel.find(meetingId);

  return meeting;
};

export const confirmMeeting = async (meetingId: string, votingSlotDto: VotingSlotDto) => {
  await meetingModel.update(meetingId, { confirmedDateType: votingSlotDto, status: 'done' });
};
