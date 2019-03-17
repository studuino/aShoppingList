import { Component } from '@angular/core';

import { MenuController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth/auth';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Router } from '@angular/router';
import { ModuleRouteNames } from './module-route.names';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: []
})

export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private nav: Router,
    private menu: MenuController,
    private screenOrientation: ScreenOrientation) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // Check for mobile platform
      if (this.platform.is('cordova')) {
        // set to portrait
        this.screenOrientation.lock('portrait');
      }

      // Check for logged in user
      this.authService.userIsLoggedIn()
        .subscribe(userAuth => {
          if (userAuth) {
            this.nav.navigateByUrl(ModuleRouteNames.SHOPPING_LIST);
          } else {
            this.nav.navigateByUrl(ModuleRouteNames.LOGIN);
          }
        });
    });
  }

  navigateHome() {
    this.nav.navigateByUrl(ModuleRouteNames.SHOPPING_LIST);
    this.menu.close();
  }
  navigateCategories() {
    this.nav.navigateByUrl(ModuleRouteNames.CATEGORIES);
    this.menu.close();
  }
  navigateUser() {
    this.nav.navigateByUrl(ModuleRouteNames.USER);
    this.menu.close();
  }

  logout() {
    this.nav.navigateByUrl(ModuleRouteNames.LOGIN)
      .then(() => this.authService.logout());
    this.menu.close();
  }
}
