import {ShoppingItem} from './ShoppingItem';

export interface ShoppingCategory {
  uid?: string;
  userUid?: string;
  title: string;
  index?: number;
  shoppingListUid?: string;
  items?: ShoppingItem[];
}
