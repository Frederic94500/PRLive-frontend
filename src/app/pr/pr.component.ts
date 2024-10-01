import { ActivatedRoute, RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { PRModel } from '@models/pr.model';
import { PRTableComponent } from '@components/pr-table/pr-table.component';
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
    MatTabsModule
  ],
  templateUrl: './pr.component.html',
  styleUrl: './pr.component.css',
})
export class PRComponent implements OnInit {
  user!: User;
  displayedColumns: string[] = [
    'name',
    'creator',
    'nomination',
    'blind',
    'deadlineNomination',
    'deadline',
    'numberSongs',
  ];
  prsUnfinished!: MatTableDataSource<PRModel>;
  prsFinished!: MatTableDataSource<PRModel>;
  isLoggedIn: boolean = false;
  isCreator: boolean = false;
  isAdmin: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const prs = this.route.snapshot.data['prs'].data;
    this.prsUnfinished = new MatTableDataSource(
      prs.filter((pr: PRModel) => !pr.finished)
    );
    this.prsFinished = new MatTableDataSource(
      prs.filter((pr: PRModel) => pr.finished)
    );

    const user = this.route.snapshot.data['auth'];
    this.user = user.data;
    if (user.code === 200) {
      this.isLoggedIn = true;
      if (user.data.role === 'admin') {
        this.displayedColumns.push('_id');
        this.isAdmin = true;
      }
      if (user.data.role === 'creator' || user.data.role === 'admin') {
        this.displayedColumns.push('options');
        this.isCreator = true;
      }
    }
  }
}
