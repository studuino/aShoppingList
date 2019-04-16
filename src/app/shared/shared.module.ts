import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './guards/auth.guard';
import { LoadingService } from './services/loading.service';
import { ShoppingListService } from './firestore/shopping-list.service';
import { CategoryService } from './firestore/category.service';
import { InformationService } from './services/information.service';
import { LocationWithSortedCategoriesService } from './firestore/location-with-sorted-categories.service';
import { PlatformService } from './services/platform.service';
import { ItemsService } from './firestore/items.service';

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
    InformationService,
    LocationWithSortedCategoriesService,
    PlatformService,
    ItemsService
  ]
})
export class SharedModule {
}
