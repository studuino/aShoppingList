import {ShoppingCategory} from './ShoppingCategory';
import {ShoppingCart} from './ShoppingCart';

export interface ShoppingList {
  uid?: string;
  title?: string;
  categories?: ShoppingCategory[];
  cart?: ShoppingCart;
}
