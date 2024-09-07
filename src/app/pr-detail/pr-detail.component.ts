import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PRDetailModel } from '@models/pr.model';
import { SongModel } from '@models/song.model';
import { UserModel } from '@models/user.model';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-pr-detail',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatButtonModule, MatIcon],
  templateUrl: './pr-detail.component.html',
  styleUrl: './pr-detail.component.css'
})
export class PRDetailComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['orderId', 'uuid', 'artist', 'title', 'type', 'startSample', 'sampleLength', 'urlVideo', 'urlAudio'];
  pr!: PRDetailModel;
  songList!: MatTableDataSource<SongModel>;
  user!: UserModel;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private route: ActivatedRoute, private snackBar: MatSnackBar) {}
  
  async ngOnInit(): Promise<void> {
    this.pr = this.route.snapshot.data['pr'].data;
    this.songList = new MatTableDataSource(this.pr.songList);

    this.user = (await new UserService().getUser(this.pr.creator)).data;
  }
  
  ngAfterViewInit(): void {
    this.songList.sort = this.sort;
  }

  passedDeadline(): string {
    if (Date.parse(this.pr.deadline) < Date.now()) return 'red-value';
    return 'green-value';
  }

  countFinished(): number {
    return this.pr.voters.filter(voter => voter.hasFinished).length;
  }

  generateStallerMsg(): void {
    const stallers = this.pr.voters.filter(voter => !voter.hasFinished);
    if (stallers.length === 0) {
      this.snackBar.open('No stallers found', 'Close', { duration: 2000 });
      return;
    };

    const msg = stallers.map(staller => `<@${staller.discordId}>`).join(' ');
    navigator.clipboard.writeText(`${msg}\n\nDeadline: ${this.pr.deadline}`);
    this.snackBar.open('Stallers copied to clipboard', 'Close', { duration: 2000 });
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
