import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './guards/auth.guard';
import {LoadingService} from "./services/loading.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [AuthGuard, LoadingService]
})
export class SharedModule {
}
