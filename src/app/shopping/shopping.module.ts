import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { CoreModule } from '../core/core.module';
import { FormsModule } from '@angular/forms';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { ShoppingOptionsComponent } from './shopping-options/shopping-options.component';
import { LocationWithSortedCategoriesComponent } from './location-with-sorted-categories/location-with-sorted-categories.component';

@NgModule({
  declarations: [
    ShoppingListComponent,
    ItemDetailComponent,
    ShoppingOptionsComponent,
    LocationWithSortedCategoriesComponent
  ],
  entryComponents: [ShoppingOptionsComponent],
  imports: [
    CommonModule,
    IonicModule,
    CoreModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ShoppingListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'item',
        component: ItemDetailComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'location',
        component: LocationWithSortedCategoriesComponent,
        canActivate: [AuthGuard]
      }
    ])
  ]
})
export class ShoppingPageModule {
}
