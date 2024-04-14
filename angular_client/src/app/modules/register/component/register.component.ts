import { Component, OnDestroy, ViewChild } from "@angular/core";
import { UserInterface } from "../../../shared/interfaces/auth.interface";
import { AuthService } from "../../../shared/services/auth/auth.service";
import { Subscription } from "rxjs";
import { RouterPathsEnum } from "../../../shared/enums/routerPaths.enum";
import { AuthFormComponent } from "../../../shared/components/auth-form/component/auth-form.component";
import { Router } from "@angular/router";
import { MaterialService } from "../../../shared/classes/material.service";

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnDestroy {
    registerSubscription!: Subscription;
    @ViewChild("form") crmAuthForm!: AuthFormComponent;
    constructor(
        private authService: AuthService,
        private router: Router,
        private materialService: MaterialService,
    ) { }
    register($event: UserInterface) {
        this.crmAuthForm.authForm.disable();
        this.registerSubscription = this.authService
            .register($event)
            .subscribe(
                () => {
                    this.router.navigate([RouterPathsEnum.LOGIN]);
                    this.materialService.toast("Puedes iniciar sesión con tus propias credenciales.");
                },
                (err: any) => {
                    this.crmAuthForm.authForm.enable();
                    if (err && err.error && err.error?.message) {
                        this.materialService.toast(err.error?.message);
                    } else {
                        this.materialService.toast('Ocurrió un error al registrarse. Por favor, inténtelo nuevamente.');
                    }
                },
            );
    }


    ngOnDestroy(): void {
        if (this.registerSubscription) {
            this.registerSubscription.unsubscribe();
        }
    }
}
