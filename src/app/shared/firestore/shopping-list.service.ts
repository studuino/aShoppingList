import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ShoppingList } from '../../entities/ShoppingList';
import { ShoppingCart } from '../../entities/ShoppingCart';
import { ShoppingItem } from '../../entities/ShoppingItem';
import { ShoppingCategory } from '../../entities/ShoppingCategory';
import { LocationWithSortedCategories } from '../../entities/LocationWithSortedCategories';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  private SHOPPING_LISTS_COLLECTION = 'shoppingLists';
  public currentItem: ShoppingItem;
  public currentCategory: ShoppingCategory;
  public currentShoppingList: ShoppingList;
  public currentLocation: LocationWithSortedCategories;

  constructor(private afs: AngularFirestore) {
  }

  /**
   * Get all shopping lists with just title and uid
   * for later specific querying
   */
  getShoppingListsByUserUid(userUid: string): Observable<ShoppingList[]> {
    return this.afs.collection<ShoppingList>(this.SHOPPING_LISTS_COLLECTION,
      ref =>
        ref.where('userUid', '==', userUid)).valueChanges();
  }

  sortItemsByCurrentLocation(shoppingList: ShoppingList,
                             locationWithSortedCategories: LocationWithSortedCategories) {
    const UNCATEGORIZED = 'Uncategorized';
    // Instantiate new sorted array
    const sortedArray: ShoppingCategory[] = [];
    const uncategorized = shoppingList.categories
      .find(category => category.title === UNCATEGORIZED);
    sortedArray.push(uncategorized);
    locationWithSortedCategories.sortedCategories
    // For each category in sorted array
      .forEach(sortedCategory => {
        // Check for category for current index
        const categoryInCurrentList = shoppingList.categories
          .find(category => category.title === sortedCategory.title);
        const indexOfCategory = shoppingList.categories.indexOf(categoryInCurrentList);
        // If the category is in the shopping list
        if (categoryInCurrentList) {
          // Add to the sorted array
          sortedArray.push(categoryInCurrentList);
          shoppingList.categories.splice(indexOfCategory, 1);
        }
      });
    // Ensure that no categories get lost!
    shoppingList.categories.forEach(category => {
      if (category.title !== UNCATEGORIZED) {
        sortedArray.push(category);
      }
    });
    // Update default location to latest picked
    shoppingList.defaultLocationUid = locationWithSortedCategories.uid;
    // Set shopping list categories to newly sorted array from location
    shoppingList.categories = sortedArray;
    // Update shopping list on firestore
    return this.updateShoppingList(shoppingList);
  }

  /**
   * Update provided shopping list on firestore
   */
  updateShoppingList(shoppingList: ShoppingList) {
    return this.afs.collection(this.SHOPPING_LISTS_COLLECTION)
      .doc(shoppingList.uid)
      .set(shoppingList, {merge: true});
  }

  /**
   * Sum total price of items in each category in shopping list
   */
  calculateShoppingListTotal(shoppingList: ShoppingList): number {
    let total = 0;
    // Check for instantiation
    if (shoppingList.categories) {
      shoppingList.categories.forEach(category => {
        if (category.items) {
          category.items.forEach(item => {
            // Check if item has a price
            if (item.price) {
              // Increase total
              total += (item.price * item.quantity);
            }
          });
        }
      });
    }
    return total;
  }

  /**
   * Calculate and return total of shopping cart
   */
  calculateCartTotal(shoppingCart: ShoppingCart) {
    let total = 0;
    // Sum up total
    shoppingCart.items
      .forEach(item =>
        total += item.price ? (item.price * item.quantity) : 0);
    return total;
  }

  /**
   * Remove provided item from category array of items
   */
  removeItemFromItemList(categoryToRemoveItemFrom: ShoppingItem[], item: ShoppingItem) {
    // Locate index of item in cart
    const indexOfItemInCart = categoryToRemoveItemFrom.indexOf(item);
    // Remove item from cart
    categoryToRemoveItemFrom.splice(indexOfItemInCart, 1);
  }

  /**
   * Remove provided category from all shopping lists by provided user uid
   */
  removeCategoryFromAllShoppingLists(userUid: string, category: ShoppingCategory) {
    this.getShoppingListsByUserUid(userUid)
      .pipe(map(shoppingLists => {
        shoppingLists.forEach(shoppingList => {
          // Locate category in all shopping lists
          const index = shoppingList.categories.findIndex(categoryInShoppingList => categoryInShoppingList.uid === category.uid);
          // If category exists
          if (index !== -1) {
            // Remove it
            shoppingList.categories.splice(index, 1);
            // Update shopping list
            this.updateShoppingList(shoppingList);
          }
        });
      }));
  }

  /**
   * Rename category in all shopping lists
   */
  renameCategoryInAllShoppingLists(userUid: string, categoryUid: string, newTitle: string) {
    this.getShoppingListsByUserUid(userUid)
      .pipe(map(shoppingLists => {
        shoppingLists.forEach(shoppingList => {
          // Locate category
          const category: ShoppingCategory = shoppingList.categories
            .find((shoppingCategory: ShoppingCategory) => shoppingCategory.uid === categoryUid);
          // Category exists
          if (category) {
            // Remove it from array
            category.title = newTitle;
            // Update shopping list
            this.updateShoppingList(shoppingList);
          }
        });
      }));
  }

  /***
   * Create new shopping list in firestore
   * @return Uid of new list as {Promise<string>}
   */
  createShoppingList(userUid: string, newTitle: string, defaultLocationUid: string): Promise<string> {
    // Create UUID for document
    const newUid = this.afs.createId();
    // Create new shopping list
    const newShoppingList: ShoppingList = {
      uid: newUid,
      userUid: userUid,
      defaultLocationUid: defaultLocationUid,
      title: newTitle,
      cart: {
        items: []
      },
      categories: [
        {
          title: 'Uncategorized',
          items: []
        }
      ]
    };
    // Add new shopping list to firestore
    return this.afs.firestore.collection(this.SHOPPING_LISTS_COLLECTION)
      .doc(newUid)
      .set(newShoppingList)
      .then(() => {
        // Return uid of new list
        return newUid;
      });
  }
}
