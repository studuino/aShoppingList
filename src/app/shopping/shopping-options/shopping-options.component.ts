import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ShoppingListService } from '../../shared/firestore/shopping-list.service';
import { AuthService } from '../../auth/shared/auth.service';
import { first, map } from 'rxjs/operators';

@Component({
  selector: 'a-shopping-options',
  templateUrl: './shopping-options.component.html',
  styleUrls: ['./shopping-options.component.scss'],
})
export class ShoppingOptionsComponent implements OnInit {
  deleteAvailable: boolean;

  $shoppingListCount;

  constructor(private popoverCtrl: PopoverController,
              private authService: AuthService,
              private shoppingListService: ShoppingListService) {
  }

  ngOnInit() {
    this.$shoppingListCount = this.shoppingListService.getShoppingListsByUserUid(this.authService.getUserUid())
      .pipe(first())
      .pipe(map(shoppingListsArray => shoppingListsArray.length))
      .subscribe(amountOfShoppingLists => this.deleteAvailable = amountOfShoppingLists > 1);
  }

  /**** SHOPPING LIST ACTIONS ****/
  onNewListClicked() {
    // String is used, since the data binding will not recognized by the handler
    // TODO ALH: Investigate further
    this.popoverCtrl.dismiss('NEW_SHOPPING_LIST');
  }

  onRenameListClicked() {
    this.popoverCtrl.dismiss('RENAME_SHOPPING_LIST');
  }

  onDeleteList() {
    this.popoverCtrl.dismiss('DELETE_SHOPPING_LIST');
  }

  /**** LOCATION ACTIONS ****/

  onReorderClicked() {
    this.popoverCtrl.dismiss('REORDER_CATEGORIES');
  }

  onRenameLocationClicked() {
    this.popoverCtrl.dismiss('RENAME_LOCATION');
  }

}
