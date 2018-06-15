import {ShoppingCategory} from './ShoppingCategory';
import {ShoppingCart} from './ShoppingCart';

export interface ShoppingList {
  uid?: string;
  userUid: string;
  title?: string;
  categories?: ShoppingCategory[];
  cart?: ShoppingCart;
  defaultLocationUid?: string;
}
