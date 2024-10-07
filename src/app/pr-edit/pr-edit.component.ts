import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { PR } from '@interfaces/pr.interface';
import { PRService } from '@services/pr.service';
import { PrEditAddSongDialogComponent } from '../pr-edit-add-song-dialog/pr-edit-add-song-dialog.component';
import { Song } from '@interfaces/song.interface';
import { User } from '@interfaces/user.interface';
import { getServerURL } from '@/src/toolbox/toolbox';

@Component({
  selector: 'app-pr-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatSortModule,
    MatInputModule,
    MatCardModule,
    FormsModule,
    MatSelectModule,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  templateUrl: './pr-edit.component.html',
  styleUrl: './pr-edit.component.css',
})
export class PREditComponent implements OnInit {
  displayedColumnsSongList: string[] = [
    'artist',
    'title',
    'anime',
    'type',
    'startSample',
    'sampleLength',
    'urlVideo',
    'urlAudio',
    'delete',
  ];
  pr!: PR;
  songList!: MatTableDataSource<Song>;
  userList!: User[];
  prService = new PRService();
  currentAudioSource: string | null = null;
  user!: User;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.pr = this.route.snapshot.data['pr'].data;
    this.songList = new MatTableDataSource(this.pr.songList);
    this.userList = this.route.snapshot.data['users'].data;
    this.user = this.route.snapshot.data['auth'].data;
  }

  formatDate(date: string): string {
    const parsedDate = new Date(date);
    return parsedDate.toLocaleDateString();
  }

  async updatePR(): Promise<void> {
    const response = await this.prService.updatePR(this.pr);
    if (response.code != 200) {
      this.snackBar.open('Failed to update PR', 'Close', {
        duration: 2000,
      });
    }
  }

  async simpleUpdatePRField(): Promise<void> {
    console.log(this.pr);
    this.updatePR();
  }

  async updatePRField(field: string): Promise<void> {
    const inputElement = document.getElementById(field) as HTMLInputElement;
    console.log(inputElement);
    const value = inputElement.value;
    console.log(value);
    this.pr[field] = value;
    console.log(this.pr);
    this.updatePR();
  }

  async updateSongListField(uuid: string, field: string): Promise<void> {
    const inputElement = document.getElementById(
      `${uuid}-${field}`
    ) as HTMLInputElement;
    let value: number | string;
    if (['startSample', 'sampleLength'].includes(field)) {
      value = parseInt(inputElement.value);
    } else {
      value = inputElement.value;
    }
    this.pr.songList[this.pr.songList.findIndex((song) => song.uuid === uuid)][
      field
    ] = value;
    this.updatePR();
  }

  async addSong(): Promise<void> {
    this.dialog.open(PrEditAddSongDialogComponent, {
      data: {
        prId: this.pr._id,
      },
    });

    this.dialog.afterAllClosed.subscribe(async () => {
      this.pr = (await this.prService.getPR(this.pr._id)).data;
      this.songList = new MatTableDataSource(this.pr.songList);
    });
  }

  confirmDeleteSong(songUuid: string): void {
    const song = this.pr.songList.find((x) => x.uuid === songUuid);
    if (!song) {
      this.snackBar.open('Song not found', 'Close', {
        duration: 2000,
      });
      return;
    }
    const confirmDelete = confirm(
      `Are you sure you want to delete ${song.artist} - ${song.title}?`
    );
    if (confirmDelete) {
      this.deleteSong(songUuid);
    }
  }

  async deleteSong(songUuid: string): Promise<void> {
    const response = await this.prService.deleteSongPR(this.pr._id, songUuid);
    if (response.code != 200) {
      this.snackBar.open('Failed to delete song', 'Close', {
        duration: 2000,
      });
      return;
    }
    this.snackBar.open('Song deleted', 'Close', {
      duration: 2000,
    });

    this.pr = (await this.prService.getPR(this.pr._id)).data;
    this.songList = new MatTableDataSource(this.pr.songList);
  }

  openInNewTab(uuid: string): void {
    const URL = this.pr.songList.find((x) => x.uuid === uuid)?.urlVideo;
    if (!URL) {
      this.snackBar.open('URL not found', 'Close', {
        duration: 2000,
      });
      return;
    }
    const isURL = URL.includes('https://');
    window.open(isURL ? URL : `${getServerURL(this.user)}${URL}`, '_blank');
  }

  getNowPlaying(url: string): { artist: string; title: string } {
    return {
      artist:
        this.pr.songList.find((x) => url.includes(x.urlAudio))?.artist ?? '',
      title:
        this.pr.songList.find((x) => url.includes(x.urlAudio))?.title ?? '',
    };
  }

  playAudio(url: string): void {
    if (this.currentAudioSource === url) {
      this.currentAudioSource = null;
      return;
    }
    this.currentAudioSource = url.includes('https://')
      ? url
      : `${getServerURL(this.user)}${url}`;
  }
}
