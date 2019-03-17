import {Injectable} from '@angular/core';
import {AlertController} from '@ionic/angular';

/*
  Generated class for the AlertProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable(
    { providedIn: 'root' }
)
export class AlertProvider {

    constructor(private alertCtrl: AlertController) {
    }

    /**
     * Create standard alert with input for user
     */
    async getInputAlert(title: string, message: string, successButton) {
        return await this.alertCtrl.create({
            header: title,
            message: message,
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
     */
    async getConfirmAlert(title: string, message: string, confirmButton) {
        return await this.alertCtrl.create({
            header: title,
            subHeader: message,
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
     */
    async getErrorAlert(text: string) {
        return await this.alertCtrl.create({
            header: 'Houston we have a problem!',
            subHeader: text,
            buttons: ['OK']
        });
    }

}
