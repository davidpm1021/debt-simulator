import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface Debt {
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

@Component({
  selector: 'app-debt-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  template: `
    <h2 class="section-header">
      <mat-icon class="header-icon">list</mat-icon>
      Your Debts
    </h2>
    <table mat-table [dataSource]="debts" class="mat-elevation-z2">
      <!-- Name Column -->
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Debt Name</th>
        <td mat-cell *matCellDef="let debt">{{debt.name}}</td>
      </ng-container>

      <!-- Balance Column -->
      <ng-container matColumnDef="balance">
        <th mat-header-cell *matHeaderCellDef>Balance</th>
        <td mat-cell *matCellDef="let debt">{{debt.balance | currency}}</td>
      </ng-container>

      <!-- Interest Rate Column -->
      <ng-container matColumnDef="interestRate">
        <th mat-header-cell *matHeaderCellDef>Interest Rate</th>
        <td mat-cell *matCellDef="let debt">{{debt.interestRate}}%</td>
      </ng-container>

      <!-- Minimum Payment Column -->
      <ng-container matColumnDef="minimumPayment">
        <th mat-header-cell *matHeaderCellDef>Minimum Payment</th>
        <td mat-cell *matCellDef="let debt">{{debt.minimumPayment | currency}}</td>
      </ng-container>

      <!-- Actions Column -->
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let debt; let i = index">
          <button mat-icon-button color="warn" (click)="onDelete(i)">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  `,
  styles: [`
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

    table {
      width: 100%;
      background: white;
    }

    .mat-mdc-header-cell {
      color: #546e7a;
      font-weight: 500;
      font-size: 14px;
    }

    .mat-mdc-cell {
      color: #2c3e50;
      font-size: 14px;
    }

    .mat-column-actions {
      width: 80px;
      text-align: center;
    }

    tr.mat-mdc-row:hover {
      background: #f5f7fa;
    }
  `]
})
export class DebtTableComponent {
  @Input() debts: Debt[] = [];
  @Output() deleteDebt = new EventEmitter<number>();

  displayedColumns: string[] = ['name', 'balance', 'interestRate', 'minimumPayment', 'actions'];

  onDelete(index: number) {
    this.deleteDebt.emit(index);
  }
} 