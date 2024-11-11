import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SongModel } from '@/src/models/song.model';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { PRModel } from '@/src/models/pr.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { User } from '@/src/interfaces/user.interface';
import { modifyPRURL } from '@/src/toolbox/toolbox';
import { Song } from '@/src/interfaces/song.interface';

@Component({
  selector: 'app-song-list-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatTableModule, MatSortModule, MatIconModule, MatButtonModule],
  templateUrl: './song-list-dialog.component.html',
  styleUrl: './song-list-dialog.component.css',
})
export class SongListDialogComponent implements AfterViewInit {
  user!: User;
  displayedColumns: string[] = [
    'artist',
    'title',
    'anime',
    'type',
    'urlVideo',
    'urlAudio',
  ];
  pr: PRModel;
  songList!: Song[];
  songTable: MatTableDataSource<Song>;
  currentAudioSource: string | null = null;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialogSongList: MatDialogRef<SongListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = data.user;
    this.pr = data.pr;
    this.pr = modifyPRURL(this.pr, this.user) as PRModel;

    this.songList = data.songList;
    this.songList = this.pr.songList.map(song => {
      const { uuid, orderId, nominatedId, artist, title, anime, type, urlVideo, urlAudio, startSample, sampleLength } = song;
      return {
        uuid,
        orderId,
        nominatedId: this.pr.nomination.hidden ? '' : nominatedId ?? '',
        artist: this.pr.nomination.blind ? '' : artist ?? '',
        title: this.pr.nomination.blind ? '' : title ?? '',
        anime: this.pr.nomination.blind ? '' : anime ?? '',
        type,
        urlVideo: this.pr.nomination.blind ? '' : urlVideo ?? '',
        urlAudio: this.pr.nomination.blind ? '' : urlAudio ?? '',
        startSample,
        sampleLength,
      };
    })
    if (this.pr.nomination) {
      this.displayedColumns = [];
      if (!this.pr.nomination.blind) {
        this.displayedColumns.unshift(
          'artist',
          'title',
          'anime',
          'type',
          'urlVideo',
          'urlAudio'
        );
      }
    }
    this.songTable = new MatTableDataSource(this.songList);
  }

  ngAfterViewInit(): void {
    this.songTable.sort = this.sort;
  }

  videoLink(uuid: string): string {
    return this.pr.songList.find((x) => x.uuid === uuid)?.urlVideo ?? '';
  }

  playAudio(uuid: string): void {
    this.currentAudioSource =
      this.pr.songList.find((x) => x.uuid === uuid)?.urlAudio ?? null;
  }

  getNowPlaying(url: string): { artist: string; title: string } {
    return {
      artist: this.pr.songList.find((x) => x.urlAudio === url)?.artist ?? '',
      title: this.pr.songList.find((x) => x.urlAudio === url)?.title ?? '',
    };
  }
}
