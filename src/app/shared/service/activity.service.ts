import { Injectable, ErrorHandler } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Activity } from '../model/activity';
import { HttpErrorHandler } from './errorHandler';
import { Service } from '../model/service';
import { Duration } from '../model/duration';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ActivityService extends HttpErrorHandler {
  public activities: Activity[] | null = null;
  public durations: Duration[] | null = null;
  constructor(protected override http: HttpClient) {
    super(http);
  }

  getData(id: Number): Observable<Activity[]> {
    return this.http
      .get<Activity[]>(
        `${environment.apiUrl}/activity?idshop=${id}`,
        httpOptions
      )
      .pipe(
        tap((result) => (this.activities = result)),
        catchError(this.handleError)
      );
  }

  getServiceData(id: Number): Observable<Service[]> {
    return this.http
      .get<Service[]>(
        `${environment.apiUrl}/service/withDuration?idshop=${id}`,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getDurationData(): Observable<Duration[]> {
    return this.http
      .get<Duration[]>(`${environment.apiUrl}/duration`, httpOptions)
      .pipe(
        tap((result) => (this.durations = result)),
        catchError(this.handleError)
      );
  }

  postData(data: any): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/activity`, data, httpOptions)
      .pipe(catchError(this.handleError));
  }

  postServiceData(data: any): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/service`, data, httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteData(data: any): Observable<any> {
    const customOptions= {httpOptions, body:data};
    return this.http
      .delete<any>(`${environment.apiUrl}/activity`, customOptions)
      .pipe(catchError(this.handleError));
  }

  deleteServiceData(data: any): Observable<any> {
    const customOptions = {httpOptions, body: data};
    return this.http
      .delete<any>(`${environment.apiUrl}/service`, customOptions)
      .pipe(catchError(this.handleError));
  }
}
