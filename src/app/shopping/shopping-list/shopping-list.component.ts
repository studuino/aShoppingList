import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShoppingList } from '../../entities/ShoppingList';
import { ShoppingListService } from '../../shared/firestore/shopping-list.service';
import { AuthService } from '../../auth/shared/auth.service';
import { LocationWithSortedCategories } from '../../entities/LocationWithSortedCategories';
import { CategoryService } from '../../shared/firestore/category.service';
import { ShoppingCategory } from '../../entities/ShoppingCategory';
import { ShoppingItem } from '../../entities/ShoppingItem';
import { Router } from '@angular/router';
import { ModuleRoutes } from '../../ModuleRoutes';
import { ShoppingRoutes } from '../ShoppingRoutes';
import { IonItemSliding, NavController, PopoverController } from '@ionic/angular';
import { ShoppingOptionsComponent } from '../shopping-options/shopping-options.component';
import { EShoppingOption } from '../shared/EShoppingOption';
import { InformationService } from '../../shared/services/information.service';
import { ArrayUtil } from '../../shared/utils/ArrayUtil';
import { LocationWithSortedCategoriesService } from '../../shared/firestore/location-with-sorted-categories.service';

@Component({
  selector: 'a-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  currentShoppingList: ShoppingList;
  $shoppingListsSub;
  userShoppingLists: ShoppingList[];

  $locationsSub;
  locationsWithSortedCategories: LocationWithSortedCategories[];
  currentLocationWithSortedCategories: LocationWithSortedCategories;

  newItemTitle = '';
  private currentShoppingListTotal: number;
  private currentCartTotal: number;

  constructor(private authService: AuthService,
              private shoppingListService: ShoppingListService,
              private categoryService: CategoryService,
              private locationService: LocationWithSortedCategoriesService,
              private router: Router,
              private navCtrl: NavController,
              private popoverCtrl: PopoverController,
              private informationService: InformationService) {
  }

  ngOnInit() {
    const userUid = this.authService.getUserUid();
    this.initShoppingLists(userUid);
    this.initLocationsWithSortedCategories(userUid);
  }

  ngOnDestroy(): void {
    // Make sure to close connection to firestore!
    this.$shoppingListsSub.unsubscribe();
    this.$locationsSub.unsubscribe();
  }

  /***** HEADER ACTIONS *****/

  selectShoppingList(uid?: string) {
    // If a uid was provided to this method
    if (uid) {
      // Find list in array
      const selectedListInArray = this.userShoppingLists.find(shoppingList => shoppingList.uid === uid);
      if (selectedListInArray) {
        this.currentShoppingList = selectedListInArray;
      }
    }
    this.shoppingListService.currentShoppingList = this.currentShoppingList;
    this.checkDefaultLocation();
    this.sortItemsByCurrentLocation();
  }

  async presentOptions(event) {
    const popover = await this.popoverCtrl.create({
      component: ShoppingOptionsComponent,
      event: event,
      translucent: true
    });

    popover.onDidDismiss().then((optionResponse) => this.handlePopoverClosed(optionResponse.data));

    return await popover.present();
  }

  private async handlePopoverClosed(option) {
    const shoppingListOption = option as EShoppingOption;

    switch (shoppingListOption) {
      case EShoppingOption.NEW_SHOPPING_LIST:
        const newListPrompt = await this.informationService.getRenamePrompt(
          'Create new Shopping list',
          'Please provide a title for the Shopping List',
          data => {
            // Get new category name from user input data
            const newTitle = data.title;
            this.createShoppingList(newTitle);
          }
        );
        newListPrompt.present();
        break;
      case EShoppingOption.RENAME_SHOPPING_LIST:
        const renameListPrompt = await this.informationService.getRenamePrompt(
          'Rename Shopping list',
          'Please provide new title for the Shopping List',
          data => {
            // Get new category name from user input data
            const newTitle = data.title;
            this.renameShoppingList(newTitle);
          }
        );
        renameListPrompt.present();
        break;
      case EShoppingOption.DELETE_SHOPPING_LIST:
        const promptDeleteList = await this.informationService.getDeletePrompt(
          'Delete Shopping list',
          'Please confirm that you want to delete the Shopping List',
          data => {
            const listToSwitchTo = this.userShoppingLists.find(shoppingList => shoppingList.uid !== this.currentShoppingList.uid);
            if (listToSwitchTo) {
              const selectedShoppingListUidToDelete = this.currentShoppingList.uid;
              this.currentShoppingList = listToSwitchTo;
              this.deleteShoppingList(selectedShoppingListUidToDelete);
            }
          }
        );
        promptDeleteList.present();
        break;
      case EShoppingOption.REORDER_CATEGORIES:
        // Ensure current location is shared
        this.shoppingListService.currentLocation = this.currentLocationWithSortedCategories;
        this.navCtrl.navigateForward(`${ModuleRoutes.SHOPPING_LIST}/${ShoppingRoutes.LOCATION_WITH_SORTED_CATEGORIES}`);
        break;
      case EShoppingOption.RENAME_LOCATION:
        const renameLocationPrompt = await this.informationService.getRenamePrompt(
          'Rename Location',
          'Please provide new title for the location',
          data => {
            // Get new category name from user input data
            const newTitle = data.title;
            this.renameLocation(newTitle);
          }
        );
        renameLocationPrompt.present();
        break;
      default:
        break;
    }
  }

  private createShoppingList(newTitle: string) {
    this.shoppingListService.create(this.authService.getUserUid(), newTitle, this.currentLocationWithSortedCategories.uid)
      .then(newShoppingListUid => this.selectShoppingList(newShoppingListUid));
  }

  private renameShoppingList(newTitle: string) {
    this.currentShoppingList.title = newTitle;

    this.updateShoppingList();
  }

  private deleteShoppingList(uid: string) {
    this.shoppingListService.delete(uid);
  }

  private renameLocation(newTitle: string) {
    this.currentLocationWithSortedCategories.title = newTitle;

    this.locationService.update(this.currentLocationWithSortedCategories);
  }

  sortItemsByCurrentLocation() {
    this.shoppingListService.sortItemsByCurrentLocation(this.currentShoppingList, this.currentLocationWithSortedCategories);
  }

  addItem() {
    const newItem: ShoppingItem = {
      title: this.newItemTitle,
      price: 0,
      checked: false,
      quantity: 1,
    };
    const uncategorized = this.categoryService.getUncategorizedCategoryFromShoppingList(this.currentShoppingList);
    uncategorized.items.push(newItem);
    this.updateShoppingList();
    // Reset newItemTitle
    this.newItemTitle = '';
  }

  /***** ITEM LIST *****/

  checkItemToCart(category: ShoppingCategory, item: ShoppingItem) {
    // TODO ALH: Consider setting category id earlier!
    if (category.title !== this.categoryService.UNCATEGORIZED_TITLE) {
      // Assign categoryUid to item, to support unchecking of item
      item.categoryUid = category.uid;
    } else {
      item.categoryUid = this.categoryService.UNCATEGORIZED_TITLE;
    }
    // Find item to remove from current category
    const indexOfItemToMove = category.items.indexOf(item);
    category.items.splice(indexOfItemToMove, 1);

    this.currentShoppingList.cart.items.push(item);
    this.updateShoppingList();
  }

  reorderItems(positionChange, items: ShoppingItem[]) {
    ArrayUtil.reorderItemsInArray(positionChange, items);
    positionChange.complete();
    // Send updated list to firestore!
    this.updateShoppingList();
  }

  editItem(category: ShoppingCategory, item: ShoppingItem, slider: IonItemSliding) {
    this.shoppingListService.currentItem = item;
    this.shoppingListService.currentCategory = category;
    this.shoppingListService.currentShoppingList = this.currentShoppingList;
    this.navCtrl.navigateForward(ModuleRoutes.SHOPPING_LIST + ShoppingRoutes.ITEM_DETAIL);
    slider.close();
  }

  removeItem(category: ShoppingCategory, item: ShoppingItem, slider: IonItemSliding) {
    // Find index of item to remove from category
    const indexOfItemToRemove = category.items.findIndex(itemInList => itemInList.title === item.title);
    // Remove item
    category.items.splice(indexOfItemToRemove, 1);
    // Send updated shopping list to update in firestore
    this.updateShoppingList();
    slider.close();
  }

  private computeTotalOfItemsInList() {
    // Set calculated shopping list total
    this.currentShoppingListTotal = this.shoppingListService.calculateShoppingListTotal(this.currentShoppingList);
  }

  /**
   * Helper method for initializing users locations
   */
  private initLocationsWithSortedCategories(userUid) {
    this.$locationsSub = this.categoryService.getLocationsWithSortedCategoriesByUserUid(userUid)
      .subscribe(locationsWithSortedCategories => {
        // Set locations
        this.locationsWithSortedCategories = locationsWithSortedCategories;
        // Set ensure current location is set
        this.currentLocationWithSortedCategories = locationsWithSortedCategories[0];
        // Check if user has set a default location
        this.checkDefaultLocation();
        this.sortItemsByCurrentLocation();
      });
  }

  /**
   * Check if user has set default location
   * If set, then update current location
   */
  checkDefaultLocation() {
    if (this.currentShoppingList.defaultLocationUid) {
      const defaultLocation = this.locationsWithSortedCategories
        .find(location => location.uid === this.currentShoppingList.defaultLocationUid);
      // If default location exists then set it to the current location
      if (defaultLocation) {
        this.currentLocationWithSortedCategories = defaultLocation;
      }
    }
  }

  /**
   * Helper method for initializing users shopping lists
   */
  private initShoppingLists(userUid) {
    this.$shoppingListsSub = this.shoppingListService.getShoppingListsByUserUid(userUid)
      .subscribe(shoppingLists => {
        if (shoppingLists) {
          if (this.shoppingListService.currentShoppingList) {
            this.currentShoppingList = shoppingLists.find(shoppingList =>
              shoppingList.uid === this.shoppingListService.currentShoppingList.uid);
          } else {
            this.currentShoppingList = shoppingLists[0];
          }
          this.userShoppingLists = shoppingLists;
          this.computeTotalOfItemsInList();
          this.computeTotalOfCart();
        }
      });
  }

  /***** SHOPPING CART *****/

  uncheckItemFromCart(checkedItem: ShoppingItem) {
    // Make sure to uncheck item
    checkedItem.checked = false;
    // Locate the category to move the item back to
    const originalCategory = this.categoryService.getCategoryFromItem(this.currentShoppingList, checkedItem);
    originalCategory.items.push(checkedItem);
    // Remove item from shopping cart
    this.shoppingListService.removeItemFromItemList(this.currentShoppingList.cart.items, checkedItem);
    // Update shopping list on firestore
    this.updateShoppingList();
  }

  checkoutCart() {
    // Empty shopping cart
    this.currentShoppingList.cart.items = [];
    // Update firestore
    this.updateShoppingList();
  }

  uncheckAllItemsFromCart() {
    this.currentShoppingList.cart.items
    // For every item in the cart
      .forEach(itemInList => {
        // Uncheck item
        itemInList.checked = false;
        // Locate the category to move the item back to
        const originalCategory = this.categoryService.getCategoryFromItem(this.currentShoppingList, itemInList);
        originalCategory.items.push(itemInList);
      });
    // Empty shopping cart
    this.currentShoppingList.cart.items = [];
    // Update firestore
    this.updateShoppingList();
  }

  updateShoppingList() {
    this.shoppingListService.updateShoppingList(this.currentShoppingList);
  }

  /**
   * Helper method to compute cart total
   */
  private computeTotalOfCart() {
    // Set calculated cart total
    this.currentCartTotal = this.shoppingListService.calculateCartTotal(this.currentShoppingList.cart);
  }
}
