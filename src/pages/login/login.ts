import {Component} from '@angular/core';
import {AlertController, IonicPage, Loading, LoadingController, NavController} from 'ionic-angular';
import {AuthProvider} from '../../providers/auth/auth';
import {LoginCredentials} from '../../entities/auth/LoginCredentials';
import {ShoppingListPage} from '../shopping-list/shopping-list';

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
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
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
    this.showLoading();
    // Handle login
    this.authProvider.login(this.registerCredentials)
      .then(() => this.nav.setRoot(ShoppingListPage))
      .catch(err => {
        this.showError(err.message);
      });
  }

  /**
   * Display loading screen
   */
  private showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please stand by..',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  /**
   * Handle errors
   * @param text
   */
  private showError(text) {
    this.loading.dismiss();

    let alert = this.alertCtrl.create({
      title: 'Houston we have a problem!',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

}
