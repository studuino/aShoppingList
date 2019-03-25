import {Component, OnInit} from '@angular/core';
import {ShoppingItem} from '../../entities/ShoppingItem';
import {ShoppingCategory} from '../../entities/ShoppingCategory';
import {ShoppingListService} from '../../shared/firestore/shopping-list.service';

@Component({
  selector: 'a-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
})
export class ItemDetailComponent implements OnInit {
  item: ShoppingItem;
  category: ShoppingCategory;

  constructor(private shoppingListService: ShoppingListService) {
    this.item = this.shoppingListService.currentItem;
    this.category = this.shoppingListService.currentCategory;
  }

  ngOnInit() {

  }

  updateSelectedItemInCategory() {

  }

  /**
   * Decrease amount of selected item, if more than 1 is available
   */
  decreaseAmount() {
    if (this.item.quantity > 1) {
      this.item.quantity -= 1;
      this.updateSelectedItemInCategory();
    }
  }

  /**
   * Increase amount of item by 1
   */
  increaseAmount() {
    this.item.quantity += 1;
    this.updateSelectedItemInCategory();
  }

  moveItemToCategory() {

  }
}
