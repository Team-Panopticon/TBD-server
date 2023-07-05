import { CreateVotingDto } from '../dtos/votings';
import { VotingModel } from '../model/Voting';
import { equalTo, orderByChild } from 'firebase/database';
export const createVoting = async (
  meetingId: string,
  { username, dateType = [], mealType = [] }: CreateVotingDto,
) => {
  const votingModel = new VotingModel(meetingId);

  const createdVoting = await votingModel.create({
    username,
    dateType,
    mealType,
  });

  return createdVoting;
};

export const getVoting = async (meetingId: string, votingId: string) => {
  const votingModel = new VotingModel(meetingId);
  const voting = await votingModel.find(votingId);

  return voting;
};

export const getVotings = async (meetingId: string, username?: string) => {
  const votingModel = new VotingModel(meetingId);
  const quries = [orderByChild('username')];
  if (username && username !== '') quries.push(equalTo(username));
  const votings = await votingModel.findAll(...quries);

  return votings;
};

export const updateVoting = async (
  meetingId: string,
  votingId: string,
  { username, dateType = [], mealType = [] }: CreateVotingDto,
) => {
  const votingModel = new VotingModel(meetingId);

  const voting = await votingModel.update(votingId, {
    username,
    dateType,
    mealType,
  });

  return voting;
};
