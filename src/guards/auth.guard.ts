import { AuthService } from "@services/auth.service";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable()
export class AuthGuard {
  constructor(private router: Router, private authService: AuthService) {}
  
  public async canActivate(): Promise<boolean> {
    if ((await this.authService.getWhoAmI()).code !== 200) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  public async protectedRoute(): Promise<boolean> {
    const response = await this.authService.getWhoAmI();
    if (response.code !== 200) {
      this.router.navigate(['/login']);
      return false;
    }
    if (response.data.role === 'user') {
      this.router.navigate(['/error'], { queryParams: { code: 403, message: response.data } });
      return false;
    }
    return true;
  }

  public async adminRoute(): Promise<boolean> {
    if ((await this.authService.getWhoAmI()).data.role !== 'admin') {
      this.router.navigate(['/error'], { queryParams: { code: 403, message: 'You are not an admin' } });
      return false;
    }
    return true;
  }
}