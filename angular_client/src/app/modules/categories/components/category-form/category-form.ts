import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { RouterPathsEnum } from "../../../../shared/enums/routerPaths.enum";
import { firstValueFrom, fromEvent, Subject, switchMap, takeUntil } from "rxjs";
import { CategoryInterface } from "../../../../shared/interfaces/category.interface";
import { CategoriesService } from "../../../../shared/services/categories/categories.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MaterialService } from "../../../../shared/classes/material.service";
import { of } from 'rxjs';
import { MatDialog } from "@angular/material/dialog";
import { ConfirmCategoryDialogComponent } from "./confirm-dialog/confirm-dialog.component";


@Component({
      selector: "crm-category-form",
      templateUrl: "./category-form.html",
      styleUrls: ["./category-form.css"],
})
export class CategoryFormComponent implements OnInit, OnDestroy {
      category?: CategoryInterface;
      categoryId?: string;
      isNew = true;
      categoryForm: FormGroup;
      private isAlive = new Subject<void>();
      image: File | undefined;
      imagePreview: string | File | ArrayBuffer | null = "";
      routerPathsEnum = RouterPathsEnum;
      @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>;
      @ViewChild("delButton", { static: true }) delButton!: ElementRef<HTMLButtonElement>;

      constructor(
            private categoriesService: CategoriesService,
            private materialService: MaterialService,
            private route: ActivatedRoute,
            private router: Router,
            private dialog: MatDialog,
      ) {
            this.categoryForm = new FormGroup({
                  name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
            });
      }

      ngOnInit(): void {
            this.initializeDeleteStream();
            this.initializeRouterParams();
      }

      ngOnDestroy(): void {
            this.isAlive.next();
            this.isAlive.complete();
      }

      private initializeDeleteStream() {
            fromEvent(this.delButton.nativeElement, "click")
                  .pipe(takeUntil(this.isAlive))
                  .subscribe(() => this.removeCategory());
      }

      private initializeRouterParams() {
            this.route.params
                  .pipe(
                        switchMap((params: { id?: string }) => {
                              if (params.id) {
                                    this.isNew = false;
                                    this.categoryId = params.id;
                                    return this.categoriesService.getCurrentCategory(params.id);
                              }
                              return of(null);
                        }),
                        takeUntil(this.isAlive)
                  )
                  .subscribe(
                        (category: CategoryInterface | null) => {
                              if (category) {
                                    this.category = category;
                                    this.categoryForm.patchValue({
                                          name: category.name,
                                    });
                                    this.imagePreview = category.image || null;
                                    this.materialService.updateTextInput();
                              }
                        },
                        (error: any) => this.materialService.toast(error.error.message)
                  );
      }


      convertToBase64(file: File): Promise<string> {
            return new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => resolve(reader.result as string);
                  reader.onerror = error => reject(error);
            });
      }

      async submitForm() {
            if (this.categoryForm.invalid) {
                  this.materialService.toast('El formulario no es válido. Por favor, revise los errores.');
                  return;
            }

            this.categoryForm.disable();

            const categoryName = this.categoryForm.get('name')!.value;
            let imageBase64 = '';

            if (this.image) {
                  imageBase64 = await this.convertToBase64(this.image);
            } else if (this.category && this.category.imageSrc) {
                  imageBase64 = this.category.imageSrc;
            } else {
                  this.materialService.toast('Por favor, adjunte una imagen para la categoría.');
                  this.categoryForm.enable();
                  return;
            }

            const payload = {
                  name: categoryName,
                  image: imageBase64
            };

            try {
                  if (this.isNew) {
                        const newCategory = await firstValueFrom(this.categoriesService.createCategory(payload));
                        this.router.navigate([this.routerPathsEnum.CATEGORIES, newCategory._id]);
                        this.materialService.toast('La categoría ha sido creada.');
                  } else if (this.categoryId) {
                        await firstValueFrom(this.categoriesService.updateCategory(this.categoryId, payload));
                        this.materialService.toast('La categoría ha sido actualizada.');
                  }
            } catch (error) {
                  this.materialService.toast('Error al guardar la categoría.');
            } finally {
                  this.categoryForm.enable();
            }
      }

      removeCategory() {
            const decision = window.confirm(`Seguro que quieres borrar la categoría ${this.category?.name}?`);
            if (decision) {
                  this.categoryId &&
                        this.categoriesService
                              .removeCategory(this.categoryId)
                              .pipe(takeUntil(this.isAlive))
                              .subscribe(
                                    ({ message }) => {
                                          this.materialService.toast(message);
                                          this.router.navigate([this.routerPathsEnum.CATEGORIES]);
                                    },
                                    error => this.materialService.toast(error.error.message)
                              );
            }
      }

      openConfirmCategoryDialog(): void {
            const dialogRef = this.dialog.open(ConfirmCategoryDialogComponent, {
                  width: '250px'
            });

            dialogRef.afterClosed().subscribe(result => { });
      }

      showFileInput() {
            this.fileInput.nativeElement.click();
      }

      onFileUpload(event: Event) {
            const element = event.target as HTMLInputElement;
            const file = element.files![0];
            this.image = file;

            const reader = new FileReader();
            reader.onload = () => {
                  this.imagePreview = reader.result;
            };
            reader.readAsDataURL(file);
      }
}