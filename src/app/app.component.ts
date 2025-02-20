import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { DebtFormComponent } from './debt-form/debt-form.component';
import { DebtTableComponent } from './debt-table/debt-table.component';
import { PayoffResultsComponent } from './payoff-results/payoff-results.component';
import { DebtCalculatorService } from './services/debt-calculator.service';

interface Debt {
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

interface PayoffComparison {
  strategy: 'snowball' | 'avalanche';
  totalMonths: number;
  totalInterestPaid: number;
  totalPaid: number;
  debts: any[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    DebtFormComponent,
    DebtTableComponent,
    PayoffResultsComponent
  ],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <div class="toolbar-content">
        <div class="logo-title-container">
          <img 
            src="assets/placeholder-logo.png" 
            alt="Logo" 
            class="logo"
            (error)="onLogoError($event)" 
            onerror="this.onerror=null"
          />
          <div class="title-container">
            <h1 class="main-title">Debt Payment Simulator</h1>
            <span class="subtitle">Snowball vs. Avalanche Calculator</span>
          </div>
        </div>
      </div>
    </mat-toolbar>

    <div class="container">
      <div class="content-wrapper">
        <mat-card class="intro-card">
          <mat-card-header>
            <mat-card-title>Welcome to Debt Payment Simulator</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Compare different debt payment strategies to become debt-free faster. Add your debts below to get started.</p>
          </mat-card-content>
        </mat-card>

        <div class="grid">
          <div class="form-section">
            <app-debt-form 
              (debtAdded)="addDebt($event)"
              [(extraPayment)]="extraPayment"
              (extraPaymentChange)="onExtraPaymentChange($event)"
            ></app-debt-form>
          </div>
          
          <div class="results-section">
            <div class="table-section">
              <app-debt-table 
                *ngIf="debts.length > 0"
                [debts]="debts"
                (deleteDebt)="removeDebt($event)"
              ></app-debt-table>
            </div>

            <app-payoff-results
              *ngIf="debts.length > 0 && snowballResults && avalancheResults"
              [snowball]="snowballResults"
              [avalanche]="avalancheResults"
            ></app-payoff-results>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toolbar {
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      height: auto;
      min-height: 96px;
      padding: 12px 0;
    }

    .toolbar-content {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .logo-title-container {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .logo {
      height: 72px;
      width: auto;
      object-fit: contain;
      display: block;
    }

    .strategy-result {
      background: transparent;
      border-radius: 0;
      padding: 0;
      box-shadow: none;
    }

    .title-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .main-title {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
      letter-spacing: 0.5px;
      color: white;
      line-height: 1.2;
    }

    .subtitle {
      font-size: 16px;
      opacity: 0.9;
      color: white;
    }

    @media (max-width: 600px) {
      .toolbar {
        min-height: 80px;
      }

      .logo {
        height: 56px;
      }

      .main-title {
        font-size: 20px;
      }

      .subtitle {
        font-size: 14px;
      }

      .container {
        padding-top: 24px;
      }
    }

    .container {
      min-height: 100vh;
      padding-top: 32px;
      background-color: #f5f7fa;
    }

    .content-wrapper {
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px;
    }

    .intro-card {
      margin-bottom: 32px;
      background: white;
    }

    .intro-card mat-card-title {
      color: #1976d2;
      font-size: 24px;
      margin-bottom: 16px;
    }

    .intro-card p {
      color: #546e7a;
      font-size: 16px;
      line-height: 1.6;
      margin: 0;
    }

    .grid {
      display: grid;
      gap: 32px;
      grid-template-columns: 1fr;
    }

    @media (min-width: 1024px) {
      .grid {
        grid-template-columns: 400px 1fr;
        align-items: start;
      }

      .form-section {
        position: sticky;
        top: 132px;
      }
    }

    .results-section {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .table-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
    }
  `]
})
export class AppComponent {
  debts: Debt[] = [];
  extraPayment: number = 0;
  snowballResults?: PayoffComparison;
  avalancheResults?: PayoffComparison;

  constructor(private calculator: DebtCalculatorService) {}

  private updateCalculations() {
    if (this.debts.length > 0) {
      [this.snowballResults, this.avalancheResults] = 
        this.calculator.compareStrategies(this.debts, this.extraPayment);
    }
  }

  addDebt(debt: Debt) {
    this.debts = [...this.debts, debt];
    this.updateCalculations();
  }

  removeDebt(index: number) {
    this.debts = this.debts.filter((_, i) => i !== index);
    if (this.debts.length === 0) {
      this.snowballResults = undefined;
      this.avalancheResults = undefined;
    } else {
      this.updateCalculations();
    }
  }

  onExtraPaymentChange(amount: number) {
    this.extraPayment = amount;
    this.updateCalculations();
  }

  onLogoError(event: any) {
    console.error('Logo failed to load. Please check that the file exists at: src/assets/placeholder-logo.png');
    event.target.src = '';
    event.target.style.display = 'none';
  }
}
