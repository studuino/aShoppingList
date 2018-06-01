import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {CategoryProvider} from '../../providers/categories/category';
import {AlertProvider} from '../../providers/alert/alert';

@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {

  $categories;
  userUid = 'fprXH7XZKsWEa0T5TrAv';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private categoryProvider: CategoryProvider,
              private alertProvider: AlertProvider) {
  }

  ionViewDidLoad() {
    this.$categories = this.categoryProvider.getCategoriesByUserUid(this.userUid);
  }

  /**
   * Prompt user for new category name
   */
  promptForNewCategory() {
    let prompt = this.alertProvider.getAlert(
      'New Category',
      'Enter a name for this new category',
      {
        text: 'Save',
        handler: data => {
          // Get new category name from user input data
          const nameOfNewCategory = data.title;
          this.createCategory(nameOfNewCategory)
        }
      });
    prompt.present();
  }

  /**
   * Create a new category
   * @param {string} nameOfNewCategory
   */
  createCategory(nameOfNewCategory: string) {
    this.categoryProvider.createCategoryForUserUid(this.userUid, nameOfNewCategory);
  }

}
