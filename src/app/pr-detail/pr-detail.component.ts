import { ActivatedRoute, RouterLink } from '@angular/router';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserModel, UserOutputModel } from '@models/user.model';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { PRDetailModel } from '@models/pr.model';
import { SheetService } from '@/src/services/sheet.service';
import { SheetViewDialogComponent } from '../sheet-view-dialog/sheet-view-dialog.component';
import { SongModel } from '@models/song.model';
import { UserOutput } from '@interfaces/user.interface';
import { UserService } from '@services/user.service';
import { modifyPRURL } from '@/src/toolbox/toolbox';

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
  ],
  templateUrl: './pr-detail.component.html',
  styleUrl: './pr-detail.component.css',
})
export class PRDetailComponent implements OnInit, AfterViewInit {
  displayedColumnsSongList: string[] = [
    'orderId',
    'artist',
    'title',
    'anime',
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
    'options',
  ];
  pr!: PRDetailModel;
  songList!: MatTableDataSource<SongModel>;
  user!: UserModel;
  userList!: MatTableDataSource<UserOutputModel>;
  isAdmin!: boolean;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    this.pr = this.route.snapshot.data['pr'].data;
    this.songList = new MatTableDataSource(this.pr.songList.sort((a, b) => a.orderId - b.orderId));
    this.userList = new MatTableDataSource(this.pr.voters);

    this.isAdmin = this.route.snapshot.data['auth'].data.role === 'admin';

    this.user = (await new UserService().getUser(this.pr.creator)).data;

    if (this.isAdmin) {
      this.displayedColumnsSongList.unshift('uuid');
    }
  }

  ngAfterViewInit(): void {
    this.songList.sort = this.sort;
    this.userList.sort = this.sort;
  }

  passedDeadline(): string {
    if (Date.parse(this.pr.deadline) < Date.now()) return 'red-value';
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

  downloadJson(): void {
    const pr = modifyPRURL({...this.pr}, this.user);
    const json = JSON.stringify(pr, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.pr.name}_output_PR.json`;
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
    confirm('Are you sure you want to delete this User?') ? this.removeUser(prId, discordId) : null;
  }

  async removeUser(prId: string, discordId: string): Promise<void> {
    await new SheetService().deleteSheetUser(prId, discordId);

    this.snackBar.open('User removed', 'Close', { duration: 2000 });
    this.userList.data = this.userList.data.filter(
      (user) => user.discordId !== discordId
    );
  }
}
