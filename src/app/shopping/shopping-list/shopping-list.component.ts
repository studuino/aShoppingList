import {Component, OnInit} from '@angular/core';
import {Observable, of} from "rxjs";

@Component({
  selector: 'a-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit {
  currentShoppingListTitle = 'TEST';
  $shoppingLists: Observable<any>;

  constructor() {
  }

  ngOnInit() {
    this.$shoppingLists = of();
  }

}
