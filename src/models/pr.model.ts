import { SongModel } from "@models/song.model";

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

export class PRDetailModel extends PRModel {
  numberVoters!: number;
  voters!: {
    discordId: string;
    username: string;
    name: string;
    image: string;
    hasFinished: boolean;
  }[]
}
