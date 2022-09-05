import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class FormsService {

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

  public createForm(img: string) {
    return this.http.post(`${baseUrl}/forms/create`, { img }, this.headers);
  }
}
