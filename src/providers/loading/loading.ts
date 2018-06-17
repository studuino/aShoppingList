import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {LoadingController} from 'ionic-angular';

/*
  Generated class for the LoadingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoadingProvider {

  constructor(private loadingCtrl: LoadingController) {
  }

  /**
   * Create loading data screen
   * @return {Loading}
   */
  createLoadingDataScreen() {
    return this.loadingCtrl.create({
      content: 'Loading Data',
      spinner: 'bubbles'
    });
  }

  /**
   * Create a please stand by loading screen
   * @return {Loading}
   */
  createPleaseStandByLoading() {
    return this.loadingCtrl.create({
      content: 'Please stand by..',
      dismissOnPageChange: true
    });
  }

}
