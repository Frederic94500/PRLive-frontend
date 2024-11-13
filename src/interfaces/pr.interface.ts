import { AnisongDb, Song, SongInput, SongOutput } from '@interfaces/song.interface';

import { Nomination } from './nomination.interface';
import { PRStatus } from '../enums/prStatus.enum';
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
  status: PRStatus;
  nomination: Nomination;
  deadline: string;
  finished: boolean;
  numberSongs: number;
  hashKey: string;
  mustBe: number;
  video: string;
  affinityImage: string;
  prStats: string;
  songList: Song[];
  [key: string]: string | number | boolean | Song[] | Nomination | Tie | UserOutput[];
}

export interface Tie {
  prId: string;
  status: boolean;
  tieSong: {
    uuid: string;
    urlAudio: string;
    totalRank: number;
  }[];
}

export interface PRDetail extends PR {
  numberVoters: number;
  tie: Tie;
  voters: UserOutput[];
}

export interface PRInput {
  name: string;
  isNomination?: boolean;
  hidden?: boolean;
  blind?: boolean;
  hideNominatedSongList?: boolean;
  deadlineNomination?: string;
  songPerUser?: number;
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

export interface PRFinished {
  _id: string;
  name: string;
  video: string;
  affinityImage: string;
  prStats: string;
  hasSheet: boolean;
  resultTable: SongOutput[];
}

export interface ResultTable {
  rankPosition: number;
  song: string;
  source: string;
  type: string;
  urlVideo: string;
  totalRank: number;
  voters: number[];
}
