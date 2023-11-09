import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TwelvedataService {

  constructor(private http: HttpClient) { }

  private apiKey = '';
  private apiUrl = 'https://api.twelvedata.com';

  getCurrentPrice(symbol: string) {
    const url = `${this.apiUrl}/price?symbol=${symbol}&apikey=${this.apiKey}`;
    return this.http.get(url);
  }
}
