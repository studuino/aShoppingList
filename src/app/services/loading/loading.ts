import {Injectable} from '@angular/core';
import { LoadingController } from '@ionic/angular';

/*
  Generated class for the LoadingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable(
    { providedIn: 'root' }
)
export class LoadingProvider {

  constructor(private loadingCtrl: LoadingController) {
  }

  /**
   * Create loading data screen
   */
  async createLoadingDataScreen() {
    return await this.loadingCtrl.create({
      message: 'Loading Data',
      spinner: 'bubbles'
    });
  }

  /**
   * Create a please stand by loading screen
   */
  createPleaseStandByLoading() {
    return this.loadingCtrl.create({
      message: 'Please stand by..',
      backdropDismiss: true
    });
  }

}
