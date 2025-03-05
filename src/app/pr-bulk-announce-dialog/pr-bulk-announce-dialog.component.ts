import { PRStatus } from '@/src/enums/prStatus.enum';
import { PR } from '@/src/interfaces/pr.interface';
import { PRService } from '@/src/services/pr.service';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pr-bulk-announce-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './pr-bulk-announce-dialog.component.html',
  styleUrl: './pr-bulk-announce-dialog.component.css'
})
export class PRBulkAnnounceDialogComponent {
  prs: PR[];
  bulkAnnouncePRForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<PRBulkAnnounceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.prs = data.prs.filter((pr: PR) => pr.status === PRStatus.RANKING || pr.status === PRStatus.NOMINATION);
    this.bulkAnnouncePRForm = this.formBuilder.group({
      prs: [[], Validators.required],
      message: ['', Validators.required],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async onBulkAnnounce(): Promise<void> {
    if (this.bulkAnnouncePRForm.invalid) {
      this.snackBar.open('Please fill in all fields', 'Close', {
        duration: 3000,
      });
      return;
    }

    const prIds: string[] = this.bulkAnnouncePRForm.get('prs')!.value;
    const message: string = this.bulkAnnouncePRForm.get('message')!.value;
    const response = await new PRService().bulkAnnouncePR(prIds, message);
    if (response.code === 201) {
      this.snackBar.open('PRs announced successfully', 'Close', {
        duration: 3000,
      });
      this.dialogRef.close();
    } else {
      this.snackBar.open(`Error announcing PRs: ${response.data || response.message}`,
        'Close',
        {
          duration: 3000,
        }
      );
    }
  }
}
