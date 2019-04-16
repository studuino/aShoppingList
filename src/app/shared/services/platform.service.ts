import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  private smallestWidth = 600;
  private smallestHeight = 800;

  constructor(private platform: Platform) {
  }

  /**
   * Check if the current platform is a browser
   */
  isDesktopOptimized() {
    return this.platform.width() > this.smallestWidth && this.platform.height() > this.smallestHeight;
  }

  /**
   * Check if platform is anything but desktop
   */
  isMobile(): boolean {
    return !this.platform.is('desktop');
  }

  /**
   * Return ready state of browser
   */
  isReady(): Promise<string> {
    return this.platform.ready();
  }
}
