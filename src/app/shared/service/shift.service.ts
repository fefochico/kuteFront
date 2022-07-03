import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorHandler } from './errorHandler';
import { environment } from '../../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DayStr } from '../model/day';
import { Time } from '../model/time';
import { Shift } from '../model/shift';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ShiftService extends HttpErrorHandler {
  public shifts: Shift[] | null = null;
  public days: DayStr[] | null = null;
  public times: Time[] | null = null;

  constructor(protected override http: HttpClient) {
    super(http);
  }

  getData(id: number): Observable<Shift[]> {
    return this.http
      .get<Shift[]>(
        `${environment.apiUrl}/shift/withTime?idshop=${id}`,
        httpOptions
      )
      .pipe(
        tap((shifts) => {
          this.shifts = shifts;
        }),
        catchError(this.handleError)
      );
  }

  getDayData(): Observable<DayStr[]> {
    return this.http
      .get<DayStr[]>(`${environment.apiUrl}/day`, httpOptions)
      .pipe(
        tap((days) => {
          this.days = days;
        }),
        catchError(this.handleError)
      );
  }

  getTimeData(): Observable<Time[]> {
    return this.http
      .get<Time[]>(`${environment.apiUrl}/time`, httpOptions)
      .pipe(
        tap((times) => {
          this.times = times;
        }),
        catchError(this.handleError)
      );
  }

  postData(data: any): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/shift`, data, httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteData(data: any): Observable<any> {
    const customOptions= { httpOptions, body: data};
    return this.http
      .delete<any>(`${environment.apiUrl}/shift`, customOptions)
      .pipe(catchError(this.handleError));
  }
}
