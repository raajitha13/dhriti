import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private BASE_URL = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  register(user: User): Observable<any> {
    return this.http.post(`${this.BASE_URL}/register`, user);
  }

  login(user: User): Observable<any> {
    return this.http.post(`${this.BASE_URL}/login`, user);
  }

  storeToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
  }

  getUsernameFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload); // decode base64
      const parsed = JSON.parse(decodedPayload);
      return parsed.sub || parsed.username || null;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

}
