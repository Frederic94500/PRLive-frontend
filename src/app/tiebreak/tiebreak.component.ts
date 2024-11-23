import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PRService } from '@/src/services/pr.service';
import { Tie } from '@/src/interfaces/pr.interface';
import { User } from '@/src/interfaces/user.interface';
import { modifyTieURL } from '@/src/toolbox/toolbox';

@Component({
  selector: 'app-tiebreak',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatTooltipModule, MatIconModule],
  templateUrl: './tiebreak.component.html',
  styleUrl: './tiebreak.component.css'
})
export class TiebreakComponent implements OnInit {
  user: User;
  tie: Tie;

  constructor(private prService: PRService, private snackBar: MatSnackBar, private route: ActivatedRoute) {
    this.user = this.route.snapshot.data['auth'].data;
    this.tie = this.route.snapshot.data['tie'].data;
  }

  ngOnInit() {
    this.tie = modifyTieURL(this.tie, this.user);
  }

  isCreator() {
    return this.user.role === 'admin' || this.user.role === 'creator';
  }

  onWheel(event: WheelEvent) {
    event.preventDefault();
  }

  onCopyLink() {
    const el = document.createElement('textarea');
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.snackBar.open('Link copied to clipboard!', 'Close', {
      duration: 2000,
    });
  }

  onSubmit() {
    const tiebreak = this.tie.tieSongs.map((tieSongs) => {
      return tieSongs.map((tieSong) => {
        return {
          uuid: tieSong.uuid,
          tiebreak: Number((document.getElementById(tieSong.uuid) as HTMLInputElement)?.value) || 0,
        };
      });
    });

    console.log(tiebreak);

    let verified = true;
    tiebreak.forEach((tieSongs) => {
      const groupTiebreak = tieSongs.map((tieSong) => tieSong.tiebreak);
      const setTiebreak = new Set(groupTiebreak);
      if (setTiebreak.size !== tieSongs.length) {
        this.snackBar.open('Error: Duplicate tiebreaks', 'Close', {
          duration: 2000,
        });
        verified = false;
      }
    });
    if (!verified) {
      return;
    }
    
    this.prService.tiebreak(this.tie.prId, { tieSongs: tiebreak }).then((response) => {
      if (response.code === 200) {
        this.snackBar.open('Tiebreak submitted!', 'Close', {
          duration: 2000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        this.snackBar.open(response.data || response.message, 'Close', {
          duration: 2000,
        });
      }
    });
  }
}
