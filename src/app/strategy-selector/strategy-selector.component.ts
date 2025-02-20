import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-strategy-selector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  template: `
    <mat-card class="strategy-card">
      <mat-card-header>
        <mat-card-title class="strategy-title">
          <mat-icon class="title-icon">strategy</mat-icon>
          Payment Strategy
        </mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="strategy-content">
          <mat-button-toggle-group
            [value]="selectedStrategy"
            (change)="onStrategyChange($event.value)"
            class="strategy-toggle"
          >
            <mat-button-toggle value="snowball">
              <div class="toggle-content">
                <mat-icon>ac_unit</mat-icon>
                <div class="toggle-text">
                  <span class="toggle-title">Snowball</span>
                  <span class="toggle-description">Pay smallest balance first</span>
                </div>
              </div>
            </mat-button-toggle>
            <mat-button-toggle value="avalanche">
              <div class="toggle-content">
                <mat-icon>local_fire_department</mat-icon>
                <div class="toggle-text">
                  <span class="toggle-title">Avalanche</span>
                  <span class="toggle-description">Pay highest interest first</span>
                </div>
              </div>
            </mat-button-toggle>
          </mat-button-toggle-group>

          <mat-form-field appearance="outline" class="extra-payment">
            <mat-label>Extra Monthly Payment</mat-label>
            <input
              matInput
              type="number"
              [value]="extraPayment"
              (input)="onExtraPaymentChange($event)"
              min="0"
              placeholder="0.00"
            >
            <span matPrefix>$&nbsp;</span>
            <mat-icon matSuffix>add_circle</mat-icon>
          </mat-form-field>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .strategy-card {
      background: white;
      margin-top: 24px;
    }

    .strategy-title {
      color: #1976d2;
      font-size: 20px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .title-icon {
      color: #1976d2;
    }

    .strategy-content {
      padding: 16px 0;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .strategy-toggle {
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
    }

    ::ng-deep .mat-button-toggle-group {
      border: none !important;
      box-shadow: 0 2px 4px -1px rgb(0 0 0 / 0.1) !important;
    }

    ::ng-deep .mat-button-toggle {
      background: #f8fafc;
      border: none !important;
      width: 50%;
    }

    ::ng-deep .mat-button-toggle-checked {
      background: #1976d2 !important;
    }

    ::ng-deep .mat-button-toggle-checked .toggle-content {
      color: white;
    }

    ::ng-deep .mat-button-toggle-checked mat-icon {
      color: white;
    }

    .toggle-content {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      color: #475569;
    }

    .toggle-text {
      display: flex;
      flex-direction: column;
      text-align: left;
    }

    .toggle-title {
      font-weight: 500;
      font-size: 16px;
    }

    .toggle-description {
      font-size: 12px;
      opacity: 0.8;
    }

    .extra-payment {
      width: 100%;
    }

    ::ng-deep .mat-mdc-input-element {
      color: rgba(0, 0, 0, 0.87) !important;
      font-weight: 400;
    }
  `]
})
export class StrategySelectorComponent {
  @Input() selectedStrategy: 'snowball' | 'avalanche' = 'snowball';
  @Input() extraPayment: number = 0;
  @Output() strategyChange = new EventEmitter<'snowball' | 'avalanche'>();
  @Output() extraPaymentChange = new EventEmitter<number>();

  onStrategyChange(strategy: 'snowball' | 'avalanche') {
    this.strategyChange.emit(strategy);
  }

  onExtraPaymentChange(event: Event) {
    const value = +(event.target as HTMLInputElement).value;
    this.extraPaymentChange.emit(value);
  }
} 