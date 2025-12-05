import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';

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

  createStylist(stylist: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/stylists`, stylist);
  }
}
