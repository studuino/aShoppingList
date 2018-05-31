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
   * Create standard alert for user
   * @param {string} title
   * @param {string} message
   * @param successButton
   * @return {Alert}
   */
  getAlert(title: string, message: string, successButton: AlertButton) {
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

}
