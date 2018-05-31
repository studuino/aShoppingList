import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {ShoppingListPage} from '../pages/shopping-list/shopping-list';
import {DetailItemPage} from '../pages/shopping-list/detail-item/detail-item';
import {ShoppingListProvider} from '../providers/shopping-list/shopping-list';
import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {CategoryProvider} from '../providers/categories/category';
import {ScreenOrientation} from '@ionic-native/screen-orientation';
import { AlertProvider } from '../providers/alert/alert';

// AF2 Settings
export const firebaseConfig = {
  apiKey: "AIzaSyD8c8n0Wi0steriAFwvty1yXCB8r1UAHw0",
  authDomain: "adamino-shoppinglist.firebaseapp.com",
  databaseURL: "https://adamino-shoppinglist.firebaseio.com",
  projectId: "adamino-shoppinglist",
  storageBucket: "adamino-shoppinglist.appspot.com",
  messagingSenderId: "832874222094"
};

@NgModule({
  declarations: [
    MyApp,
    ShoppingListPage,
    DetailItemPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule.enablePersistence()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ShoppingListPage,
    DetailItemPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ShoppingListProvider,
    CategoryProvider,
    AlertProvider
  ]
})
export class AppModule {
}
