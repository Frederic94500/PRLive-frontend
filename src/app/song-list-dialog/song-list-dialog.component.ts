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
  songList!: SongModel[];
  songTable: MatTableDataSource<SongModel>;
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
