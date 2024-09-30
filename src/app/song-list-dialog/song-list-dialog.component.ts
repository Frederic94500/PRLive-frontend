import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SongModel } from '@/src/models/song.model';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { PRModel } from '@/src/models/pr.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-song-list-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatTableModule, MatSortModule, MatIconModule, MatButtonModule],
  templateUrl: './song-list-dialog.component.html',
  styleUrl: './song-list-dialog.component.css',
})
export class SongListDialogComponent implements AfterViewInit {
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
    this.pr = data.pr;
    this.songList = data.songList;
    this.songTable = new MatTableDataSource<SongModel>(this.songList);
  }

  ngAfterViewInit(): void {
    this.songTable.sort = this.sort;
  }

  openInNewTab(uuid: string): void {
    window.open(
      this.pr.songList.find((x) => x.uuid === uuid)?.urlVideo,
      '_blank'
    );
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
