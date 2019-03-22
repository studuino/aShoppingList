import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { ModuleRoutes } from '../../routing/ModuleRoutes';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  pageTitle = 'Welcome to aShoppingList!';

  credentials;

  constructor(private authService: AuthService,
              private navCtrl: NavController,
              private menuCtrl: MenuController) {
    this.resetCredentials();
  }

  private resetCredentials() {
    this.credentials = {
      email: '',
      password: ''
    };
  }

  login() {
    // Ensure no space at end!
    this.credentials.email.trim();
    this.authService.login(this.credentials)
      .then(() => {
        this.menuCtrl.enable(true);
        this.navCtrl.navigateRoot(ModuleRoutes.HOME);
      })
      .catch(error => console.log(error));
  }
}
