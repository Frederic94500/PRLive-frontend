import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { PR } from '@interfaces/pr.interface';
import { PRService } from '@services/pr.service';
import { Song } from '@interfaces/song.interface';
import { User } from '@interfaces/user.interface';

@Component({
  selector: 'app-pr-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatSortModule,
    MatInputModule,
    MatCardModule,
    FormsModule,
    MatSelectModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  templateUrl: './pr-edit.component.html',
  styleUrl: './pr-edit.component.css',
})
export class PREditComponent implements OnInit {
  displayedColumnsSongList: string[] = [
    'artist',
    'title',
    'anime',
    'type',
    'startSample',
    'sampleLength',
    'urlVideo',
    'urlAudio',
  ];
  pr!: PR;
  songList!: MatTableDataSource<Song>;
  userList!: User[];
  prService = new PRService();

  constructor(private route: ActivatedRoute, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.pr = this.route.snapshot.data['pr'].data;
    this.songList = new MatTableDataSource(this.pr.songList);
    this.userList = this.route.snapshot.data['users'].data;
  }

  formatDate(date: string): string {
    const parsedDate = new Date(date);
    return parsedDate.toLocaleDateString();
  }

  async updatePR(): Promise<void> {
    const response = await this.prService.updatePR(this.pr);
    if (response.code != 200) {
      this.snackBar.open('Failed to update PR', 'Close', {
        duration: 2000,
      });
    }
  }

  async simpleUpdatePRField(): Promise<void> {
    console.log(this.pr);
    this.updatePR();
  }

  async updatePRField(field: string): Promise<void> {
    const inputElement = document.getElementById(field) as HTMLInputElement;
    console.log(inputElement);
    const value = inputElement.value;
    console.log(value);
    this.pr[field] = value;
    console.log(this.pr);
    this.updatePR();
  }

  async updateSongListField(uuid: string, field: string): Promise<void> {
    const inputElement = document.getElementById(
      `${uuid}-${field}`
    ) as HTMLInputElement;
    let value: number | string;
    if (['startSample', 'sampleLength'].includes(field)) {
      value = parseInt(inputElement.value);
    } else {
      value = inputElement.value;
    }
    this.pr.songList[this.pr.songList.findIndex((song) => song.uuid === uuid)][
      field
    ] = value;
    this.updatePR();
  }
}
