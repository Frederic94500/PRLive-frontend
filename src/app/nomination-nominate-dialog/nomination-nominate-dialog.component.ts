import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SheetCSVDialogComponent } from '../sheet-csv-dialog/sheet-csv-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { start } from 'repl';
import { NominationService } from '@/src/services/nomination';

@Component({
  selector: 'app-nomination-nominate-dialog',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatInputModule],
  templateUrl: './nomination-nominate-dialog.component.html',
  styleUrl: './nomination-nominate-dialog.component.css',
})
export class NominationNominateDialogComponent {
  @Input() prId: string;
  nominateForm: FormGroup;

  httpsValidator(control: AbstractControl): ValidationErrors | null {
    const url = control.value;
    if (url && !url.startsWith('https://')) {
      return { https: true };
    }
    return null;
  }

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SheetCSVDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.prId = data.prId;

    this.nominateForm = this.formBuilder.group({
      artist: ['', Validators.required],
      title: ['', Validators.required],
      source: [''],
      type: ['', Validators.required],
      startSample: [0, Validators.required],
      urlVideo: ['', [Validators.required, this.httpsValidator]],
      urlAudio: ['', [Validators.required, this.httpsValidator]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async onSubmit(): Promise<void> {
    if (this.nominateForm.invalid) {
      this.snackBar.open('Please fill out all required fields.', 'Close', {
        duration: 3000,
      });
      return;
    }

    let songData = this.nominateForm.value;
    songData.source = songData.source || null;
    songData.sampleLength = 30;
    
    const response = await new NominationService().nominateSong(this.prId, songData);
    if (response.code !== 201) {
      this.snackBar.open(`Failed to nominate song: ${response.message || response.data}`, 'Close', {
        duration: 3000,
      });
      return;
    }

    this.snackBar.open('Song nominated successfully!', 'Close', {
      duration: 3000,
    });
    this.dialogRef.close();
  } 
}
