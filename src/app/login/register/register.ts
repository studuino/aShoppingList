import { Component } from '@angular/core';
import { AlertProvider } from '../../services/alert/alert';
import { AuthService } from '../../services/auth/auth';
import { Router } from '@angular/router';
import { ModuleRouteNames } from '../../module-route.names';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  styleUrls: ['register.scss']
})
export class RegisterPage {

  registerCredentials = {email: '', password: ''};

  constructor(private nav: Router,
              private alertProvider: AlertProvider,
              private authProvider: AuthService) {
  }

  /**
   * Register user
   */
  public register() {
    // Ensure no space at end!
    this.registerCredentials.email.trim();
    // Handle registration
    this.authProvider.registerWithEmailAndPassword(this.registerCredentials)
      .then(() => {
        this.nav.navigateByUrl(ModuleRouteNames.ROOT);
      })
      .catch(err => {
        this.showPopup('Error', err.message);
      });
  }

  /**
   * Display creation popup to user
   */
  private async showPopup(title, text) {
    const alert = await this.alertProvider.getConfirmAlert(title, text, {
      text: 'OK',
      handler: data => {
        this.nav.navigateByUrl(ModuleRouteNames.ROOT);
      }
    });
    alert.present();
  }
}
