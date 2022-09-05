import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { User } from '../models/user.model';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: User;

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }
  get headers() {
    return {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    };
  }

  public login(formData: LoginForm) {
    return this.http.post(`${baseUrl}/login`, formData);
  }

  public logout() {
    return this.http.get(`${baseUrl}/logout`, this.headers);
  }

  public validateToken(): Observable<boolean> {
    return this.http.get(`${baseUrl}/validate-token`, this.headers).pipe(
      tap((resp: any) => {
        const {id, name, email, delegation, points, position } = resp.user;
        this.user = new User(id, name, email, delegation, points, position);
      }),
      map(resp => true),
      catchError(error => of(false))
    );
  }
}
