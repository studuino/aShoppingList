import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterPage } from './register';
import {AuthProvider} from '../../../providers/auth/auth';

@NgModule({
  declarations: [
    RegisterPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterPage),
  ],
  providers: [
    AuthProvider
  ]
})
export class RegisterPageModule {}
