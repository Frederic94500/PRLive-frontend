import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SongModel } from '@/src/models/song.model';
import { UserOutputModel } from '@/src/models/user.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { Sheet, SheetSheet } from '@/src/interfaces/sheet.interface';

@Component({
  selector: 'app-sheet-view-dialog',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatDialogModule],
  templateUrl: './sheet-view-dialog.component.html',
  styleUrl: './sheet-view-dialog.component.css',
})
export class SheetViewDialogComponent implements AfterViewInit {
  displayedColumns: string[] = [
    // 'orderId',
    'artist',
    'title',
    'anime',
    'rank',
    'score',
  ];
  voter: UserOutputModel;
  songList: SongModel[];
  sheet: Sheet;
  sheetTable: MatTableDataSource<SheetSheet>;
  mustBe: number = 0;
  totalRank: number = 0;
  meanScore: number = 0;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialogSheet: MatDialogRef<SheetViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.voter = data.voter;
    this.songList = data.songList;
    this.sheet = data.sheet;
    this.sheetTable = new MatTableDataSource<SheetSheet>(this.sheet.sheet);
    this.mustBe = data.mustBe;

    this.totalRank = this.sheetTable.data.reduce(
      (acc, x) => acc + x.rank,
      0
    );

    this.sheetTable.data.forEach((x) => {
      this.meanScore += x.score;
    });
    this.meanScore /= this.sheetTable.data.length;
  }

  ngAfterViewInit(): void {
    this.sheetTable.sort = this.sort;
  }

  onNoClick(): void {
    this.dialogSheet.close();
  }

  mustBeChecker(): string {
    if (this.mustBe === this.totalRank) return 'green-value';
    return 'red-value';
  }

  getEntry(uuid: string, field: string): string {
    const song = this.songList.find((x) => x.uuid === uuid);
    if (!song) return '';
    return (song as any)[field];
  }
}
