import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'shopping',
    pathMatch: 'full'
  },
  /**** AUTH ROUTES ****/
  {path: 'login', loadChildren: './auth/login/login.module#LoginPageModule'},
  {path: 'register', loadChildren: './auth/register/register.module#RegisterPageModule'},
  /**** SHOPPING ROUTES ****/
  {path: 'shopping', loadChildren: './shopping/shopping.module#ShoppingPageModule', canLoad: [AuthGuard]},
  /**** CATEGORY ROUTES ****/
  {path: 'category', loadChildren: './category/category.module#CategoryPageModule', canLoad: [AuthGuard]},
  /**** PROFILE ROUTES ****/
  {path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule'}


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
