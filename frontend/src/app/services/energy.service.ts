import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, timer } from 'rxjs';

export interface Energy {
  energyData: number;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class EnergyService {
  private readonly upiUrl: string = 'http://localhost:3100/api/energy';

  constructor(private httpClient: HttpClient) { }

  getEnergy(): Observable<Energy> {
    return timer(0, 3000).pipe(
      switchMap(() => this.httpClient.get<Energy>(`${this.upiUrl}/now`))
    );
  }
}
