/**
 * Cliente Angular realizado por: Jhusef Alfonso López Parra
 */
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginModule } from "./modules/login/login.module";
import { HeaderModule } from "./shared/components/layouts/header/header.module";
import { NaviModule } from "./shared/components/layouts/navi/navi.module";
import { RegisterModule } from "./modules/register/register.module";
import { ProfileModule } from "./modules/profile/profile.module";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { TokenInterceptor } from "./shared/classes/token.interceptor";
import { OverviewModule } from "./modules/overview/overview.module";
import { OrderModule } from "./modules/order/order.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { HistoryModule } from "./modules/history/history.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { MatDialogModule } from "@angular/material/dialog";
import { MailingModule } from "./modules/mailing/mailing-schema.module";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

export function tokenGetter() {
      return localStorage.getItem('authToken');
}

@NgModule({
      declarations: [AppComponent],
      imports: [
            BrowserModule,
            MatDialogModule,
            AppRoutingModule,
            LoginModule,
            HeaderModule,
            NaviModule,
            RegisterModule,
            BsDatepickerModule.forRoot(),
            ProfileModule,
            HttpClientModule,
            OverviewModule,
            OrderModule,
            CategoriesModule,
            HistoryModule,
            MailingModule,
            AnalyticsModule,
            MatDatepickerModule,
            MatFormFieldModule,
            MatInputModule,
            MatMomentDateModule,
            BrowserAnimationsModule,
            JwtModule.forRoot({
                  config: {
                        tokenGetter: tokenGetter,
                  },
            }),
      ],
      providers: [
            {
                  provide: HTTP_INTERCEPTORS,
                  useClass: TokenInterceptor,
                  multi: true,
            },
            JwtHelperService,
      ],
      bootstrap: [AppComponent],
})
export class AppModule { }
