import { ActivatedRoute, RouterLink } from '@angular/router';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { PRDetailModel } from '@models/pr.model';
import { SongModel } from '@models/song.model';
import { UserModel } from '@models/user.model';
import { UserOutput } from '@interfaces/user.interface';
import { UserService } from '@services/user.service';

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
  ];
  pr!: PRDetailModel;
  songList!: MatTableDataSource<SongModel>;
  user!: UserModel;
  userList!: MatTableDataSource<UserOutput>;
  isAdmin!: boolean;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private route: ActivatedRoute, private snackBar: MatSnackBar) {}

  async ngOnInit(): Promise<void> {
    this.pr = this.route.snapshot.data['pr'].data;
    this.songList = new MatTableDataSource(this.pr.songList);
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
    const json = JSON.stringify(this.pr, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.pr.name}_output_PR.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
