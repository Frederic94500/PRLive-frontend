import { ActivatedRoute, RouterLink } from '@angular/router';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PR, PRDetail } from '@/src/interfaces/pr.interface';
import { User, UserOutput } from '@interfaces/user.interface';
import { getServerURL, modifyPRURL } from '@/src/toolbox/toolbox';

import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { FileType } from '@/src/enums/fileType.enum';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { PRDetailAnnouncePRDialogComponent } from '../pr-detail-announce-pr-dialog/pr-detail-announce-pr-dialog.component';
import { PRService } from '@/src/services/pr.service';
import { SheetService } from '@/src/services/sheet.service';
import { SheetViewDialogComponent } from '../sheet-view-dialog/sheet-view-dialog.component';
import { Song } from '@/src/interfaces/song.interface';
import { VideoPlayerComponent } from '../video-player/video-player.component';
import { environment } from '@/src/environments/environment';

@Component({
  selector: 'app-pr-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIcon,
    MatTabsModule,
    RouterLink,
    MatMenuModule,
    VideoPlayerComponent,
  ],
  templateUrl: './pr-detail.component.html',
  styleUrl: './pr-detail.component.css',
})
export class PRDetailComponent implements OnInit, AfterViewInit {
  displayedColumnsSongList: string[] = [
    'orderId',
    'rankPosition',
    'nominator',
    'artist',
    'title',
    'source',
    'type',
    'startSample',
    'sampleLength',
    'urlVideo',
    'urlAudio',
  ];
  displayedColumnsUsers: string[] = [
    'username',
    'name',
    'hasFinished',
    'staller',
    'doubleRank',
    'image',
    'options',
  ];
  pr!: PRDetail;
  songList!: MatTableDataSource<Song>;
  user!: User;
  userList!: MatTableDataSource<UserOutput>;
  isAdmin!: boolean;
  currentAudioSource: string | null = null;
  currentVideoSource: string | null = null;
  tabVideoMode: boolean = false;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private prService: PRService
  ) {}

  async ngOnInit(): Promise<void> {
    this.pr = this.route.snapshot.data['pr'].data;
    this.songList = new MatTableDataSource(
      this.pr.songList.sort((a, b) => a.orderId - b.orderId)
    );
    this.userList = new MatTableDataSource(this.pr.voters);

    this.isAdmin = this.route.snapshot.data['auth'].data.role === 'admin';

    this.user = this.route.snapshot.data['auth'].data;

    if (this.isAdmin) {
      this.displayedColumnsSongList.unshift('uuid');
    }
    if (!this.pr.nomination) {
      this.displayedColumnsSongList = this.displayedColumnsSongList.filter(
        (column) => column !== 'nominator'
      );
    }
  }

  ngAfterViewInit(): void {
    this.songList.sort = this.sort;
    this.userList.sort = this.sort;
  }

  passedDeadline(date: string): string {
    if (Date.parse(date) < Date.now()) return 'red-value';
    return 'green-value';
  }

  getRowClass(voter: UserOutput): string {
    if (voter.hasFinished) {
      return 'finished';
    } else if (voter.staller) {
      return 'staller';
    } else if (voter.doubleRank) {
      return 'double-rank';
    }
    return '';
  }

  countFinished(): number {
    return this.pr.voters.filter((voter) => voter.hasFinished).length;
  }

  generateStallerMsg(): void {
    const stallers = this.pr.voters.filter((voter) => !voter.hasFinished);
    if (stallers.length === 0) {
      this.snackBar.open('No stallers found', 'Close', { duration: 2000 });
      return;
    }

    const msg = stallers.map((staller) => `<@${staller.discordId}>`).join(' ');
    navigator.clipboard.writeText(
      `${msg}\n\nDeadline: <t:${new Date(this.pr.deadline).getTime() / 1000}:F>`
    );
    this.snackBar.open('Stallers copied to clipboard', 'Close', {
      duration: 2000,
    });
  }

  copyLinkConfirmJoin(): void {
    navigator.clipboard.writeText(
      `${environment.frontUrl}/confirmjoin/${this.pr._id}`
    );
    this.snackBar.open('Link copied to clipboard', 'Close', {
      duration: 2000,
    });
  }

  downloadJson(): void {
    if (this.pr.tie.status) {
      if (
        !confirm(
          'This PR has an unresolved tie. Do you want to download the output?'
        )
      ) {
        return;
      }
    }
    const pr = modifyPRURL(this.pr as PR, this.user);
    pr.songList = pr.songList.sort(
      (a, b) => Number(b.rankPosition) - Number(a.rankPosition)
    );
    const json = JSON.stringify(pr, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pr.name.replace(/[^a-zA-Z0-9]/g, '_')}_output_PR.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  async openSheetViewDialog(prId: string, discordId: string): Promise<void> {
    const voter = this.pr.voters.find((voter) => voter.discordId === discordId);
    if (!voter) {
      this.snackBar.open('User not found', 'Close', { duration: 2000 });
      return;
    }
    const sheet = await new SheetService().getUserSheet(prId, discordId);
    if (sheet.code !== 200) {
      this.snackBar.open('Error fetching sheet', 'Close', { duration: 2000 });
      return;
    }

    this.dialog.open(SheetViewDialogComponent, {
      data: {
        voter,
        mustBe: this.pr.mustBe,
        songList: this.pr.songList,
        sheet: sheet.data,
      },
    });
  }

  openDeleteUserDialog(prId: string, discordId: string): void {
    confirm('Are you sure you want to delete this User?')
      ? this.removeUser(prId, discordId)
      : null;
  }

  async removeUser(prId: string, discordId: string): Promise<void> {
    await new SheetService().deleteSheetUser(prId, discordId);

    this.snackBar.open('User removed', 'Close', { duration: 2000 });
    this.userList.data = this.userList.data.filter(
      (user) => user.discordId !== discordId
    );
  }

  openAnnouncePRDialog(): void {
    this.dialog.open(PRDetailAnnouncePRDialogComponent, {
      data: { prId: this.pr._id },
    });
  }

  videoLink(uuid: string): string {
    const URL = this.pr.songList.find((x) => x.uuid === uuid)?.urlVideo;
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
        this.pr.songList.find((x) => url.includes(x[field] as string))
          ?.artist ?? '',
      title:
        this.pr.songList.find((x) => url.includes(x[field] as string))?.title ??
        '',
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

  toggleTabVideoMode(): void {
    this.tabVideoMode = !this.tabVideoMode;
  }

  closeVideoPlayer(): void {
    this.currentVideoSource = null;
  }

  closeAudioPlayer(): void {
    this.currentAudioSource = null;
  }

  openFileUploadDialog(prId: string, voterId: string): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png, image/jpeg, image/gif, image/webp';
    input.onchange = async () => {
      if (!input.files) {
        return;
      }
      const file = input.files[0];
      if (!file) {
        return;
      }
      const response = await this.prService.uploadFilePR(
        prId,
        FileType.PFP,
        file,
        [{ item: 'voterId', value: voterId }]
      );
      if (response.code !== 200) {
        this.snackBar.open('Error uploading file', 'Close', { duration: 2000 });
        return;
      }
      this.snackBar.open('File uploaded', 'Close', { duration: 2000 });
      this.pr = (await this.prService.outputPR(prId)).data;
      this.userList.data = this.pr.voters;
    };
    input.click();
  }
}
