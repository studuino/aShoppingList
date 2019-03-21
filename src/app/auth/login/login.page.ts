import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ModuleRoutes } from '../../routing/ModuleRoutes';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  pageTitle = 'Welcome to aShoppingList!';

  credentials;

  constructor(private authService: AuthService,
              private router: Router) {
    this.credentials = {
      email: '',
      password: ''
    };
  }

  ionViewDidLeave() {
    this.credentials = {
      email: '',
      password: ''
    };
  }

  login() {
    // Ensure no space at end!
    this.credentials.email.trim();
    // TODO ALH: Handle login
    this.authService.login(this.credentials)
      .then(() => this.router.navigateByUrl(ModuleRoutes.HOME))
      .catch(error => console.log(error));
  }
}
