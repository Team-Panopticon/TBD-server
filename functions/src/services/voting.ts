import { CreateVotingDto } from "../dtos/votings";
import { VotingModel } from "../model/Voting";
import { equalTo, orderByChild } from "firebase/database";
export const createVoting = async (
  meetingId: string,
  { userName, dateType = [], mealType = [] }: CreateVotingDto
) => {
  const votingModel = new VotingModel(meetingId);

  const createdVoting = await votingModel.create({
    userName,
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

export const getVotings = async (meetingId: string, userName?: string) => {
  const votingModel = new VotingModel(meetingId);
  const quries = [orderByChild("userName")];
  if (userName && userName !== "") quries.push(equalTo(userName));
  const votings = await votingModel.findAll(...quries);

  return votings;
};

export const updateVoting = async (
  meetingId: string,
  votingId: string,
  { userName, dateType = [], mealType = [] }: CreateVotingDto
) => {
  const votingModel = new VotingModel(meetingId);

  const voting = await votingModel.update(votingId, {
    userName,
    dateType,
    mealType,
  });

  return voting;
};
