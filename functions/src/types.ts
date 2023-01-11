type Meal = "lunch" | "dinner";

export type Meeting = {
  name: string;
  dates: string[];
  types: "date" | "meal";
  status: "in progress" | "done";
  selectedDate?: {
    date: string;
    meal: Meal;
  };
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
