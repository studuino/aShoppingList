import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { ShoppingListPageModule } from './shopping-list/shopping-list.module';
import { LoginPageModule } from './login/login.module';
import { CategoriesPageModule } from './categories/categories.module';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

// AF2 Settings
export const firebaseConfig = {
  apiKey: 'AIzaSyD8c8n0Wi0steriAFwvty1yXCB8r1UAHw0',
  authDomain: 'adamino-shoppinglist.firebaseapp.com',
  databaseURL: 'https://adamino-shoppinglist.firebaseio.com',
  projectId: 'adamino-shoppinglist',
  storageBucket: 'adamino-shoppinglist.appspot.com',
  messagingSenderId: '832874222094'
};

@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    ShoppingListPageModule,
    LoginPageModule,
    CategoriesPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
