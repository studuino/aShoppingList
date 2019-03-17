import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPage } from './login';
import { RegisterPage } from './register/register';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';

@NgModule({
  declarations: [
    LoginPage,
    RegisterPage,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: LoginPage
      },
      {
        path: 'register',
        component: RegisterPage
      }
    ])
  ]
})
export class LoginPageModule { }
