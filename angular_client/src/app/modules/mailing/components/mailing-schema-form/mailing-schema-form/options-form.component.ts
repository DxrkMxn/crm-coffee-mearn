import {
      AfterViewInit,
      Component,
      ElementRef,
      Input,
      OnDestroy,
      OnInit,
      ViewChild,
} from "@angular/core";
import { fromEvent, Observable, of, Subject, takeUntil } from "rxjs";
import {
      MaterialInterface,
      MaterialService,
} from "../../../../../shared/classes/material.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { OptionsService } from "src/app/shared/services/positions/option.service";
import { OptionInterface } from "src/app/shared/interfaces/option.interface";
import { EmailSchemaInterface } from "src/app/shared/interfaces/email-schema.interface";

@Component({
      selector: "crm-options-form",
      templateUrl: "./options-form.component.html",
      styleUrls: ["./options-form.component.css"],
})
export class OptionsFormComponent
      implements OnInit, AfterViewInit, OnDestroy {
      options$: Observable<OptionInterface[] | null> = of(null);
      modal: MaterialInterface | undefined;
      optionId: string | null = null;
      addOptionForm!: FormGroup;
      isAlive = new Subject<void>();
      @Input("schemaId") schemaIdProps: string | undefined;
      @ViewChild("addOption", { static: true }) addOptionRef!: ElementRef;
      @ViewChild("modal") modalRef!: ElementRef;

      constructor(
            private optionsService: OptionsService,
            private materialService: MaterialService,
      ) { }

      ngOnInit(): void {
            this.initializeOptions();
            this.initializeForm();

            fromEvent(this.addOptionRef.nativeElement, "click").subscribe(
                  () => {
                        this.optionId = null;
                        this.modal?.open();
                        this.addOptionForm.reset({
                              name: null,
                              subject: null,
                              sendDate: null,
                              templateUrl: null,
                        });
                        this.materialService.updateTextInput();
                  },
            );
      }

      initializeOptions() {
            if (this.schemaIdProps) {
                  this.options$ = this.optionsService.getAllMailingOptions(
                        this.schemaIdProps,
                  );
            }
      }
      initializeForm() {
            this.addOptionForm = new FormGroup({
                  name: new FormControl(null, [
                        Validators.required,
                        Validators.min(2),
                  ]),
                  subject: new FormControl(null, [
                        Validators.required,
                        Validators.min(2),
                  ]),
                  sendDate: new FormControl(null, [
                        Validators.required,
                  ]),
                  templateUrl: new FormControl(null, [
                        Validators.required,
                  ]),
            });
      }

      trackById(index: number, item: OptionInterface) {
            return item._id;
      }

      ngAfterViewInit(): void {
            this.modal = this.materialService.initModal(
                  this.modalRef.nativeElement,
            );
      }

      ngOnDestroy(): void {
            this.modal?.destroy();
            this.isAlive.next();
            this.isAlive.complete();
      }

      selectOption(option: OptionInterface) {
            const emailSchema: EmailSchemaInterface = {
                  _id: option._id ? option._id : '',
                  name: option.name,
                  subject: '',
                  sendDate: new Date(),
                  templateUrl: '',
            };

            this.optionId = option._id as string;
            this.addOptionForm.patchValue({
                  name: option.name,      
                  subject: emailSchema.subject,
                  sendDate: emailSchema.sendDate,
                  templateUrl: emailSchema.templateUrl,
            });
            this.modal?.open();
            this.materialService.updateTextInput();
      }


      hideModal() {
            this.modal?.close();
      }

      submitOption() {
            this.addOptionForm.disable();
            const { name, subject, sendDate, templateUrl } = this.addOptionForm.value;
            let stream$ = of({} as EmailSchemaInterface);
            if (this.schemaIdProps && this.optionId) {
                  stream$ = this.optionsService
                        .updateMailingOption(this.schemaIdProps, name, subject, sendDate, templateUrl,)
                        .pipe(takeUntil(this.isAlive));
            } else if (this.schemaIdProps) {
                  const body = { name, subject, sendDate, templateUrl, };
                  stream$ = this.optionsService
                        .createMailingOption(body)
                        .pipe(takeUntil(this.isAlive));
            }

            stream$.subscribe(
                  option => {
                        this.initializeOptions();

                        this.materialService.toast(`La Opción ${option.name} fue ${this.optionId ? 'actualizada' : 'creada'}`);
                  },
                  err => {
                        this.materialService.toast(err.error.message);
                  },
                  () => {
                        this.modal?.close();
                        this.addOptionForm.enable();
                        this.addOptionForm.reset({
                              name: null,
                              subject: null,
                              sendDate: null,
                              templateUrl: null,
                        });
                        this.materialService.updateTextInput();
                  },
            );
      }

      removeOption(_id: string, event: Event) {
            event.stopPropagation();
            const decision = window.confirm("Realmente quieres remover esta Opción?");
            if (decision) {
                  this.optionsService
                        .removeOption(_id)
                        .pipe(takeUntil(this.isAlive))
                        .subscribe(
                              ({ message }) => {
                                    this.initializeOptions();
                              },
                              err =>
                                    this.materialService.toast(
                                          err.error.message,
                                    ),
                        );
            }
      }
}
