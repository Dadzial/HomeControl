import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, timer, switchMap } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import {DatePipe, NgIf} from '@angular/common';
import { Temperature, TemperatureService } from '../services/temperature.service';

@Component({
  selector: 'app-temperature',
  imports: [
    MatIcon,
    NgIf,
    DatePipe,
  ],
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.css']
})
export class TemperatureComponent implements OnInit, OnDestroy {
  temperature?: number;
  time?: Date;
  private sub?: Subscription;
  private saveSub?: Subscription;

  constructor(private temperatureService: TemperatureService) {}

  ngOnInit() {
    this.sub = this.temperatureService.getTemperature().subscribe({
      next: (data: Temperature) => {
        this.temperature = data.temperature;
        this.time = new Date(data.timestamp);
      },
      error: err => {
        console.error('Error fetching temperature:', err);
      }
    });
    this.startAutoSave();
  }

  private startAutoSave() {
    this.saveSub = timer(0, 3000).pipe(
      switchMap(() => this.temperatureService.getTemperature()),
      switchMap(temp => this.temperatureService.saveTemperature(temp.temperature))
    ).subscribe({
      next: () => console.log('Temperature auto-saved'),
      error: err => console.error(err)
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.saveSub?.unsubscribe();
  }
}
