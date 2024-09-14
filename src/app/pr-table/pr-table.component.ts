import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PRModel } from '@models/pr.model';
import { PROutput } from '@/src/interfaces/pr.interface';
import { PRService } from '@/src/services/pr.service';
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
export class PRTableComponent implements OnInit, AfterViewInit {
  @Input() dataSource!: MatTableDataSource<PRModel>;
  @Input() displayedColumns!: string[];
  @Input() isAdmin: boolean = false;
  @Input() isLoggedIn: boolean = false;
  @Input() isCreator: boolean = false;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
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

  async downloadJson(prId: string): Promise<void> {
    const prOutput: PROutput =  (await (new PRService().outputPR(prId))).data;
    const json = JSON.stringify(prOutput, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${prOutput.name}_output_PR.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  openDeleteDialog(prId: string): void {
    confirm('Are you sure you want to delete this PR?') ? this.deletePR(prId) : null;
  }

  async deletePR(prId: string): Promise<void> {
    const response = await new PRService().deletePR(prId);
    if (response.code !== 200) {
      this.snackBar.open('Error deleting PR', 'Close', { duration: 2000 });
      return;
    }
    this.snackBar.open('PR deleted', 'Close', { duration: 2000 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    window.location.reload();
  }
}
