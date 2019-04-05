import { Component } from '@angular/core';

import { MenuController, NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/shared/auth.service';
import { ModuleRoutes } from './ModuleRoutes';

@Component({
  selector: 'a-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public appPages = [
    {
      title: 'Shopping List',
      url: '/shopping',
      icon: 'home'
    }
  ];
  browserMode = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public authService: AuthService,
    private navCtrl: NavController,
    private menuCtrl: MenuController
  ) {
    this.statusBar.styleDefault();
    this.splashScreen.hide();
    if (this.platform.is('desktop')) {
      console.log('Running in browser!');
      this.browserMode = true;
    } else {
      this.menuCtrl.enable(false);
    }
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.authService.isAuthenticated()) {
        this.menuCtrl.enable(true);
        this.navCtrl.navigateRoot(ModuleRoutes.SHOPPING_LIST);
      }
    });
  }

  logout() {
    this.navCtrl.navigateRoot(ModuleRoutes.LOGIN)
      .then(() => {
        this.menuCtrl.enable(false);
        this.authService.logout();
      });
  }
}
