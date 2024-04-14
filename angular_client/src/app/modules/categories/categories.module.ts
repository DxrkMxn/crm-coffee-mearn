import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CategoriesComponent } from "./components/categories.component";
import { RouterLink } from "@angular/router";
import { LoaderModule } from "../../shared/components/loader/loader.module";
import { OptionsFormComponent } from "./components/category-form/options-form/options-form.component";
import { CategoryFormComponent } from "./components/category-form/category-form";
import {MatDialogModule} from '@angular/material/dialog';
import { ConfirmCategoryDialogComponent } from "./components/category-form/confirm-dialog/confirm-dialog.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
      declarations: [CategoriesComponent, CategoryFormComponent, OptionsFormComponent, ConfirmCategoryDialogComponent],
      imports: [CommonModule, RouterLink, LoaderModule, ReactiveFormsModule, MatDialogModule ],
})
export class CategoriesModule {}
