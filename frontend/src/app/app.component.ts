import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CalculatorService,
  CalculationHistoryEntry,
} from './services/calculator.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  displayValue = '0';
  expression = '0';
  firstOperand: number | null = null;
  pendingOperation: string | null = null;
  waitingForSecondOperand = false;
  lastResult: number | null = null;
  error = '';
  isLoading = false;
  backendConnected = false;
  history: CalculationHistoryEntry[] = [];

  digits = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'];
  operations = [
    { value: '+', symbol: '+' },
    { value: '-', symbol: '−' },
    { value: '*', symbol: '×' },
    { value: '/', symbol: '÷' },
  ];

  constructor(private calculatorService: CalculatorService) {}

  ngOnInit(): void {
    this.loadHistory();
    this.checkBackendConnection();
  }

  loadHistory(): void {
    this.calculatorService.getHistory(10).subscribe({
      next: (history) => {
        this.history = history;
      },
      error: (error) => {
        console.warn('Impossible de charger l\'historique:', error);
      },
    });
  }

  checkBackendConnection(): void {
    this.calculatorService.checkHealth().subscribe({
      next: () => {
        this.backendConnected = true;
      },
      error: (error) => {
        this.backendConnected = false;
        console.warn('Impossible de connecter au backend:', error);
      },
    });
  }

  inputDigit(digit: string): void {
    this.error = '';

    if (this.waitingForSecondOperand) {
      this.displayValue = digit;
      this.waitingForSecondOperand = false;
      return;
    }

    if (this.displayValue === '0') {
      this.displayValue = digit;
      return;
    }

    this.displayValue += digit;
  }

  inputDecimal(): void {
    this.error = '';

    if (this.waitingForSecondOperand) {
      this.displayValue = '0.';
      this.waitingForSecondOperand = false;
      return;
    }

    if (!this.displayValue.includes('.')) {
      this.displayValue += '.';
    }
  }

  toggleSign(): void {
    this.error = '';

    if (this.displayValue === '0') {
      return;
    }

    this.displayValue = this.displayValue.startsWith('-')
      ? this.displayValue.slice(1)
      : `-${this.displayValue}`;
  }

  inputTripleZero(): void {
    this.error = '';

    if (this.waitingForSecondOperand) {
      this.displayValue = '000';
      this.waitingForSecondOperand = false;
      return;
    }

    if (this.displayValue === '0') {
      this.displayValue = '000';
      return;
    }

    this.displayValue += '000';
  }

  setPercent(): void {
    this.error = '';

    const value = this.parseDisplayValue(this.displayValue) / 100;
    this.displayValue = this.formatNumber(value);
    this.waitingForSecondOperand = false;
  }

  deleteLast(): void {
    this.error = '';

    if (this.waitingForSecondOperand) {
      this.displayValue = '0';
      this.waitingForSecondOperand = false;
      return;
    }

    this.displayValue = this.displayValue.length > 1
      ? this.displayValue.slice(0, -1)
      : '0';
  }

  clearAll(): void {
    this.displayValue = '0';
    this.expression = '0';
    this.firstOperand = null;
    this.pendingOperation = null;
    this.waitingForSecondOperand = false;
    this.lastResult = null;
    this.error = '';
    this.isLoading = false;
  }

  setOperation(operation: string): void {
    this.error = '';

    this.firstOperand = this.parseDisplayValue(this.displayValue);
    this.pendingOperation = operation;
    this.waitingForSecondOperand = true;
    this.expression = `${this.formatNumber(this.firstOperand)} ${this.getOperationSymbol(operation)}`;
    this.lastResult = null;
  }

  computeResult(): void {
    this.error = '';

    if (this.pendingOperation === null || this.firstOperand === null) {
      this.error = 'Choisis une opération avant de calculer';
      return;
    }

    const secondOperand = this.parseDisplayValue(this.displayValue);
    this.isLoading = true;

    this.calculatorService
      .calculate(this.pendingOperation, this.firstOperand, secondOperand)
      .subscribe({
        next: (response) => {
          this.isLoading = false;

          const result = response.result;

          this.lastResult = result;
          this.displayValue = String(result);
          this.expression = `${this.formatNumber(this.firstOperand)} ${this.getOperationSymbol(this.pendingOperation)} ${this.formatNumber(secondOperand)} =`;
          this.firstOperand = result;
          this.pendingOperation = null;
          this.waitingForSecondOperand = true;

          if (response.calculation) {
            this.history = [response.calculation, ...this.history].slice(0, 10);
          } else {
            this.loadHistory();
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.error = error.error?.error || 'Erreur de communication avec le serveur';
          console.error('Erreur:', error);
        },
      });
  }

  onKeyboardInput(event: KeyboardEvent): void {
    const { key } = event;

    if (/^[0-9]$/.test(key)) {
      this.inputDigit(key);
      return;
    }

    if (key === '.') {
      this.inputDecimal();
      return;
    }

    if (key === '+' || key === '-' || key === '*' || key === '/') {
      this.setOperation(key);
      return;
    }

    if (key === 'Enter' || key === '=') {
      this.computeResult();
      return;
    }

    if (key === 'Backspace') {
      this.deleteLast();
      return;
    }

    if (key === '%') {
      this.setPercent();
      return;
    }

    if (key === 'Escape') {
      this.clearAll();
    }
  }

  formatNumber(value: number | null): string {
    if (value === null || value === undefined) {
      return '0';
    }

    return Number.isInteger(value)
      ? String(value)
      : parseFloat(value.toFixed(4)).toString();
  }

  getOperationSymbol(operation: string | null): string {
    switch (operation) {
      case '+':
        return '+';
      case '-':
        return '−';
      case '*':
        return '×';
      case '/':
        return '÷';
      default:
        return '';
    }
  }

  private parseDisplayValue(value: string): number {
    const parsed = parseFloat(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  formatHistoryTime(createdAt: string): string {
    return new Date(createdAt).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  trackByHistoryId(index: number, item: CalculationHistoryEntry): number {
    return item.id;
  }
}
