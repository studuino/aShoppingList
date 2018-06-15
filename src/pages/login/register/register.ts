import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {AuthProvider} from '../../../providers/auth/auth';
import {AlertProvider} from '../../../providers/alert/alert';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  createSuccess = false;
  registerCredentials = {email: '', password: ''};

  constructor(private nav: NavController,
              private alertProvider: AlertProvider,
              private authProvider: AuthProvider) {
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
        this.createSuccess = true;
        this.showPopup("Success", "Account created.")
      })
      .catch(err => {
        this.showPopup("Error", err.message);
      });
  }

  /**
   * Display creation popup to user
   * @param title
   * @param text
   */
  private showPopup(title, text) {
    let alert = this.alertProvider.getConfirmAlert(title, text, {
      text: 'OK',
      handler: data => {
        if (this.createSuccess) {
          this.nav.popToRoot();
        }
      }
    });
    alert.present();
  }
}
