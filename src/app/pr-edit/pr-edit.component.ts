import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { FileType } from '@/src/enums/fileType.enum';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NominationService } from '@/src/services/nomination';
import { PR } from '@interfaces/pr.interface';
import { PRService } from '@services/pr.service';
import { PrEditAddSongDialogComponent } from '../pr-edit-add-song-dialog/pr-edit-add-song-dialog.component';
import { Song } from '@interfaces/song.interface';
import { User } from '@interfaces/user.interface';
import { UserService } from '@/src/services/user.service';
import { getServerURL } from '@/src/toolbox/toolbox';

@Component({
  selector: 'app-pr-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatSortModule,
    MatInputModule,
    MatCardModule,
    FormsModule,
    MatSelectModule,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  templateUrl: './pr-edit.component.html',
  styleUrl: './pr-edit.component.css',
})
export class PREditComponent implements OnInit, AfterViewInit {
  displayedColumnsSongList: string[] = [
    'artist',
    'title',
    'anime',
    'type',
    'startSample',
    'sampleLength',
    'urlVideo',
    'urlAudio',
    'delete',
  ];
  pr!: PR;
  songList!: MatTableDataSource<Song>;
  creator!: User;
  prService = new PRService();
  currentAudioSource: string | null = null;
  user!: User;
  currentVideoSource: string | null = null;
  tabVideoMode: boolean = false;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {}
  
  async ngOnInit(): Promise<void> {
    this.pr = this.route.snapshot.data['pr'].data;
    this.songList = new MatTableDataSource(this.pr.songList);
    this.creator = (await new UserService().getUser(this.pr.creator)).data;
    this.user = this.route.snapshot.data['auth'].data;
  }

  ngAfterViewInit(): void {
    this.songList.sort = this.sort;
  }

  formatDate(date: string): string {
    const parsedDate = new Date(date);
    return parsedDate.toLocaleDateString();
  }

  async refreshPR(): Promise<void> {
    this.pr = (await this.prService.getPR(this.pr._id)).data;
    this.songList = new MatTableDataSource(this.pr.songList);
  }

  async updatePR(): Promise<void> {
    const response = await this.prService.updatePR(this.pr);
    if (response.code != 200) {
      this.snackBar.open('Failed to update PR', 'Close', {
        duration: 2000,
      });
    }
  }

  async simpleUpdatePRField(): Promise<void> {
    this.updatePR();
  }

  async updatePRField(field: string): Promise<void> {
    const inputElement = document.getElementById(field) as HTMLInputElement;
    const value = inputElement.value;
    this.pr[field] = value;
    this.updatePR();
  }

  async updateSongListField(uuid: string, field: string): Promise<void> {
    const inputElement = document.getElementById(
      `${uuid}-${field}`
    ) as HTMLInputElement;
    let value: number | string;
    if (['startSample', 'sampleLength'].includes(field)) {
      value = parseInt(inputElement.value);
    } else {
      value = inputElement.value;
    }
    this.pr.songList[this.pr.songList.findIndex((song) => song.uuid === uuid)][
      field
    ] = value;
    this.updatePR();
  }

  async addSong(): Promise<void> {
    this.dialog.open(PrEditAddSongDialogComponent, {
      data: {
        prId: this.pr._id,
      },
    });

    this.dialog.afterAllClosed.subscribe(async () => {
      this.pr = (await this.prService.getPR(this.pr._id)).data;
      this.songList = new MatTableDataSource(this.pr.songList);
    });
  }

  confirmDeleteSong(songUuid: string): void {
    const song = this.pr.songList.find((x) => x.uuid === songUuid);
    if (!song) {
      this.snackBar.open('Song not found', 'Close', {
        duration: 2000,
      });
      return;
    }
    const confirmDelete = confirm(
      `Are you sure you want to delete ${song.artist} - ${song.title}?`
    );
    if (confirmDelete) {
      this.deleteSong(songUuid);
    }
  }

  async deleteSong(songUuid: string): Promise<void> {
    const response = await this.prService.deleteSongPR(this.pr._id, songUuid);
    if (response.code != 200) {
      this.snackBar.open('Failed to delete song', 'Close', {
        duration: 2000,
      });
      return;
    }
    this.snackBar.open('Song deleted', 'Close', {
      duration: 2000,
    });

    this.pr = (await this.prService.getPR(this.pr._id)).data;
    this.songList = new MatTableDataSource(this.pr.songList);
  }

  onFileSelected(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file) {
        this.prService.uploadFilePR(this.pr._id, type as FileType, file).then(
          async (response) => {
            if (response.code !== 200) {
              this.snackBar.open(
                `Error uploading file: ${response.data}`,
                'Close',
                {
                  duration: 2000,
                }
              );
              return;
            }
            this.snackBar.open('File uploaded', 'Close', {
              duration: 2000,
            });
            this.refreshPR();
            input.value = '';
          }
        );
      }
    }
  }

  onPRStatsSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
          this.pr.prStats = reader.result as string;
          this.updatePR();

          this.snackBar.open('PR stats updated', 'Close', {
            duration: 2000,
          });

          input.value = '';
        }
      }
    }
  }

  videoLink(uuid: string): string {
    const URL = this.pr.songList.find((x) => x.uuid === uuid)?.urlVideo;
    if (!URL) {
      this.snackBar.open('URL not found', 'Close', {
        duration: 2000,
      });
      return '';
    }
    const isURL = URL.includes('https://');
    return isURL ? URL : `${getServerURL(this.user)}${URL}`;
  }

  getNowPlaying(url: string, field: string): { artist: string; title: string } {
    return {
      artist:
        this.pr.songList.find((x) => url.includes(x[field] as string))?.artist ?? '',
      title:
        this.pr.songList.find((x) => url.includes(x[field] as string))?.title ?? '',
    };
  }

  isYouTubeLink(url: string): boolean {
    return url.includes('youtu');
  }

  getYoutubeId(url: string): string {
    const shortUrlPattern = /youtu\.be\/([a-zA-Z0-9_-]{11})/;
    const longUrlPattern = /youtube\.com\/.*[?&]v=([a-zA-Z0-9_-]{11})/;
    
    let match = url.match(shortUrlPattern);
    if (match && match[1]) {
      return match[1];
    }
  
    match = url.match(longUrlPattern);
    if (match && match[1]) {
      return match[1];
    }
  
    return '';
  }

  getYouTubeEmbedUrl(url: string): string {
    return `https://www.youtube.com/embed/${this.getYoutubeId(url)}?autoplay=1&cc_load_policy=1`;
  }

  sanitizeUrl(url: string): string {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.getYouTubeEmbedUrl(url)) as string
  }

  playVideo(url: string): void {
    this.currentVideoSource = url.includes('https://') || url.includes('youtu')
      ? url
      : `${getServerURL(this.user)}${url}`;
    this.currentAudioSource = null;
  }

  playAudio(url: string): void {
    this.currentVideoSource = null;
    this.currentAudioSource = url.includes('https://')
      ? url
      : `${getServerURL(this.user)}${url}`;
  }

  confirmEndNomination(): void {
    const confirmEndNomination = confirm(
      'Are you sure you want to end the nomination?'
    );
    if (confirmEndNomination) {
      this.endNomination();
    }
  }

  endNomination(): void {
    this.pr.nomination.endNomination = true;
    new NominationService().endNomination(this.pr._id);
  }

  toggleTabVideoMode(): void {
    this.tabVideoMode = !this.tabVideoMode;
  }

  closeVideoPlayer(): void {
    this.currentVideoSource = null;
  }

  closeAudioPlayer(): void {
    this.currentAudioSource = null;
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
  }
}
