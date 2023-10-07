import { database } from "firebase-admin";

type Reference = database.Reference;
type Query = database.Query;

export type QueryFunction = (ref:Reference | Query) => Query;

export const orderByChild = (path:string) => (ref:Reference | Query) => {
  return ref.orderByChild(path)
}

export const equalTo = (value: number | string | boolean | null, key?:string) => (ref:Reference | Query) => {
  return ref.equalTo(value, key);
}

export const limitToFirst = (limit: number) => (ref: Reference | Query) => {
  return ref.limitToFirst(limit);
}