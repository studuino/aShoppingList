import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './guards/auth.guard';
import { LoadingService } from './services/loading.service';
import { ShoppingListService } from './firestore/shopping-list.service';
import { CategoryService } from './firestore/category.service';
import { AlertService } from './services/alert.service';
import { LocationWithSortedCategoriesService } from './firestore/location-with-sorted-categories.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [
    AuthGuard,
    LoadingService,
    ShoppingListService,
    CategoryService,
    AlertService,
    LocationWithSortedCategoriesService
  ]
})
export class SharedModule {
}
