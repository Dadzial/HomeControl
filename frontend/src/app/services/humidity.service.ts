import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, switchMap, timer} from 'rxjs';

export interface Humidity {
  humidity: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class HumidityService {

  private readonly apiUrl : string = 'http://localhost:3100/api/climate'

  constructor(private httpClient : HttpClient) { }

  getHumidity(): Observable<Humidity> {
    return timer(0, 3000).pipe(
      switchMap(() => this.httpClient.get<Humidity>(`${this.apiUrl}/humidity`))
    );
  }
}
