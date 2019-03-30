import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, TestBed} from '@angular/core/testing';

import {MenuController, NavController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {RouterTestingModule} from '@angular/router/testing';

import {AppComponent} from './app.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireAuth} from '@angular/fire/auth';
import {AuthService} from './auth/shared/auth.service';

describe('AppComponent', () => {

  let statusBarSpy, splashScreenSpy, platformReadySpy, platformSpy, menuCtrlSpy;

  beforeEach(async(() => {
    statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', {ready: platformReadySpy, subscribeWithPriority: {}});
    menuCtrlSpy = jasmine.createSpyObj('MenuController', {componentOnReady: platformReadySpy, enable: {}});

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: StatusBar, useValue: statusBarSpy},
        {provide: SplashScreen, useValue: splashScreenSpy},
        {provide: Platform, useValue: platformSpy},
        {provide: NavController, useValue: {}},
        {provide: MenuController, useValue: menuCtrlSpy},
        AngularFireAuth,
        AuthService
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        AngularFireModule.initializeApp(environment.firebase),
      ]
    }).compileComponents();
  }));

  it('should create the app', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the app', async () => {
    TestBed.createComponent(AppComponent);
    expect(platformSpy.ready).toHaveBeenCalled();
    await platformReadySpy;
    expect(statusBarSpy.styleDefault).toHaveBeenCalled();
    expect(splashScreenSpy.hide).toHaveBeenCalled();
  });

  it('should have menu labels', async () => {
    const fixture = await TestBed.createComponent(AppComponent);
    await fixture.detectChanges();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-label');
    expect(menuItems.length).toEqual(2);
    expect(menuItems[0].textContent).toContain('Home');
    expect(menuItems[1].textContent).toContain('Logout');
  });

  it('should have urls', async () => {
    const fixture = await TestBed.createComponent(AppComponent);
    await fixture.detectChanges();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-item');
    expect(menuItems.length).toEqual(2);
    expect(menuItems[0].getAttribute('ng-reflect-router-link')).toEqual('/home');
  });

});
