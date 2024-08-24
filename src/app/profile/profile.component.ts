import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
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
  profileForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.user = this.route.snapshot.data['auth'].data;
    this.profileForm = this.formBuilder.group({
      name: [this.user.name],
      image: [this.user.image],
    });
  }

  onSaveButtonClick() {
    this.user.name = this.profileForm.value.name;
    this.user.image = this.profileForm.value.image;
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
