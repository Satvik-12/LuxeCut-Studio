import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, finalize } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/api`;
  private tokenKey = 'auth_token';
  private roleKey = 'user_role';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  private userRoleSubject = new BehaviorSubject<string | null>(this.getRole());
  private loadingSubject = new BehaviorSubject<boolean>(false);

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  userRole$ = this.userRoleSubject.asObservable();
  isLoading$ = this.loadingSubject.asObservable();
  
  constructor(private http: HttpClient, private router: Router, private toast: ToastService) { }

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

    this.loadingSubject.next(true);
    return this.http.post<any>(`${this.apiUrl}/admin/login`, formData).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.access_token);
        localStorage.setItem(this.roleKey, 'admin');
        this.isLoggedInSubject.next(true);
        this.userRoleSubject.next('admin');
        this.toast.show('Admin login successful!', 'success');
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  // User Login
  userLogin(email: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    this.loadingSubject.next(true);
    return this.http.post<any>(`${this.apiUrl}/auth/login`, formData).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.access_token);
        localStorage.setItem(this.roleKey, 'user');
        this.isLoggedInSubject.next(true);
        this.userRoleSubject.next('user');
        this.toast.show('Login successful!', 'success');
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  // User Signup
  userSignup(data: any): Observable<any> {
    this.loadingSubject.next(true);
    return this.http.post<any>(`${this.apiUrl}/auth/register`, data).pipe(
      tap(() => this.toast.show('Signup successful! Please login.', 'success')),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    this.isLoggedInSubject.next(false);
    this.userRoleSubject.next(null);
    this.router.navigate(['/']);
    this.toast.show('Logged out successfully', 'info');
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  currentUserRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }
}
