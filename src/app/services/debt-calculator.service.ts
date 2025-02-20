import { Injectable } from '@angular/core';

interface Debt {
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

interface PaymentSchedule {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

interface DebtPayoff {
  debtName: string;
  originalBalance: number;
  interestRate: number;
  totalInterestPaid: number;
  monthsToPayoff: number;
  schedule: PaymentSchedule[];
}

interface PayoffComparison {
  strategy: 'snowball' | 'avalanche';
  totalMonths: number;
  totalInterestPaid: number;
  totalPaid: number;
  debts: DebtPayoff[];
}

@Injectable({
  providedIn: 'root'
})
export class DebtCalculatorService {
  private readonly MAX_MONTHS = 360; // 30 years maximum

  calculatePayoff(debts: Debt[], strategy: 'snowball' | 'avalanche', extraPayment: number): PayoffComparison {
    // Clone and sort debts
    let workingDebts = debts.map(debt => ({
      ...debt,
      currentBalance: debt.balance,
      totalInterestPaid: 0,
      payments: [] as PaymentSchedule[],
      isPaidOff: false,
      monthsPaid: 0
    }));

    // Sort based on strategy
    workingDebts.sort((a, b) => {
      if (strategy === 'snowball') {
        return a.balance - b.balance;
      }
      return b.interestRate - a.interestRate;
    });

    let month = 0;
    let availableExtra = extraPayment;

    // Continue until all debts are paid
    while (workingDebts.some(d => !d.isPaidOff) && month < this.MAX_MONTHS) {
      month++;
      
      // Process each debt
      for (const debt of workingDebts) {
        if (debt.isPaidOff) continue;

        // 1. Calculate this month's interest
        const monthlyInterest = (debt.interestRate / 100 / 12) * debt.currentBalance;
        debt.totalInterestPaid += monthlyInterest;

        // 2. Calculate total payment (minimum + any extra)
        let payment = debt.minimumPayment;
        
        // Apply extra payment to first unpaid debt in order
        if (!workingDebts.slice(0, workingDebts.indexOf(debt)).some(d => !d.isPaidOff)) {
          payment += availableExtra;
        }

        // 3. Apply payment
        const principalPayment = Math.min(debt.currentBalance, payment - monthlyInterest);
        debt.currentBalance -= principalPayment;

        // 4. Record payment
        debt.payments.push({
          month,
          payment: principalPayment + monthlyInterest,
          principal: principalPayment,
          interest: monthlyInterest,
          remainingBalance: debt.currentBalance
        });

        // 5. Check if debt is paid off
        if (debt.currentBalance <= 0 && !debt.isPaidOff) {
          debt.isPaidOff = true;
          debt.monthsPaid = month;
          // Add this debt's minimum payment to available extra
          availableExtra += debt.minimumPayment;
        }
      }
    }

    // Create result objects
    const debtPayoffs = workingDebts.map(debt => ({
      debtName: debt.name,
      originalBalance: debt.balance,
      interestRate: debt.interestRate,
      totalInterestPaid: debt.totalInterestPaid,
      monthsToPayoff: debt.monthsPaid,
      schedule: debt.payments
    }));

    return {
      strategy,
      totalMonths: month,
      totalInterestPaid: workingDebts.reduce((sum, debt) => sum + debt.totalInterestPaid, 0),
      totalPaid: workingDebts.reduce((sum, debt) => sum + debt.balance + debt.totalInterestPaid, 0),
      debts: debtPayoffs
    };
  }

  compareStrategies(debts: Debt[], extraPayment: number = 0): [PayoffComparison, PayoffComparison] {
    const snowball = this.calculatePayoff(debts, 'snowball', extraPayment);
    const avalanche = this.calculatePayoff(debts, 'avalanche', extraPayment);
    return [snowball, avalanche];
  }
} 