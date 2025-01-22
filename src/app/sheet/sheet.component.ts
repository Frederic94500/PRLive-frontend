import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Sheet, SheetSheetFront } from '@/src/interfaces/sheet.interface';

import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PR } from '@/src/interfaces/pr.interface';
import { Response } from '@/src/interfaces/api.interface';
import { Server } from '@/src/enums/server.enum';
import { SheetCSVDialogComponent } from '../sheet-csv-dialog/sheet-csv-dialog.component';
import { SheetProfileDialogComponent } from '../sheet-profile-dialog/sheet-profile-dialog.component';
import { SheetService } from '@services/sheet.service';
import { User } from '@interfaces/user.interface';
import { modifyPRURL } from '@/src/toolbox/toolbox';

@Component({
  selector: 'app-sheet',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    MatTooltipModule,
    RouterLink,
  ],
  templateUrl: './sheet.component.html',
  styleUrl: './sheet.component.css',
})
export class SheetComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'orderId',
    'artist',
    'title',
    'source',
    'type',
    'video',
    'audio',
    'rank',
    'score',
    'comment',
  ];

  auth: boolean = false;
  sheetService: SheetService = new SheetService();
  pr!: PR;
  sheet!: Sheet;
  sheetTable!: MatTableDataSource<SheetSheetFront>;
  totalRank: number = 0;
  meanScore: number = 0;
  currentAudioSource: string | null = null;
  isPlaylistMode: boolean = false;
  currentTrackIndex: number = 0;
  currentVideoSource: string | null = null;
  tabVideoMode: boolean = false;

  @ViewChildren('rankInput') rankInputs!: QueryList<ElementRef>;
  @ViewChildren('scoreInput') scoreInputs!: QueryList<ElementRef>;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {}

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('player') audioPlayer!: ElementRef<HTMLAudioElement>;

  async ngOnInit(): Promise<void> {
    this.auth = this.route.snapshot.data['auth'].data ? true : false;
    const user: User = this.auth ? this.route.snapshot.data['auth'].data : { server: Server.EU };
    this.pr = this.route.snapshot.data['pr'].data;
    this.pr = modifyPRURL(this.pr, user) as PR;

    const response = this.route.snapshot.data['sheet'];
    if (response.code !== 200) {
      this.router.navigate(['/error'], {
        queryParams: { code: 403, message: response.data },
      });
    } else {
      const serverSheet: Sheet = response.data;
      const localSheet: Sheet | null = this.getSheetLocal(this.pr._id);
      if (localSheet && new Date(localSheet.latestUpdate) > new Date(serverSheet.latestUpdate)) {
        console.log('Using local sheet');
        this.sheet = localSheet;
      } else {
        console.log('Using server sheet');
        this.sheet = serverSheet;
      }
    }

    const sheetTableData: SheetSheetFront[] = this.sheet.sheet.map(
      (songTable) => {
        const song = this.pr.songList.find(
          (song) => song.uuid === songTable.uuid
        );
        return {
          ...songTable,
          artist: song?.artist ?? '',
          title: song?.title ?? '',
          source: song?.source ?? '',
          type: song?.type ?? '',
          urlVideo: song?.urlVideo ?? '',
          urlAudio: song?.urlAudio ?? '',
        };
      }
    );
    if (this.pr.nomination) {
      if (this.pr.nomination.blind) {
        this.displayedColumns = this.displayedColumns.filter(
          (column) =>
            !['artist', 'title', 'source', 'video', 'type'].includes(column)
        );
      }
    }
    this.sheetTable = new MatTableDataSource(sheetTableData);

    this.update();
  }

  ngAfterViewInit(): void {
    this.sheetTable.sort = this.sort;
  }

  computeTotalRank(): void {
    this.totalRank = this.sheet.sheet.reduce((acc, val) => acc + val.rank, 0);
  }

  private updateMeanScore(): void {
    this.meanScore = this.sheet.sheet.reduce((acc, val) => acc + val.score, 0);
    this.meanScore = this.meanScore / this.sheet.sheet.length;
  }

  private updateTable(): void {
    this.sheetTable.data.forEach((x) => {
      x.rank = this.sheet.sheet.find((y) => y.uuid === x.uuid)?.rank ?? 0;
      x.score = this.sheet.sheet.find((y) => y.uuid === x.uuid)?.score ?? 0;
      x.comment =
        this.sheet.sheet.find((y) => y.uuid === x.uuid)?.comment ?? '';
    });
  }

  private update(): void {
    this.computeTotalRank();
    this.updateMeanScore();
    this.updateTable();
  }

  private async updateSheet(): Promise<void> {
    if (this.pr.finished) {
      this.snackBar.open(
        'PR is finished, you cannot update the sheet',
        'Close',
        {
          duration: 2000,
        }
      );
      return;
    }
    this.sheet.sheet.sort((a, b) => a.orderId - b.orderId);
    this.storeSheet(this.sheet);
    let response: Response;
    try {
      if (this.auth) {
        response = await this.sheetService.putSheet(this.pr._id, this.sheet);
      } else {
        response = await this.sheetService.putSheetNoAuth(this.pr._id, this.sheet.voterId, this.sheet._id, this.sheet);
      }
    } catch (error) {
      this.snackBar.open('No answer from server, saved on local', 'Close', {
        duration: 2000,
      });
      this.update();
      return;
    }
    if (response.code !== 200) {
      this.snackBar.open(
        `Error updating sheet: ${response.data || response.message}`,
        'Close',
        {
          duration: 2000,
        }
      );
      return;
    }
    this.update();
  }

  updateRank(uuid: string): void {
    const inputElement = document.getElementById(
      uuid + '-rank'
    ) as HTMLInputElement;
    this.sheet.sheet[this.pr.songList.findIndex((x) => x.uuid === uuid)].rank =
      Number(inputElement.value);
    this.updateSheet();
  }

  updateScore(uuid: string): void {
    const inputElement = document.getElementById(
      uuid + '-score'
    ) as HTMLInputElement;
    this.sheet.sheet[this.pr.songList.findIndex((x) => x.uuid === uuid)].score =
      Number(inputElement.value);
    this.updateSheet();
  }

  updateComment(uuid: string): void {
    const inputElement = document.getElementById(
      uuid + '-comment'
    ) as HTMLInputElement;
    this.sheet.sheet[
      this.pr.songList.findIndex((x) => x.uuid === uuid)
    ].comment = inputElement.value;
    this.updateSheet();
  }

  videoLink(uuid: string): string {
    return this.pr.songList.find((x) => x.uuid === uuid)?.urlVideo ?? '';
  }

  togglePlaylistMode(): void {
    this.isPlaylistMode = !this.isPlaylistMode;
  }

  isYouTubeLink(url: string): boolean {
    return url.includes('youtu');
  }

  getYoutubeId(url: string): string {
    const shortUrlPattern = /youtu\.be\/([a-zA-Z0-9_-]{11})/;
    const longUrlPattern = /youtube\.com\/.*[?&]v=([a-zA-Z0-9_-]{11})/;

    let match = url.match(shortUrlPattern);
    if (match && match[1]) {
      return match[1];
    }

    match = url.match(longUrlPattern);
    if (match && match[1]) {
      return match[1];
    }

    return '';
  }

  getYouTubeEmbedUrl(url: string): string {
    return `https://www.youtube.com/embed/${this.getYoutubeId(
      url
    )}?autoplay=1&cc_load_policy=1`;
  }

  sanitizeUrl(url: string): string {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      this.getYouTubeEmbedUrl(url)
    ) as string;
  }

  playVideo(url: string): void {
    this.currentVideoSource = url;
    this.currentAudioSource = null;
  }

  playAudio(uuid: string): void {
    this.currentVideoSource = null;
    this.currentAudioSource =
      this.pr.songList.find((x) => x.uuid === uuid)?.urlAudio ?? null;
    this.currentTrackIndex = this.pr.songList.findIndex((x) => x.uuid === uuid);

    if (this.currentAudioSource) {
      const audioPlayer = this.audioPlayer.nativeElement;
      audioPlayer.src = this.currentAudioSource;

      audioPlayer.addEventListener(
        'canplay',
        () => {
          audioPlayer.play().catch((error) => {
            console.error('Error playing audio:', error);
          });
        },
        { once: true }
      );
    }
  }

  playNextTrack(): void {
    if (this.isPlaylistMode) {
      this.currentTrackIndex =
        (this.currentTrackIndex + 1) % this.pr.songList.length;
      if (this.currentTrackIndex === 0) {
        const audioPlayer = this.audioPlayer.nativeElement;
        audioPlayer.pause();
      } else {
        this.playAudio(this.pr.songList[this.currentTrackIndex].uuid);
      }
    }
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

  passedDeadline(): string {
    if (Date.parse(this.pr.deadline) < Date.now()) return 'red-value';
    return 'green-value';
  }

  mustBeChecker(): string {
    if (this.pr.mustBe === this.totalRank) return 'green-value';
    return 'red-value';
  }

  focusNextInput(index: number, type: string): void {
    if (type === 'rank') {
      const nextRankInput = this.rankInputs.toArray()[index + 1];
      if (nextRankInput) {
        nextRankInput.nativeElement.focus();
      }
    } else if (type === 'score') {
      const nextScoreInput = this.scoreInputs.toArray()[index + 1];
      if (nextScoreInput) {
        nextScoreInput.nativeElement.focus();
      }
    }
  }

  autoFillRank(): void {
    const sortedSheet = this.sheet.sheet.sort((a, b) => b.score - a.score);
    sortedSheet.forEach((x, i) => (x.rank = i + 1));
    this.sheet.sheet = sortedSheet;
    this.updateSheet();
  }

  openSheetProfileDialog(): void {
    this.dialog.open(SheetProfileDialogComponent, {
      data: { prId: this.pr._id, sheet: this.sheet },
    });

    this.dialog.afterAllClosed.subscribe(async () => {
      this.sheet = (await this.sheetService.getSheet(this.pr._id)).data;
      this.updateSheet();
    });
  }

  confirmSheetQuit(): void {
    const confirmQuit = confirm('Are you sure you want to quit this PR?');
    if (confirmQuit) {
      this.quitSheet();
    }
  }

  async quitSheet(): Promise<void> {
    let response: Response;
    if (this.auth) {
      response = await this.sheetService.deleteSheetNoAuth(this.pr._id, this.sheet.voterId, this.sheet._id);
    } else {
      response = await this.sheetService.deleteSheet(this.pr._id);
    }
    if (response.code !== 200) {
      this.snackBar.open('Failed to quit PR', 'Close', {
        duration: 2000,
      });
      return;
    }
    this.snackBar.open('PR quit', 'Close', {
      duration: 2000,
    });
    setTimeout(() => {
      this.router.navigate(['/pr']);
    }, 1000);
    this.router.navigate(['/pr']);
  }

  openSheetCSVDialog(): void {
    this.dialog.open(SheetCSVDialogComponent, {
      data: {
        prName: this.pr.name,
        username: this.sheet.name,
        sheet: this.sheet,
        sheetSheetFrontModel: this.sheetTable.data,
      },
    });

    this.dialog.afterAllClosed.subscribe(async () => {
      this.sheet = (await this.sheetService.getSheet(this.pr._id)).data;
      this.updateSheet();
    });
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
  
  public storeSheet(sheet: Sheet): void {
    try {
      sheet.latestUpdate = new Date().toISOString();
      localStorage.setItem(`sheet-${sheet.prId}`, btoa(JSON.stringify(sheet)));
    } catch (error) {
      console.error(error);
    }
  }

  public getSheetLocal(prId: string): Sheet | null {
    try {
      const sheet = localStorage.getItem(`sheet-${prId}`);
      return sheet ? JSON.parse(atob(sheet)) : null;
    } catch (error) {
      return null;
    }
  }
}
