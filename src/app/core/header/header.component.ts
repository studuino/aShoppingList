import { Component, Input, OnInit } from '@angular/core';

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

  constructor() {
  }

  ngOnInit() {
  }

}
