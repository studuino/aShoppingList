import { Injectable } from '@angular/core';
import {LoadingController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(private loadingCtrl: LoadingController) { }

  dismissLoadingScreen() {
    this.loadingCtrl.dismiss();
  }

  async presentLoadingScreen(message?: string) {
    let loadingScreen = await this.loadingCtrl.create({
      message: message ? message : 'Loading data...',
      spinner: "crescent",
      translucent: true,
      keyboardClose: true
    });
    await loadingScreen.present();
  }
}
