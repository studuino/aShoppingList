import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPage } from './user';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    UserPage
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserPage
      }
    ])
  ]
})
export class UserPageModule { }
