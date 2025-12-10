import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ToastComponent } from './core/components/toast.component';
import { ApiService } from './core/services/api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'luxe-cut-frontend';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.wakeup().subscribe();
  }
}
