import { Injectable } from "@angular/core";
import { environment } from "src/environments/environments";
import { HttpClient } from '@angular/common/http'
import { Transaction } from "./transaction";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    private apiServerUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) { }

    public getAllTransactions(): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(`${this.apiServerUrl}/transaction/all`);
    }

    public addTransaction(transaction: Transaction): Observable<Transaction> {
        return this.http.post<Transaction>(`${this.apiServerUrl}/transaction/add`, transaction);
    }

    public updateTransaction(transaction: Transaction): Observable<Transaction> {
        return this.http.put<Transaction>(`${this.apiServerUrl}/transaction/update`, transaction);
    }
    public deleteTransaction(transactionId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiServerUrl}/transaction/delete/${transactionId}`);
    }
    public getTransactionById(transactionId: number): Observable<Transaction> {
        return this.http.get<Transaction>(`${this.apiServerUrl}/transaction/find/${transactionId}`);
    }
}