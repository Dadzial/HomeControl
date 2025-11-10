import {Component, OnInit, OnDestroy} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {Subscription} from 'rxjs';
import {Temperature, TemperatureService} from '../services/temperature.service';
import {NgIf} from '@angular/common';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { ScaleType } from '@swimlane/ngx-charts';
import {MatButton} from '@angular/material/button';


@Component({
  selector: 'app-temperature',
  imports: [
    MatIcon,
    NgIf,
    NgxChartsModule,
    MatButton
  ],
  templateUrl: './temperature.component.html',
  styleUrl: './temperature.component.css'
})
export class TemperatureComponent implements OnInit, OnDestroy {
  data = [{
    name: 'Temperature',
    series: [
      { name: '10:00', value: 21 },
      { name: '10:05', value: 22 },
      { name: '10:10', value: 23 },
      { name: '10:15', value: 22 },
      { name: '10:20', value: 21 },
    ],
  }];
  colorScheme = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#80d8ff']
  };
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
