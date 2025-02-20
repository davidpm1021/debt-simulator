import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

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

interface AmortizationRow {
  month: number;
  debtName: string;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

@Component({
  selector: 'app-amortization-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonToggleModule,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  template: `
    <h2 class="section-header">
      <mat-icon class="header-icon">table_chart</mat-icon>
      Complete Amortization Schedule
    </h2>
    <mat-card class="amortization-card">
      <mat-card-content>
        <div class="controls">
          <mat-button-toggle-group
            [value]="selectedStrategy"
            (change)="onStrategyChange($event.value)"
            class="strategy-toggle"
          >
            <mat-button-toggle value="snowball">
              <div class="toggle-content">
                <mat-icon>ac_unit</mat-icon>
                Snowball Method
              </div>
            </mat-button-toggle>
            <mat-button-toggle value="avalanche">
              <div class="toggle-content">
                <mat-icon>local_fire_department</mat-icon>
                Avalanche Method
              </div>
            </mat-button-toggle>
          </mat-button-toggle-group>

          <mat-form-field appearance="outline" class="time-frame-select">
            <mat-label>Show Payments</mat-label>
            <mat-select [value]="timeFrame" (selectionChange)="onTimeFrameChange($event.value)">
              <mat-option value="all">All Months</mat-option>
              <mat-option value="yearly">Yearly (Every 12 Months)</mat-option>
              <mat-option value="quarterly">Quarterly (Every 3 Months)</mat-option>
              <mat-option value="semi-annual">Semi-Annual (Every 6 Months)</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <table mat-table [dataSource]="paginatedData" class="amortization-table">
          <ng-container matColumnDef="month">
            <th mat-header-cell *matHeaderCellDef>Month</th>
            <td mat-cell *matCellDef="let row">{{row.month}}</td>
          </ng-container>

          <ng-container matColumnDef="debtName">
            <th mat-header-cell *matHeaderCellDef>Debt Name</th>
            <td mat-cell *matCellDef="let row">{{row.debtName}}</td>
          </ng-container>

          <ng-container matColumnDef="payment">
            <th mat-header-cell *matHeaderCellDef>Payment</th>
            <td mat-cell *matCellDef="let row">{{row.payment | currency}}</td>
          </ng-container>

          <ng-container matColumnDef="principal">
            <th mat-header-cell *matHeaderCellDef>Principal</th>
            <td mat-cell *matCellDef="let row">{{row.principal | currency}}</td>
          </ng-container>

          <ng-container matColumnDef="interest">
            <th mat-header-cell *matHeaderCellDef>Interest</th>
            <td mat-cell *matCellDef="let row">{{row.interest | currency}}</td>
          </ng-container>

          <ng-container matColumnDef="remainingBalance">
            <th mat-header-cell *matHeaderCellDef>Remaining Balance</th>
            <td mat-cell *matCellDef="let row">{{row.remainingBalance | currency}}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator
          [length]="totalRows"
          [pageSize]="pageSize"
          [pageSizeOptions]="[10, 25, 50, 100]"
          (page)="onPageChange($event)"
          aria-label="Select page"
        >
        </mat-paginator>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .amortization-card {
      margin-top: 24px;
      background: white;
      border-radius: 12px;
      overflow: hidden;
    }

    .amortization-title {
      color: #1976d2;
      font-size: 20px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .title-icon {
      color: #1976d2;
    }

    .strategy-toggle {
      margin: 16px 0;
      width: 100%;
      max-width: 400px;
      border-radius: 24px;
      overflow: hidden;
    }

    .amortization-table {
      width: 100%;
      margin-top: 16px;
      box-shadow: none;
      background: #f8fafc;
      border-radius: 12px;
      overflow: hidden;
    }

    .mat-column-month {
      width: 80px;
      padding-left: 16px;
    }

    .mat-column-debtName {
      min-width: 120px;
    }

    .mat-column-remainingBalance {
      padding-right: 16px;
    }

    .mat-mdc-header-cell {
      background: #f1f5f9;
      color: #1976d2;
      font-weight: 500;
      font-size: 14px;
      padding: 16px 8px;
    }

    .mat-mdc-cell {
      color: #2c3e50;
      font-size: 14px;
      padding: 12px 8px;
      border-bottom: 1px solid #e2e8f0;
    }

    tr.mat-mdc-row:hover {
      background: #e3f2fd;
    }

    ::ng-deep .mat-button-toggle-group {
      border: none !important;
      box-shadow: 0 2px 4px -1px rgb(0 0 0 / 0.1) !important;
    }

    ::ng-deep .mat-button-toggle {
      background: #f8fafc;
      border: none !important;
      padding: 4px 16px;
    }

    ::ng-deep .mat-button-toggle-button {
      height: 44px !important;
    }

    ::ng-deep .mat-button-toggle-checked {
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%) !important;
      color: white !important;
    }

    ::ng-deep .mat-button-toggle-checked mat-icon {
      color: white !important;
    }

    ::ng-deep .mat-mdc-paginator {
      background: #f8fafc !important;
      border-top: 1px solid #e2e8f0;
    }

    ::ng-deep .mat-mdc-paginator-container {
      min-height: 64px;
    }

    ::ng-deep .mat-mdc-paginator-range-label,
    ::ng-deep .mat-mdc-paginator-page-size-label {
      color: #2c3e50 !important;
    }

    ::ng-deep .mdc-text-field--outlined {
      --mdc-outlined-text-field-container-shape: 8px;
    }

    .toggle-content {
      display: flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
    }

    mat-icon {
      margin-right: 4px;
    }

    .controls {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }

    .time-frame-select {
      min-width: 200px;
      flex-grow: 1;
      max-width: 300px;
    }

    ::ng-deep .time-frame-select .mat-mdc-form-field-infix {
      padding: 12px 0 !important;
    }

    ::ng-deep .time-frame-select .mat-mdc-text-field-wrapper {
      background: #f8fafc !important;
    }

    ::ng-deep .time-frame-select .mat-mdc-select-value {
      color: #2c3e50 !important;
    }

    ::ng-deep .time-frame-select .mat-mdc-select-arrow {
      color: #1976d2;
    }

    @media (max-width: 600px) {
      .controls {
        flex-direction: column;
        align-items: stretch;
      }

      .time-frame-select {
        max-width: none;
      }
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
  `]
})
export class AmortizationTableComponent {
  @Input() snowball!: PayoffComparison;
  @Input() avalanche!: PayoffComparison;

  selectedStrategy: 'snowball' | 'avalanche' = 'snowball';
  displayedColumns = ['month', 'debtName', 'payment', 'principal', 'interest', 'remainingBalance'];
  
  pageSize = 25;
  currentPage = 0;
  totalRows = 0;
  paginatedData: AmortizationRow[] = [];
  timeFrame: 'all' | 'yearly' | 'quarterly' | 'semi-annual' = 'all';

  ngOnChanges() {
    this.updateAmortizationData();
  }

  onStrategyChange(strategy: 'snowball' | 'avalanche') {
    this.selectedStrategy = strategy;
    this.currentPage = 0;
    this.updateAmortizationData();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateAmortizationData();
  }

  onTimeFrameChange(value: 'all' | 'yearly' | 'quarterly' | 'semi-annual') {
    this.timeFrame = value;
    this.currentPage = 0;
    this.updateAmortizationData();
  }

  private filterByTimeFrame(rows: AmortizationRow[]): AmortizationRow[] {
    if (this.timeFrame === 'all') return rows;

    const monthInterval = {
      'yearly': 12,
      'quarterly': 3,
      'semi-annual': 6
    }[this.timeFrame];

    return rows.filter(row => row.month % monthInterval === 0 || 
                             row.remainingBalance === 0); // Include final payments
  }

  private updateAmortizationData() {
    const comparison = this.selectedStrategy === 'snowball' ? this.snowball : this.avalanche;
    let allRows = this.createAmortizationRows(comparison);
    allRows = this.filterByTimeFrame(allRows);
    this.totalRows = allRows.length;
    
    const startIndex = this.currentPage * this.pageSize;
    this.paginatedData = allRows.slice(startIndex, startIndex + this.pageSize);
  }

  private createAmortizationRows(comparison: PayoffComparison): AmortizationRow[] {
    const rows: AmortizationRow[] = [];
    
    for (const debt of comparison.debts) {
      for (const payment of debt.schedule) {
        rows.push({
          month: payment.month,
          debtName: debt.debtName,
          payment: payment.payment,
          principal: payment.principal,
          interest: payment.interest,
          remainingBalance: payment.remainingBalance
        });
      }
    }

    // Sort by month and then by debt name
    return rows.sort((a, b) => {
      if (a.month === b.month) {
        return a.debtName.localeCompare(b.debtName);
      }
      return a.month - b.month;
    });
  }
} 