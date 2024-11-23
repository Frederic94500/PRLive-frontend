import { PR, PROutput, Tie } from '../interfaces/pr.interface';
import { Server, ServerURL } from '../enums/server.enum';

import { User } from '@interfaces/user.interface';
import { get } from 'node:http';

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

export function modifyPRURL(
  pr: PR | PROutput,
  user: User
): PR | PROutput {
  const server = getServerURL(user);
  pr.songList.forEach((song) => {
    song.urlVideo = song.urlVideo.includes('https://') || song.urlVideo.includes('youtu')
      ? song.urlVideo
      : server + song.urlVideo;
    song.urlAudio = song.urlAudio.includes('https://')
      ? song.urlAudio
      : server + song.urlAudio;
  });

  return pr;
}

export function modifyTieURL(tie: Tie, user: User): Tie {
  const server = getServerURL(user);
  tie.tieSongs.forEach((tieSongs) => {
    tieSongs.forEach((tieSong) => {
      tieSong.urlAudio = tieSong.urlAudio.includes('https://')
        ? tieSong.urlAudio
        : server + tieSong.urlAudio;
    });
  });

  return tie;
}
