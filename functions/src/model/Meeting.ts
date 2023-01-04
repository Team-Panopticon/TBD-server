import { Meeting } from "./../types";
import { Model } from "./Model";

export class MeetingModel extends Model<Meeting> {
  prefixPath = "meetings";

  get path() {
    return `${this.prefixPath}`;
  }
}
