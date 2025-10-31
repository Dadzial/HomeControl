import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService, WeatherData } from '../services/weather.service';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit, AfterViewInit, OnDestroy {
  weather?: WeatherData;
  loading = true;
  errorMessage: string | null = null;

  private weatherSub?: Subscription;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.weatherSub = this.weatherService.getCurrentWeather().subscribe({
      next: (data) => {
        this.weather = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Błąd podczas pobierania pogody:', err);
        this.errorMessage = 'Nie udało się pobrać danych pogodowych.';
        this.loading = false;
      }
    });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.weatherSub?.unsubscribe();
  }

  refreshWeather(): void {
    this.loading = true;
    this.weatherService.getCurrentWeather().subscribe({
      next: (data) => {
        this.weather = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Nie udało się odświeżyć danych.';
        this.loading = false;
      }
    });
  }
}
