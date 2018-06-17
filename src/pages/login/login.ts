import {Component} from '@angular/core';
import {IonicPage, Loading, NavController} from 'ionic-angular';
import {AuthProvider} from '../../providers/auth/auth';
import {LoginCredentials} from '../../entities/auth/LoginCredentials';
import {ShoppingListPage} from '../shopping-list/shopping-list';
import {LoadingProvider} from '../../providers/loading/loading';
import {AlertProvider} from '../../providers/alert/alert';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: Loading;
  registerCredentials: LoginCredentials = {
    email: '',
    password: ''
  };

  constructor(private nav: NavController,
              private alertProvider: AlertProvider,
              private loadingProvider: LoadingProvider,
              private authProvider: AuthProvider) {
  }

  ionViewDidLoad() {
  }

  /**
   * Send user to register page
   */
  createAccount() {
    this.nav.push('RegisterPage');
  }

  /**
   * Login user
   */
  login() {
    // Ensure no space at end!
    this.registerCredentials.email.trim();
    // Handle login
    this.authProvider.login(this.registerCredentials)
      .then(() => this.nav.setRoot(ShoppingListPage))
      .catch(err => {
        this.showError(err.message);
      });
  }

  /**
   * Handle errors
   * @param text
   */
  private showError(text) {
    this.loading.dismiss();

    let alert = this.alertProvider.getErrorAlert(text);
    alert.present();
  }

}
