import { Component, OnInit } from '@angular/core';
import { ShoppingList } from '../../entities/ShoppingList';
import { ShoppingListService } from '../../shared/firestore/shopping-list.service';
import { AuthService } from '../../auth/auth.service';
import { LocationWithSortedCategories } from '../../entities/LocationWithSortedCategories';
import { CategoryService } from '../../shared/firestore/category.service';

@Component({
  selector: 'a-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit {
  currentShoppingList: ShoppingList;
  userShoppingLists: ShoppingList[];

  locationsWithSortedCategories: LocationWithSortedCategories[];
  currentLocationWithSortedCategories: LocationWithSortedCategories;

  newItemTitle = '';

  constructor(private authService: AuthService,
              private shoppingListService: ShoppingListService,
              private categoryService: CategoryService) {
  }

  ngOnInit() {
    const userUid = this.authService.getUserUid();
    this.initShoppingLists(userUid);
    this.initLocationsWithSortedCategories(userUid);
    // this.shoppingListService.getFirstShoppingListByUserUid(userUid).toPromise()
    //   .then(firstShoppingList => {
    //     console.log(firstShoppingList);
    //     this.currentShoppingList = firstShoppingList;
    //     this.currentShoppingListTitle = firstShoppingList.title;
    //   });
    /*const shoppingItem: ShoppingItem = {
      uid: '1',
      title: 'Strawberry',
      categoryTitle: 'Fruit',
      categoryUid: '1',
      checked: false,
      price: 20,
      quantity: 1
    };
    const category: ShoppingCategory = {
      uid: '1',
      userUid: '1337',
      title: 'Fruit',
      shoppingListUid: '42',
      items: [shoppingItem]
    };
    const shoppingList: ShoppingList = {
      uid: '42',
      userUid: '1337',
      title: 'Shopping List',
      defaultLocationUid: '1',
      categories: [category]
    };
    this.$shoppingLists = of([shoppingList]);*/
  }

  private initLocationsWithSortedCategories(userUid) {
    this.categoryService.getlocationsWithSortedCategoriesByUserUid(userUid)
      .subscribe(locationsWithSortedCategories => {
        this.locationsWithSortedCategories = locationsWithSortedCategories;
        this.currentLocationWithSortedCategories = locationsWithSortedCategories[0];
      });
  }

  private initShoppingLists(userUid) {
    this.shoppingListService.getPartialShoppingListsByUserUid(userUid)
      .subscribe(shoppingLists => {
        if (shoppingLists) {
          this.userShoppingLists = shoppingLists;
          const firstShoppingList = shoppingLists[0];
          this.currentShoppingList = firstShoppingList;
        }
      });
  }

  addItem() {
    console.log(this.newItemTitle);
  }
}
