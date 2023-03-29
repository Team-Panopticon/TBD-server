import { CreateUserDto } from "../dtos/user";
import { UserModel } from "../model/User";
import { equalTo, orderByChild } from "firebase/database";
export const createUser = async (
  meetingId: string,
  { name, date = [], meal = [] }: CreateUserDto
) => {
  const userModel = new UserModel(meetingId);

  const createdUser = await userModel.create({
    name,
    votings: {
      date,
      meal,
    },
  });

  return createdUser;
};

export const getAllUser = async (meetingId: string) => {
  const userModel = new UserModel(meetingId);
  const meeting = await userModel.findAll();

  return meeting;
};

export const getUser = async (meetingId: string, name: string) => {
  const userModel = new UserModel(meetingId);
  const quries = [orderByChild("name")];
  if (name && name !== "") quries.push(equalTo(name));
  const meeting = await userModel.findAll(...quries);

  return meeting;
};
