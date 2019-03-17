import { LoadingController } from '@ionic/angular';
import { LoginCredentials } from '../entities/auth/LoginCredentials';
import { AlertProvider } from '../services/alert/alert';
import { AuthService } from '../services/auth/auth';
import { Router } from '@angular/router';
import { ModuleRouteNames } from '../module-route.names';
import { LoginRouteNames } from './LoginRouteNames';
import { Component } from '@angular/core';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['login.scss']
})
export class LoginPage {
  registerCredentials: LoginCredentials = {
    email: '',
    password: ''
  };

  constructor(private nav: Router,
              private alertProvider: AlertProvider,
              private authProvider: AuthService,
              private loadingCtrl: LoadingController) {
  }

  /**
   * Send user to register page
   */
  createAccount() {
    this.nav.navigateByUrl(ModuleRouteNames.LOGIN + LoginRouteNames.REGISTER);
  }

  /**
   * Login user
   */
  login() {
    // Ensure no space at end!
    this.registerCredentials.email.trim();
    // Handle login
    this.authProvider.login(this.registerCredentials)
      .then(() => this.nav.navigateByUrl(ModuleRouteNames.SHOPPING_LIST))
      .catch(err => {
        this.showError(err.message);
      });
  }

  /**
   * Handle errors
   */
  private async showError(text) {
    this.loadingCtrl.dismiss();

    (await this.alertProvider.getErrorAlert(text)).present();
  }

}
