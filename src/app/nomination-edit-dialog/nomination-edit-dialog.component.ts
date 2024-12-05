import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Song } from '@/src/interfaces/song.interface';
import { NominationService } from '@/src/services/nomination.service';

@Component({
  selector: 'app-nomination-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
  ],
  templateUrl: './nomination-edit-dialog.component.html',
  styleUrl: './nomination-edit-dialog.component.css',
})
export class NominationEditDialogComponent {
  prId: string;
  song: Song;
  editForm: FormGroup;

  constructor(
    private snackBar: MatSnackBar,
    private nominationService: NominationService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NominationEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.prId = data.prId;
    this.song = data.song;
    this.editForm = this.formBuilder.group({
      artist: [this.song.artist, Validators.required],
      title: [this.song.title, Validators.required],
      source: [this.song.source],
      type: [this.song.type, Validators.required],
      startSample: [this.song.startSample, Validators.required],
      urlVideo: [
        this.song.urlVideo,
        [Validators.required, this.httpsValidator],
      ],
      urlAudio: [
        this.song.urlAudio,
        [Validators.required, this.httpsValidator],
      ],
    });
  }

  httpsValidator(control: AbstractControl): ValidationErrors | null {
    const url = control.value;
    if (url && !url.startsWith('https://')) {
      return { https: true };
    }
    return null;
  }

  startSampleValidator(control: AbstractControl): ValidationErrors | null {
    const startSample = control.value;
    if (startSample < 0) {
      return { startSample: true };
    }
    return null;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.editForm.invalid) {
      this.snackBar.open('Please fill out all required fields.', 'Close', {
        duration: 2000,
      });
      return;
    }

    let songData = this.editForm.value;
    songData.source = songData.source || '';
    this.nominationService
      .editNominationSong(this.prId, this.song.uuid, songData)
      .then((response) => {
        if (response.code !== 200) {
          this.snackBar.open(`Failed to edit song. Reason: ${response.data || response.message}`, 'Close', {
            duration: 2000,
          });
          return;
        }
        this.snackBar.open('Song edited successfully.', 'Close', {
          duration: 2000,
        });
        this.dialogRef.close(this.song);
      });
  }
}
