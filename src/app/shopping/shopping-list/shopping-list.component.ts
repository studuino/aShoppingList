import {Component, OnInit} from '@angular/core';
import {Observable, of} from "rxjs";
import {ShoppingList} from "../../entities/ShoppingList";
import {ShoppingCategory} from "../../entities/ShoppingCategory";
import {ShoppingItem} from "../../entities/ShoppingItem";
import {ShoppingListService} from "../../shared/firestore/shopping-list.service";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'a-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit {
  currentShoppingListTitle = 'Shopping List';
  $shoppingLists: Observable<ShoppingList[]>;

  constructor(private shoppingListService: ShoppingListService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.$shoppingLists = this.shoppingListService.getPartialShoppingListsByUserUid(this.authService.getUserUid());
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

  loadShoppingLisst(shoppingList: ShoppingList) {
    this.currentShoppingListTitle = shoppingList.title;
  }
}
