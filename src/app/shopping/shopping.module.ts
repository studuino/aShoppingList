import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShoppingListComponent} from "./shopping-list/shopping-list.component";
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";
import {AuthGuard} from "../shared/guards/auth.guard";
import {CoreModule} from "../core/core.module";

@NgModule({
  declarations: [ShoppingListComponent],
  imports: [
    CommonModule,
    IonicModule,
    CoreModule,
    RouterModule.forChild([
      {
        path: '',
        component: ShoppingListComponent,
        canActivate: [AuthGuard]
      }
    ])
  ]
})
export class ShoppingPageModule {
}
