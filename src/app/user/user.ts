/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { Component } from '@angular/core';
import { ShoppingUser } from '../entities/auth/ShoppingUser';
import { AlertProvider } from '../services/alert/alert';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ModuleRouteNames } from '../module-route.names';


@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
  styleUrls: ['user.scss']
})
export class UserPage {

  $currentUser: Observable<ShoppingUser>;

  constructor(public nav: Router,
              private authProvider: AuthService,
              private alertProvider: AlertProvider) {
    this.$currentUser = authProvider.getCurrentUser()
      .pipe(map(user => user as ShoppingUser));
  }

  /**
   * Prompt user to delete account
   */
  async promptToDeleteAccount(uid: string) {
    const deleteAlert = await this.alertProvider.getConfirmAlert(
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
   */
  private deleteAccount() {
    this.authProvider.deleteAccount()
      .then(() => {
        this.authProvider.logout()
          .then(() => {
            this.nav.navigateByUrl(ModuleRouteNames.LOGIN)
              .then(async () => {
                (await this.alertProvider.getConfirmAlert(
                  'Account Deleted',
                  'Hope to see you again someday!',
                  {
                    text: 'Roger!'
                  })).present();
              });
          });
      });
  }
}
