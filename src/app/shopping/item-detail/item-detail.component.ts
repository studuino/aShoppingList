import { Component, OnInit } from '@angular/core';
import { ShoppingItem } from '../../entities/ShoppingItem';
import { ShoppingCategory } from '../../entities/ShoppingCategory';

@Component({
  selector: 'a-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
})
export class ItemDetailComponent implements OnInit {
  item: ShoppingItem;
  category: ShoppingCategory;

  constructor() {
  }

  ngOnInit() {
  }

}
