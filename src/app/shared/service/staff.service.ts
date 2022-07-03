import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorHandler } from './errorHandler';
import { environment } from 'src/environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Staff } from '../model/staff';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class StaffService extends HttpErrorHandler {
  public staff: Staff[] | null= null;
  constructor(protected override http: HttpClient) {
    super(http);
  }

  getData(id: Number): Observable<Staff[]> {
    return this.http
      .get<Staff[]>(`${environment.apiUrl}/staff?idshop=${id}`, httpOptions)
      .pipe(
        tap((staff) => {
          this.staff = staff;
        }),
        catchError(this.handleError)
      );
  }

  postData(data: any): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/staff`, data, httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteData(data: any): Observable<any> {
    const customOptions= {httpOptions, body: data};
    return this.http
      .delete<any>(`${environment.apiUrl}/staff`, customOptions)
      .pipe(catchError(this.handleError));
  }
}
