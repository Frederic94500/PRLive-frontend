import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SheetModel, SheetSheetModel } from '@models/sheet.model';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PRModel } from '@models/pr.model';
import { SheetService } from '@services/sheet.service';
import { User } from '@interfaces/user.interface';
import { UserService } from '@services/user.service';

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
  ],
  templateUrl: './sheet.component.html',
  styleUrl: './sheet.component.css',
})
export class SheetComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'orderId',
    'title',
    'artist',
    'type',
    'video',
    'audio',
    'rank',
    'score',
  ];

  sheetService: SheetService = new SheetService();
  pr!: PRModel;
  sheet!: SheetModel;
  user!: User;
  sheetTable!: MatTableDataSource<SheetSheetModel>;
  currentAudioSource: string | null = null;
  totalRank: number = 0;
  meanScore: number = 0;

  constructor(private route: ActivatedRoute, private snackBar: MatSnackBar) {}

  @ViewChild(MatSort) sort!: MatSort;

  async ngOnInit(): Promise<void> {
    this.pr = this.route.snapshot.data['pr'].data;

    this.sheet = this.route.snapshot.data['sheet'].data;
    this.sheetTable = new MatTableDataSource(this.sheet.sheet);

    this.user = (await new UserService().getUser(this.pr.creator)).data;

    this.computeTotalRank();
    this.updateMeanScore();
  }

  ngAfterViewInit(): void {
    this.sheetTable.sort = this.sort;
  }

  getEntry(uuid: string, field: string): string {
    const song = this.pr.songList.find((x) => x.uuid === uuid);
    if (!song) return '';
    return (song as any)[field];
  }

  updateMeanScore(): void {
    this.meanScore = this.sheet.sheet.reduce(
      (acc, val) => acc + val.score,
      0
    );
    this.meanScore = this.meanScore / this.sheet.sheet.length;
  }

  private async updateSheet(): Promise<void> {
    this.sheet.sheet.sort((a, b) => a.orderId - b.orderId);
    const response = (await this.sheetService.putSheet(this.pr._id, this.sheet));
    if (response.code !== 200) {
      this.snackBar.open(`Error updating sheet: ${response.data}`, 'Close', {
        duration: 2000,
      });
      return;
    }
    this.computeTotalRank();
    this.updateMeanScore();
  }

  updateRank(uuid: string): void {
    const inputElement = document.getElementById(
      uuid + 'rank'
    ) as HTMLInputElement;
    this.sheet.sheet[this.pr.songList.findIndex((x) => x.uuid === uuid)].rank =
      Number(inputElement.value);
    this.updateSheet();
  }

  updateScore(uuid: string): void {
    const inputElement = document.getElementById(
      uuid + 'score'
    ) as HTMLInputElement;
    this.sheet.sheet[this.pr.songList.findIndex((x) => x.uuid === uuid)].score =
      Number(inputElement.value);
    this.updateSheet();
    this.updateMeanScore();
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

  playNextAudio(): void {}


  computeTotalRank(): void {
    this.totalRank = this.sheet.sheet.reduce(
      (acc, val) => acc + val.rank,
      0
    );
  }

  passedDeadline(): string {
    if (Date.parse(this.pr.deadline) < Date.now()) return 'red-value';
    return 'green-value';
  }

  mustBeChecker(): string {
    if (this.pr.mustBe === this.totalRank) return 'green-value';
    return 'red-value';
  }

  autoFillRank(): void {
    const sortedSheet = this.sheet.sheet.sort((a, b) => b.score - a.score);
    sortedSheet.forEach((x, i) => (x.rank = i + 1));
    this.sheet.sheet = sortedSheet;
    this.updateSheet();
  }
}
