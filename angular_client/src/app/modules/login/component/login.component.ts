import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { UserInterface } from "../../../shared/interfaces/auth.interface";
import { AuthService } from "../../../shared/services/auth/auth.service";
import { AuthFormComponent } from "../../../shared/components/auth-form/component/auth-form.component";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { RouterPathsEnum } from "../../../shared/enums/routerPaths.enum";
import { MaterialService } from "../../../shared/classes/material.service";

@Component({
      selector: "crm-login",
      templateUrl: "./login.component.html",
      styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit, OnDestroy {
      loginSubscription!: Subscription;
      @ViewChild("form") crmAuthForm!: AuthFormComponent;

      constructor(
            private authService: AuthService,
            private router: Router,
            private route: ActivatedRoute,
            private materialService: MaterialService,
      ) { }

      login($event: UserInterface) {
            this.crmAuthForm.authForm.disable();
            this.loginSubscription = this.authService
                  .login($event)
                  .subscribe(() => {
                        let userSub: Subscription;

                        userSub = this.authService.currentUser.subscribe((user) => {
                              if (user?.admin) {
                                    this.router.navigate([RouterPathsEnum.OVERVIEW]);
                              } else {
                                    this.router.navigate([RouterPathsEnum.ORDER]);
                              }
                              if (userSub) {
                                    userSub.unsubscribe();
                              }
                        });
                  }, (err: any) => {
                        this.handleLoginError(err);
                        this.crmAuthForm.authForm.enable();
                  });
      }

      handleLoginError(err: any) {
            if (err && err.error) {
                  this.materialService.toast(err.error.message || 'Ocurrió un error.');
            } else {
                  this.materialService.toast('Ocurrió un error.');
            }
            this.crmAuthForm.authForm.enable();
            this.logout()
      }

      logout(): void {
            this.authService.logout();
            this.router.navigate(['/']);
      }

      ngOnDestroy(): void {
            if (this.loginSubscription) {
                  this.loginSubscription.unsubscribe();
            }
      }

      ngOnInit(): void { }
}
