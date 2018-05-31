import {ShoppingCategory} from './ShoppingCategory';

export interface ShoppingList {
  uid?: string;
  title?: string;
  amountOfCategories?: number;
  categories?: ShoppingCategory[];
}
