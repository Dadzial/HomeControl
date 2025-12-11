import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface alarmsResponse {
  type: string;
  triggerAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AlarmsService {

  private readonly apiUrl: string = "http://localhost:3100/api/alarm";

  constructor(private httpClient: HttpClient) {}

  getAlarms(): Observable<alarmsResponse[]> {
    return this.httpClient.get<alarmsResponse[]>(`${this.apiUrl}/all`);
  }

  deleteAlarms(): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/delete`);
  }
}
