import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { Server } from '@/src/enums/server.enum';
import { UserModel } from '@models/user.model';
import { UserService } from '@/src/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule,
    
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  userService = new UserService();
  user!: UserModel;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.user = this.route.snapshot.data['auth'].data;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e: any) => {
          const response = await this.userService.imageUpload(file);
          if (response.code !== 200) {
            this.snackBar.open(
              `Error uploading image: ${response.data}`,
              'Close',
              {
                duration: 2000,
              }
            );
            return;
          }
          this.user.image = response.data;
          input.value = '';
          this.onChange();
        };
        reader.readAsDataURL(file);
      }
    }
  }

  isValidImageUrl(url: string): boolean {
    const pattern = /\.(png|jpe?g|gif|webp)$/i;
    return pattern.test(url);
  }

  onChange() {
    if (!this.user.name) {
      this.snackBar.open('Cannot save without a name', 'Close', {
        duration: 2000,
      });
      return;
    }
    if (!this.user.image) {
      this.snackBar.open('Cannot save without an image', 'Close', {
        duration: 2000,
      });
      return;
    }
    if (!this.isValidImageUrl(this.user.image)) {
      this.snackBar.open('Invalid image URL', 'Close', {
        duration: 2000,
      });
      return;
    }
    this.user.server = this.user.server || Server.EU;
    this.userService.editUser(this.user).then((response) => {
      if (response.code === 200) {
        this.snackBar.open('Profile updated', 'Close', {
          duration: 2000,
        });
      } else {
        this.snackBar.open('Error updating profile', 'Close', {
          duration: 2000,
        });
      }
    });
  }
}
