import { Voting } from './../types';
import { Model } from './Model';

export class VotingModel extends Model<Voting> {
  constructor(public meetingId: string) {
    super('votings');
  }

  protected get path() {
    return `${this.prefixPath}/${this.meetingId}`;
  }
}
