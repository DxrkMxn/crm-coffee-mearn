import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { RouterPathsEnum } from "../../../../shared/enums/routerPaths.enum";
import { Subject, firstValueFrom, fromEvent, of, switchMap, takeUntil } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MaterialService } from "../../../../shared/classes/material.service";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmMailDialogComponent } from "./confirm-dialog/confirm-dialog.component";
import { EmailSchemaInterface } from "src/app/shared/interfaces/email-schema.interface";
import { EmailSchemasService } from "src/app/shared/services/email/email.service";
import * as moment from "moment";

@Component({
      selector: "crm-mailing-schema-form",
      templateUrl: "./mailing-schema-form.html",
      styleUrls: ["./mailing-schema-form.css"],
})
export class MailingSchemaFormComponent implements OnInit, OnDestroy {
      emailSchema?: EmailSchemaInterface;
      emailSchemaId?: string;
      isNew = true;
      emailSchemaForm: FormGroup;
      private isAlive = new Subject<void>();
      image: File | undefined;
      emailSchemaCharged: string | File | ArrayBuffer | null = "";
      emailHtmlFile: string | File | undefined | null = "";
      isFileSelected = false;
      routerPathsEnum = RouterPathsEnum;
      @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>;
      @ViewChild("delButton", { static: true }) delButton!: ElementRef<HTMLButtonElement>;

      private destroy$ = new Subject<void>();

      constructor(
            private dialog: MatDialog,
            private fb: FormBuilder,
            private route: ActivatedRoute,
            private router: Router,
            private emailSchemasService: EmailSchemasService,
            private materialService: MaterialService,
      ) {
            this.emailSchemaForm = new FormGroup({
                  name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
                  subject: new FormControl(null, [Validators.required, Validators.minLength(2)]),
                  sendDate: new FormControl(null, [Validators.required]),
                  templateUrl: new FormControl(null, [Validators.required]),

            });
      }

      ngOnInit(): void {
            this.initializeRouterParams();
            this.initializeDeleteStream();
      }

      ngOnDestroy(): void {
            this.destroy$.next();
            this.destroy$.complete();
      }

      private initializeDeleteStream() {
            fromEvent(this.delButton.nativeElement, "click")
                  .pipe(takeUntil(this.isAlive))
                  .subscribe(() => this.removeEmailSchema());
      }

      private initializeRouterParams() {
            this.route.params
                  .pipe(
                        switchMap((params: { id?: string }) => {
                              if (params.id) {
                                    this.isNew = false;
                                    this.emailSchemaId = params.id;
                                    return this.emailSchemasService.getEmailSchemaById(params.id);
                              }
                              return of(null);
                        }),
                        takeUntil(this.destroy$)
                  )
                  .subscribe(
                        (emailSchema: EmailSchemaInterface | null) => {
                              if (emailSchema) {
                                    this.emailSchema = emailSchema;
                                    this.emailSchemaCharged = emailSchema.templateUrl;
                                    this.isFileSelected = true;
                                    this.emailSchemaForm.patchValue({
                                          name: emailSchema.name,
                                          subject: emailSchema.subject,
                                          sendDate: moment(emailSchema.sendDate).format('YYYY-MM-DD'),
                                          templateUrl: emailSchema.templateUrl,
                                    });
                              }
                        },
                        (error: any) => this.materialService.toast(error.error.message)
                  );
      }

      async submitForm() {
            if (this.emailSchemaForm.invalid) {
                  this.materialService.toast("El formulario no es válido. Por favor, revise los errores.");
                  return;
            }

            this.emailSchemaForm.disable();

            const formValue = this.emailSchemaForm.value;

            try {
                  if (this.isNew) {
                        const newEmailSchema = await firstValueFrom(this.emailSchemasService.createEmailSchema(formValue));
                        this.router.navigate(["/emails/", newEmailSchema._id]);
                        this.materialService.toast("El esquema ha sido creado.");
                  } else if (this.emailSchemaId) {
                        await firstValueFrom(this.emailSchemasService.updateEmailSchema(this.emailSchemaId, formValue));
                        this.router.navigate(["/emails",this.emailSchemaId]);
                        this.materialService.toast("El esquema ha sido actualizado.");
                  }

            } catch (error) {
                  this.materialService.toast("Error al guardar el esquema.");
            } finally {
                  if (this.emailSchemaForm.disabled) {
                        this.emailSchemaForm.enable();
                  }
            }
      }

      removeEmailSchema() {
            const decision = window.confirm(
                  `¿Estás seguro de que deseas eliminar el esquema de correo electrónico ${this.emailSchema?.name}?`
            );

            if (decision && this.emailSchemaId) {
                  this.emailSchemasService.deleteEmailSchema(this.emailSchemaId).subscribe(
                        () => {
                        this.router.navigate(["/emails"]);
                        },
                        (error) => { }
                  );
            }
      }

      openConfirmMailDialog(): void {
            const dialogRef = this.dialog.open(ConfirmMailDialogComponent, {
                  width: "250px",
            });

            dialogRef.afterClosed().subscribe((result) => { });
      }

      showFileInput() {
            this.fileInput.nativeElement.click();
      }

      downloadFileInput(): void {
            if (this.isFileSelected && typeof this.emailSchemaCharged === 'string') {
                  const content = this.emailSchemaCharged;
                  const a = document.createElement('a');
                  a.style.display = 'none';
                  a.href = content;
                  a.download = 'email-schema.html';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
            }
      }



      onFileUpload(event: Event) {
            const element = event.target as HTMLInputElement;
            const file = element.files![0];

            if (file) {
                  const reader = new FileReader();

                  reader.onload = (e) => {
                        if (e.target && typeof e.target.result === "string") {
                              this.emailSchemaForm.get("templateUrl")?.setValue(e.target.result);
                              this.emailSchemaCharged = e.target.result;
                              this.isFileSelected = true;
                        }
                  };

                  reader.readAsDataURL(file);
            }
      }
}
