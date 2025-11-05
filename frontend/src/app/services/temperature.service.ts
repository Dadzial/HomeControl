import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, timer } from 'rxjs';

export interface Temperature {
  temperature: number;
  time: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TemperatureService {
  private readonly apiUrl: string = 'http://localhost:3100/api/climate';

  constructor(private httpClient: HttpClient) {}

  getTemperature(): Observable<Temperature> {
    return timer(0, 3000).pipe(
      switchMap(() => this.httpClient.get<Temperature>(`${this.apiUrl}/temperature`))
    );
  }
}
