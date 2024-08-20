import { AnisongDb, Song, SongInput, SongOutput } from './song.interface';

import { UserOutput } from './user.interface';

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
  songs: Song[];
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
  deadlineNomination: number;
  deadline: number;
  numberVoters: number;
  numberSongs: number;
  mustBe: number;
  songList: SongOutput[];
  voters: UserOutput[];
}
