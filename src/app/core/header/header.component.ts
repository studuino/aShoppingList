import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModuleRoutes } from '../../ModuleRoutes';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from '../../auth/shared/auth.service';
import { PlatformService } from '../../shared/services/platform.service';

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
              private platformService: PlatformService,
              private navCtrl: NavController,
              private menuCtrl: MenuController,
              private authService: AuthService) {
    this.browserMode = this.platformService.isDesktopOptimized();
  }

  ngOnInit() {
  }

  navigateToShopping() {
    this.router.navigateByUrl(ModuleRoutes.SHOPPING_LIST);
  }

  isShoppingUrl() {
    return window.location.href.includes(ModuleRoutes.SHOPPING_LIST);
  }

  isCategories() {
    return window.location.href.includes(ModuleRoutes.CATEGORY);
  }

  isProfile() {
    return window.location.href.includes(ModuleRoutes.PROFILE);
  }

  navigateToCategories() {
    this.router.navigateByUrl('/category');
  }

  navigateToProfile() {
    this.router.navigateByUrl('/profile');
  }

  logout() {
    this.navCtrl.navigateRoot(ModuleRoutes.LOGIN)
      .then(() => {
        this.menuCtrl.enable(false);
        this.authService.logout();
      });
  }
}
