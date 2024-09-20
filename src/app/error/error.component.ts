import { ActivatedRoute, RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css',
})
export class ErrorComponent implements OnInit {
  errorCode: number = 404;
  errorMessage: string = 'Page not found';
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['code']) {
        this.errorCode = params['code'];
        this.errorMessage = params['message'];

        if (this.errorCode == 403) {
          this.errorMessage = 'Forbidden';
        } else if (this.errorCode == 404) {
          this.errorMessage = params['message'] || 'Page not found';
        } else if (this.errorCode == 500) {
          this.errorMessage = 'Internal Server Error';
        } else {
          this.errorMessage = 'Unknown error';
        }
      }
    });
  }
}
