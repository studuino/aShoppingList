import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ShoppingCategory } from '../entities/ShoppingCategory';
import { CategoryService } from '../shared/firestore/category.service';
import { AuthService } from '../auth/shared/auth.service';
import { AlertService } from '../shared/services/alert.service';
import { LocationWithSortedCategoriesService } from '../shared/firestore/location-with-sorted-categories.service';
import { IonItemSliding } from '@ionic/angular';
import { ShoppingListService } from '../shared/firestore/shopping-list.service';

@Component({
  selector: 'a-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  pageTitle = 'Categories';
  $categories: Observable<ShoppingCategory[]>;

  constructor(private categoryService: CategoryService,
              private authService: AuthService,
              private alertService: AlertService,
              private locationService: LocationWithSortedCategoriesService,
              private shoppingListService: ShoppingListService) {
  }

  ngOnInit() {
    this.$categories = this.categoryService.getCategoriesByUserUid(this.authService.getUserUid());
  }

  async delete(category: ShoppingCategory, slider: IonItemSliding) {
    await this.categoryService.delete(category.uid);
    slider.close();

    // Remove category from locations
    const userUid = this.authService.getUserUid();
    await this.locationService.removeCategoryFromAllLocations(userUid, category);

    // Filter out category from current shopping lists categories array
    this.shoppingListService.removeCategoryFromAllShoppingLists(userUid, category);
  }

  async promptForNewCategory() {
    const prompt = await this.alertService.getInputAlert(
      'New Category',
      'Enter a name for this new category',
      {
        text: 'Save',
        handler: data => {
          // Get new category name from user input data
          const nameOfNewCategory = data.title;
          this.createCategory(nameOfNewCategory);
        }
      });
    prompt.present();
  }

  private async createCategory(nameOfNewCategory: string) {
    const category = await this.categoryService.createCategory(this.authService.getUserUid(), nameOfNewCategory);
    this.locationService.addCategoryToAllLocations(this.authService.getUserUid(), category);
  }
}
