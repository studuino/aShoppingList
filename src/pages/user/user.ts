import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AuthProvider} from '../../providers/auth/auth';
import {Observable} from 'rxjs/Observable';
import {ShoppingUser} from '../../entities/auth/ShoppingUser';
import {AlertProvider} from '../../providers/alert/alert';
import {LoginPage} from '../login/login';

/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {

  $currentUser: Observable<ShoppingUser>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private authProvider: AuthProvider,
              private alertProvider: AlertProvider) {
    this.$currentUser = authProvider.getCurrentUser()
      .map(user => user as ShoppingUser);
  }

  ionViewDidLoad() {
  }

  /**
   * Prompt user to delete account
   * @param {string} uid
   */
  promptToDeleteAccount(uid: string) {
    const deleteAlert = this.alertProvider.getConfirmAlert(
      'Warning!',
      'We are really sad to see you go, are you absolutely certain? :´( This can not be undone!',
      {
        text: 'Goodbye',
        handler: value => {
          this.deleteAccount();
        }
      });
    deleteAlert.present();
  }

  /**
   * Delete user account
   * @param {string} uid
   */
  private deleteAccount() {
    this.authProvider.deleteAccount()
      .then(() => {
        this.authProvider.logout()
          .then(() => {
            this.navCtrl.push('LoginPage')
              .then(() => {
                this.alertProvider.getConfirmAlert(
                  'Account Deleted',
                  'Hope to see you again someday!',
                  {
                    text: 'Roger!'
                  }).present();
              });
          });
      });
  }
}
