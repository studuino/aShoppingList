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

  onEditClicked() {
    this.popoverCtrl.dismiss('RENAME');
  }
}
