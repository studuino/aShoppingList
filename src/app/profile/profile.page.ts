import { Component, OnInit } from '@angular/core';
import { FirestoreUser } from '../entities/FirestoreUser';
import { AuthService } from '../auth/shared/auth.service';
import { InformationService } from '../shared/services/information.service';
import { LoadingService } from '../shared/services/loading.service';
import { ToastService } from '../shared/services/toast.service';
import { Router } from '@angular/router';
import { ModuleRoutes } from '../ModuleRoutes';

@Component({
  selector: 'a-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  currentUser: FirestoreUser;

  constructor(private authService: AuthService,
              private informationService: InformationService,
              private loadingService: LoadingService,
              private toastService: ToastService,
              private router: Router) {
  }

  ngOnInit() {
    this.currentUser = this.authService.getUser();
  }

  async onDeleteClicked() {
    const deletePrompt = await this.informationService.getDeletePrompt(
      'WARNING!',
      `
You are about to delete your account!
<br>
This cannot be undone...
<br>
are you really sure?`,
      async () => {
        this.loadingService.presentLoadingScreen('Just taking a wee cry while we remove you...');
        await this.authService.deleteAccount();
        await this.authService.logout();
        await this.router.navigateByUrl(ModuleRoutes.LOGIN);
        this.loadingService.dismissLoadingScreen();
        (await this.toastService.getToast('Account Deleted, hope to see you again someday!')).present();
      }
    );
    deletePrompt.present();
  }
}
