import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { PR } from '@/src/interfaces/pr.interface';
import { Song } from '@/src/interfaces/song.interface';
import { User } from '@/src/interfaces/user.interface';
import { VideoPlayerComponent } from '../video-player/video-player.component';
import { getServerURL } from '@/src/toolbox/toolbox';

@Component({
  selector: 'app-confirm-join-pr',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, VideoPlayerComponent],
  templateUrl: './confirm-join-pr.component.html',
  styleUrl: './confirm-join-pr.component.css',
})
export class ConfirmJoinPRComponent implements AfterViewInit {
  user: User;
  pr: PR;
  songList: MatTableDataSource<Song>;
  currentAudioSource: string | null = null;
  currentVideoSource: string | null = null;
  tabVideoMode: boolean = false;

  displayedColumnsSongList = ['artist', 'title', 'source', 'type', 'urlVideo', 'urlAudio'];
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private snackBar: MatSnackBar, private router: Router) {
    this.user = this.route.snapshot.data['auth'].data;
    this.pr = this.route.snapshot.data['pr'].data;

    if (this.pr.nomination) {
      this.router.navigate(['/nomination', this.pr._id]);
    }

    this.songList = new MatTableDataSource(this.pr.songList);
  }

  ngAfterViewInit(): void {
    this.songList.sort = this.sort;
  }

  passedDeadline(date: string): string {
    if (Date.parse(date) < Date.now()) return 'red-value';
    return 'green-value';
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

  playVideo(url: string): void {
    this.currentVideoSource = url.includes('youtu') || url.includes('https://')
      ? url
      : `${getServerURL(this.user)}${url}`;
    this.currentAudioSource = null;
  }

  playAudio(url: string): void {
    this.currentVideoSource = null;
    if (this.currentAudioSource === url) {
      this.currentAudioSource = null;
      return;
    }
    this.currentAudioSource = url.includes('https://')
      ? url
      : `${getServerURL(this.user)}${url}`;
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

  onClickJoin(): void {
    this.snackBar.open('You have joined the PR', 'Close', {
      duration: 2000,
    });
    this.router.navigate(['/sheet', this.pr._id]);
  }
}
