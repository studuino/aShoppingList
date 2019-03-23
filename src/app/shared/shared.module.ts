import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './guards/auth.guard';
import { LoadingService } from './services/loading.service';
import { ShoppingListService } from './firestore/shopping-list.service';
import { CategoryService } from './firestore/category.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [
    AuthGuard,
    LoadingService,
    ShoppingListService,
    CategoryService
  ]
})
export class SharedModule {
}
