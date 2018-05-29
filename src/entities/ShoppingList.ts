import {ShoppingCategory} from './ShoppingCategory';

export interface ShoppingList {
  uid?: string;
  categories?: ShoppingCategory[];
}
