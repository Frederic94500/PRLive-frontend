import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AnnouncePR } from '@/src/interfaces/pr.interface';
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PRService } from '@/src/services/pr.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-pr-detail-announce-pr-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './pr-detail-announce-pr-dialog.component.html',
  styleUrl: './pr-detail-announce-pr-dialog.component.css',
})
export class PRDetailAnnouncePRDialogComponent {
  prId: string;
  announcePRForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<PRDetailAnnouncePRDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.prId = data.prId;
    this.announcePRForm = this.formBuilder.group({
      message: ['', Validators.required],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async onAnnounce(): Promise<void> {
    if (this.announcePRForm.invalid) {
      this.snackBar.open('Please fill in all fields', 'Close', {
        duration: 3000,
      });
      return;
    }

    const announcePR: AnnouncePR = this.announcePRForm.value;
    const response = await new PRService().announcePR(this.prId, announcePR);
    if (response.code === 201) {
      this.snackBar.open('PR announced', 'Close', {
        duration: 3000,
      });
      this.dialogRef.close();
    } else {
      this.snackBar.open(
        `Failed to announce PR: ${response.data || response.message}`,
        'Close',
        {
          duration: 3000,
        }
      );
    }
  }
}
