import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Server } from '@/src/interfaces/server.interface';
import { ServerService } from '@/src/services/server.service';
import { ServersCreateDialogComponent } from '../servers-create-dialog/servers-create-dialog.component';
import { ServersEditDialogComponent } from '../servers-edit-dialog/servers-edit-dialog.component';

@Component({
  selector: 'app-servers',
  standalone: true,
  imports: [CommonModule, MatSortModule, MatTableModule, MatIconModule, MatButtonModule, MatMenuModule, MatDialogModule],
  templateUrl: './servers.component.html',
  styleUrl: './servers.component.css'
})
export class ServersComponent implements AfterViewInit {
  displayedColumns = ['discordId', 'name', 'options'];
  servers: Server[];
  serverList: MatTableDataSource<Server>;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private route: ActivatedRoute, private serverService: ServerService, private dialog: MatDialog, private snackBar: MatSnackBar) {
    this.servers = this.route.snapshot.data['servers'].data;

    this.serverList = new MatTableDataSource(this.servers);
  }

  ngAfterViewInit(): void {
    this.serverList.sort = this.sort;
  }

  openServerCreateDialog(): void {
    this.dialog.open(ServersCreateDialogComponent, {
      data: {server: null},
    });

    this.dialog.afterAllClosed.subscribe(() => {
      this.serverService.gets().then((res) => {
        this.servers = res.data;
        this.serverList = new MatTableDataSource(this.servers);
        this.serverList.sort = this.sort;
      });
    });
  }


  openServerEditInfoDialog(server: Server): void {
    this.dialog.open(ServersEditDialogComponent, {
      data: {server: server},
    });

    this.dialog.afterAllClosed.subscribe(() => {
      this.serverService.gets().then((res) => {
        this.servers = res.data;
        this.serverList = new MatTableDataSource(this.servers);
        this.serverList.sort = this.sort;
      });
    });
  }

  confirmDeleteServer(server: Server): void {
    if (confirm(`Are you sure you want to delete ${server.name}?`)) {
      this.deleteServer(server);
    }
  }

  deleteServer(server: Server): void {
    this.serverService.delete(server._id!).then((res) => {
      if (res.code !== 200) {
        this.snackBar.open('Error deleting server!', 'Close', {
          duration: 2000,
        });
        return;
      }

      this.snackBar.open('Server deleted!', 'Close', {
        duration: 2000,
      });
      this.serverService.gets().then((res) => {
        this.servers = res.data;
        this.serverList = new MatTableDataSource(this.servers);
        this.serverList.sort = this.sort;
      });
    });
  }
}
