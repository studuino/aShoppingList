import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingListPage } from './shopping-list';
import { ShoppingListOptionsPage } from './shopping-list-options/shopping-list-options';
import { ManageShoppingListPage } from './manage-shopping-list/manage-shopping-list';
import { LocationSortedCategoriesPage } from './location-sorted-categories/location-sorted-categories';
import { DetailItemPage } from './detail-item/detail-item';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ShoppingListPage,
    ShoppingListOptionsPage,
    ManageShoppingListPage,
    LocationSortedCategoriesPage,
    DetailItemPage
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ShoppingListPage
      },
      {
        path: 'detail',
        component: DetailItemPage
      },
      {
        path: 'options',
        component: ShoppingListOptionsPage
      },
      {
        path: 'manage',
        component: ManageShoppingListPage
      },
      {
        path: 'location',
        component: LocationSortedCategoriesPage
      }
    ])
  ],
  providers: [
  ]
})
export class ShoppingListPageModule { }
