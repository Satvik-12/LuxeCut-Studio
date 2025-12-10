import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ToastComponent } from './core/components/toast.component';
import { ApiService } from './core/services/api.service';
import { LoadingComponent } from './core/components/loading.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, LoadingComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'luxe-cut-frontend';
  isLoading = true;

  constructor(private apiService: ApiService) {
    this.apiService.wakeup().subscribe();
  }

  ngOnInit() {
  }

  onLoadingComplete() {
    this.isLoading = false;
  }
}
