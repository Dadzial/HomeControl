import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface WeatherData {
  location: {
    name?: string;
    lat: number;
    lon: number;
  };
  weather: {
    description: string;
    iconUrl: string;
  };
  temperature: {
    value: number;
    units: string;
  };
  wind: {
    speed: number;
    units: string;
    deg: number;
    direction: string;
  };
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private apiUrl = 'http://localhost:3100/api/weather';

  constructor(private httpClient: HttpClient) {}


  getCurrentWeather(): Observable<WeatherData> {
    return this.httpClient.get<WeatherData>(this.apiUrl).pipe(
      map((data: WeatherData) => ({
        ...data,
        temperature: {
          ...data.temperature,
          value: Math.round(data.temperature.value),
        },
        weather: {
          ...data.weather,
          description: data.weather.description.charAt(0).toUpperCase() + data.weather.description.slice(1)
        }
      }))
    );
  }


}
