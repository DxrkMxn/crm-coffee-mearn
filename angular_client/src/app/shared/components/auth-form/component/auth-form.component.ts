import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
      FormBuilder,
      FormControl,
      FormGroup,
      Validators,
} from "@angular/forms";
import { UserInterface } from "../../../interfaces/auth.interface";

@Component({
      selector: "crm-auth-form",
      templateUrl: "./auth-form.component.html",
      styleUrls: ["./auth-form.component.css"],
})
export class AuthFormComponent implements OnInit {
      @Input("title") titleProps!: string;
      @Input("buttonTitle") buttonTitleProps!: string;
      @Output() emitAuthForm = new EventEmitter<UserInterface>();
      @Input() isRegistering: boolean = false;
      @Input() isUpdating: boolean = false;
      authForm!: FormGroup;

      requiredPasswordLength = 3;

      emailIsValid(): boolean {
            return (
                  this.authForm.controls["email"].errors &&
                  this.authForm.controls["email"].errors["email"]
            );
      }

      constructor(private fb: FormBuilder) { }
      submitForm() {
            this.authForm.disable();
            this.emitAuthForm.emit(this.authForm.value);
      }

      ngOnInit(): void {
            const formControls: any = { };

            if (this.isUpdating) {
                  formControls['name'] = new FormControl(null, Validators.required);
                  formControls['surname'] = new FormControl(null, Validators.required);
                  formControls['phone'] = new FormControl(null, [
                        Validators.required,
                        Validators.pattern(/^3\d{9}$/)
                  ]);
            } else if (this.isRegistering) {
                  formControls['email'] = new FormControl(null, [
                        Validators.required,
                        Validators.pattern(/^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
                  ]);
                  formControls['password'] = new FormControl(null, [
                        Validators.required,
                        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}/)
                  ]);
                  formControls['name'] = new FormControl(null, Validators.required);
                  formControls['surname'] = new FormControl(null, Validators.required);
                  formControls['phone'] = new FormControl(null, [
                        Validators.required,
                        Validators.pattern(/^3\d{9}$/)
                  ]);
            } else {
                  formControls['email'] = new FormControl(null, [
                        Validators.required,
                        Validators.pattern(/^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
                  ]);
                  formControls['password'] = new FormControl(null, [
                        Validators.required,
                        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}/)
                  ]);
            }

            this.authForm = this.fb.group(formControls);
      }

}
