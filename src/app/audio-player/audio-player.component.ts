import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.css'
})
export class AudioPlayerComponent {
  @Input() artist: string = '';
  @Input() title: string = '';
  @Input() currentAudioSource: string | null = null;
  @Output() closeAudioPlayerComponent = new EventEmitter<void>();

  constructor() {}

  closeAudioPlayer(): void {
    this.closeAudioPlayerComponent.emit();
    this.currentAudioSource = null;
  }
}
