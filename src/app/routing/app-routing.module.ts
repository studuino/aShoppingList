import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'shopping',
    pathMatch: 'full'
  },
  {path: 'shopping', loadChildren: '../shopping/shopping.module#ShoppingPageModule'},
  {path: 'login', loadChildren: '../auth/login/login.module#LoginPageModule'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
