import { User } from "./../types";
import { Model } from "./Model";

export class UserModel extends Model<User> {
  constructor(public meetingId: string) {
    super("users");
  }

  protected get path() {
    return `${this.prefixPath}/${this.meetingId}`;
  }
}
