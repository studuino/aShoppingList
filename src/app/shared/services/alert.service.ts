import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertCtrl: AlertController) {
  }

  /**
   * Create standard alert with input for user
   */
  async getInputAlert(title: string, messageForAlert: string, successButton) {
    return await this.alertCtrl.create({
      header: title,
      message: messageForAlert,
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Your title here'
        }
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
