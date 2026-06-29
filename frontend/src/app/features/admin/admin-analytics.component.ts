import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { LoadingBannerComponent } from '../../core/components/loading-banner.component';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule, LoadingBannerComponent],
  template: `
    <h2 class="page-title">Site Analytics</h2>

    <app-loading-banner *ngIf="isLoading" message="Loading analytics data..."></app-loading-banner>

    <div *ngIf="!isLoading && data" class="analytics-container">
      <!-- Stat Cards -->
      <div class="stats-grid">
        <div class="stat-card primary">
          <div class="stat-icon">
            <i class="fas fa-eye"></i>
          </div>
          <div class="stat-details">
            <h3>Total Pageviews</h3>
            <p class="stat-value">{{ data.total_visits | number }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon orange">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Today</span>
            <span class="stat-value">{{ data.visits_today | number }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon green">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">This Week</span>
            <span class="stat-value">{{ data.visits_this_week | number }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon purple">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Unique Visitors</span>
            <span class="stat-value">{{ data.unique_visitors | number }}</span>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="charts-row">
        <!-- Hourly Traffic Chart -->
        <div class="chart-card wide">
          <h3>Visits by Hour <span class="subtitle">(Last 7 days)</span></h3>
          <div class="bar-chart" *ngIf="data.hourly_breakdown.length > 0">
            <div class="bar-group" *ngFor="let hour of hourlyData">
              <div class="bar-wrapper">
                <div class="bar" [style.height.%]="hour.percentage" [title]="hour.visit_count + ' visits'">
                  <span class="bar-value" *ngIf="hour.visit_count > 0">{{ hour.visit_count }}</span>
                </div>
              </div>
              <span class="bar-label">{{ hour.label }}</span>
            </div>
          </div>
          <div class="empty-state" *ngIf="data.hourly_breakdown.length === 0">
            No data yet
          </div>
        </div>

        <!-- Device Breakdown -->
        <div class="chart-card">
          <h3>Devices</h3>
          <div class="donut-chart-container" *ngIf="data.device_breakdown.length > 0">
            <div class="donut-chart">
              <svg viewBox="0 0 36 36">
                <circle *ngFor="let segment of deviceSegments"
                  class="donut-segment"
                  cx="18" cy="18" r="15.91549430918954"
                  fill="transparent"
                  [attr.stroke]="segment.color"
                  stroke-width="3"
                  [attr.stroke-dasharray]="segment.dasharray"
                  [attr.stroke-dashoffset]="segment.offset"
                />
              </svg>
              <div class="donut-center">
                <span class="donut-total">{{ totalDevices }}</span>
                <span class="donut-label">devices</span>
              </div>
            </div>
            <div class="donut-legend">
              <div class="legend-item" *ngFor="let d of data.device_breakdown">
                <span class="legend-dot" [style.background]="getDeviceColor(d.device_type)"></span>
                <span class="legend-name">{{ d.device_type | titlecase }}</span>
                <span class="legend-count">{{ d.visit_count }}</span>
              </div>
            </div>
          </div>
          <div class="empty-state" *ngIf="data.device_breakdown.length === 0">
            No data yet
          </div>
        </div>
      </div>

      <!-- Tables Row -->
      <div class="tables-row">
        <!-- Top Pages -->
        <div class="table-card">
          <h3>Top Pages</h3>
          <table *ngIf="data.top_pages.length > 0">
            <thead>
              <tr>
                <th>Page</th>
                <th>Visits</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let page of data.top_pages">
                <td class="page-path">{{ page.page_path }}</td>
                <td class="visit-count">{{ page.visit_count }}</td>
              </tr>
            </tbody>
          </table>
          <div class="empty-state" *ngIf="data.top_pages.length === 0">No data yet</div>
        </div>

        <!-- Browser Breakdown -->
        <div class="table-card">
          <h3>Browsers</h3>
          <div class="browser-list" *ngIf="data.browser_breakdown.length > 0">
            <div class="browser-item" *ngFor="let b of data.browser_breakdown">
              <div class="browser-info">
                <span class="browser-name">{{ b.browser }}</span>
                <span class="browser-count">{{ b.visit_count }}</span>
              </div>
              <div class="browser-bar-track">
                <div class="browser-bar-fill" [style.width.%]="getBrowserPercentage(b.visit_count)"></div>
              </div>
            </div>
          </div>
          <div class="empty-state" *ngIf="data.browser_breakdown.length === 0">No data yet</div>
        </div>

        <!-- Geography -->
        <div class="table-card">
          <h3>Top Locations</h3>
          <div *ngIf="data.top_countries.length > 0">
            <h4 class="sub-heading">Countries</h4>
            <div class="location-item" *ngFor="let c of data.top_countries">
              <span class="location-name">{{ c.location }}</span>
              <span class="location-count">{{ c.visit_count }}</span>
            </div>
            <h4 class="sub-heading" *ngIf="data.top_cities.length > 0">Cities</h4>
            <div class="location-item" *ngFor="let c of data.top_cities">
              <span class="location-name">{{ c.location }}</span>
              <span class="location-count">{{ c.visit_count }}</span>
            </div>
          </div>
          <div class="empty-state" *ngIf="data.top_countries.length === 0">No data yet</div>
        </div>
      </div>

      <!-- Recent Visits -->
      <div class="table-card full-width">
        <h3>Recent Visits</h3>
        <div class="table-scroll" *ngIf="data.recent_visits.length > 0">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Page</th>
                <th>Location</th>
                <th>Device</th>
                <th>Browser</th>
                <th>OS</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let v of data.recent_visits">
                <td class="time-cell">{{ v.visited_at | date:'short' }}</td>
                <td class="page-path">{{ v.page_path }}</td>
                <td>{{ v.city ? v.city + ', ' : '' }}{{ v.country || '—' }}</td>
                <td><span class="badge" [ngClass]="'badge-' + v.device_type">{{ v.device_type }}</span></td>
                <td>{{ v.browser || '—' }}</td>
                <td>{{ v.os || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="empty-state" *ngIf="data.recent_visits.length === 0">No visits recorded yet</div>
      </div>
    </div>
  `,
  styles: [`
    .page-title {
      font-size: 1.875rem;
      font-weight: 700;
      color: var(--color-navy-900);
      margin-bottom: 2rem;
    }

    .analytics-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    /* Stat Cards */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }

    @media (max-width: 1024px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 600px) {
      .stats-grid { grid-template-columns: 1fr; }
    }

    .stat-card {
      background: white;
      border-radius: 0.75rem;
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 0.625rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-icon.blue { background: rgba(59, 130, 246, 0.1); color: #3B82F6; }
    .stat-icon.orange { background: rgba(255, 138, 61, 0.1); color: #ff8a3d; }
    .stat-icon.green { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .stat-icon.purple { background: rgba(139, 92, 246, 0.1); color: #8B5CF6; }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-label {
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--color-gray-500);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--color-navy-900);
      line-height: 1.2;
    }

    /* Charts Row */
    .charts-row {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }

    @media (max-width: 900px) {
      .charts-row { grid-template-columns: 1fr; }
    }

    .chart-card {
      background: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);

      h3 {
        font-size: 1rem;
        font-weight: 600;
        color: var(--color-navy-900);
        margin-bottom: 1.25rem;

        .subtitle {
          font-weight: 400;
          font-size: 0.8rem;
          color: var(--color-gray-500);
        }
      }
    }

    /* Bar Chart */
    .bar-chart {
      display: flex;
      align-items: flex-end;
      gap: 4px;
      height: 180px;
      padding-top: 1rem;
    }

    .bar-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
    }

    .bar-wrapper {
      flex: 1;
      width: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }

    .bar {
      width: 70%;
      max-width: 28px;
      background: linear-gradient(180deg, #ff8a3d 0%, #ffb347 100%);
      border-radius: 3px 3px 0 0;
      min-height: 2px;
      position: relative;
      transition: height 0.5s ease;
    }

    .bar-value {
      position: absolute;
      top: -18px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.65rem;
      font-weight: 600;
      color: var(--color-gray-500);
      white-space: nowrap;
    }

    .bar-label {
      font-size: 0.65rem;
      color: var(--color-gray-500);
      margin-top: 6px;
      font-weight: 500;
    }

    /* Donut Chart */
    .donut-chart-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
    }

    .donut-chart {
      position: relative;
      width: 140px;
      height: 140px;

      svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
      }
    }

    .donut-segment {
      transition: stroke-dasharray 0.5s ease;
    }

    .donut-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      display: flex;
      flex-direction: column;
    }

    .donut-total {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-navy-900);
      line-height: 1;
    }

    .donut-label {
      font-size: 0.7rem;
      color: var(--color-gray-500);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .donut-legend {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
    }

    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .legend-name {
      flex: 1;
      color: var(--color-gray-800);
    }

    .legend-count {
      font-weight: 600;
      color: var(--color-navy-900);
    }

    /* Tables Row */
    .tables-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    @media (max-width: 1024px) {
      .tables-row { grid-template-columns: 1fr; }
    }

    .table-card {
      background: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);

      h3 {
        font-size: 1rem;
        font-weight: 600;
        color: var(--color-navy-900);
        margin-bottom: 1rem;
      }

      &.full-width {
        grid-column: 1 / -1;
      }
    }

    table {
      width: 100%;
      border-collapse: collapse;

      th {
        text-align: left;
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--color-gray-500);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 0.5rem 0.75rem;
        border-bottom: 1px solid var(--color-gray-200);
      }

      td {
        padding: 0.6rem 0.75rem;
        font-size: 0.85rem;
        color: var(--color-gray-800);
        border-bottom: 1px solid var(--color-gray-100);
      }

      tr:last-child td {
        border-bottom: none;
      }
    }

    .page-path {
      font-family: monospace;
      font-size: 0.8rem;
      color: var(--color-primary-blue);
    }

    .visit-count {
      font-weight: 600;
      text-align: right;
      color: var(--color-navy-900);
    }

    .time-cell {
      white-space: nowrap;
      font-size: 0.8rem;
      color: var(--color-gray-500);
    }

    .table-scroll {
      overflow-x: auto;
    }

    /* Browser bars */
    .browser-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .browser-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25rem;
    }

    .browser-name {
      font-size: 0.85rem;
      color: var(--color-gray-800);
    }

    .browser-count {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-navy-900);
    }

    .browser-bar-track {
      height: 6px;
      background: var(--color-gray-100);
      border-radius: 3px;
      overflow: hidden;
    }

    .browser-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #0056a6, #3B82F6);
      border-radius: 3px;
      transition: width 0.5s ease;
    }

    /* Location items */
    .sub-heading {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-gray-500);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0.75rem 0 0.5rem;

      &:first-of-type {
        margin-top: 0;
      }
    }

    .location-item {
      display: flex;
      justify-content: space-between;
      padding: 0.4rem 0;
      border-bottom: 1px solid var(--color-gray-100);

      &:last-child {
        border-bottom: none;
      }
    }

    .location-name {
      font-size: 0.85rem;
      color: var(--color-gray-800);
    }

    .location-count {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-navy-900);
    }

    /* Badge */
    .badge {
      display: inline-block;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: capitalize;
    }

    .badge-desktop {
      background: rgba(59, 130, 246, 0.1);
      color: #3B82F6;
    }

    .badge-mobile {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }

    .badge-tablet {
      background: rgba(139, 92, 246, 0.1);
      color: #8B5CF6;
    }

    .badge-unknown {
      background: var(--color-gray-100);
      color: var(--color-gray-500);
    }

    /* Empty state */
    .empty-state {
      text-align: center;
      padding: 2rem;
      color: var(--color-gray-500);
      font-size: 0.9rem;
    }
  `]
})
export class AdminAnalyticsComponent implements OnInit {
  data: any = null;
  isLoading = true;
  hourlyData: any[] = [];
  deviceSegments: any[] = [];
  totalDevices = 0;
  private maxBrowserCount = 0;

  private deviceColors: Record<string, string> = {
    desktop: '#3B82F6',
    mobile: '#10b981',
    tablet: '#8B5CF6',
    unknown: '#9ca3af'
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getAnalyticsOverview().subscribe({
      next: (data) => {
        this.data = data;
        this.processHourlyData();
        this.processDeviceData();
        this.maxBrowserCount = Math.max(...(data.browser_breakdown.map((b: any) => b.visit_count) || [1]), 1);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getDeviceColor(type: string): string {
    return this.deviceColors[type] || this.deviceColors['unknown'];
  }

  getBrowserPercentage(count: number): number {
    return (count / this.maxBrowserCount) * 100;
  }

  private processHourlyData() {
    const hourMap = new Map<number, number>();
    for (const h of this.data.hourly_breakdown) {
      hourMap.set(h.hour, h.visit_count);
    }

    const maxCount = Math.max(...Array.from(hourMap.values()), 1);

    this.hourlyData = Array.from({ length: 24 }, (_, i) => {
      const count = hourMap.get(i) || 0;
      return {
        hour: i,
        visit_count: count,
        percentage: (count / maxCount) * 100,
        label: i === 0 ? '12a' : i < 12 ? `${i}a` : i === 12 ? '12p' : `${i - 12}p`
      };
    });
  }

  private processDeviceData() {
    if (!this.data.device_breakdown.length) return;

    const total = this.data.device_breakdown.reduce((s: number, d: any) => s + d.visit_count, 0);
    this.totalDevices = total;
    const circumference = 2 * Math.PI * 15.91549430918954;
    let accumulatedOffset = 0;

    this.deviceSegments = this.data.device_breakdown.map((d: any) => {
      const percentage = (d.visit_count / total) * 100;
      const dash = (percentage / 100) * circumference;
      const gap = circumference - dash;
      const offset = circumference - accumulatedOffset + (circumference * 0.25);

      accumulatedOffset += dash;

      return {
        color: this.getDeviceColor(d.device_type),
        dasharray: `${dash} ${gap}`,
        offset: offset
      };
    });
  }
}
