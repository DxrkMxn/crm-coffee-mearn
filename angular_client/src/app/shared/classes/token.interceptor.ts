import {
      HttpErrorResponse,
      HttpEvent,
      HttpHandler,
      HttpInterceptor,
      HttpRequest,
      HttpResponse,
} from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { AuthService } from "../services/auth/auth.service";
import { Router } from "@angular/router";
import { RouterPathsEnum } from "../enums/routerPaths.enum";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
      constructor(
            private router: Router,
      ) { }

      intercept(
            req: HttpRequest<any>,
            next: HttpHandler,
      ): Observable<HttpEvent<any>> {
            const token = localStorage.getItem('authToken');
            if (token) {
                  const clonedReq = req.clone({
                        headers: req.headers.set("Authorization", token),
                  });
                  return next.handle(clonedReq).pipe(
                        catchError((err: HttpErrorResponse) =>
                              this.handleAuthError(err),
                        ),
                  );
            }
            return next.handle(req);
      }

      private handleAuthError(err: HttpErrorResponse): Observable<never> {
            if (err.status === 401) {
                  localStorage.removeItem('authToken');
                  this.router.navigate([RouterPathsEnum.LOGIN], {
                        queryParams: {
                              sessionFailed: true,
                        },
                  });
            }
            return throwError(err);
      }
}
