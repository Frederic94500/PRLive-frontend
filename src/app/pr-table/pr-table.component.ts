import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PR, PROutput, PRSimple } from '@/src/interfaces/pr.interface';

import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PRService } from '@/src/services/pr.service';
import { RouterLink } from '@angular/router';
import { SheetSimple } from '@/src/interfaces/sheet.interface';
import { SheetStatus } from '@/src/enums/sheetStatus.enum';
import { SongListDialogComponent } from '../song-list-dialog/song-list-dialog.component';
import { User } from '@/src/interfaces/user.interface';
import { modifyPRURL } from '@/src/toolbox/toolbox';

@Component({
  selector: 'app-table',
  standalone: true,
  templateUrl: './pr-table.component.html',
  styleUrls: ['./pr-table.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatIcon,
    MatButton,
    RouterLink,
    MatMenuModule,
    MatButtonModule,
  ],
})
export class PRTableComponent implements OnInit, AfterViewInit {
  @Input() user!: User;
  @Input() sheetSimple!: SheetSimple[];
  @Input() dataSource!: MatTableDataSource<PR>;
  @Input() displayedColumns!: string[];
  @Input() isAdmin: boolean = false;
  @Input() isLoggedIn: boolean = false;
  @Input() isCreator: boolean = false;
  @Input() filter: string = 'all';

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private snackBar: MatSnackBar, public dialog: MatDialog) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  passedDeadline(nomination: boolean, date: string): string {
    if (nomination) {
      if (Date.parse(date) > Date.now()) {
        return 'green-value';
      }
      return 'red-value';
    }
    return '';
  }

  isEmptySongList(pr: PR) {
    return pr.numberSongs === 0;
  }

  hideNominatedSongs(pr: PR): boolean {
    if (!pr.nomination) {
      return false;
    }
    if (this.isEmptySongList(pr)) {
      return true;
    }
    if (pr.nomination.hidden && pr.nomination.blind) {
      return true;
    }
    return pr.nomination.hideNominatedSongList;
  }


  async openSongListDialog(event: Event, prId: string): Promise<void> {
    event.stopPropagation();

    const pr = await new PRService().getPR(prId);

    this.dialog.open(SongListDialogComponent, {
      data: {
        user: this.user,
        pr: pr.data,
        songList: pr.data.songList,
      },
    });
  }

  async downloadJson(prId: string): Promise<void> {
    const prOutput: PROutput = (await new PRService().outputPR(prId)).data;
    const pr = modifyPRURL(prOutput, this.user);
    const json = JSON.stringify(pr, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${prOutput.name}_output_PR.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  openDeleteDialog(prId: string): void {
    confirm('Are you sure you want to delete this PR?')
      ? this.deletePR(prId)
      : null;
  }

  async deletePR(prId: string): Promise<void> {
    const response = await new PRService().deletePR(prId);
    if (response.code !== 200) {
      this.snackBar.open('Error deleting PR', 'Close', { duration: 2000 });
      return;
    }
    this.snackBar.open('PR deleted', 'Close', { duration: 2000 });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    window.location.reload();
  }

  isJoined(prId: string): boolean {
    if (!this.isLoggedIn) {
      return false;
    }

    const sheet = this.sheetSimple.find((sheet) => sheet.prId === prId);
    switch (sheet?.status) {
      case SheetStatus.FILLED:
        return true;
      case SheetStatus.UNFILLED:
        return true;
      default:
        return false;
    }
  }

  joinPartyRanking(prId: string): void {
    window.location.href = `/sheet/${prId}`;
  }

  getRowClass(pr: PRSimple): string {
    if (!this.isLoggedIn) {
      return '';
    }

    if (pr.finished) {
      return '';
    }
  
    const sheet = this.sheetSimple.find((sheet) => sheet.prId === pr._id);
    switch (sheet?.status) {
      case SheetStatus.FILLED:
        return 'finished';
      case SheetStatus.UNFILLED:
        return 'unfinished';
      default:
        return '';
    }
  }
}
