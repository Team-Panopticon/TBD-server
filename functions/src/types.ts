type Meal = "lunch" | "dinner";
export type ISODateTime = string;
export type WithId<T> = T & { id: string };

export type Meeting = {
  name: string;
  dates: ISODateTime[];
  type: "date" | "meal";
  status: "in progress" | "done";
  deadline: ISODateTime;
  selectedDate?: {
    date: string;
    meal: Meal;
  };
  password?: string; // sha256 hashed value in database
};

export type User = {
  name: string;
  votings: Votings;
};

type Votings = {
  date: Vote[];
  meal: Vote[];
};

type Vote = {
  date: string;
  meal?: Meal;
};

export type CreateMeetingDto = Pick<Meeting, 'name' | 'dates' | 'type' | 'deadline' | 'password'>
