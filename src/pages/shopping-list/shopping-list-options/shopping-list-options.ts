import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {CategoriesPage} from '../../categories/categories';

/**
 * Generated class for the ShoppingListOptionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-shopping-list-options',
  templateUrl: 'shopping-list-options.html',
})
export class ShoppingListOptionsPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShoppingListOptionsPage');
  }

  /**
   * Navigate user to manage categories
   */
  navigateToManageCategories() {
    this.navCtrl.push(CategoriesPage)
      .then(() => this.viewCtrl.dismiss());
  }
}
