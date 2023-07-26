export type Meal = 'lunch' | 'dinner';
/** ISO8601 DateTime 형식 */
export type ISODateTime = string;
export type WithId<T> = T & { id: string };
export enum MeetingType {
  dateType = 'dateType',
  mealType = 'mealType',
}
export type Meeting = {
  name: string;
  /** ISO8601 DateTime 형식의 목록 */
  dates: ISODateTime[];
  type: MeetingType;
  status: 'in progress' | 'done';
  password?: string; // sha256 hashed value in database
  confirmedDateType?: Slot;
};

export type Voting = {
  username: string;
  dateType: Slot[];
  mealType: Slot[];
};

export type Slot = {
  date: string;
  meal?: Meal;
};
