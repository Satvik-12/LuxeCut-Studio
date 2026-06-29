import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ToastComponent } from './core/components/toast.component';
import { LoadingComponent } from './core/components/loading.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, LoadingComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'luxe-cut-frontend';
  isLoading = true;

  onLoadingComplete() {
    this.isLoading = false;
  }
}
