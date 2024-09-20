import { AuthService } from "@services/auth.service";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable()
export class AuthGuard {
  constructor(private router: Router) {}
  
  public async canActivate(): Promise<boolean> {
    const authService = new AuthService();
    if ((await authService.getWhoAmI()).code !== 200) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  public async protectedRoute(): Promise<boolean> {
    const authService = new AuthService();
    const response = await authService.getWhoAmI();
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
}