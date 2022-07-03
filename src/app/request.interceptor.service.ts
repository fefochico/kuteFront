/*****************************************************/
/* EMPRESA:     Tecnología y Conocimiento            
/* Proyecto:    Minimiso                              
/* Autor:       Yeray Suárez
/* Archivo:     checklist.component.ts
/* Fecha:       20190320 
/* Vesion:      1.0.0 
/*****************************************************/
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpClient
} from '@angular/common/http';
import { throwError, Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { LoginService } from './page/login/service/login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private AUTH_HEADER = 'Authorization';
  private token = 'secrettoken';
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(private auth: LoginService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req = this.addAuthenticationToken(req);

    return <any>next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error && error.status === 403) {
          // 401 errors are most likely going to be because we have an expired token that we need to refresh.
          if (this.refreshTokenInProgress) {
            console.log('ENCOLANDO A LA ESPERA DE TOKEN REFRESH');
            // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
            // which means the new token is ready and we can retry the request again
            return this.refreshTokenSubject.pipe(
              filter((result) => result !== null),
              take(1),
              switchMap(() => next.handle(this.addAuthenticationToken(req)))
            );
          } else {
            this.refreshTokenInProgress = true;
            // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
            this.refreshTokenSubject.next(null);
            console.log('REFRESH TOKEN');
            return this.refreshAccessToken().pipe(
              switchMap((success: boolean) => {
                this.refreshTokenSubject.next(success);
                return next.handle(this.addAuthenticationToken(req));
              }),
              // When the call to refreshToken completes we reset the refreshTokenInProgress to false
              // for the next time the token needs to be refreshed
              finalize(() => {
                console.log('END REFRESH TOKEN');
                this.refreshTokenInProgress = false;
              })
            );
          }
        } else {
          console.log('LOGOUT');
          console.log('END REFRESH TOKEN');
          this.refreshTokenInProgress = false;
          if (error && error.status === 489) {
            this.auth.logout();
            return throwError(error);
          } else {
            return throwError(error);
          }
        }
      })
    );
  }

  private refreshAccessToken(): Observable<any> {
    //return of("secret token");
    return this.auth.refreshToken();
  }

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    // If we do not have a token yet then we should not set the header.
    // Here we could first retrieve the token from where we store it.
    this.token = this.auth.getAuthToken();
    if (!this.token) {
      return request;
    }
    // If you are calling an outside domain then do not add the token.

    return request.clone({
      headers: request.headers.set(this.AUTH_HEADER, 'Bearer ' + this.token)
    });
  }
}
