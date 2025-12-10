import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-banner">
      <div class="spinner"></div>
      <p>{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-banner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      min-height: 400px;
      width: 100%;
      background-color: var(--color-gray-50);
      border-radius: 0.5rem;
      color: var(--color-gray-600);
      margin-top: 2rem;
    }

    .spinner {
      width: 2.5rem;
      height: 2.5rem;
      border: 3px solid var(--color-gray-200);
      border-top-color: var(--color-accent-orange);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    p {
      font-weight: 500;
      font-size: 1rem;
      color: var(--color-navy-900);
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoadingBannerComponent {
  @Input() message: string = 'Loading...';
}
