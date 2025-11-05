import {Component, OnInit, OnDestroy} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {Subscription} from 'rxjs';
import {Temperature, TemperatureService} from '../services/temperature.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-temperature',
  imports: [
    MatIcon,
    NgIf,
  ],
  templateUrl: './temperature.component.html',
  styleUrl: './temperature.component.css'
})
export class TemperatureComponent implements OnInit, OnDestroy {
  temperature?: number;
  time?: Date;
  private sub?: Subscription;

  constructor(private temperatureService: TemperatureService) {}

  ngOnInit() {
    this.sub = this.temperatureService.getTemperature().subscribe({
      next: (data: Temperature) => {
        this.temperature = data.temperature;
        this.time = new Date(data.time);
      },
      error: err => {
        console.error('Error fetching temperature:', err);
        this.temperature = undefined;
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
