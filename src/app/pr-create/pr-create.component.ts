import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PRInput } from '@/src/interfaces/pr.interface';
import { PRService } from '@/src/services/pr.service';
import { Response } from '@/src/interfaces/api.interface';
import { Server } from '@/src/interfaces/server.interface';

@Component({
  selector: 'app-pr-create',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatFormFieldModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatInputModule,
    MatButton,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './pr-create.component.html',
  styleUrl: './pr-create.component.css',
})
export class PRCreateComponent implements OnInit {
  name!: string;
  @Input() prForm!: FormGroup;
  prService: PRService = new PRService();
  isNomination: boolean = false;
  servers: Server[];
  songCount: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
  ) {
    this.servers = this.route.snapshot.data['servers'].data;
  }

  ngOnInit(): void {
    this.prForm = this.formBuilder.group({
      name: ['', Validators.required],
      serverId: ['', Validators.required],
      deadline: ['', Validators.required],
      isNomination: [this.isNomination, Validators.required],
      hidden: [false],
      blind: [false],
      hideNominatedSongList: [false],
      deadlineNomination: [''],
      songPerUser: [1],
      songList: [null],
      mandatoryGSheet: [false],
    });
  }

  toggleNomination(): void {
    this.isNomination = !this.isNomination;
    this.prForm.get('isNomination')?.setValue(this.isNomination);
    console.log(this.prForm.value);
  }

  downloadTemplate(): void {
    const template = [
      {
        nominator: 'Nominated ID (optional)(WIP)',
        artist: 'Artist',
        title: 'Song Title',
        source: 'Anime (optional)',
        type: 'Type',
        startSample: 0,
        sampleLength: 30,
        urlVideo: 'URL to video',
        urlAudio: 'URL to audio (no audio? put URL to video)',
      },
      {
        artist: 'YOASOBI',
        title: 'Kaibutsu',
        source: 'Beastars',
        type: 'Opening 1',
        startSample: 34,
        sampleLength: 30,
        urlVideo: 'https://ladist1.catbox.video/t3j0fc.webm',
        urlAudio: 'https://ladist1.catbox.video/w7mtjf.mp3',
      },
      {
        nominator: '771428089024479263',
        artist: 'MAN WITH A MISSION',
        title: 'Dead End in Tokyo',
        type: 'Musique Originale',
        startSample: 68,
        sampleLength: 30,
        urlVideo: 'https://www.youtube.com/watch?v=JjIiK9VcIsA',
        urlAudio: 'https://files.catbox.moe/gmdrge.mp3',
      },
    ];
    const blob = new Blob([JSON.stringify(template)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'standard-song-list-template.json';
    a.click();
  }

  openJsonInputFile(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => this.onFileChange(event);
    input.click();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result as string);
          console.log(json);
          this.prForm.get('songList')?.setValue(json);
          this.songCount = json.length;
        } catch (e) {
          this.snackBar.open('Invalid JSON file', 'Close', { duration: 2000 });
        }
      };
      reader.readAsText(file);  
    }
  }

  onSubmit(): void {
    if (this.prForm.invalid) {
      this.snackBar.open('Please fill all the fields', 'Close', {
        duration: 2000,
      });
      return;
    }

    const prInput: PRInput = this.prForm.value;
    const response = this.prService.createPR(prInput);
    response.then((res: Response) => {
      if (res.code === 201) {
        this.snackBar.open('PR created successfully', 'Close', {
          duration: 2000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        this.snackBar.open(`Error creating PR ${res.data}`, 'Close', {
          duration: 2000,
        });
      }
    });
  }
}
