import { ActivatedRoute, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { User } from '@/src/interfaces/user.interface';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  user: User;
  isLogged: boolean;

  constructor(private route: ActivatedRoute) {
    this.user = this.route.snapshot.data['auth'].data;
    this.isLogged = this.user ? true : false;
  }
}
