import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { RefreshToken } from 'src/app/shared/model/refreshToken';
import { RejectToken } from 'src/app/shared/model/rejectToken';
import { User } from 'src/app/shared/model/user';

const options = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient, private router: Router) {}

  public login(dataform: Object): Observable<User> {
    let data = JSON.stringify(dataform);
    return this.http
      .post<User>(`${environment.apiUrl}/user/token`, data, options)
      .pipe(
        tap((response) => {
          if (response && response.token) {
            localStorage.setItem(
              environment.localStorageName,
              JSON.stringify(response)
            );
            return response;
          }
          return null;
        })
      );
  }

  public refreshToken(): Observable<RefreshToken|null> {
    const currentUser= localStorage.getItem(environment.localStorageName);
    if(currentUser){
      const values = JSON.parse(currentUser);
      let data = JSON.stringify(values);
      return this.http
        .post<RefreshToken>(
          `${environment.apiUrl}/user/refreshToken`,
          data,
          options
        )
        .pipe(
          tap((response) => {
            if (response && response.token) {
              localStorage.removeItem(environment.localStorageName);
              values.token = response.token;
              values.refreshToken = response.refreshtoken;
              localStorage.setItem(
                environment.localStorageName,
                JSON.stringify(values)
              );
              return true;
            }
            return false;
          })
        );
      }
      return of(null);
  }

  public rejectToken(): Observable<Boolean> {
    const currentUser= localStorage.getItem(environment.localStorageName);
    if(currentUser){
      const values = JSON.parse(currentUser);
      let data = JSON.stringify({ refreshtoken: values.refreshToken });
      return this.http
        .post<RejectToken>(`${environment.apiUrl}/user/reject`, data, options)
        .pipe(
          tap((response) => {
            return this.logout();
          }),
          catchError((err) => {
            this.logout();
            return of(err);
          })
        );
      }
      return of(false);
  }

  public logout() {
    localStorage.removeItem(environment.localStorageName);
    this.router.navigate(['/login']);
    return true;
  }

  public getAuthToken() {
    const currentUser= localStorage.getItem(environment.localStorageName);
    if(currentUser){
      const values = JSON.parse(currentUser);
      return values.token;
    }
    return null;
  }
}
