import { Component, OnDestroy, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { AuthFormComponent } from "src/app/shared/components/auth-form/component/auth-form.component";
import { AuthService } from "src/app/shared/services/auth/auth.service";
import { MaterialService } from "src/app/shared/classes/material.service";
import { UserInterface } from "src/app/shared/interfaces/auth.interface";
import { RouterPathsEnum } from "src/app/shared/enums/routerPaths.enum";

@Component({
    selector: "app-profile",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnDestroy {
    profileSubscription!: Subscription;
    @ViewChild("form") crmAuthForm!: AuthFormComponent;
    constructor(
        private authService: AuthService,
        private router: Router,
        private materialService: MaterialService,
    ) { }
    updateProfile($event: UserInterface) {     this.crmAuthForm.authForm.disable();
        this.profileSubscription = this.authService
            .updateProfile($event)
            .subscribe(
                () => {
                    this.router.navigate([RouterPathsEnum.PROFILE]);
                    this.materialService.toast('Información personal actualizada!');
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
        if (this.profileSubscription) {
            this.profileSubscription.unsubscribe();
        }
    }
}
