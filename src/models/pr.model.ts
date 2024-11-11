import { Nomination } from '../interfaces/nomination.interface';
import { PRStatus } from '../enums/prStatus.enum';
import { SongModel } from '@models/song.model';
import { UserOutputModel } from './user.model';

export class PRModel {
  _id!: string;
  name!: string;
  creator!: string;
  status!: PRStatus;
  nomination!: Nomination;
  blind!: boolean;
  deadlineNomination!: string;
  deadline!: string;
  finished!: boolean;
  numberSongs!: number;
  mustBe!: number;
  hashKey!: string;
  video!: string;
  affinityImage!: string;
  prStats!: string;
  songList!: SongModel[];
}

export class Tie {
  prId!: string;
  status!: boolean;
  tieSong!: {
    uuid: string;
    urlAudio: string;
    totalRank: number;
  }[];
}

export class PRDetailModel extends PRModel {
  numberVoters!: number;
  tie!: Tie;
  voters!: UserOutputModel[];
}
