import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ModuleRoutes } from '../../ModuleRoutes';
import { MenuController, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../shared/services/loading.service';
import { PlatformService } from '../../shared/services/platform.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  browserMode = false;

  constructor(private authService: AuthService,
              private navCtrl: NavController,
              private menuCtrl: MenuController,
              private fb: FormBuilder,
              private loadingService: LoadingService,
              private platformService: PlatformService) {
  }

  ngOnInit(): void {
    this.browserMode = this.platformService.isDesktopOptimized();

    this.loginForm = this.fb.group({
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
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  login() {
    this.loadingService.presentLoadingScreen('Logging you in...');
    const credentials = this.loginForm.value as { email: string, password: string; };
    this.authService.login(credentials)
      .then(() => {
        this.menuCtrl.enable(true);
        this.navCtrl.navigateRoot(ModuleRoutes.SHOPPING_LIST);
        this.loadingService.dismissLoadingScreen();
      })
      .catch(error => console.log(error));
  }
}
