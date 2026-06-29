import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private sessionId: string;
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private router: Router) {
    this.sessionId = this.getOrCreateSessionId();
  }

  /** Start tracking — call once after app loads */
  startTracking() {
    // Track initial page load
    this.trackPageVisit(window.location.pathname);

    // Track route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.trackPageVisit(event.urlAfterRedirects || event.url);
    });
  }

  private trackPageVisit(pagePath: string) {
    // Exclude admin pages from analytics tracking
    if (pagePath.startsWith('/admin')) {
      return;
    }

    const payload = {
      session_id: this.sessionId,
      page_path: pagePath,
      referrer: document.referrer || null,
      screen_width: window.screen.width,
      screen_height: window.screen.height
    };

    // Fire and forget — don't block the UI
    this.http.post(`${this.apiUrl}/api/analytics/track`, payload).subscribe({
      error: () => {} // Silently ignore errors
    });
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('luxecut_session_id');
    if (!sessionId) {
      sessionId = this.generateId();
      sessionStorage.setItem('luxecut_session_id', sessionId);
    }
    return sessionId;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
  }
}
