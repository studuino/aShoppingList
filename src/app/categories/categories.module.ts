import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesPage } from './categories';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    CategoriesPage
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: CategoriesPage
      }
    ])
  ]
})
export class CategoriesPageModule { }
