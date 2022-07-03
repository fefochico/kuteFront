import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() {}

  public getCurrentUser(): string | null {
    const currentUser = localStorage.getItem(environment.localStorageName);
    if (currentUser) return currentUser;
    return null;
  }

  public getToken(): string | null {
    const currentUser = localStorage.getItem(environment.localStorageName);
    if (currentUser) {
      const values= JSON.parse(currentUser);
      return values.token;
    }
    return null;
  }

  public getUsername(): string | null {
    const currentUser = localStorage.getItem(environment.localStorageName);
    if (currentUser) {
      const values= JSON.parse(currentUser);
      return values.username;
    }
    return null;
  }

  public getIdUser(): string | null {
    const currentUser = localStorage.getItem(environment.localStorageName);
    if (currentUser) {
      const values= JSON.parse(currentUser);
      return values.id;
    }
    return null;
  }

  public getTokenRefresh(): string|null {
    const currentUser = localStorage.getItem(environment.localStorageName);
    if (currentUser) {
      const values= JSON.parse(currentUser);
      return values.id;
    }
    return null;
  }
}
