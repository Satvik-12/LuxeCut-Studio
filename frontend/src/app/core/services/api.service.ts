import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = `${environment.apiBaseUrl}/api`;

  constructor(private http: HttpClient) { }

  // Public
  getServices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/services`);
  }

  getStylists(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/stylists`);
  }

  checkAvailability(date: string, serviceId: number, stylistId?: number): Observable<any> {
    let params = new HttpParams()
      .set('date', date)
      .set('service_id', serviceId);
    
    if (stylistId) {
      params = params.set('stylist_id', stylistId);
    }

    return this.http.get<any>(`${this.apiUrl}/availability`, { params });
  }

  createAppointment(appointment: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/appointments`, appointment);
  }

  getAppointment(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/appointments/${id}`);
  }

  getUserAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/appointments`);
  }

  // Admin
  getAdminDashboard(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/dashboard`);
  }

  getAdminAppointments(date?: string, status?: string): Observable<any[]> {
    let params = new HttpParams();
    if (date) params = params.set('date', date);
    if (status) params = params.set('status', status);
    
    return this.http.get<any[]>(`${this.apiUrl}/admin/appointments`, { params });
  }

  updateAppointmentStatus(id: number, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/admin/appointments/${id}`, { status });
  }

  createService(service: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/services`, service);
  }

  getAdminServices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/services`);
  }

  updateService(id: number, service: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/admin/services/${id}`, service);
  }

  createStylist(stylist: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/stylists`, stylist);
  }

  getAdminStylists(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/stylists`);
  }

  updateStylist(id: number, stylist: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/admin/stylists/${id}`, stylist);
  }
}
