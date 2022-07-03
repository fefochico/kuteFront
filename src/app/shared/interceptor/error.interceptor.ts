import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from 'src/app/page/login/service/login.service';
import { switchMap, take, filter } from 'rxjs/operators';
import { UserService } from '../service/user.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private loginService: LoginService,
    private userService: UserService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          // auto logout if 401 response returned from api
          this.loginService.logout();
          location.reload(true);
          const error = err.error.message || err.statusText;
          return throwError(error);
        }

        if (
          request.url.includes('refreshToken') ||
          request.url.includes('token')
        ) {
          if (request.url.includes('refreshToken')) {
            this.loginService.logout();
            location.reload(true);
          }
          const error = err.error.message || err.statusText;
          return throwError(error);
        }

        if (this.refreshTokenInProgress) {
          return this.refreshTokenSubject.pipe(
            filter((result) => result !== null),
            take(1),
            switchMap((res) => {
              return next.handle(this.addAuthenticationToken(request));
            })
          );
        } else {
          this.refreshTokenInProgress = true;
          this.refreshTokenSubject.next(null);

          // Call auth.refreshAccessToken(this is an Observable that will be returned)
          return this.loginService.refreshToken().pipe(
            switchMap((token: any) => {
              //When the call to refreshToken completes we reset the refreshTokenInProgress to false
              // for the next time the token needs to be refreshed
              this.refreshTokenInProgress = false;
              this.refreshTokenSubject.next(token);

              return next.handle(this.addAuthenticationToken(request));
            }),
            catchError((err: any) => {
              this.refreshTokenInProgress = false;

              this.loginService.logout();
              location.reload(true);
              const error = err.error.message || err.statusText;
              return throwError(error);
            })
          );
        }
      })
    );
  }

  addAuthenticationToken(request) {
    // Get access token from Local Storage
    const accessToken = this.userService.getToken();

    // If access token is null this means that user is not logged in
    // And we return the original request
    if (!accessToken) {
      return request;
    }

    // We clone the request, because the original request is immutable
    return request.clone({
      setHeaders: {
        Authorization: this.userService.getToken()
      }
    });
  }
}
