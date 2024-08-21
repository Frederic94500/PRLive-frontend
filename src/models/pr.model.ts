import { SongModel } from "@models/song.model";

export class PRModel {
  _id!: string;
  name!: string;
  creator!: string;
  nomination!: boolean;
  blind!: boolean;
  deadlineNomination!: number;
  deadline!: number;
  finished!: boolean;
  numberSongs!: number;
  hashKey!: string;
  songList!: SongModel[];
}
