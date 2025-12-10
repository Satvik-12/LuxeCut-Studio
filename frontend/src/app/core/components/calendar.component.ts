import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="calendar-container">
      <div class="header">
        <button (click)="prevMonth()" class="nav-btn" [disabled]="isPrevDisabled()">‹</button>
        <span class="month-label">{{ currentMonthName }} {{ currentYear }}</span>
        <button (click)="nextMonth()" class="nav-btn">›</button>
      </div>

      <div class="weekdays">
        <div *ngFor="let day of weekDays" class="weekday">{{ day }}</div>
      </div>

      <div class="days-grid">
        <div *ngFor="let empty of emptyDays" class="day-cell empty"></div>
        <button *ngFor="let date of daysInMonth" 
                class="day-cell"
                [class.selected]="isSelected(date)"
                [class.disabled]="isDisabled(date)"
                [class.today]="isToday(date)"
                (click)="selectDate(date)"
                [disabled]="isDisabled(date)">
          {{ date.getDate() }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .calendar-container {
      background: #ffffff;
      border: 1px solid var(--color-gray-200);
      border-radius: 1rem;
      padding: 1.5rem;
      max-width: 350px;
      box-shadow: var(--shadow-md);
      user-select: none;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .month-label {
      font-weight: 700;
      color: var(--color-navy-900);
      font-size: 1.125rem;
    }

    .nav-btn {
      background: none;
      border: 1px solid var(--color-gray-200);
      border-radius: 0.5rem;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      cursor: pointer;
      color: var(--color-gray-600);
      transition: all 0.2s;

      &:hover:not(:disabled) {
        border-color: var(--color-navy-900);
        color: var(--color-navy-900);
        background-color: var(--color-gray-50);
      }

      &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
    }

    .weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      margin-bottom: 0.5rem;
      text-align: center;
    }

    .weekday {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-gray-400);
      text-transform: uppercase;
      padding: 0.5rem 0;
    }

    .days-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 0.25rem;
    }

    .day-cell {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      border-radius: 50%;
      font-size: 0.875rem;
      color: var(--color-navy-900);
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;

      &:hover:not(:disabled):not(.selected) {
        background-color: var(--color-gray-100);
      }

      &.selected {
        background-color: var(--color-accent-orange);
        color: #ffffff;
        font-weight: 700;
      }

      &.today:not(.selected) {
        border: 1px solid var(--color-accent-orange);
        color: var(--color-accent-orange);
      }

      &.disabled {
        color: var(--color-gray-300);
        cursor: not-allowed;
        pointer-events: none;
      }

      &.empty {
        pointer-events: none;
      }
    }
  `]
})
export class CalendarComponent implements OnInit {
  @Input() selectedDate: string | null = null;
  @Input() minDate: string | null = null;
  @Output() dateChange = new EventEmitter<string>();

  currentDate: Date = new Date();
  daysInMonth: Date[] = [];
  emptyDays: number[] = [];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  ngOnInit() {
    if (this.selectedDate) {
        this.currentDate = new Date(this.selectedDate);
    }
    // Set to first day of month to avoid edge cases when switching months on the 31st
    this.currentDate.setDate(1); 
    this.generateCalendar();
  }

  get currentMonthName(): string {
    return this.currentDate.toLocaleString('default', { month: 'long' });
  }

  get currentYear(): number {
    return this.currentDate.getFullYear();
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // First day of this month
    const firstDay = new Date(year, month, 1);
    // Last day of this month
    const lastDay = new Date(year, month + 1, 0);
    
    // Calculate empty slots for grid alignment (0 = Sunday, etc.)
    const startingDayOfWeek = firstDay.getDay();
    this.emptyDays = Array(startingDayOfWeek).fill(0);

    // Generate days
    this.daysInMonth = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      this.daysInMonth.push(new Date(year, month, i));
    }
  }

  prevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar();
  }

  selectDate(date: Date) {
    if (this.isDisabled(date)) return;
    
    // Adjust for timezone offset to ensure emitting "YYYY-MM-DD" correctly
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;
    this.dateChange.emit(formattedDate);
  }

  isSelected(date: Date): boolean {
    if (!this.selectedDate) return false;
    // Just compare strings to avoid timezone headaches
    const d1 = new Date(this.selectedDate).toDateString();
    const d2 = date.toDateString();
    return d1 === d2;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  isDisabled(date: Date): boolean {
    if (!this.minDate) return false;
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    const min = new Date(this.minDate);
    min.setHours(0, 0, 0, 0);
    
    return checkDate < min;
  }

  isPrevDisabled(): boolean {
    // If current month is same as minDate month, disable prev
    if (!this.minDate) return false;
    
    const min = new Date(this.minDate);
    const displayed = new Date(this.currentDate);
    
    return displayed.getMonth() === min.getMonth() && 
           displayed.getFullYear() === min.getFullYear();
  }
}
