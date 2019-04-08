import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModuleRoutes } from '../../ModuleRoutes';
import { MenuController, NavController, Platform } from '@ionic/angular';
import { AuthService } from '../../auth/shared/auth.service';

@Component({
  selector: 'a-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input()
  headerTitle: string;

  @Input()
  shouldDisplayBackButton = false;

  browserMode = false;

  constructor(private router: Router,
              private platform: Platform,
              private navCtrl: NavController,
              private menuCtrl: MenuController,
              private authService: AuthService) {
    if (this.platform.is('desktop')) {
      this.browserMode = true;
    }
  }

  ngOnInit() {
  }

  navigateToShopping() {
    this.router.navigateByUrl(ModuleRoutes.SHOPPING_LIST);
  }

  isShoppingUrl() {
    return window.location.href.includes(ModuleRoutes.SHOPPING_LIST);
  }

  navigateToCategories() {
    this.router.navigateByUrl('/category');
  }

  logout() {
    this.navCtrl.navigateRoot(ModuleRoutes.LOGIN)
      .then(() => {
        this.menuCtrl.enable(false);
        this.authService.logout();
      });
  }
}
