import { Component, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Chart, registerables } from 'chart.js';
import { AmortizationTableComponent } from '../amortization-table/amortization-table.component';

Chart.register(...registerables);

interface PayoffComparison {
  strategy: 'snowball' | 'avalanche';
  totalMonths: number;
  totalInterestPaid: number;
  totalPaid: number;
  debts: DebtPayoff[];
}

interface DebtPayoff {
  debtName: string;
  originalBalance: number;
  interestRate: number;
  totalInterestPaid: number;
  monthsToPayoff: number;
  schedule: PaymentSchedule[];
}

interface PaymentSchedule {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

@Component({
  selector: 'app-payoff-results',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule, AmortizationTableComponent],
  template: `
    <h2 class="section-header">
      <mat-icon class="header-icon">analytics</mat-icon>
      Payment Strategy Results
    </h2>
    <mat-card class="results-card">
      <mat-card-content>
        <div class="comparison-grid">
          <div class="strategy-result" [class.selected]="selectedStrategy === 'snowball'">
            <h3>
              <mat-icon>ac_unit</mat-icon>
              Snowball Method
            </h3>
            <div class="metrics">
              <div class="metric">
                <span class="label">Time to Debt Free</span>
                <span class="value">{{snowball.totalMonths}} months</span>
              </div>
              <div class="metric">
                <span class="label">Total Interest</span>
                <span class="value">{{snowball.totalInterestPaid | currency}}</span>
              </div>
              <div class="metric">
                <span class="label">Total Paid</span>
                <span class="value">{{snowball.totalPaid | currency}}</span>
              </div>
            </div>
          </div>

          <div class="strategy-result" [class.selected]="selectedStrategy === 'avalanche'">
            <h3>
              <mat-icon>local_fire_department</mat-icon>
              Avalanche Method
            </h3>
            <div class="metrics">
              <div class="metric">
                <span class="label">Time to Debt Free</span>
                <span class="value">{{avalanche.totalMonths}} months</span>
              </div>
              <div class="metric">
                <span class="label">Total Interest</span>
                <span class="value">{{avalanche.totalInterestPaid | currency}}</span>
              </div>
              <div class="metric">
                <span class="label">Total Paid</span>
                <span class="value">{{avalanche.totalPaid | currency}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="savings-highlight" *ngIf="savings > 0">
          <mat-icon>savings</mat-icon>
          <span>
            The Avalanche method will save you 
            <strong>{{savings | currency}}</strong> 
            in interest payments!
          </span>
        </div>

        <div class="charts-section">
          <div class="timeline-visualization">
            <h3 class="chart-title">Debt Payoff Timeline</h3>
            <div class="timeline-container">
              <div class="strategy-timeline" *ngFor="let strategyType of strategies">
                <div class="strategy-label">
                  <mat-icon>{{strategyType === 'snowball' ? 'ac_unit' : 'local_fire_department'}}</mat-icon>
                  {{strategyType | titlecase}}
                </div>
                <div class="timeline">
                  <div class="debt-timeline" 
                       *ngFor="let debt of getDebtsForStrategy(strategyType)"
                       [style.width]="getDebtWidth(debt)"
                       [style.background]="getDebtColor(debt.debtName)"
                       [class.selected]="selectedStrategy === strategyType">
                    <div class="debt-info">
                      <div class="debt-label">{{debt.debtName}}</div>
                      <div class="debt-duration">{{debt.monthsToPayoff}} months</div>
                    </div>
                    <div class="debt-interest">{{debt.totalInterestPaid | currency}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <app-amortization-table
          [snowball]="snowball"
          [avalanche]="avalanche"
        ></app-amortization-table>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .results-card {
      margin-top: 24px;
      background: white;
    }

    .results-title {
      color: #1976d2;
      font-size: 20px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .comparison-grid {
      display: grid;
      gap: 24px;
      grid-template-columns: 1fr;
      padding: 16px 0;
    }

    @media (min-width: 768px) {
      .comparison-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .strategy-result {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    h3 {
      color: #1976d2;
      font-size: 20px;
      font-weight: 500;
      margin: 0 0 24px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .metrics {
      display: grid;
      gap: 16px;
    }

    .metric {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #e2e8f0;
    }

    .metric:last-child {
      border-bottom: none;
    }

    .label {
      color: #000000;
      font-size: 14px;
    }

    .value {
      color: #000000;
      font-weight: 500;
      font-size: 16px;
    }

    .savings-highlight {
      margin-top: 24px;
      padding: 16px;
      background: #e3f2fd;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
      color: #1976d2;
    }

    .savings-highlight strong {
      font-weight: 500;
    }

    .charts-section {
      margin-top: 32px;
      display: grid;
      gap: 24px;
      grid-template-columns: 1fr;
    }

    @media (min-width: 1024px) {
      .charts-section {
        grid-template-columns: 1fr 1fr;
      }
    }

    .chart-container {
      background: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
      height: 300px;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #1976d2;
      font-size: 20px;
      font-weight: 500;
      margin: 0 0 16px;
    }

    .header-icon {
      color: #1976d2;
    }

    .timeline-visualization {
      width: 100%;
      margin: 24px 0;
    }

    .timeline-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .strategy-timeline {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .strategy-label {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 140px;
      font-weight: 500;
      color: #2c3e50;
    }

    .timeline {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .debt-timeline {
      position: relative;
      height: 48px;
      border-radius: 24px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: white;
      font-size: 14px;
      transition: all 0.2s;
      opacity: 0.8;
      min-width: 250px;
      overflow: hidden;
    }

    .debt-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }

    .debt-label {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 8px;
    }

    .debt-duration {
      font-size: 12px;
      opacity: 0.9;
    }

    .debt-interest {
      font-size: 12px;
      white-space: nowrap;
      text-align: right;
      font-weight: 500;
    }

    .debt-timeline:hover {
      opacity: 1;
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 1;
    }

    .debt-label:hover {
      cursor: default;
    }
  `]
})
export class PayoffResultsComponent implements OnChanges {
  @Input() snowball!: PayoffComparison;
  @Input() avalanche!: PayoffComparison;
  @Input() selectedStrategy: 'snowball' | 'avalanche' = 'snowball';
  maxMonths: number = 0;
  savings: number = 0;
  strategies = ['snowball', 'avalanche'] as const;

  ngOnChanges() {
    this.maxMonths = Math.max(
      ...this.snowball.debts.map(d => d.monthsToPayoff),
      ...this.avalanche.debts.map(d => d.monthsToPayoff)
    );
    this.savings = this.snowball.totalInterestPaid - this.avalanche.totalInterestPaid;
  }

  getDebtsForStrategy(strategy: 'snowball' | 'avalanche'): DebtPayoff[] {
    return strategy === 'snowball' ? this.snowball.debts : this.avalanche.debts;
  }

  getDebtWidth(debt: DebtPayoff): string {
    return `${(debt.monthsToPayoff / this.maxMonths * 100)}%`;
  }

  getDebtColor(debtName: string): string {
    const colors = [
      '#2196F3', // Blue
      '#FF5722', // Deep Orange
      '#4CAF50', // Green
      '#9C27B0', // Purple
      '#FF9800', // Orange
      '#00BCD4', // Cyan
      '#F44336', // Red
      '#3F51B5', // Indigo
    ];
    
    const index = this.snowball.debts.findIndex(d => d.debtName === debtName);
    return colors[index % colors.length];
  }
} 