import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ShoppingCategory } from '../entities/ShoppingCategory';
import { CategoryService } from '../shared/firestore/category.service';
import { AuthService } from '../auth/shared/auth.service';

@Component({
  selector: 'a-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  pageTitle = 'Categories';
  $categories: Observable<ShoppingCategory[]>;

  constructor(private categoryService: CategoryService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.$categories = this.categoryService.getCategoriesByUserUid(this.authService.getUserUid());
  }
}
