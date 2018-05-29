import {ShoppingItem} from './ShoppingItem';

export interface ShoppingCategory {
  uid?: string;
  title: string;
  items?: ShoppingItem[];
}
