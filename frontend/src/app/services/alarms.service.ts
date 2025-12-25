import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AlarmsResponse {
  type: string;
  triggerAt: Date;
}

export interface AlarmSettings {
  motion: boolean;
  temperature: boolean;
  gas: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AlarmsService {

  private readonly apiUrl: string = "http://localhost:3100/api/alarm";

  constructor(private httpClient: HttpClient) {}

  getAlarms(): Observable<AlarmsResponse[]> {
    return this.httpClient.get<AlarmsResponse[]>(`${this.apiUrl}/all`);
  }

  getSettings(): Observable<AlarmSettings> {
    return this.httpClient.get<AlarmSettings>(`${this.apiUrl}/settings`);
  }

  deleteAlarms(): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/delete`);
  }

  toggleAlarms(type: string, enabled: boolean): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/toggle`, { type, enabled });
  }
}
