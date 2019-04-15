import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class InformationService {

  constructor(private alertCtrl: AlertController) {
  }

  /**
   * Create standard alert for deletion
   */
  async getDeletePrompt(title: string, messageForAlert: string, successHandler) {
    return await this.alertCtrl.create({
      header: title,
      message: `<strong>${messageForAlert}</strong>`,
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          cssClass: 'danger',
          handler: successHandler
        }
      ]
    });
  }

  /**
   * Create standard alert with input for user
   */
  async getInputTitlePrompt(title: string, messageForAlert: string, successHandler) {
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
        {
          text: 'Save',
          handler: successHandler
        }
      ]
    });
  }
}
