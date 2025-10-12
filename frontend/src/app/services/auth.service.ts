import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface TokenResponse {
    token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3100/api/user'

  constructor(private httpClient: HttpClient) { }

  login(username: string, password: string): Observable<TokenResponse> {
    return this.httpClient.post<TokenResponse>(`${this.apiUrl}/auth`, {
      login: username,
      password
    });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isTokenExpired(token?: string): boolean {
    const t = token || this.getToken();
    if (!t) return true;

    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      if (!payload.exp) return true;
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch (e) {
      console.error('Error decoding token:', e);
      return true;
    }
  }
}
