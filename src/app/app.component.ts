import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {ShoppingListPage} from '../pages/shopping-list/shopping-list';
import {ScreenOrientation} from '@ionic-native/screen-orientation';
import {CategoriesPage} from '../pages/categories/categories';
import {AuthProvider} from '../providers/auth/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'LoginPage';

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              private authProvider: AuthProvider,
              private screenOrientation: ScreenOrientation) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'Shopping List', component: ShoppingListPage},
      {title: 'Categories', component: CategoriesPage},
      {title: 'User', component: 'UserPage'}
    ];

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
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT)
      }

      // Check for logged in user
      if (this.authProvider.userIsLoggedIn()) {
        this.rootPage = ShoppingListPage;
      }
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
