import { Component } from '@angular/core';

import { MenuController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/shared/auth.service';
import { ModuleRoutes } from './ModuleRoutes';
import { PlatformService } from './shared/services/platform.service';

@Component({
  selector: 'a-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public appPages = [
    {
      title: 'Shopping List',
      url: '/shopping',
      icon: 'basket'
    },
    {
      title: 'Categories',
      url: '/category',
      icon: 'filing'
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: 'contact'
    }
  ];
  browserMode = false;

  constructor(
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public authService: AuthService,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private platformService: PlatformService
  ) {
    this.browserMode = this.platformService.isDesktopOptimized();

    if (this.platformService.isMobile()) {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    }
    this.menuCtrl.enable(false);
    this.initializeApp();
  }

  async initializeApp() {
    await this.platformService.isReady();
    if (this.authService.isAuthenticated()) {
      this.menuCtrl.enable(true);
      this.navCtrl.navigateRoot(ModuleRoutes.SHOPPING_LIST);
    }
  }

  logout() {
    this.navCtrl.navigateRoot(ModuleRoutes.LOGIN)
      .then(() => {
        this.menuCtrl.enable(false);
        this.authService.logout();
      });
  }
}
