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
import { OptionInterface } from "src/app/shared/interfaces/option.interface";
import { OptionsService } from "src/app/shared/services/positions/option.service";

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
      @Input("categoryId") categoryIdProps: string | undefined;
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
                              cost: null,
                        });
                        this.materialService.updateTextInput();
                  },
            );
      }

      initializeOptions() {
            if (this.categoryIdProps) {
                  this.options$ = this.optionsService.getAllOptions(
                        this.categoryIdProps,
                  );
            }
      }
      initializeForm() {
            this.addOptionForm = new FormGroup({
                  name: new FormControl(null, [Validators.required]),
                  cost: new FormControl(null, [
                        Validators.required,
                        Validators.min(0),
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
            this.optionId = option._id as string;
            this.addOptionForm.patchValue({
                  name: option.name,
                  cost: option.cost,
            });
            this.modal?.open();
            this.materialService.updateTextInput();
      }

      hideModal() {
            this.modal?.close();
      }

      submitOption() {
            this.addOptionForm.disable();
            const { name, cost } = this.addOptionForm.value;
            let stream$ = of({} as OptionInterface);
            if (this.categoryIdProps && this.optionId) {
                  stream$ = this.optionsService
                        .updateOption(this.optionId, name, cost)
                        .pipe(takeUntil(this.isAlive));
            } else if (this.categoryIdProps) {
                  const body = { name, cost, category: this.categoryIdProps };
                  stream$ = this.optionsService
                        .createOption(body)
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
                              cost: null,
                        });
                        this.materialService.updateTextInput();
                  },
            );
      }

      removeOption(_id: string, event: Event) {
            event.stopPropagation();
            const decision = window.confirm("Realmente quieres removerlo?");
            if (decision) {
                  this.optionsService
                        .removeOption(_id)
                        .pipe(takeUntil(this.isAlive))
                        .subscribe(
                              ({ message }) => {
                                    if (message !== undefined) {
                                          this.materialService.toast(message);
                                    }
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
