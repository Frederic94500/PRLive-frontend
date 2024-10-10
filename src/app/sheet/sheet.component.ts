import { ActivatedRoute, Router } from '@angular/router';
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
import { SheetModel, SheetSheetFrontModel } from '@models/sheet.model';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PRModel } from '@models/pr.model';
import { SheetProfileDialogComponent } from '../sheet-profile-dialog/sheet-profile-dialog.component';
import { SheetService } from '@services/sheet.service';
import { User } from '@interfaces/user.interface';
import { UserService } from '@services/user.service';
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
    MatSlideToggleModule,
    MatTooltipModule
  ],
  templateUrl: './sheet.component.html',
  styleUrl: './sheet.component.css',
})
export class SheetComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'orderId',
    'artist',
    'title',
    'anime',
    'type',
    'video',
    'audio',
    'rank',
    'score',
  ];

  sheetService: SheetService = new SheetService();
  pr!: PRModel;
  sheet!: SheetModel;
  userCreator!: User;
  sheetTable!: MatTableDataSource<SheetSheetFrontModel>;
  totalRank: number = 0;
  meanScore: number = 0;
  currentAudioSource: string | null = null;
  isPlaylistMode: boolean = false;
  currentTrackIndex: number = 0;

  @ViewChildren('rankInput') rankInputs!: QueryList<ElementRef>;
  @ViewChildren('scoreInput') scoreInputs!: QueryList<ElementRef>;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {}

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('player') audioPlayer!: ElementRef<HTMLAudioElement>;

  async ngOnInit(): Promise<void> {
    const user: User = this.route.snapshot.data['auth'].data;
    this.pr = this.route.snapshot.data['pr'].data;
    this.pr = modifyPRURL(this.pr, user) as PRModel;

    const response = this.route.snapshot.data['sheet'];
    if (response.code !== 200) {
      this.router.navigate(['/error'], {
        queryParams: { code: 403, message: response.data },
      });
    }

    this.sheet = this.route.snapshot.data['sheet'].data;
    const sheetTableData: SheetSheetFrontModel[] = this.sheet.sheet.map((songTable) => {
      const song = this.pr.songList.find((song) => song.uuid === songTable.uuid);
      return {
        ...songTable,
        artist: song?.artist ?? '',
        title: song?.title ?? '',
        anime: song?.anime ?? '',
        type: song?.type ?? '',
        urlVideo: song?.urlVideo ?? '',
        urlAudio: song?.urlAudio ?? '',
      };
    });
    this.sheetTable = new MatTableDataSource(sheetTableData);

    this.userCreator = (await new UserService().getUser(this.pr.creator)).data;

    this.computeTotalRank();
    this.updateMeanScore();
  }

  ngAfterViewInit(): void {
    this.sheetTable.sort = this.sort;
  }

  private updateMeanScore(): void {
    this.meanScore = this.sheet.sheet.reduce((acc, val) => acc + val.score, 0);
    this.meanScore = this.meanScore / this.sheet.sheet.length;
  }

  private updateTable(): void {
    this.sheetTable.data.forEach((x) => {
      x.rank = this.sheet.sheet.find((y) => y.uuid === x.uuid)?.rank ?? 0;
      x.score = this.sheet.sheet.find((y) => y.uuid === x.uuid)?.score ?? 0;
    });
  }

  private async updateSheet(): Promise<void> {
    this.sheet.sheet.sort((a, b) => a.orderId - b.orderId);
    const response = await this.sheetService.putSheet(this.pr._id, this.sheet);
    if (response.code !== 200) {
      this.snackBar.open(`Error updating sheet: ${response.data}`, 'Close', {
        duration: 2000,
      });
      return;
    }
    this.computeTotalRank();
    this.updateMeanScore();
    this.updateTable();
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

  videoLink(uuid: string): string {
    return this.pr.songList.find((x) => x.uuid === uuid)?.urlVideo ?? '';
  }
  
  playAudio(uuid: string): void {
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

  getNowPlaying(url: string): { artist: string; title: string } {
    return {
      artist: this.pr.songList.find((x) => x.urlAudio === url)?.artist ?? '',
      title: this.pr.songList.find((x) => x.urlAudio === url)?.title ?? '',
    };
  }

  computeTotalRank(): void {
    this.totalRank = this.sheet.sheet.reduce((acc, val) => acc + val.rank, 0);
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
    const response = await this.sheetService.deleteSheet(this.pr._id);
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
}
