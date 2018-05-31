import {ShoppingCategory} from './ShoppingCategory';

export interface ShoppingList {
  uid?: string;
  title?: string;
  categories?: ShoppingCategory[];
}
