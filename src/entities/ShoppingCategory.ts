import {ShoppingItem} from './ShoppingItem';

export interface ShoppingCategory {
  uid?: string;
  title: string;
  index?: number;
  shoppingListUid?: string;
  items?: ShoppingItem[];
}
