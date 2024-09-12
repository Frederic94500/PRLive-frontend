import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PRModel } from '@models/pr.model';
import { RouterLink } from '@angular/router';

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
export class PRTableComponent implements OnInit {
  @Input() dataSource!: MatTableDataSource<PRModel>;
  @Input() displayedColumns!: string[];
  @Input() isAdmin: boolean = false;
  @Input() isLoggedIn: boolean = false;
  @Input() isCreator: boolean = false;

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
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
}
