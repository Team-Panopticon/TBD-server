export type Meal = "lunch" | "dinner";
/** ISO8601 DateTime 형식 */
export type ISODateTime = string;
export type WithId<T> = T & { id: string };

export type Meeting = {
  name: string;
  /** ISO8601 DateTime 형식의 목록 */
  dates: ISODateTime[];
  type: "date" | "meal";
  status: "in progress" | "done";
  /** ISO8601 DateTime 형식 */
  deadline: ISODateTime;
  selectedDate?: {
    date: string;
    meal: Meal;
  };
  password?: string; // sha256 hashed value in database
};

export type Voting = {
  userName: string;
  date: Vote[];
  meal: Vote[];
};

export type VotingDatas = {
  date: Vote[];
  meal: Vote[];
};

export type Vote = {
  date: string;
  meal?: Meal;
};
