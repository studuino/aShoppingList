import { Component, OnInit } from '@angular/core';
import { ShoppingItem } from '../../entities/ShoppingItem';
import { ShoppingCategory } from '../../entities/ShoppingCategory';
import { ShoppingListService } from '../../shared/firestore/shopping-list.service';

@Component({
  selector: 'a-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
})
export class ItemDetailComponent implements OnInit {
  item: ShoppingItem;
  category: ShoppingCategory;

  constructor(private shoppingListService: ShoppingListService) {
  }

  ngOnInit() {
    this.item = this.shoppingListService.currentItem;
    this.category = this.shoppingListService.currentCategory;
  }

}
