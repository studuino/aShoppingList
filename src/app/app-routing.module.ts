import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleRouteNames } from './module-route.names';

const routes: Routes = [
  { path: '', redirectTo: ModuleRouteNames.LOGIN, pathMatch: 'full' },
  { path: 'categories', loadChildren: './categories/categories.module#CategoriesPageModule' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'shopping-list', loadChildren: './shopping-list/shopping-list.module#ShoppingListPageModule' },
  { path: 'user', loadChildren: './user/user.module#UserPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
