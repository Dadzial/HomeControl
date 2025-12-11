import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface gateResponse {
  action: 'open' | 'close' | 'stop';
  espStatus: number;
  espResponse: any;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})

export class GateService {

  private readonly apiUrl: string = 'http://localhost:3100/api/gates';

  constructor( private httpClient :HttpClient ) { }

  openGate(): Observable<gateResponse> {
    return this.httpClient.post<gateResponse>(`${this.apiUrl}/open`, {action :'open'});
  }

  closeGate(): Observable<gateResponse> {
    return this.httpClient.post<gateResponse>(`${this.apiUrl}/close`, {action:'close'});
  }

}
