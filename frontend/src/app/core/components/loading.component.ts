import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-overlay" [class.fade-out]="fadeOut">
      <!-- Background decorative elements -->
      <div class="bg-decoration">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
      </div>

      <div class="content">
        <!-- Animated scissors icon -->
        <div class="scissors-wrapper">
          <svg class="scissors-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="6" cy="6" r="3"/>
            <circle cx="6" cy="18" r="3"/>
            <line x1="20" y1="4" x2="8.12" y2="15.88"/>
            <line x1="14.47" y1="14.48" x2="20" y2="20"/>
            <line x1="8.12" y1="8.12" x2="12" y2="12"/>
          </svg>
        </div>

        <!-- Brand text -->
        <div class="brand-text">
          <span class="brand-luxe">Luxe</span><span class="brand-cut">Cut</span>
          <span class="brand-studio">Studio</span>
        </div>

        <!-- Progress bar with animated scissor -->
        <div class="progress-container">
          <div class="progress-track">
            <div class="progress-bar" [style.width.%]="progress"></div>
            <div class="progress-glow" [style.left.%]="progress"></div>
          </div>
          <div class="progress-scissor" [style.left.%]="progress">
            ✂️
          </div>
        </div>

        <!-- Status text -->
        <div class="status-text">{{ statusMessage }}</div>
        <div class="percentage-text">{{ progress | number:'1.0-0' }}%</div>

        <!-- Error state -->
        <div class="error-state" *ngIf="hasError">
          <p class="error-message">Unable to connect to the server. Please try refreshing the page.</p>
          <button class="retry-btn" (click)="retry()">Try Again</button>
        </div>
      </div>

      <!-- Cutting line animation -->
      <div class="cutting-line"></div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(135deg, #0d1a2d 0%, #1a2b42 40%, #0d1a2d 100%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .loading-overlay.fade-out {
      opacity: 0;
      transform: scale(1.02);
    }

    /* Background decorative circles */
    .bg-decoration {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
    }

    .circle {
      position: absolute;
      border-radius: 50%;
      opacity: 0.04;
      background: #ff8a3d;
    }

    .circle-1 {
      width: 600px;
      height: 600px;
      top: -200px;
      right: -100px;
      animation: float 8s ease-in-out infinite;
    }

    .circle-2 {
      width: 400px;
      height: 400px;
      bottom: -150px;
      left: -100px;
      animation: float 10s ease-in-out infinite reverse;
    }

    .circle-3 {
      width: 300px;
      height: 300px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: pulse-circle 4s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-30px) rotate(5deg); }
    }

    @keyframes pulse-circle {
      0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.03; }
      50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.06; }
    }

    /* Content container */
    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 90%;
      max-width: 420px;
      position: relative;
      z-index: 2;
    }

    /* Scissors icon */
    .scissors-wrapper {
      margin-bottom: 2rem;
      animation: snip 2s ease-in-out infinite;
    }

    .scissors-icon {
      width: 56px;
      height: 56px;
      color: #ff8a3d;
      filter: drop-shadow(0 0 20px rgba(255, 138, 61, 0.3));
    }

    @keyframes snip {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(15deg); }
      75% { transform: rotate(-15deg); }
    }

    /* Brand text */
    .brand-text {
      font-family: 'Montserrat', sans-serif;
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 2.5rem;
      letter-spacing: 2px;
      animation: brand-glow 3s ease-in-out infinite;
    }

    .brand-luxe {
      color: #ffffff;
    }

    .brand-cut {
      color: #ff8a3d;
    }

    .brand-studio {
      display: block;
      text-align: center;
      font-size: 1rem;
      font-weight: 400;
      letter-spacing: 8px;
      color: rgba(255, 255, 255, 0.5);
      text-transform: uppercase;
      margin-top: 0.25rem;
    }

    @keyframes brand-glow {
      0%, 100% { text-shadow: 0 0 20px rgba(255, 138, 61, 0); }
      50% { text-shadow: 0 0 40px rgba(255, 138, 61, 0.15); }
    }

    /* Progress bar */
    .progress-container {
      position: relative;
      width: 100%;
      padding: 0 0.5rem;
      margin-bottom: 1.5rem;
    }

    .progress-track {
      position: relative;
      width: 100%;
      height: 3px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #ff8a3d, #ffb347);
      border-radius: 4px;
      transition: width 0.3s ease;
      position: relative;
    }

    .progress-glow {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 40px;
      height: 20px;
      background: radial-gradient(circle, rgba(255, 138, 61, 0.6) 0%, transparent 70%);
      border-radius: 50%;
      transition: left 0.3s ease;
      pointer-events: none;
    }

    .progress-scissor {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%) rotate(-90deg) scaleX(-1);
      font-size: 1.25rem;
      transition: left 0.3s ease;
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
    }

    /* Status text */
    .status-text {
      font-family: 'Inter', sans-serif;
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 0.5rem;
      text-align: center;
      min-height: 1.25rem;
      transition: opacity 0.3s ease;
    }

    .percentage-text {
      font-family: 'Montserrat', sans-serif;
      font-size: 0.8rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.35);
      letter-spacing: 2px;
    }

    /* Cutting line animation */
    .cutting-line {
      position: absolute;
      bottom: 60px;
      width: 120px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 138, 61, 0.3), transparent);
      animation: cut-line 3s ease-in-out infinite;
    }

    @keyframes cut-line {
      0%, 100% { width: 60px; opacity: 0.3; }
      50% { width: 160px; opacity: 0.6; }
    }

    /* Error state */
    .error-state {
      margin-top: 1.5rem;
      text-align: center;
      animation: fade-in 0.4s ease;
    }

    .error-message {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.85rem;
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .retry-btn {
      background: linear-gradient(135deg, #ff8a3d, #e6732b);
      color: white;
      border: none;
      padding: 0.6rem 2rem;
      border-radius: 9999px;
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(255, 138, 61, 0.3);
    }

    .retry-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 138, 61, 0.4);
    }

    @keyframes fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Mobile adjustments */
    @media (max-width: 480px) {
      .brand-text {
        font-size: 2rem;
      }

      .brand-studio {
        letter-spacing: 6px;
        font-size: 0.85rem;
      }

      .scissors-icon {
        width: 44px;
        height: 44px;
      }
    }
  `]
})
export class LoadingComponent implements OnInit, OnDestroy {
  @Output() completed = new EventEmitter<void>();

  progress = 0;
  statusMessage = 'Starting up the server — this may take a moment...';
  fadeOut = false;
  hasError = false;

  private pollTimer: any;
  private progressTimer: any;
  private startTime = 0;
  private backendReady = false;
  private readonly MAX_WAIT_MS = 60000; // 60 second timeout
  private readonly POLL_INTERVAL_MS = 3000; // Poll every 3 seconds
  private readonly statusMessages = [
    'Starting up the server — this may take a moment...',
    'Server is waking up, hang tight...',
    'Warming up the studio for you...',
    'Still starting up — free servers need a little extra time...',
    'Getting the stylists ready...',
    'Sharpening the scissors...',
    'Almost there, preparing your experience...',
    'Just a few more seconds...'
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.startTime = Date.now();
    this.startPolling();
    this.startProgressSimulation();
  }

  ngOnDestroy() {
    this.clearTimers();
  }

  retry() {
    this.hasError = false;
    this.progress = 0;
    this.startTime = Date.now();
    this.statusMessage = 'Reconnecting...';
    this.startPolling();
    this.startProgressSimulation();
  }

  private startPolling() {
    // Immediately try to wake up the backend
    this.pingBackend();

    this.pollTimer = setInterval(() => {
      const elapsed = Date.now() - this.startTime;

      if (elapsed > this.MAX_WAIT_MS) {
        this.clearTimers();
        this.hasError = true;
        this.statusMessage = 'Connection timed out';
        return;
      }

      if (!this.backendReady) {
        this.pingBackend();
      }
    }, this.POLL_INTERVAL_MS);
  }

  private pingBackend() {
    this.http.get<any>(`${environment.apiBaseUrl}/wakeup`).subscribe({
      next: () => {
        this.backendReady = true;
        this.onBackendReady();
      },
      error: () => {
        // Backend not ready yet, will retry on next poll
      }
    });
  }

  private startProgressSimulation() {
    let messageIndex = 0;

    this.progressTimer = setInterval(() => {
      if (this.backendReady) {
        return; // Let onBackendReady handle the final jump
      }

      // Slowly crawl progress to 85% max while waiting
      if (this.progress < 85) {
        // Slow down as we approach 85%
        const remaining = 85 - this.progress;
        const increment = Math.max(0.3, remaining * 0.03);
        this.progress = Math.min(85, this.progress + increment);
      }

      // Cycle through status messages
      const elapsed = Date.now() - this.startTime;
      const newIndex = Math.min(
        Math.floor(elapsed / 5000),
        this.statusMessages.length - 1
      );
      if (newIndex !== messageIndex) {
        messageIndex = newIndex;
        this.statusMessage = this.statusMessages[messageIndex];
      }
    }, 150);
  }

  private onBackendReady() {
    this.clearTimers();
    this.statusMessage = 'Ready!';

    // Smoothly animate progress from current to 100%
    const jumpInterval = setInterval(() => {
      this.progress = Math.min(100, this.progress + 3);

      if (this.progress >= 100) {
        clearInterval(jumpInterval);

        // Wait a moment at 100% then fade out
        setTimeout(() => {
          this.fadeOut = true;

          // Emit completed after fade-out animation
          setTimeout(() => {
            this.completed.emit();
          }, 600);
        }, 400);
      }
    }, 20);
  }

  private clearTimers() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }
}
