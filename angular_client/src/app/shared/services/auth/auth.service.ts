import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UserInterface } from "../../interfaces/auth.interface";
import { Observable, BehaviorSubject, tap } from "rxjs";
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from "src/enviroments/environment";
import { UserDetailsInterface } from "../../interfaces/UserDetailsInterface ";
import { OrderService as AppOrdersService } from "../../../modules/order/service/order.service";

@Injectable({
      providedIn: "root",
})
export class AuthService {
      private storage: Storage;
      private currentUserSubject = new BehaviorSubject<UserInterface | null>(null);
      public currentUser = this.currentUserSubject.asObservable();

      constructor(
            private http: HttpClient,
            private appOrdersService: AppOrdersService,
            private jwtHelper: JwtHelperService,
      ) {
            this.storage = localStorage;
            this.loadCurrentUser();
      }

      private loadCurrentUser() {
            const token = this.getToken();
            if (token && !this.jwtHelper.isTokenExpired(token)) {
                  const decodedToken = this.jwtHelper.decodeToken(token);
                  this.getUserDetails(decodedToken.userId).subscribe(
                        (userData: UserDetailsInterface) => {
                              this.saveUser(userData);
                              this.currentUserSubject.next({
                                    ...userData,
                                    email: userData.email || '',
                              });
                        },
                        (error) => {
                              console.error('Error obteniendo detalles de usuario:', error);
                              this.currentUserSubject.next(null);
                        }
                  );
            } else {
                  this.currentUserSubject.next(null);
            }
      }

      private saveToken(token: string | null): void {
            if (token) {
                  this.storage.setItem('authToken', token);
            } else {
                  this.storage.removeItem('authToken');
                  this.storage.removeItem('userDetails');
            }
      }

      getToken(): string | null {
            return this.storage.getItem('authToken');
      }

      saveUser(user: UserDetailsInterface | null): void {
            if (user) {
                  this.storage.setItem('userDetails', JSON.stringify(user));
            } else {
                  this.storage.removeItem('userDetails');
            }
      }

      clearToken(): void {
            this.storage.removeItem('authToken');
      }

      login(payload: UserInterface): Observable<{ token: string }> {
            return this.http.post<{ token: string }>(
                  `${environment.urls.auth}/login`,
                  payload,
            ).pipe(
                  tap(({ token }) => {
                        this.saveToken(token);
                        const decodedToken = this.jwtHelper.decodeToken(token);
                        this.getUserDetails(decodedToken.userId).subscribe(
                              (user: UserDetailsInterface) => {
                                    this.saveUser(user);
                                    this.currentUserSubject.next({
                                          ...user,
                                          email: user.email || '',
                                    });
                              },
                              (error) => { }
                        );
                  }),
            );
      }

      register(user: UserInterface): Observable<UserInterface> {
            return this.http.post<UserInterface>(
                  `${environment.urls.auth}/register`,
                  user,
            );
      }

      update(user: UserInterface): Observable<UserInterface> {
            return this.http.post<UserInterface>(
                  `${environment.urls.auth}/update`,
                  user,
            );
      }

      isAuthenticated(): boolean {
            const token = this.getToken();
            return !!token && !this.jwtHelper.isTokenExpired(token);
      }

      logout() {
            this.appOrdersService.clear();
            this.saveToken(null);
            this.currentUserSubject.next(null);
      }

      get currentUserValue(): UserInterface | null {
            return this.currentUserSubject.value;
      }

      getUserDetails(userId: string): Observable<UserDetailsInterface> {
            return this.http.get<UserDetailsInterface>(`${environment.urls.user}/${userId}`);
      }

      getUser(): UserDetailsInterface | null {
            const userJson = this.storage.getItem('userDetails');
            return userJson ? JSON.parse(userJson) : null;
      }

      isAdmin(): boolean {
            const user = this.currentUserSubject.value;
            return user?.admin === true;
      }

      getCurrentUserId(): string | undefined {
            return this.currentUserSubject.value?._id;
      }

      updateProfile(userData: UserInterface): Observable<any> {
            return this.http.patch<UserDetailsInterface>(`${environment.urls.user}/${userData._id}`, userData);
      }
}
