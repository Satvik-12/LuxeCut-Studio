import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-overlay">
      <div class="content">
        <div class="brand-text">LuxeCut Studio</div>
        <div class="progress-container">
          <div class="progress-bar" [style.width.%]="progress"></div>
          <div class="scissor-icon" [style.left.%]="progress">
            ✂️
          </div>
        </div>
        <div class="percentage">{{ progress | number:'1.0-0' }}%</div>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: var(--color-white);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      max-width: 300px;
    }

    .brand-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-navy-900);
      margin-bottom: 2rem;
      letter-spacing: 1px;
    }

    .progress-container {
      position: relative;
      width: 100%;
      height: 4px;
      background-color: var(--color-gray-200);
      border-radius: 2px;
      margin-bottom: 1rem;
    }

    .progress-bar {
      height: 100%;
      background-color: var(--color-accent-orange);
      border-radius: 2px;
      transition: width 0.05s linear;
    }

    .scissor-icon {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%) rotate(-90deg);
      font-size: 1.5rem;
      transition: left 0.05s linear;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
    }

    .percentage {
      color: var(--color-gray-500);
      font-size: 0.875rem;
      font-weight: 500;
    }
  `]
})
export class LoadingComponent implements OnInit, OnDestroy {
  @Input() duration: number = 10; // Duration in seconds
  @Output() completed = new EventEmitter<void>();

  progress = 0;
  private intervalId: any;

  ngOnInit() {
    const steps = 100;
    const intervalTime = (this.duration * 1000) / steps;
    
    this.intervalId = setInterval(() => {
      this.progress++;
      
      if (this.progress >= 100) {
        this.progress = 100;
        this.clearTimer();
        setTimeout(() => {
          this.completed.emit();
        }, 300); // Small delay at 100%
      }
    }, intervalTime);
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  private clearTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
