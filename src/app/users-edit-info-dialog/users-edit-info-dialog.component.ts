import { Server } from '@/src/enums/server.enum';
import { User } from '@/src/interfaces/user.interface';
import { UserService } from '@/src/services/user.service';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-users-edit-info-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatOptionModule,
  ],
  templateUrl: './users-edit-info-dialog.component.html',
  styleUrl: './users-edit-info-dialog.component.css',
})
export class UsersEditInfoDialogComponent {
  user: User;
  userForm: FormGroup;
  servers: string[] = Object.values(Server);

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UsersEditInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = data.user;
    this.userForm = this.formBuilder.group({
      name: [this.user.name, Validators.required],
      image: [this.user.image, [Validators.required, Validators.pattern('https?://.+')]],
      role: [this.user.role, [Validators.required, this.roleValidator]],
      server: [this.user.server, [Validators.required, this.serverValidator]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  roleValidator(control: AbstractControl): Validators | null {
    const validRoles = ['admin', 'creator', 'user'];
    if (!validRoles.includes(control.value)) {
      return { invalidRole: true };
    }
    return null;
  }

  serverValidator(control: AbstractControl): Validators | null {
    const validServers = ['EU', 'NA1', 'NA2'];
    if (!validServers.includes(control.value)) {
      return { invalidServer: true };
    }
    return null;
  }

  openFileSelector(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = "image/png, image/jpeg, image/gif, image/webp";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.userService.imageUploadUserId(file, this.user.discordId).then((res) => {
          if (res.code === 200) {
            this.snackBar.open('Profile picture updated!', 'Close', {
              duration: 2000,
            });
            this.userForm.controls['image'].setValue(res.data);
          } else {
            this.snackBar.open('Failed to update profile picture!', 'Close', {
              duration: 2000,
            });
          }
      })};
    };
    input.click();
  }

  onSave(): void {
    if (this.userForm.invalid) {
      this.snackBar.open('Please fill out all fields', 'Close', {
        duration: 2000,
      });
      return;
    }

    this.userService.editUserId(this.userForm.value, this.user.discordId).then((res) => {
      if (res.code === 200) {
        this.snackBar.open('User updated!', 'Close', {
          duration: 2000,
        });
        this.dialogRef.close();
      } else {
        this.snackBar.open('Error updating user', 'Close', {
          duration: 2000,
        });
      }
    });
  }
}
