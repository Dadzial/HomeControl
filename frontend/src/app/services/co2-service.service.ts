import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, timer } from 'rxjs';

export interface Co2 {
    lpg: number;
    co: number;
    methane: number;
    timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class Co2ServiceService {

  private readonly apiUrl : string = 'http://localhost:3100/api/gaz';

  constructor(private http: HttpClient) { }

  getCo2Data(): Observable<Co2> {
    return timer(0,3000).pipe(
      switchMap(() => this.http.get<Co2>(`${this.apiUrl}/now`))
    );
  }
}
