import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environments";
import { Share } from "./share";
import { HttpClient } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
  })
  export class ShareService{
    private apiServerUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) { }

    public getAllShares():Observable<Share[]>{
        return this.http.get<Share[]>(`${this.apiServerUrl}/share/all`);
    }

    public addShares(share:Share):Observable<Share>{
        return this.http.post<Share>(`${this.apiServerUrl}/share/add`,share);
    }

    public updateShare(share:Share):Observable<Share>{
        return this.http.put<Share>(`${this.apiServerUrl}/share/update`,share);
    }

  }