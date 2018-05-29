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
import {AngularFirestore, AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireDatabase, AngularFireDatabaseModule} from 'angularfire2/database';

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
    AngularFirestoreModule
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
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ShoppingListProvider,
    AngularFirestore
  ]
})
export class AppModule {
}
