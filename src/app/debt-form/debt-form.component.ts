import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

interface Debt {
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

@Component({
  selector: 'app-debt-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <h2 class="section-header">
      <mat-icon class="header-icon">add_circle</mat-icon>
      Add New Debt
    </h2>
    <mat-card class="form-card">
      <mat-card-content>
        <div class="extra-payment-section">
          <h3 class="section-title">
            <mat-icon>payments</mat-icon>
            Extra Monthly Payment
          </h3>
          <p class="helper-text">
            Enter the additional amount you can pay each month beyond the minimum payments.
            This amount will be applied according to the selected strategy.
          </p>
          <mat-form-field appearance="outline" class="extra-payment-field">
            <mat-label>Extra Payment Amount ($)</mat-label>
            <input 
              matInput 
              type="number" 
              [value]="extraPayment"
              (input)="onExtraPaymentChange($event)"
              required
              min="0"
              placeholder="0.00"
            >
            <mat-icon matSuffix>payments</mat-icon>
            <mat-error>Extra payment amount is required</mat-error>
          </mat-form-field>
        </div>

        <mat-divider class="divider"></mat-divider>

        <form [formGroup]="debtForm" (ngSubmit)="onSubmit()" class="debt-form">
          <mat-form-field appearance="outline">
            <mat-label>Debt Name</mat-label>
            <input matInput formControlName="name" placeholder="e.g., Car Loan">
            <mat-icon matSuffix>label</mat-icon>
            <mat-error *ngIf="debtForm.get('name')?.errors?.['required'] && debtForm.get('name')?.touched">
              Debt name is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Balance ($)</mat-label>
            <input matInput type="number" formControlName="balance" placeholder="0.00">
            <mat-icon matSuffix>account_balance</mat-icon>
            <mat-error *ngIf="debtForm.get('balance')?.errors?.['required'] && debtForm.get('balance')?.touched">
              Balance is required
            </mat-error>
            <mat-error *ngIf="debtForm.get('balance')?.errors?.['min'] && debtForm.get('balance')?.touched">
              Balance must be positive
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Interest Rate (%)</mat-label>
            <input matInput type="number" formControlName="interestRate" placeholder="0.00">
            <mat-icon matSuffix>percent</mat-icon>
            <mat-error *ngIf="debtForm.get('interestRate')?.errors?.['required'] && debtForm.get('interestRate')?.touched">
              Interest rate is required
            </mat-error>
            <mat-error *ngIf="(debtForm.get('interestRate')?.errors?.['min'] || debtForm.get('interestRate')?.errors?.['max']) && debtForm.get('interestRate')?.touched">
              Interest rate must be between 0 and 100
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Minimum Payment ($)</mat-label>
            <input matInput type="number" formControlName="minimumPayment" placeholder="0.00">
            <mat-icon matSuffix>payments</mat-icon>
            <mat-error *ngIf="debtForm.get('minimumPayment')?.errors?.['required'] && debtForm.get('minimumPayment')?.touched">
              Minimum payment is required
            </mat-error>
            <mat-error *ngIf="debtForm.get('minimumPayment')?.errors?.['min'] && debtForm.get('minimumPayment')?.touched">
              Minimum payment must be positive
            </mat-error>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" [disabled]="!debtForm.valid" class="submit-button">
            <mat-icon>add</mat-icon>
            Add Debt
          </button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .form-card {
      background: white;
    }

    .debt-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 16px 0;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 8px;
    }

    .mat-mdc-form-field-subscript-wrapper {
      font-size: 12px;
    }

    .submit-button {
      align-self: flex-end;
      padding: 0 24px;
      height: 48px;
      font-size: 16px;
      font-weight: 500;
      border-radius: 24px;
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
      transition: transform 0.2s;
    }

    .submit-button:not(:disabled) {
      box-shadow: 0 4px 6px -1px rgb(25 118 210 / 0.2), 0 2px 4px -2px rgb(25 118 210 / 0.1);
    }

    .submit-button:not(:disabled):hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 8px -1px rgb(25 118 210 / 0.2), 0 4px 6px -2px rgb(25 118 210 / 0.1);
    }

    .submit-button:disabled {
      opacity: 0.7;
    }

    .submit-button mat-icon {
      margin-right: 8px;
    }

    ::ng-deep .mat-mdc-form-field {
      --mdc-filled-text-field-active-indicator-height: 0;
      --mdc-filled-text-field-container-shape: 8px;
    }

    ::ng-deep .mat-mdc-text-field-wrapper {
      background: #f8fafc !important;
    }

    ::ng-deep .mdc-text-field--outlined {
      --mdc-outlined-text-field-container-shape: 8px;
    }

    ::ng-deep .mat-mdc-form-field-flex {
      min-height: 56px !important;
    }

    ::ng-deep .mat-mdc-text-field-wrapper .mat-mdc-form-field-flex .mat-mdc-floating-label {
      top: 28px !important;
    }

    ::ng-deep .mdc-text-field--outlined.mdc-text-field--with-leading-icon {
      padding-left: 0px;
    }

    ::ng-deep .mat-mdc-form-field-infix {
      padding-top: 8px !important;
      padding-bottom: 8px !important;
      min-height: 40px !important;
    }

    ::ng-deep .mat-mdc-input-element {
      padding: 8px 0 !important;
      margin-top: 8px !important;
      color: #000000 !important;
    }

    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      height: 0;
    }

    .extra-payment-field {
      width: 100%;
    }

    .extra-payment-section {
      padding: 16px 0;
    }

    .section-title {
      color: #1976d2;
      font-size: 18px;
      font-weight: 500;
      margin: 0 0 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .helper-text {
      color: #000000;
      font-size: 14px;
      margin: 0 0 16px;
      line-height: 1.5;
    }

    .divider {
      margin: 24px 0;
    }

    ::ng-deep .mdc-text-field:not(.mdc-text-field--disabled) .mdc-floating-label {
      color: rgba(0, 0, 0, 0.87) !important;
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
export class DebtFormComponent {
  @Output() debtAdded = new EventEmitter<Debt>();
  @Input() extraPayment: number = 0;
  @Output() extraPaymentChange = new EventEmitter<number>();
  
  debtForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.debtForm = this.fb.group({
      name: ['', Validators.required],
      balance: ['', [Validators.required, Validators.min(0)]],
      interestRate: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      minimumPayment: ['', [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit() {
    if (this.debtForm.valid) {
      this.debtAdded.emit(this.debtForm.value);
      this.debtForm.reset({
        name: '',
        balance: '',
        interestRate: '',
        minimumPayment: ''
      }, { emitEvent: false });
      Object.keys(this.debtForm.controls).forEach(key => {
        const control = this.debtForm.get(key);
        control?.markAsUntouched();
        control?.markAsPristine();
      });
    }
  }

  onExtraPaymentChange(event: Event) {
    const value = +(event.target as HTMLInputElement).value;
    if (value >= 0) {
      this.extraPayment = value;
      this.extraPaymentChange.emit(value);
    }
  }
} 