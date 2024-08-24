import { ActivatedRoute, RouterLink } from '@angular/router';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';
import { PRModel } from '@models/pr.model';
import { UnixTimestampPipe } from '@toolbox/unixTimestampPipe.toolbox';

@Component({
  selector: 'app-pr',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, UnixTimestampPipe, MatIcon, MatButton, RouterLink],
  templateUrl: './pr.component.html',
  styleUrl: './pr.component.css',
})
export class PRComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'creator', 'nomination', 'blind', 'deadlineNomination', 'deadline', 'numberSongs', 'finished'];
  prs!: MatTableDataSource<PRModel>;
  prsFinished!: MatTableDataSource<PRModel>;
  isLoggedIn: boolean = false;
  isCreator: boolean = false;
  isAdmin: boolean = false;

  constructor(private route: ActivatedRoute) {}

  @ViewChild(MatSort) sort!: MatSort;
  
  ngOnInit(): void {
    this.prs = new MatTableDataSource(this.route.snapshot.data['prs'].data.filter((pr: PRModel) => !pr.finished));
    this.prsFinished = new MatTableDataSource(this.route.snapshot.data['prs'].data.filter((pr: PRModel) => pr.finished));

    const user = this.route.snapshot.data['auth'];
    if (user.code === 200) {
      this.isLoggedIn = true;
      this.displayedColumns.push('sheet');
      if (user.data.role === 'creator' || user.data.role === 'admin') {
        this.displayedColumns.push('edit');
        this.isCreator = true;
      }
      if (user.data.role === 'admin') {
        this.displayedColumns.unshift('_id');
        this.isAdmin = true;
      }
    }
  }

  ngAfterViewInit(): void {
    this.prs.sort = this.sort;
  }
}
