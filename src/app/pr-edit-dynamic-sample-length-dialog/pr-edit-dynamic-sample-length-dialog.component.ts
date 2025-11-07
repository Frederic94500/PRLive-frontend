import { PR, PROutput } from '@/src/interfaces/pr.interface';
import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pr-edit-dynamic-sample-length-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './pr-edit-dynamic-sample-length-dialog.component.html',
  styleUrl: './pr-edit-dynamic-sample-length-dialog.component.css'
})
export class PrEditDynamicSampleLengthDialogComponent {
  pr: PR;
  prOutput: PROutput;
  dynamicSampleLengthForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<PrEditDynamicSampleLengthDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.pr = data.pr;
    this.prOutput = data.prOutput;
    this.dynamicSampleLengthForm = this.formBuilder.group({
      lastPosSampleLength: [1, [Validators.required, Validators.min(1)]],
      firstPosSampleLength: [10, [Validators.required, Validators.min(1)]],
    }, { validators: this.sampleLengthValidator });
  }

  sampleLengthValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const first = group.get('firstPosSampleLength')?.value;
    const last = group.get('lastPosSampleLength')?.value;

    if (first < last) {
      return { invalidLength: true };
    }
    return null;
  };

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.dynamicSampleLengthForm.invalid) {
      this.snackBar.open('Please fill in all required fields.', 'Close', {
        duration: 3000,
      });
      return;
    }

    console.log(this.pr);
    console.log(this.prOutput);

    const rankMap = new Map<string, number>();
    this.prOutput.songList.forEach(song => {
      rankMap.set(song.uuid, song.rankPosition);
    });
    this.pr.songList.sort((a, b) => {
      const rankA = rankMap.get(a.uuid) || 0;
      const rankB = rankMap.get(b.uuid) || 0;
      return rankA - rankB;
    });

    const numberOfSongs = this.pr.songList.length;
    const lastPosSampleLength = this.dynamicSampleLengthForm.value.lastPosSampleLength;
    const firstPosSampleLength = this.dynamicSampleLengthForm.value.firstPosSampleLength;
    const sampleLengthIncrement = (firstPosSampleLength - lastPosSampleLength) / (numberOfSongs - 1);
    this.pr.songList.forEach((song, index) => {
      song.sampleLength = parseFloat((firstPosSampleLength - index * sampleLengthIncrement).toFixed(2));
    });

    this.pr.songList.sort((a, b) => a.orderId - b.orderId);
    this.snackBar.open('Sample lengths updated successfully.', 'Close', {
      duration: 3000,
    });

    this.dialogRef.close(this.pr);
  }
}
