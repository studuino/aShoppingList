import {Injectable} from '@angular/core';
import {AlertButton, AlertController} from 'ionic-angular';

/*
  Generated class for the AlertProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AlertProvider {

  constructor(private alertCtrl: AlertController) {
  }

  /**
   * Create standard alert with input for user
   * @param {string} title
   * @param {string} message
   * @param successButton
   * @return {Alert}
   */
  getInputAlert(title: string, message: string, successButton: AlertButton) {
    return this.alertCtrl.create({
      title: title,
      message: message,
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        successButton
      ]
    });
  }

  /**
   * Create standard confirm alert for user
   * @param {string} title
   * @param {string} message
   * @param {AlertButton} confirmButton
   * @return {Alert}
   */
  getConfirmAlert(title: string, message: string, confirmButton: AlertButton) {
    return this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        confirmButton
      ]
    });
  }

  /**
   * Get error alert displaying provided text
   * @param {string} text
   * @return {Alert}
   */
  getErrorAlert(text: string) {
    return this.alertCtrl.create({
      title: 'Houston we have a problem!',
      subTitle: text,
      buttons: ['OK']
    });
  }

}
