import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { Shop } from '../model/shop';
import { catchError, tap } from 'rxjs/operators';
import { HttpErrorHandler } from './errorHandler';
import { Country } from '../model/country';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ShopService extends HttpErrorHandler {
  public shops: Shop[] | null = null;
  public countries: Country[] | null = null;
  constructor(protected override http: HttpClient) {
    super(http);
  }

  getData(id: string | null): Observable<Shop[]> {
    return this.http
      .get<Shop[]>(`${environment.apiUrl}/shop?iduser=${id}`, httpOptions)
      .pipe(
        tap((shops) => {
          this.shops = shops;
        }),
        catchError(this.handleError)
      );
  }

  getCountryData(): Observable<Country[]> {
    return this.http
      .get<Country[]>(`${environment.apiUrl}/country`, httpOptions)
      .pipe(
        tap((countries) => {
          this.countries = countries;
        }),
        catchError(this.handleError)
      );
  }

  postData(data: any): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/shop`, data, httpOptions)
      .pipe(catchError(this.handleError));
  }
}
