import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/api`;
  private tokenKey = 'auth_token';
  private roleKey = 'user_role';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  private userRoleSubject = new BehaviorSubject<string | null>(this.getRole());

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  userRole$ = this.userRoleSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  private getRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  // Admin Login
  login(email: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    return this.http.post<any>(`${this.apiUrl}/admin/login`, formData).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.access_token);
        localStorage.setItem(this.roleKey, 'admin');
        this.isLoggedInSubject.next(true);
        this.userRoleSubject.next('admin');
      })
    );
  }

  // User Login
  userLogin(email: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    return this.http.post<any>(`${this.apiUrl}/auth/login`, formData).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.access_token);
        localStorage.setItem(this.roleKey, 'user');
        this.isLoggedInSubject.next(true);
        this.userRoleSubject.next('user');
      })
    );
  }

  // User Signup
  userSignup(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, data);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    this.isLoggedInSubject.next(false);
    this.userRoleSubject.next(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  currentUserRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }
}
