import {Component} from '@angular/core';
import {AlertController, IonicPage, Loading, LoadingController, NavController} from 'ionic-angular';

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
  registerCredentials = {email: '', password: ''};

  constructor(private nav: NavController,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  /**
   * Send user to register page
   */
  public createAccount() {
    this.nav.push('RegisterPage');
  }

  /**
   * Login user
   */
  public login() {
    this.showLoading();
    // Handle login
    // this.auth.login(this.registerCredentials)
    //   .subscribe(allowed => {
    //     if (allowed) {
    //       this.nav.setRoot('HomePage');
    //     } else {
    //       this.showError("Access Denied");
    //     }
    //   },
    //   error => {
    //     this.showError(error);
    //   });
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
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

}
