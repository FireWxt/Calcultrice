import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CalculationRequest {
  operation: string;
  num1: number;
  num2: number;
}

export interface CalculationResponse {
  result: number;
  calculation?: CalculationHistoryEntry;
}

export interface ErrorResponse {
  error: string;
}

export interface CalculationHistoryEntry {
  id: number;
  operation: string;
  num1: number;
  num2: number;
  result: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  calculate(
    operation: string,
    num1: number,
    num2: number
  ): Observable<CalculationResponse> {
    return this.http.post<CalculationResponse>(`${this.apiUrl}/calculate`, {
      operation,
      num1,
      num2,
    });
  }

  checkHealth(): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(`${this.apiUrl}/health`);
  }

  getHistory(limit = 10): Observable<CalculationHistoryEntry[]> {
    return this.http.get<CalculationHistoryEntry[]>(`${this.apiUrl}/history?limit=${limit}`);
  }
}
