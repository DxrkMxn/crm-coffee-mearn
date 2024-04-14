import { Injectable } from "@angular/core";
import {
      ActivatedRouteSnapshot,
      CanActivate,
      CanActivateChild,
      Router,
      RouterStateSnapshot,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { AuthService } from "../services/auth/auth.service";
import { RouterPathsEnum } from "../enums/routerPaths.enum";

@Injectable({
      providedIn: "root",
})
export class AuthGuard implements CanActivate, CanActivateChild {
      constructor(private authService: AuthService, private router: Router) {}
      canActivate(
            route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot,
      ): Observable<boolean> {
            if (this.authService.isAuthenticated()) {
                  return of(true);
            } else {
                  this.router.navigate([RouterPathsEnum.LOGIN], {
                        queryParams: { accessDenied: true },
                  });
                  return of(false);
            }
      }

      canActivateChild(
            childRoute: ActivatedRouteSnapshot,
            state: RouterStateSnapshot,
      ): Observable<boolean> {
            return this.canActivate(childRoute, state);
      }
}
