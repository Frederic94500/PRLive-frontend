import { ActivatedRoute, RouterLink } from '@angular/router';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NominationData } from '@/src/interfaces/nomination.interface';
import { NominationEditDialogComponent } from '../nomination-edit-dialog/nomination-edit-dialog.component';
import { NominationNominateDialogComponent } from '../nomination-nominate-dialog/nomination-nominate-dialog.component';
import { NominationService } from '@/src/services/nomination.service';
import { User } from '@/src/interfaces/user.interface';
import { VideoPlayerComponent } from '../video-player/video-player.component';
import { getServerURL } from '@/src/toolbox/toolbox';

@Component({
  selector: 'app-nomination',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatTableModule,
    RouterLink,
    MatMenuModule,
    MatSortModule,
    VideoPlayerComponent,
  ],
  templateUrl: './nomination.component.html',
  styleUrl: './nomination.component.css',
})
export class NominationComponent implements AfterViewInit {
  user: User;
  displayedColumns: string[] = ['edit', 'delete'];
  nomination: NominationData;
  songList: MatTableDataSource<any>;
  currentAudioSource: string | null = null;
  currentVideoSource: string | null = null;
  tabVideoMode: boolean = false;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private nominationService: NominationService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) {
    this.user = this.route.snapshot.data['auth'].data;
    this.nomination = this.route.snapshot.data['nomination'].data;

    if (!this.nomination.blind) {
      this.displayedColumns.unshift(
        'source',
        'type',
        'title',
        'artist',
        'urlVideo',
        'urlAudio'
      );
    }
    if (!this.nomination.hidden) {
      this.displayedColumns.unshift('nominator');
    }

    this.songList = new MatTableDataSource(this.nomination.songList);
  }

  ngAfterViewInit(): void {
    this.songList.sort = this.sort;
  }

  videoLink(uuid: string): string {
    const URL = this.nomination.songList.find((x) => x.uuid === uuid)?.urlVideo;
    if (!URL) {
      this.snackBar.open('URL not found', 'Close', {
        duration: 2000,
      });
      return '';
    }
    const isURL = URL.includes('https://');
    return isURL ? URL : `${getServerURL(this.user)}${URL}`;
  }

  getNowPlaying(url: string, field: string): { artist: string; title: string } {
    return {
      artist:
        this.nomination.songList.find((x) => url.includes(x[field] as string))
          ?.artist ?? '',
      title:
        this.nomination.songList.find((x) => url.includes(x[field] as string))
          ?.title ?? '',
    };
  }

  playVideo(url: string): void {
    this.currentVideoSource =
      url.includes('youtu') || url.includes('https://')
        ? url
        : `${getServerURL(this.user)}${url}`;
    this.currentAudioSource = null;
  }

  playAudio(url: string): void {
    this.currentVideoSource = null;
    if (this.currentAudioSource === url) {
      this.currentAudioSource = null;
      return;
    }
    this.currentAudioSource = url.includes('https://')
      ? url
      : `${getServerURL(this.user)}${url}`;
  }

  closeVideoPlayer(): void {
    this.currentVideoSource = null;
  }

  closeAudioPlayer(): void {
    this.currentAudioSource = null;
  }

  toggleTabVideoMode(): void {
    this.tabVideoMode = !this.tabVideoMode;
  }

  valueColor(): string {
    return this.nomination.remainingNominations > 0 ? 'green' : 'red';
  }

  isEmptySongList() {
    return this.nomination.numberSongs === 0;
  }

  showNominatedSongs(): boolean {
    return !this.isEmptySongList();
  }

  openNominationNominateDialog(): void {
    this.dialog.open(NominationNominateDialogComponent, {
      data: {
        prId: this.nomination.prId,
      },
      disableClose: true,
    });

    this.dialog.afterAllClosed.subscribe(async () => {
      const newNomination = (
        await new NominationService().getNomination(this.nomination.prId)
      ).data;
      this.nomination = newNomination;
      this.songList = new MatTableDataSource(newNomination.songList);
    });
  }

  async openNominationEditDialog(song: any): Promise<void> {
    const nominatedSong = await this.nominationService.getNominationSong(
      this.nomination.prId,
      song.uuid
    );
    if (nominatedSong.code !== 200) {
      this.snackBar.open(
        `Failed to fetch song. Reason: ${
          nominatedSong.data || nominatedSong.message
        }`,
        'Close',
        {
          duration: 2000,
        }
      );
      return;
    }
    this.dialog.open(NominationEditDialogComponent, {
      data: {
        prId: this.nomination.prId,
        song: nominatedSong.data,
      },
      disableClose: true,
    });

    this.dialog.afterAllClosed.subscribe(async () => {
      const newNomination = (
        await this.nominationService.getNomination(this.nomination.prId)
      ).data;
      this.nomination = newNomination;
      this.songList = new MatTableDataSource(newNomination.songList);
    });
  }

  openNominationDeleteDialog(songUuid: string): void {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this nomination?'
    );
    if (confirmDelete) {
      this.deleteNominationSong(songUuid);
    }
  }

  async deleteNominationSong(songUuid: string): Promise<void> {
    const deleteSong = await this.nominationService.deleteNominationSong(
      this.nomination.prId,
      songUuid
    );
    if (deleteSong.code !== 200) {
      this.snackBar.open(
        `Failed to delete nomination. Reason: ${
          deleteSong.data || deleteSong.message
        }`,
        'Close',
        {
          duration: 2000,
        }
      );
      return;
    }

    this.snackBar.open('Song deleted successfully', 'Close', {
      duration: 2000,
    });

    const newNomination = (
      await this.nominationService.getNomination(this.nomination.prId)
    ).data;
    this.nomination = newNomination;
    this.songList = new MatTableDataSource(newNomination.songList);
  }
}
