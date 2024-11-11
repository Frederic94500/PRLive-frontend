import { ActivatedRoute, RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { PRModel } from '@models/pr.model';
import { PRStatus } from '@/src/enums/prStatus.enum';
import { PRTableComponent } from '@components/pr-table/pr-table.component';
import { SheetSimple } from '@/src/interfaces/sheet.interface';
import { SheetStatus } from '@/src/enums/sheetStatus.enum';
import { User } from '@/src/interfaces/user.interface';

@Component({
  selector: 'app-pr',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatIcon,
    MatButton,
    RouterLink,
    PRTableComponent,
    MatTabsModule,
    MatButtonToggleModule,
  ],
  templateUrl: './pr.component.html',
  styleUrl: './pr.component.css',
})
export class PRComponent implements OnInit {
  user!: User;
  prs!: PRModel[];
  nominationDisplayedColumns: string[] = [
    'name',
    'creator',
    'deadlineNomination',
    'numberSongs',
  ];
  rankingDisplayedColumns: string[] = [
    'name',
    'creator',
    'nomination',
    'deadline',
    'numberSongs',
  ];
  finishedDisplayedColumns: string[] = [
    'name',
    'creator',
    'nomination',
    'deadline',
    'numberSongs',
    'finished',
  ];
  prsNomination!: MatTableDataSource<PRModel>;
  prsRanking!: MatTableDataSource<PRModel>;
  prsFinished!: MatTableDataSource<PRModel>;
  sheets!: SheetSimple[];
  isLoggedIn: boolean = false;
  isCreator: boolean = false;
  isAdmin: boolean = false;
  filter: string = SheetStatus.ALL;

  constructor(private route: ActivatedRoute) {}

  isAllJoined(prsData: MatTableDataSource<PRModel>): boolean {
    const sheets = this.sheets.filter((sheet: SheetSimple) =>
      prsData.data.some((pr: PRModel) => pr._id === sheet.prId)
    );
    return (
      sheets.filter(
        (sheet: SheetSimple) => sheet.status === SheetStatus.NOTJOINED
      ).length === 0
    );
  }

  ngOnInit(): void {
    this.prs = this.route.snapshot.data['prs'].data;
    this.prsNomination = new MatTableDataSource(
      this.prs.filter((pr: PRModel) => pr.status === PRStatus.NOMINATION)
    );
    this.prsRanking = new MatTableDataSource(
      this.prs.filter((pr: PRModel) => pr.status === PRStatus.RANKING)
    );
    this.prsFinished = new MatTableDataSource(
      this.prs.filter((pr: PRModel) => pr.status === PRStatus.FINISHED)
    );

    const user = this.route.snapshot.data['auth'];
    this.user = user.data;
    if (user.code === 200) {
      this.isLoggedIn = true;
      this.sheets = this.route.snapshot.data['sheets'].data;
      this.nominationDisplayedColumns.push('nominate');
      if (!this.isAllJoined(this.prsRanking)) {
        this.rankingDisplayedColumns.push('join');
      }
      if (user.data.role === 'admin') {
        this.nominationDisplayedColumns.push('_id');
        this.rankingDisplayedColumns.push('_id');
        this.finishedDisplayedColumns.push('_id');
        this.isAdmin = true;
      }
      if (user.data.role === 'creator' || user.data.role === 'admin') {
        this.nominationDisplayedColumns.push('options');
        this.rankingDisplayedColumns.push('options');
        this.finishedDisplayedColumns.push('options');
        this.isCreator = true;
      }
    }
  }

  filterSheet(event: any): void {
    switch (event.value) {
      case SheetStatus.ALL:
        this.filter = SheetStatus.ALL;
        break;
      case SheetStatus.NOTJOINED:
        this.filter = SheetStatus.NOTJOINED;
        break;
      case SheetStatus.UNFILLED:
        this.filter = SheetStatus.UNFILLED;
        break;
      case SheetStatus.FILLED:
        this.filter = SheetStatus.FILLED;
        break;
      default:
        this.filter = SheetStatus.ALL;
    }

    if (this.filter === SheetStatus.ALL) {
      this.prsNomination = new MatTableDataSource(
        this.prs.filter((pr: PRModel) => pr.status === PRStatus.NOMINATION)
      );
      this.prsRanking = new MatTableDataSource(
        this.prs.filter((pr: PRModel) => pr.status === PRStatus.RANKING)
      );
      this.prsFinished = new MatTableDataSource(
        this.prs.filter((pr: PRModel) => pr.status === PRStatus.FINISHED)
      );
      return;
    }

    this.prsRanking = new MatTableDataSource(
      this.prs.filter((pr: PRModel) =>
        this.sheets.some(
          (sheet: SheetSimple) =>
            sheet.prId === pr._id &&
            sheet.status === this.filter &&
            pr.finished === false
        )
      )
    );
    this.prsFinished = new MatTableDataSource(
      this.prs.filter((pr: PRModel) =>
        this.sheets.some(
          (sheet: SheetSimple) =>
            sheet.prId === pr._id &&
            sheet.status === this.filter &&
            pr.finished === true
        )
      )
    );
  }
}
