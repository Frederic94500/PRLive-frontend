import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { PRModel } from '@models/pr.model';
import { RouterLink } from '@angular/router';
import { UnixTimestampPipe } from '@toolbox/unixTimestampPipe.toolbox';

@Component({
  selector: 'app-table',
  standalone: true,
  templateUrl: './pr-table.component.html',
  styleUrls: ['./pr-table.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    UnixTimestampPipe,
    MatIcon,
    MatButton,
    RouterLink,
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
}
