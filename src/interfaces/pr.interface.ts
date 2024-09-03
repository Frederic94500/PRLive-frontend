import { AnisongDb, Song, SongInput, SongOutput } from '@interfaces/song.interface';

import { UserOutput } from '@interfaces/user.interface';

export interface PRSimple {
  _id: string;
  name: string;
  creator: string;
  nomination: boolean;
  blind: boolean;
  deadlineNomination: number;
  deadline: number;
  finished: boolean;
  numberSongs: number;
}

export interface PR {
  _id: string;
  name: string;
  creator: string;
  nomination: boolean;
  blind: boolean;
  deadlineNomination: number;
  deadline: number;
  finished: boolean;
  numberSongs: number;
  hashKey: string;
  songList: Song[];
}

export interface PRInput {
  name: string;
  nomination: boolean;
  blind: boolean;
  deadlineNomination?: number;
  deadline: number;
  songList?: SongInput[];
  anisongDb?: AnisongDb[];
}

export interface PROutput {
  name: string;
  creator: string;
  nomination: boolean;
  blind: boolean;
  deadlineNomination: string;
  deadline: string;
  numberVoters: number;
  numberSongs: number;
  mustBe: number;
  songList: SongOutput[];
  voters: UserOutput[];
}
