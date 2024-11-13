import { ActivatedRoute, RouterLink } from '@angular/router';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { PRFinished, ResultTable } from '@/src/interfaces/pr.interface';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-pr-finished',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule],
  templateUrl: './pr-finished.component.html',
  styleUrl: './pr-finished.component.css',
})
export class PRFinishedComponent implements AfterViewInit {
  prFinished: PRFinished;
  resultTable: MatTableDataSource<ResultTable>;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private route: ActivatedRoute) {
    this.prFinished = this.route.snapshot.data['prFinished'].data;
    this.prFinished.resultTable = this.prFinished.resultTable.sort(
      (a, b) => a.rankPosition - b.rankPosition
    );

    const resultTable = this.prFinished.resultTable.map((song) => {
      return {
        rankPosition: song.rankPosition,
        song: song.artist + ' - ' + song.title,
        source: song.source || '',
        type: song.type,
        urlVideo: song.urlVideo,
        totalRank: song.totalRank,
        voters: song.voters.flatMap((voter) => voter.rank),
      };
    });

    this.resultTable = new MatTableDataSource(resultTable);
  }

  ngAfterViewInit(): void {
    this.resultTable.sort = this.sort;
  }
}
