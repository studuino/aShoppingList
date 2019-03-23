import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ModuleRoutes } from '../../routing/ModuleRoutes';
import { MenuController, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {LoadingService} from "../../shared/services/loading.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  pageTitle = 'Welcome to aShoppingList!';

  myForm: FormGroup;

  constructor(private authService: AuthService,
              private navCtrl: NavController,
              private menuCtrl: MenuController,
              private fb: FormBuilder,
              private loadingService: LoadingService) {
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(4)
      ]]
    });
  }

  get email() {
    return this.myForm.get('email');
  }

  get password() {
    return this.myForm.get('password');
  }

  login() {
    this.loadingService.presentLoadingScreen('Logging you in...');
    const credentials = this.myForm.value as { email: string, password: string; };
    this.authService.login(credentials)
      .then(() => {
        this.menuCtrl.enable(true);
        this.navCtrl.navigateRoot(ModuleRoutes.HOME);
        this.loadingService.dismissLoadingScreen();
      })
      .catch(error => console.log(error));
  }
}
