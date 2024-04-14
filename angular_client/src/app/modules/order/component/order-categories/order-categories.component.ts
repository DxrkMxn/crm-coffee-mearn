import { Component, OnInit } from "@angular/core";
import { RouterPathsEnum } from "../../../../shared/enums/routerPaths.enum";
import { CategoriesService } from "../../../../shared/services/categories/categories.service";
import { delay, Observable } from "rxjs";
import { CategoryInterface } from "../../../../shared/interfaces/category.interface";

@Component({
      selector: "app-order-categories",
      templateUrl: "./order-categories.component.html",
      styleUrls: ["./order-categories.component.css"],
})
export class OrderCategoriesComponent implements OnInit {
      routerPathsEnum = RouterPathsEnum;
      categories$!: Observable<CategoryInterface[]>;
      constructor(private categoriesService: CategoriesService) { }
      trackByIndex(index: number) {
            return index;
      }

      ngOnInit(): void {
            this.categories$ = this.categoriesService
                  .getAllCategories()
                  .pipe(delay(800));
      }
}
