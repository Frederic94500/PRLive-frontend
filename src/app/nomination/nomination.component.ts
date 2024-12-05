import { ActivatedRoute, RouterLink } from '@angular/router';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { NominationData } from '@/src/interfaces/nomination.interface';
import { NominationEditDialogComponent } from '../nomination-edit-dialog/nomination-edit-dialog.component';
import { NominationNominateDialogComponent } from '../nomination-nominate-dialog/nomination-nominate-dialog.component';
import { NominationService } from '@/src/services/nomination.service';

@Component({
  selector: 'app-nomination',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatTableModule,
    RouterLink,
    MatMenuModule
  ],
  templateUrl: './nomination.component.html',
  styleUrl: './nomination.component.css',
})
export class NominationComponent implements AfterViewInit {
  displayedColumns: string[] = ['edit'];
  nomination: NominationData;
  songList: MatTableDataSource<any>;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private route: ActivatedRoute, private dialog: MatDialog, private nominationService: NominationService, private snackBar: MatSnackBar) {
    this.nomination = this.route.snapshot.data['nomination'].data;

    if (
      !this.nomination.hideNominatedSongList &&
      (!this.nomination.blind || !this.nomination.hidden)
    ) {
      this.displayedColumns = ['edit'];
      if (!this.nomination.blind) {
        this.displayedColumns.unshift(
          'artist',
          'title',
          'source',
          'type',
          'urlVideo',
          'urlAudio'
        );
      }
      if (!this.nomination.hidden) {
        this.displayedColumns.unshift('nominator');
        this.nomination.songList.forEach((song) => {
          song.nominator = this.nomination.nominators.find(
            (user) => user.nominator === song.nominator
          )!.name;
        });
      }
    }

    this.songList = new MatTableDataSource(this.nomination.songList);
  }

  ngAfterViewInit(): void {
    this.songList.sort = this.sort;
  }

  valueColor(): string {
    return this.nomination.remainingNominations > 0 ? 'green' : 'red';
  }

  isEmptySongList() {
    return this.nomination.numberSongs === 0;
  }

  showNominatedSongs(): boolean {
    if (this.nomination.blind && this.nomination.hidden) {
      return false;
    }

    return !this.nomination.hideNominatedSongList && !this.isEmptySongList();
  }

  openNominationNominateDialog(): void {
    this.dialog.open(NominationNominateDialogComponent, {
      data: {
        prId: this.nomination.prId,
      },
    });

    this.dialog.afterAllClosed.subscribe(async () => {
      const newNomination = (
        await new NominationService().getNomination(this.nomination.prId)
      ).data;
      this.nomination = newNomination;
      if (!this.nomination.hidden) {
        this.nomination.songList.forEach((song) => {
          song.nominator = this.nomination.nominators.find(
            (user) => user.nominator === song.nominator
          )!.name;
        });
      }
      this.songList = new MatTableDataSource(newNomination.songList);
    });
  }

  async openNominationEditDialog(song: any): Promise<void> {
    const nominatedSong = (await this.nominationService.getNominationSong(this.nomination.prId, song.uuid));
    if (nominatedSong.code !== 200) {
      this.snackBar.open(`Failed to fetch song. Reason: ${nominatedSong.data || nominatedSong.message}`, 'Close', {
        duration: 2000,
      });
      return;
    }
    this.dialog.open(NominationEditDialogComponent, {
      data: {
        prId: this.nomination.prId,
        song: nominatedSong.data,
      },
    });

    this.dialog.afterAllClosed.subscribe(async () => {
      const newNomination = (
        await this.nominationService.getNomination(this.nomination.prId)
      ).data;
      this.nomination = newNomination;
      if (!this.nomination.hidden) {
        this.nomination.songList.forEach((song) => {
          song.nominator = this.nomination.nominators.find(
            (user) => user.nominator === song.nominator
          )!.name;
        });
      }
      this.songList = new MatTableDataSource(newNomination.songList);
    });
  }
}
