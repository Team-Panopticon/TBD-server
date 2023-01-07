import { Meeting } from "./../types";
import { Model } from "./Model";

export class MeetingModel extends Model<Meeting> {
  constructor() {
    super("meetings");
  }

  get path() {
    return `${this.prefixPath}`;
  }
}
