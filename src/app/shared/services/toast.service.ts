import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastCtrl: ToastController) {
  }

  /**
   * Create and return standard toast with provided message
   */
  async getToast(message: string) {
    return this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      keyboardClose: true,
      closeButtonText: 'Roger!'
    });
  }
}
