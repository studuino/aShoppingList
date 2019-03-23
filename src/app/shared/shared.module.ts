import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthGuard} from './guards/auth.guard';
import {LoadingService} from "./services/loading.service";
import {ShoppingListService} from "./firestore/shopping-list.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [
    AuthGuard,
    LoadingService,
    ShoppingListService
  ]
})
export class SharedModule {
}
