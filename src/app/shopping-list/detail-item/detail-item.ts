import { Component } from '@angular/core';
import { ShoppingItem } from '../../entities/ShoppingItem';
import { ShoppingCategory } from '../../entities/ShoppingCategory';
import { ShoppingList } from '../../entities/ShoppingList';
import { Observable } from 'rxjs';
import { CategoryProvider } from '../../services/categories/category';
import { ShoppingListProvider } from '../../services/shopping-list/shopping-list';
import { AuthService } from '../../services/auth/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-detail-item',
  templateUrl: 'detail-item.html',
  styleUrls: ['detail-item.scss']
})
export class DetailItemPage {
  selectedItem: ShoppingItem;
  // Category Selected item origins from
  selectedCategory: ShoppingCategory;
  // Current shopping list uid
  selectedShoppingList: ShoppingList;
  // User selected category, that selectedItem should be placed in
  selectorCategoryTitle: string;
  selectorCategory: ShoppingCategory;

  $categories: Observable<ShoppingCategory[]>;

  constructor(public navParams: ActivatedRoute,
              private categoryProvider: CategoryProvider,
              private authProvider: AuthService,
              private shoppingListProvider: ShoppingListProvider) {
    // If we navigated to this page, we will have an item available as a nav param
    navParams.data.toPromise().then((data: ShoppingItem) => this.selectedItem = data);
    navParams.data.toPromise().then((data: ShoppingCategory) => this.selectedCategory = data);
    navParams.data.toPromise().then((data: ShoppingList) => this.selectedShoppingList = data);
    // Set title for the popup selector
    this.selectorCategoryTitle = this.selectedCategory.title;
  }

  ionViewDidEnter() {
    // Get categories from owner userUid of current shopping list
    this.$categories = this.categoryProvider.getCategoriesByUserUid(this.selectedShoppingList.userUid);
  }

  /**
   * Increase amount of selected item
   */
  increaseAmount() {
    this.selectedItem.quantity += 1;
    this.updateSelectedItemInCategory();
  }

  /**
   * Update the currently selected item
   */
  updateSelectedItemInCategory() {
    this.shoppingListProvider.updateShoppingList(this.selectedShoppingList);
  }

  /**
   * Decrease amount of selected item, if more than 1 is available
   */
  decreaseAmount() {
    if (this.selectedItem.quantity > 1) {
      this.selectedItem.quantity -= 1;
      this.updateSelectedItemInCategory();
    }
  }

  /**
   * Move item from selectedCategory to categoryToMoveItemTo by selectorCategoryTitle
   */
  moveItemToCategory() {
    // Find index of item to remove from old category
    const indexOfItemToRemove = this.selectedCategory.items.indexOf(this.selectedItem);
    // Remove item from category
    this.selectedCategory.items.splice(indexOfItemToRemove, 1);

    let categoryInList = false;
    // Check if selector category is in the list
    this.selectedShoppingList.categories
      .forEach(category => {
        if (this.selectorCategory.uid === category.uid) {
          categoryInList = true;
          // Assign selectorcategory to found category
          this.selectorCategory = category;
        }
      });
    // If not
    if (!categoryInList) {
      // Instantiate items
      this.selectorCategory.items = [];
      // And add category
      this.selectedShoppingList.categories.push(this.selectorCategory);
    }
    // Push selected item to new category
    this.selectorCategory.items.push(this.selectedItem);
    // Update the shopping list
    this.shoppingListProvider.updateShoppingList(this.selectedShoppingList);
  }
}
