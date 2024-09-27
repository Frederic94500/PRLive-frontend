import { SongModel } from '@models/song.model';

export class PRModel {
  _id!: string;
  name!: string;
  creator!: string;
  nomination!: boolean;
  blind!: boolean;
  deadlineNomination!: string;
  deadline!: string;
  finished!: boolean;
  numberSongs!: number;
  mustBe!: number;
  hashKey!: string;
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
  voters!: {
    discordId: string;
    username: string;
    name: string;
    image: string;
    hasFinished: boolean;
    staller: boolean;
    doubleRank: boolean;
  }[];
}
