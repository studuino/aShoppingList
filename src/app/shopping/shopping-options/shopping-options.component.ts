import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'a-shopping-options',
  templateUrl: './shopping-options.component.html',
  styleUrls: ['./shopping-options.component.scss'],
})
export class ShoppingOptionsComponent implements OnInit {

  constructor(private popoverCtrl: PopoverController) {
  }

  ngOnInit() {
  }

  onRenameListClicked() {
    // String is used, since the data binding will not recognized by the handler
    // TODO ALH: Investigate further
    this.popoverCtrl.dismiss('RENAME_SHOPPING_LIST');
  }

  onReorderClicked() {
    this.popoverCtrl.dismiss('REORDER_CATEGORIES');
  }

  onRenameLocationClicked() {
    this.popoverCtrl.dismiss('RENAME_LOCATION');
  }

  onNewListClicked() {
    this.popoverCtrl.dismiss('NEW_SHOPPING_LIST');
  }
}
