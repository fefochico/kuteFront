import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Booking } from '../model/booking';
import { HttpErrorHandler } from './errorHandler';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class BookingService extends HttpErrorHandler {
  public bookings: Booking[] | null = null;

  constructor(protected override http: HttpClient) {
    super(http);
  }

  getDataWithDates(
    idshop: number,
    keystaff: string,
    startdate: string,
    enddate: string
  ): Observable<Booking[]> {
    return this.http
      .get<Booking[]>(
        `${environment.apiUrl}/booking/betweenDates?idshop=${idshop}&keystaff=${keystaff}&startdate=${startdate}&enddate=${enddate}`,
        httpOptions
      )
      .pipe(
        tap((result) => (this.bookings = result)),
        catchError(this.handleError)
      );
  }

  deleteData(data: any) {
    const options = {
      headers: httpOptions.headers,
      body: data
    };
    return this.http
      .delete<any>(`${environment.apiUrl}/booking`, options)
      .pipe(catchError(this.handleError));
  }

  postData(data: any) {
    return this.http
      .post<any>(`${environment.apiUrl}/booking`, data, httpOptions)
      .pipe(catchError(this.handleError));
  }
}
