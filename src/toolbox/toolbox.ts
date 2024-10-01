import { Server, ServerURL } from '../enums/server.enum';

import { PRModel } from '../models/pr.model';
import { User } from '@interfaces/user.interface';

export function getServerURL(user: User): string {
  switch (user.server) {
    case Server.EU:
      return ServerURL.EU;
    case Server.NA1:
      return ServerURL.NA1;
    case Server.NA2:
      return ServerURL.NA2;
    default:
      return ServerURL.EU;
  }
}

export function modifyPRURL(pr: PRModel, user: User): PRModel {
  pr.songList.forEach((song) => {
    song.urlVideo = song.urlVideo.includes('https://')
      ? song.urlVideo
      : getServerURL(user) + song.urlVideo;
    song.urlAudio = song.urlAudio.includes('https://')
      ? song.urlAudio
      : getServerURL(user) + song.urlAudio;
  });

  return pr;
}
