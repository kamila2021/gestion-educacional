import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/v1';
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  public get currentUserValue() {
    return this.userSubject.value;
  }

  public get token(): string | null {
    return localStorage.getItem('token');
  }

  private loadUserFromStorage() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        this.userSubject.next(JSON.parse(userStr));
      } catch (e) {
        this.logout();
      }
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap(res => {
        if (res && res.token && res.refreshToken) {
          this.setSession(res);
        }
      })
    );
  }

  signup(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/signup`, data).pipe(
      tap(res => {
        if (res && res.token && res.refreshToken) {
          this.setSession(res);
        }
      })
    );
  }

  verify2FA(code: string, userId?: string): Observable<any> {
    const body: any = { code };
    if (userId) {
      body.userId = userId;
    }
    return this.http.post<any>(`${this.apiUrl}/auth/2fa/verify`, body).pipe(
      tap(res => {
        if (res && res.token && res.refreshToken) {
          this.setSession(res);
        }
      })
    );
  }

  setup2FA(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/2fa/setup`, {});
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<any>(`${this.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap(res => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);
        }
      })
    );
  }

  logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      this.http.post(`${this.apiUrl}/auth/logout`, { refreshToken }).subscribe();
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  private setSession(authResult: any) {
    localStorage.setItem('token', authResult.token);
    localStorage.setItem('refreshToken', authResult.refreshToken);
    localStorage.setItem('user', JSON.stringify(authResult.user));
    this.userSubject.next(authResult.user);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}
