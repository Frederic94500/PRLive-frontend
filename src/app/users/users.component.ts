import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '@/src/interfaces/user.interface';
import { UserService } from '@/src/services/user.service';
import { UsersEditInfoDialogComponent } from '../users-edit-info-dialog/users-edit-info-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MatSortModule, MatTableModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements AfterViewInit {
  users: User[];
  userList: MatTableDataSource<User>;
  displayedColumns: string[] = ['discordId', 'username', 'name', 'role', 'image', 'options'];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private route: ActivatedRoute, private userService: UserService, private dialog: MatDialog, private snackBar: MatSnackBar) {
    this.users = this.route.snapshot.data['users'].data;

    this.userList = new MatTableDataSource(this.users);
  }
  
  ngAfterViewInit(): void {
    this.userList.sort = this.sort;
  }

  openUserEditInfoDialog(user: User): void {
    this.dialog.open(UsersEditInfoDialogComponent, {
      data: {user: user},
    });

    this.dialog.afterAllClosed.subscribe(() => {
      this.userService.getUsers().then((res) => {
        this.users = res.data;
        this.userList = new MatTableDataSource(this.users);
        this.userList.sort = this.sort;
      });
    });
  }

  updatePFP(user: User): void {
    this.userService.imageUpdateUserId(user.discordId).then((res) => {
      if (res.code === 200) {
        this.snackBar.open('Profile picture updated!', 'Close', {
          duration: 2000,
        });
        this.userService.getUsers().then((res) => {
          this.users = res.data;
          this.userList = new MatTableDataSource(this.users);
          this.userList.sort = this.sort;
        });
      } else {
        this.snackBar.open('Failed to update profile picture!', 'Close', {
          duration: 2000,
        });
      }
    });
  }

  confirmDeleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete ${user.username}?`)) {
      this.deleteUser(user);
    };
  }

  deleteUser(user: User): void {
    this.userService.deleteUser(user.discordId).then((res) => {
      if (res.code === 200) {
        this.snackBar.open('User deleted!', 'Close', {
          duration: 2000,
        });
        this.userService.getUsers().then((res) => {
          this.users = res.data;
          this.userList = new MatTableDataSource(this.users);
          this.userList.sort = this.sort;
        });
      } else {
        this.snackBar.open('Failed to delete user!', 'Close', {
          duration: 2000,
        });
      }
    });
  }
}
