import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

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
  registerCredentials = { email: '', password: '' };

  constructor(private nav: NavController,
              private alertCtrl: AlertController) { }

  /**
   * Register user
    */
  public register() {
    // Handle registration
    console.log(this.registerCredentials)
    // this.auth.register(this.registerCredentials).subscribe(success => {
    //     if (success) {
    //       this.createSuccess = true;
    //       this.showPopup("Success", "Account created.");
    //     } else {
    //       this.showPopup("Error", "Problem creating account.");
    //     }
    //   },
    //   error => {
    //     this.showPopup("Error", error);
    //   });
  }

  /**
   * Display creation popup to user
   * @param title
   * @param text
   */
  private showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (this.createSuccess) {
              this.nav.popToRoot();
            }
          }
        }
      ]
    });
    alert.present();
  }
}
