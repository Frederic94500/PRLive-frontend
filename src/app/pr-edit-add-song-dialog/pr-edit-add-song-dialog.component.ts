import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PRService } from '@/src/services/pr.service';
import { SongInput } from '@/src/interfaces/song.interface';

@Component({
  selector: 'app-pr-edit-add-song-dialog',
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
  templateUrl: './pr-edit-add-song-dialog.component.html',
  styleUrl: './pr-edit-add-song-dialog.component.css',
})
export class PrEditAddSongDialogComponent {
  songData: SongInput;
  prId: string;
  songForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<PrEditAddSongDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.songData = {
      nominatedId: '',
      artist: '',
      title: '',
      anime: '',
      type: '',
      startSample: 0,
      sampleLength: 1,
      urlVideo: '',
      urlAudio: '',
    };
    this.prId = data.prId;
    this.songForm = this.formBuilder.group({
      nominatedId: [this.songData.nominatedId],
      artist: [this.songData.artist, Validators.required],
      title: [this.songData.title, Validators.required],
      anime: [this.songData.anime],
      type: [this.songData.type, Validators.required],
      startSample: [this.songData.startSample, [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]],
      sampleLength: [this.songData.sampleLength, [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]],
      urlVideo: [this.songData.urlVideo, [Validators.required]],
      urlAudio: [this.songData.urlAudio, [Validators.required]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async onSubmit(): Promise<void> {
    if (this.songForm.invalid) {
      this.snackBar.open('Please fill out all required fields.', 'Close', {
        duration: 5000,
      });
      return;
    }
    
    let songData = this.songForm.value;
    songData.nominatedId = songData.nominatedId || null;
    songData.anime = songData.anime || null;
    songData.tiebreak = 0;
    const response = await new PRService().addSongPR(this.prId, this.songForm.value);
    if (response.code === 201) {
      this.snackBar.open('Song added', 'Close', {
        duration: 2000,
      });
      this.dialogRef.close();
    } else {
      this.snackBar.open(`Error when Add Song: ${response.message}`, 'Close', {
        duration: 5000,
      });
    }
  }
}
