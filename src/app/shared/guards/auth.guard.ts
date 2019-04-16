import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../../auth/shared/auth.service';
import { ModuleRoutes } from '../../ModuleRoutes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private router: Router,
              private authService: AuthService) {
  }

  async canActivate(): Promise<boolean> {
    const loggedIn = this.authService.isAuthenticated();

    if (!loggedIn) {
      console.log('Not authenticated');
      this.router.navigateByUrl(ModuleRoutes.LOGIN);
    }

    return loggedIn;
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate();
  }

}
