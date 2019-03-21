import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ModuleRoutes } from '../../routing/ModuleRoutes';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  pageTitle = 'Welcome to aShoppingList!';

  credentials = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
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
