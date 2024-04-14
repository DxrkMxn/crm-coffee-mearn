import { Component, OnInit } from "@angular/core";
import { RouterPathsEnum } from "../../../shared/enums/routerPaths.enum";
import { CategoriesService } from "../../../shared/services/categories/categories.service";
import { delay, Observable } from "rxjs";
import { CategoryInterface } from "../../../shared/interfaces/category.interface";

@Component({
      selector: "crm-categories",
      templateUrl: "./categories.component.html",
      styleUrls: ["./categories.component.css"],
})
export class CategoriesComponent implements OnInit {
      categoriesList$!: Observable<CategoryInterface[]>;
      routerPathsEnum = RouterPathsEnum;

      constructor(private categoriesService: CategoriesService) {}

      trackById(index: number, item: CategoryInterface) {
            return item._id;
      }

      ngOnInit(): void {
            this.categoriesList$ = this.categoriesService
                  .getAllCategories()
                  .pipe(delay(800));
      }
}
