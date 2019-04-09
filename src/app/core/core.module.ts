import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { LogoComponent } from './logo/logo.component';

@NgModule({
  declarations: [HeaderComponent, LogoComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [HeaderComponent, LogoComponent]
})
export class CoreModule {
}
