import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css'
})
export class VideoPlayerComponent implements OnInit {
  @Input() artist: string = '';
  @Input() title: string = '';
  @Input() currentVideoSource: string | null = null;
  @Output() closeVideoPlayerComponent = new EventEmitter<void>();
  sanitizedUrl: string | null = null;

  constructor(public sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.sanitizedUrl = this.sanitizeUrl(this.currentVideoSource!);
  }

  closeVideoPlayer(): void {
    this.closeVideoPlayerComponent.emit();
    this.currentVideoSource = null;
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
    return `https://www.youtube.com/embed/${this.getYoutubeId(
      url
    )}?autoplay=1&cc_load_policy=1`;
  }

  sanitizeUrl(url: string): string {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      this.getYouTubeEmbedUrl(url)
    ) as string;
  }
}
