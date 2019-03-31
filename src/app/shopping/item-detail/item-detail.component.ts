import { Component } from '@angular/core';
import { ShoppingItem } from '../../entities/ShoppingItem';
import { ShoppingCategory } from '../../entities/ShoppingCategory';
import { ShoppingListService } from '../../shared/firestore/shopping-list.service';
import { ShoppingList } from '../../entities/ShoppingList';
import { AuthService } from '../../auth/shared/auth.service';
import { CategoryService } from '../../shared/firestore/category.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'a-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
})
export class ItemDetailComponent {
  selectedItem: ShoppingItem;
  selectedCategory: ShoppingCategory;
  selectedShoppingList: ShoppingList;
  $categories: Observable<ShoppingCategory[]>;

  constructor(private shoppingListService: ShoppingListService,
              private authService: AuthService,
              private categoriesService: CategoryService) {
    this.selectedItem = this.shoppingListService.currentItem;
    this.selectedCategory = this.shoppingListService.currentCategory;
    this.selectedShoppingList = this.shoppingListService.currentShoppingList;
    this.$categories = this.categoriesService.getCategoriesByUserUid(this.authService.getUserUid());
  }

  updateSelectedItemInCategory() {
    this.shoppingListService.updateShoppingList(this.selectedShoppingList);
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
   * Increase amount of item by 1
   */
  increaseAmount() {
    this.selectedItem.quantity += 1;
    this.updateSelectedItemInCategory();
  }

  moveItemToCategory() {
    const oldCategory = this.shoppingListService.currentCategory;
    // Find index of item to remove from old category
    const indexOfItemToRemove = oldCategory.items.indexOf(this.selectedItem);
    // Remove item from category
    oldCategory.items.splice(indexOfItemToRemove, 1);

    let categoryInList = false;
    // Check if new category is in the list
    this.selectedShoppingList.categories
      .forEach(shoppingListCategory => {
        if (this.selectedCategory.uid === shoppingListCategory.uid) {
          categoryInList = true;
          // Assign selected category to found category
          this.selectedCategory = shoppingListCategory;
        }
      });
    // If not
    if (!categoryInList) {
      // Instantiate items
      this.selectedCategory.items = [];
      // And add category
      this.selectedShoppingList.categories.push(this.selectedCategory);
    }
    // Update item category uuid
    this.selectedItem.categoryUid = this.selectedCategory.uid;
    // Push selected item to new category
    this.selectedCategory.items.push(this.selectedItem);
    // Update the shopping list
    this.shoppingListService.updateShoppingList(this.selectedShoppingList);
  }
}
