import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ToastComponent } from './core/components/toast.component';
import { LoadingComponent } from './core/components/loading.component';
import { AnalyticsService } from './core/services/analytics.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, LoadingComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'luxe-cut-frontend';
  isLoading = true;

  constructor(private analytics: AnalyticsService) {}

  onLoadingComplete() {
    this.isLoading = false;
    // Start tracking visits after the app has loaded
    this.analytics.startTracking();
  }
}
