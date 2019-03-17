import {ShoppingItem} from './ShoppingItem';

export interface ShoppingCategory {
  uid?: string;
  userUid?: string;
  title: string;
  shoppingListUid?: string;
  items?: ShoppingItem[];
}
